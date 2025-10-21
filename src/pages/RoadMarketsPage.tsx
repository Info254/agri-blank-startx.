import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Navigation,
  Star,
  Truck,
  AlertCircle
} from 'lucide-react';

// Mock data for highway markets - in production this would come from database
const roadMarkets = [
  {
    id: '1',
    name: 'Thika Road Fresh Market',
    highway: 'A1',
    location: 'Thika Road, Km 15',
    coordinates: { lat: -1.2, lng: 36.9 },
    products: ['Vegetables', 'Fruits', 'Grains'],
    contact: '+254712345678',
    operatingHours: '6:00 AM - 7:00 PM',
    rating: 4.5,
    vendors: 25,
    parkingAvailable: true,
    verified: true
  },
  {
    id: '2',
    name: 'Mombasa Highway Produce',
    highway: 'A8',
    location: 'Mombasa Road, Km 8',
    coordinates: { lat: -1.3, lng: 36.8 },
    products: ['Coconuts', 'Cashews', 'Mangoes'],
    contact: '+254723456789',
    operatingHours: '5:30 AM - 8:00 PM',
    rating: 4.2,
    vendors: 18,
    parkingAvailable: true,
    verified: false
  },
  {
    id: '3',
    name: 'Nakuru Highway Market',
    highway: 'A4',
    location: 'Nakuru Road, Km 35',
    coordinates: { lat: -0.9, lng: 36.7 },
    products: ['Potatoes', 'Cabbages', 'Carrots'],
    contact: '+254734567890',
    operatingHours: '6:00 AM - 6:00 PM',
    rating: 4.8,
    vendors: 42,
    parkingAvailable: true,
    verified: true
  }
];

const highways = ['All Highways', 'A1', 'A2', 'A3', 'A4', 'A8', 'A9'];

const RoadMarketsPage: React.FC = () => {
  const [markets, setMarkets] = useState(roadMarkets);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHighway, setSelectedHighway] = useState('All Highways');
  const [selectedProduct, setSelectedProduct] = useState('All Products');

  const allProducts = Array.from(new Set(roadMarkets.flatMap(market => market.products)));

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHighway = selectedHighway === 'All Highways' || market.highway === selectedHighway;
    const matchesProduct = selectedProduct === 'All Products' || market.products.includes(selectedProduct);
    
    return matchesSearch && matchesHighway && matchesProduct;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Highway Markets (A1-A9)</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover roadside farmers and highway sellers along Kenya's major highways. 
            Fresh produce directly from farmers to your table.
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            {highways.slice(1).map(highway => (
              <Badge key={highway} variant="secondary" className="bg-white/20 text-white">
                {highway} Highway
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Input
              placeholder="Search markets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
            <Select value={selectedHighway} onValueChange={setSelectedHighway}>
              <SelectTrigger>
                <SelectValue placeholder="Select Highway" />
              </SelectTrigger>
              <SelectContent>
                {highways.map(highway => (
                  <SelectItem key={highway} value={highway}>{highway}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger>
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Products">All Products</SelectItem>
                {allProducts.map(product => (
                  <SelectItem key={product} value={product}>{product}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground flex items-center">
              {filteredMarkets.length} markets found
            </div>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <Card key={market.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{market.name}</CardTitle>
                      {market.verified && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground text-sm">{market.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{market.highway} Highway</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{market.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{market.operatingHours}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{market.contact}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2">Available Products</h4>
                    <div className="flex flex-wrap gap-1">
                      {market.products.map((product, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{market.vendors} vendors</span>
                    {market.parkingAvailable && (
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        <span>Parking</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button size="sm" className="flex-1">
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Information Section */}
        <section className="mt-16 bg-muted/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Highway Market Guide</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about shopping at roadside markets
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Best Times to Visit</h3>
              <p className="text-muted-foreground text-sm">Early morning (6-9 AM) for freshest produce and best prices</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safety Tips</h3>
              <p className="text-muted-foreground text-sm">Park safely off the highway and use designated parking areas</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Assurance</h3>
              <p className="text-muted-foreground text-sm">Look for verified vendors and check produce quality before buying</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoadMarketsPage;