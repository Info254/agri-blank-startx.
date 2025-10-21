import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Truck, 
  MapPin, 
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Marketplace: React.FC = () => {
  const navigate = useNavigate();

  const marketplaces = [
    {
      title: 'Farm Input Marketplace',
      description: 'Quality agricultural inputs from verified suppliers',
      icon: <Package className="h-8 w-8 text-primary" />,
      route: '/farm-input-marketplace',
      features: ['Verified Suppliers', 'Quality Guarantee', 'Bulk Discounts', 'Fast Delivery'],
      stats: { suppliers: '500+', products: '2,000+' }
    },
    {
      title: 'Agricultural Marketplace',
      description: 'Buy and sell produce, livestock, and agricultural products',
      icon: <Store className="h-8 w-8 text-primary" />,
      route: '/agricultural-marketplace',
      features: ['Fresh Produce', 'Livestock Trading', 'Direct Farm Sales', 'Price Transparency'],
      stats: { farmers: '2,000+', listings: '5,000+' }
    },
    {
      title: 'Bulk Orders',
      description: 'Organize group purchases for better prices',
      icon: <Users className="h-8 w-8 text-primary" />,
      route: '/bulk-orders',
      features: ['Group Buying', 'Volume Discounts', 'Shared Logistics', 'Community Orders'],
      stats: { orders: '300+', savings: '30%' }
    },
    {
      title: 'City Markets',
      description: 'Connect with local city and county markets',
      icon: <MapPin className="h-8 w-8 text-primary" />,
      route: '/city-markets',
      features: ['Local Markets', 'Market Info', 'Trading Hours', 'Location Services'],
      stats: { markets: '150+', counties: '47' }
    }
  ];

  const quickActions = [
    {
      title: 'Post a Listing',
      description: 'Sell your produce to buyers nationwide',
      icon: <Store className="h-6 w-6" />,
      action: () => navigate('/create-listing')
    },
    {
      title: 'Find Suppliers',
      description: 'Source quality inputs for your farm',
      icon: <Package className="h-6 w-6" />,
      action: () => navigate('/farm-input-marketplace')
    },
    {
      title: 'Join Bulk Order',
      description: 'Save money through group purchases',
      icon: <Users className="h-6 w-6" />,
      action: () => navigate('/bulk-orders')
    },
    {
      title: 'Track Shipment',
      description: 'Monitor your orders and deliveries',
      icon: <Truck className="h-6 w-6" />,
      action: () => navigate('/logistics-optimization')
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Agricultural Marketplace</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Connect farmers, suppliers, and buyers in Kenya's largest agricultural trading platform. 
            Find everything you need from farm inputs to fresh produce markets.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => navigate('/auth')}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Start Trading
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Quick Actions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={action.action}>
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      {action.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-muted-foreground text-sm">{action.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Marketplace Sections */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Explore Our Marketplaces</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {marketplaces.map((marketplace, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {marketplace.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{marketplace.title}</CardTitle>
                        <p className="text-muted-foreground mt-1">{marketplace.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Features</h4>
                      <div className="space-y-2">
                        {marketplace.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="mr-2">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Stats</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {Object.entries(marketplace.stats).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key}:</span>
                            <span className="font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate(marketplace.route)}
                  >
                    Explore {marketplace.title}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Market Insights */}
        <section className="mb-16 bg-muted/30 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Market Insights</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay informed with real-time market data and trends
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">KES 2.5B+</div>
              <div className="text-muted-foreground">Total Trade Value</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">150K+</div>
              <div className="text-muted-foreground">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-muted-foreground">Successful Transactions</div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-8 pb-8">
              <TrendingUp className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Ready to Start Trading?</h2>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of farmers and suppliers already trading on SokoConnect
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="secondary" size="lg" onClick={() => navigate('/auth')}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Create Account
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => navigate('/market-insights')}
                >
                  View Market Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default Marketplace;