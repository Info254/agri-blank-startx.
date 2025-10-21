import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { 
  Warehouse, 
  Globe, 
  Handshake,
  MapPin,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  Truck,
  Heart,
  Building2
} from 'lucide-react';

const marketplaceCategories = [
  {
    title: 'Core Marketplaces',
    items: [
      {
        icon: Package,
        title: 'Farm Input Marketplace',
        description: 'Seeds, fertilizers, pesticides, and farming equipment',
        href: '/farm-input-marketplace',
        color: 'bg-blue-500'
      },
      {
        icon: Warehouse,
        title: 'Equipment Marketplace',
        description: 'Rent, lease, or buy agricultural machinery and tools',
        href: '/equipment-marketplace',
        color: 'bg-green-500'
      },
      {
        icon: TrendingUp,
        title: 'Commodity Trading',
        description: 'Buy and sell agricultural produce and commodities',
        href: '/commodity-trading',
        color: 'bg-orange-500'
      }
    ]
  },
  {
    title: 'Specialized Markets',
    items: [
      {
        icon: Globe,
        title: 'Export Market Opportunities',
        description: 'International buyers and export opportunities',
        href: '/export-market-opportunities',
        color: 'bg-purple-500',
        badge: 'A1-A9'
      },
      {
        icon: Handshake,
        title: 'Contract Farming',
        description: 'Guaranteed purchase contracts with agribusiness',
        href: '/contract-farming',
        color: 'bg-indigo-500'
      },
      {
        icon: MapPin,
        title: 'City Markets',
        description: 'Urban wholesale and retail market directory',
        href: '/city-markets',
        color: 'bg-red-500'
      }
    ]
  },
  {
    title: 'Alternative Trading',
    items: [
      {
        icon: DollarSign,
        title: 'Barter Exchange',
        description: 'Trade goods and services without money',
        href: '/barter-exchange',
        color: 'bg-teal-500'
      },
      {
        icon: Users,
        title: 'Group Input Orders',
        description: 'Bulk purchasing for better prices',
        href: '/inputs/group-orders',
        color: 'bg-cyan-500'
      },
      {
        icon: MapPin,
        title: 'Road Markets (A1-A9)',
        description: 'Highway sellers and roadside farmers',
        href: '/road-markets',
        color: 'bg-yellow-500',
        badge: 'A1-A9'
      }
    ]
  },
  {
    title: 'Logistics & Support',
    items: [
      {
        icon: Truck,
        title: 'Transport & Logistics',
        description: 'Find transporters and logistics solutions',
        href: '/logistics',
        color: 'bg-gray-500'
      },
      {
        icon: Heart,
        title: 'Food Rescue',
        description: 'Donate surplus produce to those in need',
        href: '/food-rescue-dashboard',
        color: 'bg-pink-500'
      },
      {
        icon: Building2,
        title: 'Bulk Orders',
        description: 'Large volume procurement and sales',
        href: '/bulk-orders',
        color: 'bg-slate-500'
      }
    ]
  }
];

const MarketplacePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-foreground text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Agricultural Marketplace</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Your one-stop platform for buying, selling, and trading agricultural products, 
            equipment, and services across Kenya and beyond.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <div className="space-y-12">
          {marketplaceCategories.map((category) => (
            <div key={category.title}>
              <h2 className="text-2xl font-bold mb-6">{category.title}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card key={item.href} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${item.color} bg-opacity-10`}>
                            <Icon className="h-6 w-6" style={{ color: item.color.replace('bg-', '').replace('-500', '') }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{item.title}</CardTitle>
                              {item.badge && (
                                <span className="px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <CardDescription className="mt-2">
                              {item.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link to={item.href}>
                          <Button className="w-full">
                            Explore {item.title}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <section className="mt-16 bg-muted/30 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Trading Today</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join thousands of farmers, traders, and agribusiness professionals 
            already using our platform to grow their businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">Create Account</Button>
            </Link>
            <Link to="/community-forum">
              <Button variant="outline" size="lg">Join Community</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MarketplacePage;