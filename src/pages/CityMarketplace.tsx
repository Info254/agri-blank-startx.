import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MobileHeader, MobileNav } from '@/components/ui/mobile-nav';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Gavel, Clock, TrendingUp, Plus, AlertCircle } from 'lucide-react';

export default function CityMarketplace() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const { data, error } = await supabase
        .from('city_market_auctions')
        .select('*, product:city_market_products(*)')
        .eq('status', 'active')
        .order('end_time', { ascending: true });

      if (error) throw error;
      setAuctions(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (auctionId: string, bidAmount: number) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to place bids',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase.from('city_market_bids').insert({
        auction_id: auctionId,
        bidder_user_id: user.id,
        bid_amount: bidAmount
      });

      if (error) throw error;

      toast({
        title: 'Bid Placed',
        description: 'Your bid has been submitted successfully'
      });
      fetchAuctions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <MobileHeader title="City Market Auctions" />
      
      <main className="py-6 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <Gavel className="h-8 w-8 text-primary" />
            City Market Live Auctions
          </h1>
          <p className="text-muted-foreground">Bid on wholesale agricultural products</p>
          
          <Card className="mt-4 bg-amber-50 dark:bg-amber-950 border-amber-200">
            <CardContent className="pt-4 space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Auction Guidelines:</p>
                  <ul className="space-y-1 text-muted-foreground mt-2">
                    <li>• All bids are binding once accepted</li>
                    <li>• Verify product quality before bidding</li>
                    <li>• Payment must be made within 24 hours</li>
                    <li>• Pickup arrangements are buyer's responsibility</li>
                  </ul>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-3">
                    <strong>Disclaimer:</strong> SokoConnect facilitates auction connections only. We are not responsible for product quality, payment disputes, or transaction failures. Participate at your own risk.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-full text-center text-muted-foreground">Loading auctions...</p>
          ) : auctions.length === 0 ? (
            <p className="col-span-full text-center text-muted-foreground">No active auctions</p>
          ) : (
            auctions.map(auction => (
              <Card key={auction.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{auction.product?.name || 'Product'}</CardTitle>
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Starting Price:</span>
                      <span className="font-semibold">KES {auction.starting_price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Bid:</span>
                      <span className="font-bold text-primary">
                        KES {(auction.current_price || auction.starting_price)?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ends:</span>
                      <span>{new Date(auction.end_time).toLocaleString()}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => {
                      const bidAmount = prompt('Enter your bid amount (KES):');
                      if (bidAmount) handlePlaceBid(auction.id, parseFloat(bidAmount));
                    }}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Place Bid
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
