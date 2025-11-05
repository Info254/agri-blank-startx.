import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Route, Store, Phone } from 'lucide-react';
import { MobileHeader, MobileNav } from '@/components/ui/mobile-nav';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface RouteMarket {
  id: string;
  route_name: string;
  route_code: string;
  start_location: string;
  end_location: string;
  distance_km: number;
  active_listings: number;
  major_commodities: string[];
  description: string;
  is_active: boolean;
}

const RouteBasedMarkets: React.FC = () => {
  const [markets, setMarkets] = useState<RouteMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchMarkets();
  }, []);

  async function fetchMarkets() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('route_based_markets')
        .select('*')
        .eq('is_active', true);
      
      if (error) throw error;
      setMarkets(data || []);
    } catch (error) {
      console.error('Error fetching markets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load route-based markets',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const filteredMarkets = markets.filter(m => 
    m.route_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.start_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.end_location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <MobileHeader title="Route-Based Markets" />
      
      <main className="py-6 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Route-Based Markets</h1>
          <p className="text-muted-foreground">
            Discover vendors and markets along major transport routes
          </p>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Search routes, start or end location..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">Loading markets...</div>
        ) : filteredMarkets.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredMarkets.map(market => (
              <Card key={market.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Route className="h-5 w-5" />
                      {market.route_name}
                    </span>
                    <Badge variant="outline">{market.route_code}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">From:</span> {market.start_location}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span className="font-medium">To:</span> {market.end_location}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Route className="h-4 w-4" />
                      <span className="font-medium">Distance:</span> {market.distance_km} km
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Store className="h-4 w-4" />
                      <span className="font-medium">Active Listings:</span> {market.active_listings}
                    </div>
                    
                    {market.major_commodities && market.major_commodities.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium mb-2">Major Commodities:</p>
                        <div className="flex flex-wrap gap-1">
                          {market.major_commodities.map((commodity, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {commodity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-sm text-muted-foreground mt-3">{market.description}</p>
                    
                    <Button className="w-full mt-4">Explore Markets</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Store className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No markets found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or check back later for new markets.
            </p>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Suggest a Market</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Suggest a Route-Based Market</DialogTitle>
                </DialogHeader>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Route Name*</Label>
                      <Input placeholder="e.g., A1 Nairobi-Mombasa" required />
                    </div>
                    <div>
                      <Label>Route Code</Label>
                      <Input placeholder="e.g., A1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Location*</Label>
                      <Input placeholder="e.g., Nairobi" required />
                    </div>
                    <div>
                      <Label>End Location*</Label>
                      <Input placeholder="e.g., Mombasa" required />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea placeholder="Describe the market opportunities along this route..." />
                  </div>
                  <Button type="submit" className="w-full">Submit Suggestion</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </main>
      
      <MobileNav />
    </div>
  );
};

export default RouteBasedMarkets;