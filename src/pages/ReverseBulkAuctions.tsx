import { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Calendar, MapPin, TrendingDown, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReverseBulkAuction {
  id: string;
  product_name: string;
  description: string;
  buyer_id: string;
  quantity: number;
  max_price: number;
  deadline: string;
  location: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

const ReverseBulkAuctions = () => {
  const { toast } = useToast();
  const [auctions, setAuctions] = useState<ReverseBulkAuction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "closed" | "all">("active");

  useEffect(() => {
    fetchAuctions();
  }, [activeTab]);

  const fetchAuctions = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('reverse_bulk_auctions')
        .select(`
          *,
          profiles:buyer_id (
            full_name
          )
        `);

      if (activeTab === "active") {
        query = query.eq('status', 'active');
      } else if (activeTab === "closed") {
        query = query.in('status', ['closed', 'completed']);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setAuctions(data || []);
    } catch (error) {
      console.error('Error fetching reverse auctions:', error);
      toast({
        title: "Error",
        description: "Failed to load reverse auctions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAuctions = auctions.filter(auction => {
    const matchesSearch = searchTerm === "" || 
      auction.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      auction.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reverse Auctions for Bulk Orders</h1>
            <p className="text-muted-foreground mt-2">
              Buyers post their needs and sellers compete to offer the best price
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>Post Bulk Need</Button>
          </div>
        </div>

        <Tabs defaultValue="active" value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "closed" | "all")} className="mb-6">
          <TabsList>
            <TabsTrigger value="active">Active Auctions</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
            <TabsTrigger value="all">All Auctions</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-6">
          <Input
            placeholder="Search by product, location, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-2/3 lg:w-1/2"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Card key={n} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded w-full mb-2"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredAuctions.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No reverse auctions found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {activeTab === "active" 
                ? "No active auctions match your search. Try different keywords or post a new bulk need." 
                : "No auctions found. Check back later or view all auctions."}
            </p>
            {activeTab !== "all" && (
              <Button variant="outline" onClick={() => setActiveTab("all")}>
                View All Auctions
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAuctions.map((auction) => {
              const daysLeft = Math.ceil((new Date(auction.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              const isExpired = daysLeft < 0;
              
              return (
                <Card key={auction.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{auction.product_name}</CardTitle>
                    <CardDescription className="truncate">{auction.profiles?.full_name || 'Buyer'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {auction.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{auction.description}</p>
                    )}
                    
                    <div className="flex items-center text-sm gap-1">
                      <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium truncate">{auction.quantity.toLocaleString()} units needed</span>
                    </div>
                    
                    <div className="flex items-center text-sm gap-1">
                      <TrendingDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">Max: <span className="font-semibold">KES {auction.max_price.toLocaleString()}</span></span>
                    </div>
                    
                    <div className="flex items-center text-sm gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{auction.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">Deadline: {new Date(auction.deadline).toLocaleDateString()}</span>
                    </div>

                    {auction.status === 'active' && !isExpired && (
                      <Badge variant={daysLeft > 7 ? "secondary" : "destructive"} className="w-full justify-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining
                      </Badge>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Badge variant={auction.status === 'active' ? 'default' : 'secondary'}>
                      {auction.status}
                    </Badge>
                    <Button size="sm" disabled={auction.status !== 'active' || isExpired}>
                      {auction.status === 'active' && !isExpired ? 'Bid on Order' : 'View Details'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
};

export default ReverseBulkAuctions;
