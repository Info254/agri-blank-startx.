import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCcw, Package, MapPin, Calendar, Plus, Trash2 } from 'lucide-react';
import { MobileHeader, MobileNav } from '@/components/ui/mobile-nav';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface BarterOffer {
  id: string;
  user_id: string;
  offering_product: string;
  offering_quantity: number;
  offering_unit: string;
  seeking_product: string;
  seeking_quantity: number;
  seeking_unit: string;
  location: string;
  county: string | null;
  description: string | null;
  status: string;
  created_at: string;
}

const BarterTrade: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [offers, setOffers] = useState<BarterOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [newOffer, setNewOffer] = useState({
    offering_product: '',
    offering_quantity: '',
    offering_unit: 'kg',
    seeking_product: '',
    seeking_quantity: '',
    seeking_unit: 'kg',
    location: '',
    county: '',
    description: ''
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('barter_offers')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOffers(data || []);
    } catch (error) {
      console.error('Error fetching barter offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOffer = async () => {
    if (!user) {
      toast({ title: 'Please login to create offers', variant: 'destructive' });
      return;
    }

    if (!newOffer.offering_product || !newOffer.seeking_product || !newOffer.location) {
      toast({ title: 'Please fill in required fields', variant: 'destructive' });
      return;
    }

    try {
      setSubmitting(true);
      const { error } = await supabase.from('barter_offers').insert({
        user_id: user.id,
        offering_product: newOffer.offering_product,
        offering_quantity: parseFloat(newOffer.offering_quantity) || 0,
        offering_unit: newOffer.offering_unit,
        seeking_product: newOffer.seeking_product,
        seeking_quantity: parseFloat(newOffer.seeking_quantity) || 0,
        seeking_unit: newOffer.seeking_unit,
        location: newOffer.location,
        county: newOffer.county || null,
        description: newOffer.description || null,
        status: 'active'
      });

      if (error) throw error;

      toast({ title: 'Barter offer created successfully!' });
      setIsCreateDialogOpen(false);
      setNewOffer({
        offering_product: '', offering_quantity: '', offering_unit: 'kg',
        seeking_product: '', seeking_quantity: '', seeking_unit: 'kg',
        location: '', county: '', description: ''
      });
      fetchOffers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    try {
      const { error } = await supabase.from('barter_offers').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Offer deleted' });
      fetchOffers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <MobileHeader title="Barter Trade" />
      
      <main className="py-6 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <RefreshCcw className="h-8 w-8 text-primary" />
            Barter Trade Exchange
          </h1>
          <p className="text-muted-foreground">Trade agricultural products without money</p>
          
          <Card className="mt-4 bg-amber-50 dark:bg-amber-950 border-amber-200">
            <CardContent className="pt-4 space-y-2 text-sm">
              <p className="font-semibold">Important Guidelines:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Verify product quality before exchanging</li>
                <li>• Meet in safe, public locations</li>
                <li>• Consider fair market values for both items</li>
                <li>• Document exchanges with receipts/photos</li>
              </ul>
              <p className="text-xs text-amber-700 dark:text-amber-400 pt-2">
                <strong>Disclaimer:</strong> SokoConnect facilitates connections only. We are not responsible for product quality, fairness of trades, or disputes.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Post Barter Offer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Barter Trade Offer</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-3">What I'm Offering</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label>Product *</Label>
                      <Input 
                        placeholder="e.g., Maize" 
                        value={newOffer.offering_product}
                        onChange={(e) => setNewOffer({...newOffer, offering_product: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input 
                        type="number" 
                        placeholder="Amount"
                        value={newOffer.offering_quantity}
                        onChange={(e) => setNewOffer({...newOffer, offering_quantity: e.target.value})}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Unit</Label>
                      <Select value={newOffer.offering_unit} onValueChange={(v) => setNewOffer({...newOffer, offering_unit: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kg</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                          <SelectItem value="litres">Litres</SelectItem>
                          <SelectItem value="pieces">Pieces</SelectItem>
                          <SelectItem value="crates">Crates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-3">What I'm Seeking</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Label>Product *</Label>
                      <Input 
                        placeholder="e.g., Fertilizer"
                        value={newOffer.seeking_product}
                        onChange={(e) => setNewOffer({...newOffer, seeking_product: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input 
                        type="number" 
                        placeholder="Amount"
                        value={newOffer.seeking_quantity}
                        onChange={(e) => setNewOffer({...newOffer, seeking_quantity: e.target.value})}
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Unit</Label>
                      <Select value={newOffer.seeking_unit} onValueChange={(v) => setNewOffer({...newOffer, seeking_unit: v})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kg</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                          <SelectItem value="litres">Litres</SelectItem>
                          <SelectItem value="pieces">Pieces</SelectItem>
                          <SelectItem value="crates">Crates</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Location *</Label>
                  <Input 
                    placeholder="Your location"
                    value={newOffer.location}
                    onChange={(e) => setNewOffer({...newOffer, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label>County</Label>
                  <Input 
                    placeholder="e.g., Nairobi"
                    value={newOffer.county}
                    onChange={(e) => setNewOffer({...newOffer, county: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Add details about your offer..."
                    value={newOffer.description}
                    onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                  />
                </div>
                <Button onClick={handleCreateOffer} className="w-full" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Offer'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : offers.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <RefreshCcw className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No barter offers yet</h3>
              <p className="text-muted-foreground">Be the first to create a barter offer!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {offers.map(offer => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Trade Offer</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Active</Badge>
                      {user?.id === offer.user_id && (
                        <Button size="icon" variant="ghost" onClick={() => handleDeleteOffer(offer.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Offering</div>
                        <div className="font-semibold flex items-center gap-1">
                          <Package className="h-4 w-4 text-green-600" />
                          {offer.offering_product}
                        </div>
                        <div className="text-sm">{offer.offering_quantity} {offer.offering_unit}</div>
                      </div>
                      <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <div className="text-xs text-muted-foreground mb-1">Seeking</div>
                        <div className="font-semibold flex items-center gap-1">
                          <Package className="h-4 w-4 text-blue-600" />
                          {offer.seeking_product}
                        </div>
                        <div className="text-sm">{offer.seeking_quantity} {offer.seeking_unit}</div>
                      </div>
                    </div>

                    {offer.description && (
                      <p className="text-sm text-muted-foreground">{offer.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {offer.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(offer.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    <Button className="w-full">
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Propose Trade
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      <MobileNav />
    </div>
  );
};

export default BarterTrade;