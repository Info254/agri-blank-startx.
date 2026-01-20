
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Users, MapPin, Calendar, Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
  county?: string;
  description?: string;
  status: string;
  created_at: string;
}

const BarterExchange: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [offers, setOffers] = useState<BarterOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
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

  async function fetchOffers() {
    setLoading(true);
    try {
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
  }

  async function handleCreateOffer(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Please log in to create a barter offer', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('barter_offers').insert({
        user_id: user.id,
        offering_product: newOffer.offering_product,
        offering_quantity: parseFloat(newOffer.offering_quantity),
        offering_unit: newOffer.offering_unit,
        seeking_product: newOffer.seeking_product,
        seeking_quantity: parseFloat(newOffer.seeking_quantity),
        seeking_unit: newOffer.seeking_unit,
        location: newOffer.location,
        county: newOffer.county || null,
        description: newOffer.description || null,
        status: 'active'
      });
      if (error) throw error;
      toast({ title: 'Barter offer posted successfully!' });
      setNewOffer({ offering_product: '', offering_quantity: '', offering_unit: 'kg', seeking_product: '', seeking_quantity: '', seeking_unit: 'kg', location: '', county: '', description: '' });
      setShowForm(false);
      fetchOffers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteOffer(id: string) {
    if (!confirm('Delete this barter offer?')) return;
    try {
      const { error } = await supabase.from('barter_offers').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Offer deleted' });
      fetchOffers();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  }

  const filteredListings = offers.filter(offer =>
    offer.offering_product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.seeking_product.toLowerCase().includes(searchTerm.toLowerCase()) ||
    offer.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Barter Exchange</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Trade agricultural goods and services directly with other farmers without using money
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search barter opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button><Plus className="h-4 w-4 mr-2" />Post Barter Offer</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Post Barter Offer</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateOffer} className="space-y-4">
                  <div>
                    <Label>What are you offering? *</Label>
                    <Input value={newOffer.offering_product} onChange={(e) => setNewOffer({...newOffer, offering_product: e.target.value})} placeholder="e.g., Maize, Beans, Tractor use" required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Quantity *</Label>
                      <Input type="number" value={newOffer.offering_quantity} onChange={(e) => setNewOffer({...newOffer, offering_quantity: e.target.value})} required />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Select value={newOffer.offering_unit} onValueChange={(val) => setNewOffer({...newOffer, offering_unit: val})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="bags">bags</SelectItem>
                          <SelectItem value="tons">tons</SelectItem>
                          <SelectItem value="days">days</SelectItem>
                          <SelectItem value="units">units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>What are you seeking? *</Label>
                    <Input value={newOffer.seeking_product} onChange={(e) => setNewOffer({...newOffer, seeking_product: e.target.value})} placeholder="e.g., Fertilizer, Transport" required />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Quantity *</Label>
                      <Input type="number" value={newOffer.seeking_quantity} onChange={(e) => setNewOffer({...newOffer, seeking_quantity: e.target.value})} required />
                    </div>
                    <div>
                      <Label>Unit</Label>
                      <Select value={newOffer.seeking_unit} onValueChange={(val) => setNewOffer({...newOffer, seeking_unit: val})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="bags">bags</SelectItem>
                          <SelectItem value="tons">tons</SelectItem>
                          <SelectItem value="days">days</SelectItem>
                          <SelectItem value="units">units</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Location *</Label>
                    <Input value={newOffer.location} onChange={(e) => setNewOffer({...newOffer, location: e.target.value})} placeholder="Town/Area" required />
                  </div>
                  <div>
                    <Label>County</Label>
                    <Input value={newOffer.county} onChange={(e) => setNewOffer({...newOffer, county: e.target.value})} placeholder="County name" />
                  </div>
                  <div>
                    <Label>Additional Details</Label>
                    <Textarea value={newOffer.description} onChange={(e) => setNewOffer({...newOffer, description: e.target.value})} placeholder="Any other information..." />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Posting...' : 'Post Offer'}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading barter offers...</div>
        ) : (
          <div className="grid gap-6">
            {filteredListings.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{offer.offering_product} ↔ {offer.seeking_product}</CardTitle>
                      <Badge variant="secondary">{offer.county || 'Kenya'}</Badge>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(offer.created_at).toLocaleDateString()}
                      </div>
                      {user?.id === offer.user_id && (
                        <Button variant="ghost" size="sm" className="mt-2" onClick={() => handleDeleteOffer(offer.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="p-4 border rounded-lg bg-primary/5">
                      <h4 className="font-semibold text-primary mb-2">Offering:</h4>
                      <p className="text-foreground">{offer.offering_quantity} {offer.offering_unit} of {offer.offering_product}</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-secondary/30">
                      <h4 className="font-semibold text-secondary-foreground mb-2">Looking for:</h4>
                      <p className="text-foreground">{offer.seeking_quantity} {offer.seeking_unit} of {offer.seeking_product}</p>
                    </div>
                  </div>
                  {offer.description && <p className="text-muted-foreground mb-4">{offer.description}</p>}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{offer.location}</span>
                    </div>
                    <Button variant="outline" onClick={() => toast({ title: 'Contact', description: 'Contact feature coming soon - use the forum to reach out!' })}>Contact</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredListings.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">No barter opportunities found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or be the first to post a barter offer!
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />Post Your First Barter Offer
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default BarterExchange;
