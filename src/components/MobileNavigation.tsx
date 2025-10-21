import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  MapPin, 
  Bluetooth,
  MessageSquare,
  User,
  Menu
} from 'lucide-react';

const mobileNavItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: ShoppingCart, label: 'Marketplace', href: '/marketplace' },
  { icon: TrendingUp, label: 'Prices', href: '/price-trends' },
  { icon: Bluetooth, label: 'Bluetooth', href: '/bluetooth-marketplace' },
  { icon: MessageSquare, label: 'Community', href: '/community-forums' },
  { icon: MapPin, label: 'Logistics', href: '/logistics' },
  { icon: Users, label: 'Traders', href: '/service-providers' },
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Menu, label: 'More', href: '/more' }
];

export function MobileNavigation() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden">
      <div className="grid grid-cols-5 gap-1 p-2">
        {mobileNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-1 rounded-md transition-colors min-h-[60px]",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}