import { useState, useEffect } from "react";
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, MapPin, TrendingDown, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface GroupOrder {
  id: string;
  input_name: string;
  description: string;
  organizer_id: string;
  target_quantity: number;
  current_quantity: number;
  unit_price: number;
  deadline: string;
  location: string;
  status: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

const GroupInputOrders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<GroupOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "all">("active");

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('group_input_orders')
        .select(`
          *,
          profiles:organizer_id (
            full_name
          )
        `);

      if (activeTab === "active") {
        query = query.eq('status', 'active');
      } else if (activeTab === "completed") {
        query = query.eq('status', 'completed');
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching group orders:', error);
      toast({
        title: "Error",
        description: "Failed to load group orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === "" || 
      order.input_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.location.toLowerCase().includes(searchTerm.toLowerCase());
    
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
            <h1 className="text-3xl font-bold tracking-tight">Group Purchasing for Inputs</h1>
            <p className="text-muted-foreground mt-2">
              Save money by buying farm inputs in bulk with other farmers
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button>Express Need</Button>
          </div>
        </div>

        <Tabs defaultValue="active" value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "completed" | "all")} className="mb-6">
          <TabsList>
            <TabsTrigger value="active">Active Orders</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Orders</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mb-6">
          <Input
            placeholder="Search by input name, location, or description..."
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
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No group orders found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {activeTab === "active" 
                ? "No active group orders match your search. Try different keywords or start a new order." 
                : "No orders found. Check back later or view all orders."}
            </p>
            {activeTab !== "all" && (
              <Button variant="outline" onClick={() => setActiveTab("all")}>
                View All Orders
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const progress = (order.current_quantity / order.target_quantity) * 100;
              const daysLeft = Math.ceil((new Date(order.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              
              return (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{order.input_name}</CardTitle>
                    <CardDescription className="truncate">{order.profiles?.full_name || 'Organizer'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {order.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">{order.description}</p>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{order.current_quantity} / {order.target_quantity} units</span>
                        {order.status === 'active' && (
                          <Badge variant={daysLeft > 7 ? "secondary" : "destructive"} className="text-xs">
                            {daysLeft} days left
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{order.location}</span>
                    </div>
                    
                    <div className="flex items-center text-sm gap-1">
                      <TrendingDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">KES {order.unit_price.toLocaleString()} per unit</span>
                    </div>
                    
                    <div className="flex items-center text-sm gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">Deadline: {new Date(order.deadline).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between gap-2">
                    <Badge variant={order.status === 'active' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                    <Button size="sm" disabled={order.status !== 'active'}>
                      {order.status === 'active' ? 'Join Order' : 'View Details'}
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

export default GroupInputOrders;
