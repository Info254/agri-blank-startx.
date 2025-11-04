import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Plus, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Budget {
  id: string;
  category: string;
  subcategory: string;
  year: number;
  planned_amount: number;
  actual_amount: number;
  notes: string;
}

export const Budgets: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    year: currentYear,
    planned_amount: 0,
    actual_amount: 0,
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchBudgets();
    }
  }, [user]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('farm_budgets')
        .select('*')
        .eq('user_id', user?.id)
        .order('year', { ascending: false });

      if (error) throw error;
      setBudgets(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('farm_budgets')
        .insert([{ ...formData, user_id: user?.id }]);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Budget entry added successfully'
      });
      setShowForm(false);
      setFormData({ category: '', subcategory: '', year: currentYear, planned_amount: 0, actual_amount: 0, notes: '' });
      fetchBudgets();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const calculateTotals = () => {
    const totalPlanned = budgets.reduce((sum, b) => sum + b.planned_amount, 0);
    const totalActual = budgets.reduce((sum, b) => sum + b.actual_amount, 0);
    const variance = totalActual - totalPlanned;
    const variancePercent = totalPlanned > 0 ? (variance / totalPlanned) * 100 : 0;

    return { totalPlanned, totalActual, variance, variancePercent };
  };

  const totals = calculateTotals();

  if (loading) {
    return <div className="text-center py-8">Loading budgets...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Farm Budgets</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Planned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold">
                KES {totals.totalPlanned.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Actual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">
                KES {totals.totalActual.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Variance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {totals.variance >= 0 ? (
                <TrendingUp className="h-5 w-5 text-red-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-green-600" />
              )}
              <span className={`text-2xl font-bold ${totals.variance >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {totals.variancePercent.toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Budget Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inputs">Inputs (Seeds, Fertilizer)</SelectItem>
                      <SelectItem value="labor">Labor</SelectItem>
                      <SelectItem value="equipment">Equipment</SelectItem>
                      <SelectItem value="irrigation">Irrigation</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Input
                    id="subcategory"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="planned_amount">Planned Amount (KES)</Label>
                  <Input
                    id="planned_amount"
                    type="number"
                    value={formData.planned_amount}
                    onChange={(e) => setFormData({ ...formData, planned_amount: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="actual_amount">Actual Amount (KES)</Label>
                  <Input
                    id="actual_amount"
                    type="number"
                    value={formData.actual_amount}
                    onChange={(e) => setFormData({ ...formData, actual_amount: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Add Budget</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Budget Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {budgets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No budget entries yet. Add your first budget to start tracking!
            </div>
          ) : (
            <div className="space-y-3">
              {budgets.map((budget) => {
                const variance = budget.actual_amount - budget.planned_amount;
                const isOverBudget = variance > 0;

                return (
                  <div key={budget.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{budget.category}</h3>
                          {budget.subcategory && (
                            <span className="text-sm text-muted-foreground">• {budget.subcategory}</span>
                          )}
                          <span className="text-sm text-muted-foreground">• {budget.year}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Planned</p>
                            <p className="font-medium">KES {budget.planned_amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Actual</p>
                            <p className="font-medium">KES {budget.actual_amount.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Variance</p>
                            <p className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                              {isOverBudget ? '+' : ''} KES {variance.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        {budget.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{budget.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
