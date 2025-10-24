import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MobileNavigation } from '@/components/MobileNavigation';
import { 
  Truck, 
  Building2, 
  AlertTriangle, 
  BookOpen, 
  MessageCircle,
  TrendingUp,
  Globe,
  Handshake,
  Package,
  MapPin,
  Users,
  Heart,
  Recycle,
  Settings,
  HelpCircle,
  Shield,
  FileText,
  Phone
} from 'lucide-react';

const moreFeatures = [
  {
    title: 'Supply Chain Solutions',
    items: [
      { icon: Truck, label: 'Logistics Solutions Map', href: '/logistics-solutions-map', badge: 'A1-A9' },
      { icon: Package, label: 'Bulk Orders', href: '/bulk-orders' },
      { icon: AlertTriangle, label: 'Supply Chain Problems', href: '/supply-chain-problems' },
      { icon: TrendingUp, label: 'Market Demand Hotspot', href: '/market-demand-hotspot' }
    ]
  },
  {
    title: 'Trading & Commerce',
    items: [
      { icon: Handshake, label: 'Barter Exchange', href: '/barter-exchange' },
      { icon: Globe, label: 'Export Opportunities', href: '/export-market-opportunities', badge: 'A1-A9' },
      { icon: Building2, label: 'Contract Farming', href: '/contract-farming' },
      { icon: MapPin, label: 'Road Markets', href: '/road-markets' }
    ]
  },
  {
    title: 'Community & Learning',
    items: [
      { icon: BookOpen, label: 'Training Events', href: '/training-events' },
      { icon: MessageCircle, label: 'Quality Control Discussions', href: '/quality-control-discussions' },
      { icon: Users, label: 'Farmer Success Stories', href: '/farmer-success-stories' },
      { icon: MessageCircle, label: 'Community Forum', href: '/community-forum' }
    ]
  },
  {
    title: 'Specialized Markets',
    items: [
      { icon: Building2, label: 'City Markets', href: '/city-markets' },
      { icon: Package, label: 'Equipment Marketplace', href: '/equipment-marketplace' },
      { icon: Heart, label: 'Food Rescue Dashboard', href: '/food-rescue-dashboard' },
      { icon: Recycle, label: 'Imperfect Surplus', href: '/imperfect-surplus-dashboard' }
    ]
  },
  {
    title: 'Farm Inputs',
    items: [
      { icon: Package, label: 'Farm Input Marketplace', href: '/farm-input-marketplace' },
      { icon: Users, label: 'Group Input Orders', href: '/inputs/group-orders' },
      { icon: TrendingUp, label: 'Input Pricing Verification', href: '/inputs/pricing-verification' }
    ]
  },
  {
    title: 'Data & Analytics',
    items: [
      { icon: TrendingUp, label: 'Sentiment Analysis', href: '/sentiment-analysis' },
      { icon: FileText, label: 'Kilimo AMS Data', href: '/kilimo-ams-data' },
      { icon: Globe, label: 'API Documentation', href: '/api-docs' }
    ]
  },
  {
    title: 'Account & Support',
    items: [
      { icon: Settings, label: 'Settings', href: '/profile' },
      { icon: Shield, label: 'Privacy Policy', href: '/privacy-policy' },
      { icon: FileText, label: 'Terms of Service', href: '/terms-of-service' },
      { icon: HelpCircle, label: 'FAQ', href: '/faq' },
      { icon: Phone, label: 'Contact Us', href: '/contact' }
    ]
  }
];

export default function MorePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 space-y-6 pb-24">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">More Features</h1>
          <p className="text-muted-foreground">
            Explore all SokoConnect features and services
          </p>
        </div>

        <div className="space-y-6">
          {moreFeatures.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription>
                  Access specialized tools and services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <Icon className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <span className="font-medium">{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <MobileNavigation />
    </div>
  );
}