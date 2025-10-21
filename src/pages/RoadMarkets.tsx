import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Star, 
  AlertTriangle, 
  Shield, 
  Truck, 
  Users,
  Flag,
  Scale,
  Camera
} from 'lucide-react';
import { MobileHeader, MobileNav } from '@/components/ui/mobile-nav';
import { useToast } from '@/hooks/use-toast';

interface RoadMarket {
  id: string;
  name: string;
  road: string;
  km_marker: string;
  location: string;
  county: string;
  coordinates: { lat: number; lng: number };
  operating_hours: string;
  primary_products: string[];
  verified_sellers: number;
  total_sellers: number;
  trust_score: number;
  recent_reports: number;
  facilities: string[];
  parking_available: boolean;
  security_level: 'low' | 'medium' | 'high';
  price_transparency: number;
  measurement_verified: boolean;
  created_at: string;
}

interface MarketReport {
  id: string;
  market_id: string;
  reporter_name: string;
  report_type: 'quality' | 'pricing' | 'measurement' | 'safety';
  description: string;
  severity: 'low' | 'medium' | 'high';
  verified: boolean;
  created_at: string;
}

const RoadMarkets: React.FC = () => {
  const [markets, setMarkets] = useState<RoadMarket[]>([]);
  const [reports, setReports] = useState<MarketReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoad, setSelectedRoad] = useState('all');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<RoadMarket | null>(null);
  const { toast } = useToast();

  const [newReport, setNewReport] = useState({
    report_type: '',
    description: '',
    severity: 'medium' as const
  });

  // Kenya's major roads as mentioned by the user
  const majorRoads = [
    'A1 (Namanga to Lokichogio)',
    'A2 (Nairobi to Moyale)', 
    'A3 (Thika to Garissa)',
    'A4 Road',
    'A5 Road',
    'A6 Road',
    'A7 Road',
    'A8 Road',
    'A9 Road'
  ];

  useEffect(() => {
    fetchMarkets();
    fetchReports();
  }, []);

  async function fetchMarkets() {
    setLoading(true);
    try {
      // Mock data representing roadside markets along Kenya's major roads
      const mockMarkets: RoadMarket[] = [
        {
          id: '1',
          name: 'Athi River Market',
          road: 'A1 (Namanga to Lokichogio)',
          km_marker: 'KM 25',
          location: 'Athi River Town',
          county: 'Machakos',
          coordinates: { lat: -1.4523, lng: 36.9778 },
          operating_hours: '6:00 AM - 8:00 PM',
          primary_products: ['Maize', 'Beans', 'Potatoes', 'Tomatoes'],
          verified_sellers: 15,
          total_sellers: 23,
          trust_score: 7.8,
          recent_reports: 2,
          facilities: ['Weighing scales', 'Parking', 'Toilets', 'Water'],
          parking_available: true,
          security_level: 'medium',
          price_transparency: 8.5,
          measurement_verified: true,
          created_at: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'Kajiado Junction Market',
          road: 'A1 (Namanga to Lokichogio)',
          km_marker: 'KM 45',
          location: 'Kajiado Junction',
          county: 'Kajiado',
          coordinates: { lat: -1.8523, lng: 36.7778 },
          operating_hours: '5:30 AM - 7:00 PM',
          primary_products: ['Onions', 'Cabbages', 'Carrots', 'Livestock'],
          verified_sellers: 8,
          total_sellers: 18,
          trust_score: 6.2,
          recent_reports: 5,
          facilities: ['Basic weighing', 'Parking'],
          parking_available: true,
          security_level: 'low',
          price_transparency: 5.5,
          measurement_verified: false,
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Thika Blue Post Market',
          road: 'A3 (Thika to Garissa)',
          km_marker: 'KM 5',
          location: 'Thika Blue Post',
          county: 'Kiambu',
          coordinates: { lat: -1.0369, lng: 37.0698 },
          operating_hours: '6:00 AM - 9:00 PM',
          primary_products: ['Pineapples', 'Bananas', 'Avocados', 'Coffee'],
          verified_sellers: 28,
          total_sellers: 35,
          trust_score: 9.1,
          recent_reports: 0,
          facilities: ['Digital scales', 'Covered stalls', 'Security', 'Banking', 'Restaurants'],
          parking_available: true,
          security_level: 'high',
          price_transparency: 9.2,
          measurement_verified: true,
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Isiolo Livestock Market',
          road: 'A2 (Nairobi to Moyale)',
          km_marker: 'KM 285',
          location: 'Isiolo Town',
          county: 'Isiolo',
          coordinates: { lat: 0.3496, lng: 37.5820 },
          operating_hours: '5:00 AM - 6:00 PM',
          primary_products: ['Cattle', 'Goats', 'Camels', 'Hides'],
          verified_sellers: 12,
          total_sellers: 30,
          trust_score: 5.8,
          recent_reports: 8,
          facilities: ['Livestock pens', 'Veterinary services', 'Water troughs'],
          parking_available: true,
          security_level: 'medium',
          price_transparency: 4.5,
          measurement_verified: false,
          created_at: new Date().toISOString()
        }
      ];
      setMarkets(mockMarkets);
    } catch (error) {
      console.error('Error fetching markets:', error);
      toast({
        title: 'Error',
        description: 'Failed to load road markets',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  async function fetchReports() {
    try {
      // Mock reports data
      const mockReports: MarketReport[] = [
        {
          id: '1',
          market_id: '2',
          reporter_name: 'John K.',
          report_type: 'measurement',
          description: 'Sellers using tampered scales, giving less than paid for',
          severity: 'high',
          verified: true,
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '2', 
          market_id: '4',
          reporter_name: 'Mary W.',
          report_type: 'pricing',
          description: 'Overpricing compared to standard market rates',
          severity: 'medium',
          verified: false,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setReports(mockReports);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  }

  const roads = Array.from(new Set(markets.map(m => m.road)));
  const counties = Array.from(new Set(markets.map(m => m.county)));

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         market.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRoad = selectedRoad === 'all' || market.road === selectedRoad;
    const matchesCounty = selectedCounty === 'all' || market.county === selectedCounty;
    return matchesSearch && matchesRoad && matchesCounty;
  });

  const handleSubmitReport = async () => {
    if (!selectedMarket) return;
    
    try {
      // Here you would save to Supabase
      toast({
        title: 'Report Submitted',
        description: 'Your report has been submitted for verification. Thank you for helping improve market transparency.'
      });
      setIsReportDialogOpen(false);
      setNewReport({ report_type: '', description: '', severity: 'medium' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit report',
        variant: 'destructive'
      });
    }
  };

  const getTrustColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSecurityBadge = (level: string) => {
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800', 
      low: 'bg-red-100 text-red-800'
    };
    return colors[level as keyof typeof colors];
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <MobileHeader title="Road Markets" />
      
      <main className="py-6 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Kenya Road Markets</h1>
          <p className="text-muted-foreground">
            Find verified sellers along Kenya's major roads. Travel safe, trade smart.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search markets..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="sm:w-64"
            />
            <Select value={selectedRoad} onValueChange={setSelectedRoad}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="All Roads" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roads</SelectItem>
                {roads.map(road => (
                  <SelectItem key={road} value={road}>{road}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Counties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {counties.map(county => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">Loading road markets...</div>
          ) : filteredMarkets.length > 0 ? (
            filteredMarkets.map(market => (
              <Card key={market.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{market.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Navigation className="h-4 w-4" />
                        {market.road} - {market.km_marker}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getTrustColor(market.trust_score)}`}>
                        {market.trust_score}/10
                      </div>
                      <div className="text-xs text-muted-foreground">Trust Score</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{market.location}, {market.county}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{market.operating_hours}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">
                          {market.verified_sellers}/{market.total_sellers} verified sellers
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Primary Products</h4>
                      <div className="flex flex-wrap gap-1">
                        {market.primary_products.map((product, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {product}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Facilities</h4>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {market.facilities.map((facility, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {facility}
                          </Badge>
                        ))}
                      </div>
                      <Badge className={`text-xs ${getSecurityBadge(market.security_level)}`}>
                        {market.security_level.toUpperCase()} Security
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-muted rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Scale className={`h-4 w-4 ${market.measurement_verified ? 'text-green-600' : 'text-red-600'}`} />
                        <span className="text-sm font-medium">
                          {market.measurement_verified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Measurements</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{market.price_transparency}/10</div>
                      <div className="text-xs text-muted-foreground">Price Transparency</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Truck className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {market.parking_available ? 'Available' : 'Limited'}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">Parking</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <AlertTriangle className={`h-4 w-4 ${market.recent_reports > 0 ? 'text-orange-600' : 'text-green-600'}`} />
                        <span className="text-sm font-medium">{market.recent_reports}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Recent Reports</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1">Visit Market</Button>
                    <Button variant="outline">Get Directions</Button>
                    <Dialog open={isReportDialogOpen} onOpenChange={setIsReportDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedMarket(market)}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Report Market Issue</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div>
                            <Label htmlFor="report-type">Report Type</Label>
                            <Select 
                              value={newReport.report_type} 
                              onValueChange={type => setNewReport({...newReport, report_type: type})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select report type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="measurement">Measurement Issues</SelectItem>
                                <SelectItem value="pricing">Pricing Problems</SelectItem>
                                <SelectItem value="quality">Quality Concerns</SelectItem>
                                <SelectItem value="safety">Safety Issues</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="severity">Severity</Label>
                            <Select 
                              value={newReport.severity} 
                              onValueChange={severity => setNewReport({...newReport, severity: severity as any})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              placeholder="Describe the issue..."
                              value={newReport.description}
                              onChange={e => setNewReport({...newReport, description: e.target.value})}
                            />
                          </div>
                          <Button onClick={handleSubmitReport} className="w-full">
                            Submit Report
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">No road markets found.</div>
          )}
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default RoadMarkets;