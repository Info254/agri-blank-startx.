import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { MobileNav } from '@/components/ui/mobile-nav';
import { BottomNav } from '@/components/BottomNav';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Phone, 
  Star, 
  Navigation,
  Truck,
  Store,
  Search,
  Filter,
  Map as MapIcon,
  Route
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Major routes in Kenya
const MAJOR_ROUTES = [
  { id: 'A1', name: 'A1 - Nairobi-Mombasa Highway', description: 'The busiest highway connecting Nairobi to Mombasa port' },
  { id: 'A2', name: 'A2 - Nairobi-Nakuru-Eldoret Highway', description: 'Northern corridor to Eldoret and Uganda border' },
  { id: 'A3', name: 'A3 - Nairobi-Naivasha-Kisumu Highway', description: 'Western route to Kisumu and Lake Victoria' },
  { id: 'A104', name: 'A104 - Nairobi-Thika Superhighway', description: 'Modern expressway to Central Kenya' },
  { id: 'B3', name: 'B3 - Mombasa-Malindi-Lamu Highway', description: 'Coastal route connecting major beach towns' },
  { id: 'C77', name: 'C77 - Nairobi-Namanga Highway', description: 'Route to Tanzania border' },
  { id: 'A109', name: 'A109 - Nairobi Southern Bypass', description: 'Bypass connecting southern suburbs' }
];

interface RouteVendor {
  id: string;
  name: string;
  route: string;
  location: string;
  coordinates: string;
  services: string[];
  products: string[];
  rating: number;
  reviews: number;
  phone: string;
  verified: boolean;
  description: string;
}

const MajorRoutesMarketplace: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [vendors, setVendors] = useState<RouteVendor[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data - Replace with actual API call
  useEffect(() => {
    const mockVendors: RouteVendor[] = [
      {
        id: '1',
        name: 'Machakos Fresh Produce',
        route: 'A1',
        location: 'Machakos Junction, KM 65',
        coordinates: '-1.5177, 37.2634',
        services: ['Fresh Produce', 'Cold Storage', 'Bulk Orders'],
        products: ['Tomatoes', 'Onions', 'Potatoes', 'Cabbages'],
        rating: 4.5,
        reviews: 128,
        phone: '+254 712 345 678',
        verified: true,
        description: 'Quality fresh produce directly from Machakos farmers'
      },
      {
        id: '2',
        name: 'Athi River Grain Store',
        route: 'A1',
        location: 'Athi River, KM 25',
        coordinates: '-1.4522, 36.9781',
        services: ['Grain Trading', 'Warehousing', 'Transport Coordination'],
        products: ['Maize', 'Beans', 'Green Grams', 'Rice'],
        rating: 4.8,
        reviews: 95,
        phone: '+254 723 456 789',
        verified: true,
        description: 'Large grain warehouse serving Nairobi-Mombasa corridor'
      },
      {
        id: '3',
        name: 'Nakuru Dairy Hub',
        route: 'A2',
        location: 'Nakuru Town, KM 160',
        coordinates: '-0.3031, 36.0800',
        services: ['Dairy Products', 'Refrigerated Transport', 'Quality Testing'],
        products: ['Milk', 'Yogurt', 'Butter', 'Cheese'],
        rating: 4.7,
        reviews: 203,
        phone: '+254 734 567 890',
        verified: true,
        description: 'Fresh dairy from Nakuru farms delivered daily'
      },
      {
        id: '4',
        name: 'Thika Pineapple Vendors',
        route: 'A104',
        location: 'Thika, Blue Post Area',
        coordinates: '-1.0332, 37.0690',
        services: ['Fresh Fruits', 'Direct Farm Sales', 'Wholesale'],
        products: ['Pineapples', 'Avocados', 'Bananas'],
        rating: 4.3,
        reviews: 76,
        phone: '+254 745 678 901',
        verified: false,
        description: 'Famous for the sweetest Thika pineapples'
      }
    ];

    setTimeout(() => {
      setVendors(mockVendors);
      setLoading(false);
    }, 800);
  }, []);

  const filteredVendors = vendors.filter(vendor => {
    const matchesRoute = selectedRoute === 'all' || vendor.route === selectedRoute;
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.products.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRoute && matchesSearch;
  });

  const handleCallVendor = (phone: string, name: string) => {
    toast({
      title: "Calling...",
      description: `Dialing ${name} at ${phone}`,
    });
  };

  const handleNavigate = (coordinates: string, name: string) => {
    toast({
      title: "Opening Maps",
      description: `Navigating to ${name}`,
    });
    // In real app, open Google Maps with coordinates
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <MobileNav />

      <div className="container mx-auto px-4 py-6 pb-20 md:pb-6">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 flex items-center gap-2">
            <Route className="h-8 w-8 text-primary" />
            Major Routes Marketplace
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Find farmers, traders, and service providers along Kenya's major highways. 
            Direct access to quality produce and services on your route.
          </p>
          
          {/* Search & Filter */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search vendors, products, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger>
                <SelectValue placeholder="Select Route" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Routes</SelectItem>
                {MAJOR_ROUTES.map(route => (
                  <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Route Info Card */}
          {selectedRoute !== 'all' && (
            <Card className="mb-6 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <MapIcon className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {MAJOR_ROUTES.find(r => r.id === selectedRoute)?.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {MAJOR_ROUTES.find(r => r.id === selectedRoute)?.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading vendors...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Store className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No vendors found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or route selection
              </p>
              <Button onClick={() => { setSearchTerm(''); setSelectedRoute('all'); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVendors.map(vendor => (
              <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1 flex items-center gap-2">
                        {vendor.name}
                        {vendor.verified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {vendor.location}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{vendor.rating}</span>
                    <span className="text-muted-foreground">({vendor.reviews} reviews)</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {vendor.description}
                  </p>

                  <div className="mb-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">PRODUCTS:</p>
                    <div className="flex flex-wrap gap-1">
                      {vendor.products.slice(0, 4).map(product => (
                        <Badge key={product} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground mb-2">SERVICES:</p>
                    <div className="flex flex-wrap gap-1">
                      {vendor.services.slice(0, 3).map(service => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Badge className="mb-4">
                    <Route className="h-3 w-3 mr-1" />
                    Route {vendor.route}
                  </Badge>

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCallVendor(vendor.phone, vendor.name)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleNavigate(vendor.coordinates, vendor.name)}
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Navigate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Your Business CTA */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10">
          <CardContent className="pt-6 pb-6 text-center">
            <Truck className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold mb-2">Have a Business Along a Major Route?</h3>
            <p className="text-muted-foreground mb-4">
              Get discovered by thousands of travelers and traders. List your location, products, and services.
            </p>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Add Your Business
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default MajorRoutesMarketplace;
