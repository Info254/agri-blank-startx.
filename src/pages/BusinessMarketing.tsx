import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Megaphone, TrendingUp, Users, Target, CheckCircle } from 'lucide-react';
import advertiseBackground from '@/assets/advertise_background.png';

const BusinessMarketing: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    business_type: '',
    description: '',
    contact_phone: '',
    contact_email: '',
    location: '',
    county: '',
    services_offered: '',
    target_audience: '',
    website_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to advertise your business',
        variant: 'destructive'
      });
      navigate('/auth');
      return;
    }

    toast({
      title: 'Success!',
      description: 'Your business advertisement has been submitted. Feature coming soon!'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Background Image */}
      <section 
        className="relative py-24 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${advertiseBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4 text-center relative z-10">
          <Megaphone className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-2xl">
            Advertise Your Agricultural Business
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto drop-shadow-lg opacity-95">
            Reach thousands of farmers, buyers, and agribusinesses across Kenya. 
            Grow your customer base with targeted advertising on SokoConnect.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12">
        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader className="text-center">
              <Target className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Targeted Reach</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Connect with farmers, buyers, and processors actively seeking agricultural products and services
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Growing Network</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Join thousands of verified businesses in Kenya's largest agricultural marketplace
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2" />
              <CardTitle>Measurable Results</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
              Track views, inquiries, and conversions with our built-in analytics dashboard
            </CardContent>
          </Card>
        </div>

        {/* Advertisement Form */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Submit Your Business Advertisement</CardTitle>
            <CardDescription>
              Fill out the form below to advertise your agricultural business on SokoConnect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="business_name">Business Name *</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="business_type">Business Type *</Label>
                  <Select 
                    value={formData.business_type}
                    onValueChange={(value) => setFormData({ ...formData, business_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplier">Farm Input Supplier</SelectItem>
                      <SelectItem value="equipment">Equipment Dealer</SelectItem>
                      <SelectItem value="logistics">Logistics Provider</SelectItem>
                      <SelectItem value="processor">Processor</SelectItem>
                      <SelectItem value="exporter">Exporter</SelectItem>
                      <SelectItem value="service">Service Provider</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Business Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your business, products, and services..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact_phone">Contact Phone *</Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={formData.contact_phone}
                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                    placeholder="+254..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="contact_email">Contact Email *</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Town/City"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="county">County *</Label>
                  <Input
                    id="county"
                    value={formData.county}
                    onChange={(e) => setFormData({ ...formData, county: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-900 dark:text-amber-200">
                    <p className="font-semibold mb-2">What happens next?</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Your advertisement will be reviewed by our team (24-48 hours)</li>
                      <li>• Once approved, it will be visible to all SokoConnect users</li>
                      <li>• You'll receive notifications when customers contact you</li>
                      <li>• Track your ad performance in your dashboard</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Advertisement'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <div className="pb-20 md:pb-0">
        <MobileNavigation />
      </div>
    </div>
  );
};

export default BusinessMarketing;
