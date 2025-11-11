import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Ship, 
  Globe, 
  Search,
  MapPin,
  Calendar,
  DollarSign,
  Package,
  FileText,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MobileNavigation } from '@/components/MobileNavigation';
import highwayBackground from '@/assets/highway_background.png';

interface ExportOpportunity {
  id: string;
  buyer_company: string;
  buyer_country: string;
  product_required: string;
  quantity_required: number;
  unit: string;
  target_price: number;
  certifications_required: string[];
  deadline: string;
  description: string;
  contact_email: string;
  status: string;
}

const ExportMarketplace: React.FC = () => {
  const [opportunities, setOpportunities] = useState<ExportOpportunity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock data for demonstration
  const mockOpportunities: ExportOpportunity[] = [
    {
      id: '1',
      buyer_company: 'European Fresh Produce Ltd',
      buyer_country: 'Netherlands',
      product_required: 'Avocados (Hass)',
      quantity_required: 50000,
      unit: 'kg',
      target_price: 3.50,
      certifications_required: ['GlobalGAP', 'Organic EU'],
      deadline: '2025-02-28',
      description: 'Seeking high-quality Hass avocados for European market. Must meet EU food safety standards.',
      contact_email: 'procurement@europeanfresh.com',
      status: 'active'
    },
    {
      id: '2',
      buyer_company: 'Asian Spice Importers',
      buyer_country: 'Singapore',
      product_required: 'Dried Chili Peppers',
      quantity_required: 10000,
      unit: 'kg',
      target_price: 5.00,
      certifications_required: ['HACCP', 'ISO 22000'],
      deadline: '2025-03-15',
      description: 'Looking for premium dried chili peppers with consistent quality and spice level.',
      contact_email: 'buyers@asianspice.sg',
      status: 'active'
    },
    {
      id: '3',
      buyer_company: 'American Coffee Roasters',
      buyer_country: 'United States',
      product_required: 'Arabica Coffee Beans',
      quantity_required: 100000,
      unit: 'kg',
      target_price: 6.00,
      certifications_required: ['Fair Trade', 'Rainforest Alliance'],
      deadline: '2025-04-30',
      description: 'Premium Arabica coffee beans for specialty roasting. Looking for long-term supply partnership.',
      contact_email: 'sourcing@americancoffee.com',
      status: 'active'
    }
  ];

  useEffect(() => {
    setOpportunities(mockOpportunities);
  }, []);

  const filteredOpportunities = opportunities.filter(opp =>
    opp.product_required.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.buyer_country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.buyer_company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (opportunityId: string) => {
    toast({
      title: 'Application Submitted',
      description: 'Your expression of interest has been sent to the buyer. They will contact you directly.'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative py-24 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${highwayBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <Ship className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-2xl">
            Export Marketplace
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto drop-shadow-lg opacity-95">
            Connect with international buyers and expand your agricultural business globally. 
            Access verified export opportunities from buyers worldwide.
          </p>
          <Button size="lg" variant="secondary" className="shadow-xl">
            <Plus className="h-4 w-4 mr-2" />
            Register as Exporter
          </Button>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Disclaimer */}
        <Card className="mb-8 bg-amber-50 dark:bg-amber-950 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm space-y-2">
                <p className="font-semibold text-amber-900 dark:text-amber-200">Important Export Guidelines:</p>
                <ul className="space-y-1 text-amber-800 dark:text-amber-300">
                  <li>• Verify buyer credentials before entering into contracts</li>
                  <li>• Ensure you have all required certifications and export licenses</li>
                  <li>• Understand international trade terms (Incoterms)</li>
                  <li>• Comply with phytosanitary and food safety regulations</li>
                  <li>• Consider using escrow services for secure payments</li>
                </ul>
                <p className="text-xs text-amber-700 dark:text-amber-400 pt-2">
                  <strong>Disclaimer:</strong> SokoConnect facilitates connections between exporters and buyers. 
                  We are not responsible for contract disputes, product quality, payment issues, or compliance failures. 
                  Always conduct due diligence and seek legal/trade advice when necessary.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Stats */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product, country, or buyer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredOpportunities.length} active opportunities
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-semibold">50+ Countries</div>
              <p className="text-xs text-muted-foreground">Global buyer network</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <Package className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-semibold">200+ Products</div>
              <p className="text-xs text-muted-foreground">Diverse demand</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-semibold">Verified Buyers</div>
              <p className="text-xs text-muted-foreground">Pre-screened companies</p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="pt-6">
              <DollarSign className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="font-semibold">Fair Prices</div>
              <p className="text-xs text-muted-foreground">Competitive offers</p>
            </CardContent>
          </Card>
        </div>

        {/* Export Opportunities List */}
        <div className="space-y-6">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{opportunity.product_required}</CardTitle>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {opportunity.buyer_company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {opportunity.buyer_country}
                      </span>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">{opportunity.description}</p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Quantity Required</div>
                      <div className="font-medium">{opportunity.quantity_required.toLocaleString()} {opportunity.unit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Target Price</div>
                      <div className="font-medium">USD ${opportunity.target_price}/{opportunity.unit}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Deadline</div>
                      <div className="font-medium flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(opportunity.deadline).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Required Certifications:</div>
                    <div className="flex gap-2 flex-wrap">
                      {opportunity.certifications_required.map((cert, index) => (
                        <Badge key={index} variant="secondary">{cert}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t flex gap-2">
                    <Button 
                      onClick={() => handleApply(opportunity.id)}
                      className="flex-1"
                    >
                      <Ship className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                    <Button variant="outline">View Details</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOpportunities.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Ship className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No opportunities found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or check back later for new export opportunities.
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <div className="pb-20 md:pb-0">
        <MobileNavigation />
      </div>
    </div>
  );
};

export default ExportMarketplace;
