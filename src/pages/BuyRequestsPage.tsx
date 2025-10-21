import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MapPin, Calendar, Package, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BuyRequestForm from '@/components/BuyRequestForm';
import BuyRequestList from '@/components/BuyRequestList';
import Header from '@/components/Header';

interface BuyRequest {
  id: string;
  buyer_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  max_price: number;
  location: string;
  deadline: string;
  description: string;
  status: string;
  created_at: string;
}

const BuyRequestsPage: React.FC = () => {
  const [requests, setRequests] = useState<BuyRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBuyRequests();
  }, []);

  const fetchBuyRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('buy_requests')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching buy requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load buy requests. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request =>
    request.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="py-12 px-6 max-w-7xl mx-auto">
          <div className="text-center">
            <div className="text-lg">Loading buy requests...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Buy Requests</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connect with buyers looking for agricultural products. Post what you're selling or find buyers for your produce.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Buy Request
          </Button>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div className="relative mb-4 md:mb-0">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search buy requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 md:w-64"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredRequests.length} active buy requests
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Direct Connection</h3>
              <p className="text-muted-foreground">Connect directly with verified buyers</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
              <p className="text-muted-foreground">Pre-negotiated quality standards</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Local Markets</h3>
              <p className="text-muted-foreground">Find buyers in your area</p>
            </CardContent>
          </Card>
        </div>

        {/* Buy Requests List */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredRequests.map((request) => {
            const daysRemaining = getDaysRemaining(request.deadline);
            
            return (
              <Card key={request.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl mb-2">{request.product_name}</CardTitle>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{request.location}</span>
                      </div>
                    </div>
                    <Badge variant={daysRemaining > 7 ? "default" : "destructive"}>
                      {daysRemaining} days left
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">{request.description}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Quantity Needed</div>
                        <div className="font-medium">{request.quantity} {request.unit}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Max Price</div>
                        <div className="font-medium">KES {request.max_price}/{request.unit}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline: {new Date(request.deadline).toLocaleDateString()}</span>
                    </div>

                    <div className="pt-4 border-t flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        <Package className="h-4 w-4 mr-2" />
                        Contact Buyer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredRequests.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No buy requests found</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to create a buy request in your area.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Buy Request
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Create Buy Request</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                Close
              </Button>
            </div>
            <BuyRequestForm 
              userId="temp-user-id" 
              onSubmitted={() => {
                setShowCreateForm(false);
                fetchBuyRequests();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyRequestsPage;