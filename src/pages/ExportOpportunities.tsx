import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Globe, Users, Calendar, MapPin, Package, TrendingUp, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ExportOpportunity {
  id: string;
  opportunity_title: string;
  commodity: string;
  destination_country: string;
  volume: number;
  unit: string;
  deadline: string;
  price_range: string | null;
  specifications: string | null;
  certifications_required: string[] | null;
  payment_terms: string | null;
  delivery_terms: string | null;
  contact_info: any;
  status: string | null;
  created_at: string;
}

const ExportOpportunities: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<ExportOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newOpportunity, setNewOpportunity] = useState({
    opportunity_title: '',
    commodity: '',
    destination_country: '',
    volume: '',
    unit: 'kg',
    deadline: '',
    price_range: '',
    specifications: '',
    certifications_required: '',
    payment_terms: '',
    delivery_terms: ''
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('export_opportunities')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching export opportunities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load export opportunities',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const crops = Array.from(new Set(opportunities.map(o => o.commodity)));
  const countries = Array.from(new Set(opportunities.map(o => o.destination_country)));

  const filteredOpportunities = opportunities.filter(o => {
    const matchesSearch = o.opportunity_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         o.commodity.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'all' || o.commodity === selectedCrop;
    const matchesCountry = selectedCountry === 'all' || o.destination_country === selectedCountry;
    return matchesSearch && matchesCrop && matchesCountry;
  });

  const handleCreateOpportunity = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create export opportunities',
        variant: 'destructive'
      });
      return;
    }

    if (!newOpportunity.opportunity_title || !newOpportunity.commodity || !newOpportunity.destination_country || !newOpportunity.deadline) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from('export_opportunities').insert({
        created_by: user.id,
        opportunity_title: newOpportunity.opportunity_title,
        commodity: newOpportunity.commodity,
        destination_country: newOpportunity.destination_country,
        volume: parseFloat(newOpportunity.volume) || 0,
        unit: newOpportunity.unit,
        deadline: newOpportunity.deadline,
        price_range: newOpportunity.price_range || null,
        specifications: newOpportunity.specifications || null,
        certifications_required: newOpportunity.certifications_required ? newOpportunity.certifications_required.split(',').map(c => c.trim()) : null,
        payment_terms: newOpportunity.payment_terms || null,
        delivery_terms: newOpportunity.delivery_terms || null,
        status: 'active'
      });

      if (error) throw error;

      toast({ title: 'Export opportunity created successfully!' });
      setIsCreateDialogOpen(false);
      setNewOpportunity({
        opportunity_title: '', commodity: '', destination_country: '', volume: '', unit: 'kg',
        deadline: '', price_range: '', specifications: '', certifications_required: '', payment_terms: '', delivery_terms: ''
      });
      fetchOpportunities();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout title="Export Opportunities">
      <div className="container mx-auto px-4 py-6 max-w-7xl pb-24">
        {/* Info Banner */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Globe className="h-6 w-6 text-primary mt-1" />
              <div>
                <CardTitle className="text-2xl">Export Market Opportunities</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Connect with international buyers and access global markets
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Access verified export opportunities from international markets. Get fair prices, 
              technical support, and quality certification assistance to meet global standards.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4 border">
                <Globe className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Global Markets</h4>
                <p className="text-sm text-muted-foreground">Access to EU, US, Asian markets</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Premium Prices</h4>
                <p className="text-sm text-muted-foreground">Higher returns for quality produce</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <Users className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Full Support</h4>
                <p className="text-sm text-muted-foreground">Training, certification, logistics help</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Create Button */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search buyers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="sm:w-64"
            />
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                {crops.map(crop => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={country}>{country}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Post Export Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Export Opportunity</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Title *</Label>
                  <Input
                    value={newOpportunity.opportunity_title}
                    onChange={e => setNewOpportunity({...newOpportunity, opportunity_title: e.target.value})}
                    placeholder="e.g., Avocado Export to Europe"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Commodity *</Label>
                    <Input
                      value={newOpportunity.commodity}
                      onChange={e => setNewOpportunity({...newOpportunity, commodity: e.target.value})}
                      placeholder="e.g., Avocado"
                    />
                  </div>
                  <div>
                    <Label>Destination Country *</Label>
                    <Input
                      value={newOpportunity.destination_country}
                      onChange={e => setNewOpportunity({...newOpportunity, destination_country: e.target.value})}
                      placeholder="e.g., Germany"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Volume</Label>
                    <Input
                      type="number"
                      value={newOpportunity.volume}
                      onChange={e => setNewOpportunity({...newOpportunity, volume: e.target.value})}
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select value={newOpportunity.unit} onValueChange={v => setNewOpportunity({...newOpportunity, unit: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="tons">tons</SelectItem>
                        <SelectItem value="crates">crates</SelectItem>
                        <SelectItem value="containers">containers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Deadline *</Label>
                    <Input
                      type="date"
                      value={newOpportunity.deadline}
                      onChange={e => setNewOpportunity({...newOpportunity, deadline: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Price Range</Label>
                  <Input
                    value={newOpportunity.price_range}
                    onChange={e => setNewOpportunity({...newOpportunity, price_range: e.target.value})}
                    placeholder="e.g., $2-3 per kg"
                  />
                </div>
                <div>
                  <Label>Specifications</Label>
                  <Textarea
                    value={newOpportunity.specifications}
                    onChange={e => setNewOpportunity({...newOpportunity, specifications: e.target.value})}
                    placeholder="Quality requirements, size specifications..."
                  />
                </div>
                <div>
                  <Label>Certifications Required (comma separated)</Label>
                  <Input
                    value={newOpportunity.certifications_required}
                    onChange={e => setNewOpportunity({...newOpportunity, certifications_required: e.target.value})}
                    placeholder="GlobalGAP, Organic, HACCP"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Payment Terms</Label>
                    <Input
                      value={newOpportunity.payment_terms}
                      onChange={e => setNewOpportunity({...newOpportunity, payment_terms: e.target.value})}
                      placeholder="e.g., 50% advance, 50% on delivery"
                    />
                  </div>
                  <div>
                    <Label>Delivery Terms</Label>
                    <Input
                      value={newOpportunity.delivery_terms}
                      onChange={e => setNewOpportunity({...newOpportunity, delivery_terms: e.target.value})}
                      placeholder="e.g., FOB Mombasa"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateOpportunity} className="w-full" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Opportunity'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Opportunities List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading opportunities...</p>
            </div>
          ) : filteredOpportunities.length > 0 ? (
            filteredOpportunities.map(opp => (
              <Card key={opp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <CardTitle className="text-xl">{opp.opportunity_title}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">
                        <Calendar className="mr-1 h-3 w-3" />
                        Deadline: {new Date(opp.deadline).toLocaleDateString()}
                      </Badge>
                      <Badge variant="default">{opp.destination_country}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Commodity</div>
                      <div className="font-medium flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {opp.commodity}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Volume Required</div>
                      <div className="font-medium">{opp.volume} {opp.unit}</div>
                    </div>
                    {opp.price_range && (
                      <div>
                        <div className="text-sm text-muted-foreground">Price Range</div>
                        <div className="font-medium">{opp.price_range}</div>
                      </div>
                    )}
                  </div>

                  {opp.specifications && (
                    <p className="text-muted-foreground">{opp.specifications}</p>
                  )}

                  {opp.certifications_required && opp.certifications_required.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {opp.certifications_required.map((cert, i) => (
                        <Badge key={i} variant="secondary">{cert}</Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1">Apply Now</Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No export opportunities found.</h3>
                <p className="text-muted-foreground">Try adjusting your filters or create a new opportunity.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ExportOpportunities;