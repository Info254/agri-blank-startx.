import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Package, 
  Calendar, 
  MapPin,
  TrendingDown,
  Clock,
  Plus,
  Search
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface BulkOrder {
  id: string;
  buyer_id: string;
  product_type: string;
  quantity: number;
  unit: string;
  max_price: number | null;
  delivery_location: string;
  delivery_date: string;
  requirements: string | null;
  status: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
}

const BulkOrders: React.FC = () => {
  const [orders, setOrders] = useState<BulkOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const [newOrder, setNewOrder] = useState({
    product_type: '',
    quantity: '',
    unit: 'kg',
    max_price: '',
    delivery_location: '',
    delivery_date: '',
    requirements: ''
  });

  useEffect(() => {
    fetchBulkOrders();
  }, []);

  const fetchBulkOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bulk_orders')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching bulk orders:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bulk orders. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Please login to create orders', variant: 'destructive' });
      return;
    }
    try {
      setSubmitting(true);
      const { error } = await supabase.from('bulk_orders').insert({
        buyer_id: user.id,
        product_type: newOrder.product_type,
        quantity: parseFloat(newOrder.quantity),
        unit: newOrder.unit,
        max_price: newOrder.max_price ? parseFloat(newOrder.max_price) : null,
        delivery_location: newOrder.delivery_location,
        delivery_date: newOrder.delivery_date,
        requirements: newOrder.requirements || null,
        status: 'active'
      });
      if (error) throw error;
      toast({ title: 'Bulk order created successfully!' });
      setNewOrder({ product_type: '', quantity: '', unit: 'kg', max_price: '', delivery_location: '', delivery_date: '', requirements: '' });
      setShowForm(false);
      fetchBulkOrders();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const joinOrder = async (orderId: string) => {
    try {
      // In a real app, you'd insert into a participants table
      toast({
        title: 'Joined Order',
        description: 'You have successfully joined this bulk order!',
      });
    } catch (error) {
      console.error('Error joining order:', error);
      toast({
        title: 'Error',
        description: 'Failed to join order. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const filteredOrders = orders.filter(order =>
    order.product_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.delivery_location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateProgress = (order: BulkOrder) => {
    // Simplified progress calculation
    return Math.min((order.quantity / 1000) * 100, 100);
  };

  const getDaysRemaining = (deliveryDate: string | null) => {
    if (!deliveryDate) return 0;
    const date = new Date(deliveryDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-12 px-6 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-lg">Loading bulk orders...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with gradient background similar to auth pages */}
      <section className="relative py-24 bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 dark:from-green-900 dark:via-green-800 dark:to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Bulk Orders</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto drop-shadow-md opacity-95">
            Join group purchases to get better prices on agricultural inputs and products. 
            Organize with other farmers in your area for maximum savings.
          </p>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button size="lg" variant="secondary" className="shadow-xl hover:shadow-2xl transition-shadow">
                <Plus className="h-4 w-4 mr-2" />
                Create Bulk Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Bulk Order</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateOrder} className="space-y-4">
                <div>
                  <Label>Product Type *</Label>
                  <Input value={newOrder.product_type} onChange={(e) => setNewOrder({...newOrder, product_type: e.target.value})} placeholder="e.g., Fertilizer, Seeds" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity *</Label>
                    <Input type="number" value={newOrder.quantity} onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})} required />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Select value={newOrder.unit} onValueChange={(v) => setNewOrder({...newOrder, unit: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="bags">bags</SelectItem>
                        <SelectItem value="litres">litres</SelectItem>
                        <SelectItem value="pieces">pieces</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Max Price (KES)</Label>
                  <Input type="number" value={newOrder.max_price} onChange={(e) => setNewOrder({...newOrder, max_price: e.target.value})} placeholder="Optional" />
                </div>
                <div>
                  <Label>Delivery Location *</Label>
                  <Input value={newOrder.delivery_location} onChange={(e) => setNewOrder({...newOrder, delivery_location: e.target.value})} placeholder="e.g., Nakuru, Kenya" required />
                </div>
                <div>
                  <Label>Delivery Date *</Label>
                  <Input type="date" value={newOrder.delivery_date} onChange={(e) => setNewOrder({...newOrder, delivery_date: e.target.value})} required />
                </div>
                <div>
                  <Label>Requirements</Label>
                  <Textarea value={newOrder.requirements} onChange={(e) => setNewOrder({...newOrder, requirements: e.target.value})} placeholder="Any specific requirements..." />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Bulk Order'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="relative mb-4 md:mb-0">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bulk orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 md:w-64"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredOrders.length} active bulk orders
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingDown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Save Up to 30%</h3>
              <p className="text-muted-foreground">Get wholesale prices through group buying power</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Community Driven</h3>
              <p className="text-muted-foreground">Connect with farmers in your area</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
              <p className="text-muted-foreground">Verified suppliers and products</p>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Orders List */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const progress = calculateProgress(order);
            const daysRemaining = getDaysRemaining(order.delivery_date);
            
            return (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{order.product_type}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{order.delivery_location}</span>
                      </div>
                    </div>
                    <Badge variant={daysRemaining > 7 ? "default" : "destructive"}>
                      {daysRemaining} days left
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{order.requirements || 'No specific requirements'}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Quantity Needed</div>
                        <div className="font-medium">{order.quantity} {order.unit}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Max Price</div>
                        <div className="font-medium">KES {order.max_price || 'N/A'}/{order.unit}</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Delivery: {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'TBD'}</span>
                    </div>

                    <div className="pt-4 border-t flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => joinOrder(order.id)}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Join Order
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredOrders.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bulk orders found</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a bulk order in your area.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Bulk Order
              </Button>
            </CardContent>
          </Card>
        )}

        {/* How It Works */}
        <section className="mt-16 bg-muted/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">How Bulk Orders Work</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to save money through group purchasing
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Find or Create</h3>
              <p className="text-muted-foreground text-sm">Browse existing orders or create your own</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Join & Commit</h3>
              <p className="text-muted-foreground text-sm">Commit to your quantity and payment</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Reach Target</h3>
              <p className="text-muted-foreground text-sm">Wait for minimum participants to join</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Get Delivery</h3>
              <p className="text-muted-foreground text-sm">Receive your order at wholesale prices</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BulkOrders;