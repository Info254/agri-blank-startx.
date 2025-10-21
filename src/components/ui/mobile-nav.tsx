import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  ShoppingCart, 
  MessageSquare, 
  TrendingUp, 
  Users,
  Menu,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { title: 'Home', href: '/', icon: Home },
  { title: 'Markets', href: '/marketplace', icon: ShoppingCart },
  { title: 'Prices', href: '/price-trends', icon: TrendingUp },
  { title: 'Community', href: '/community-forums', icon: MessageSquare },
];

export const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border lg:hidden">
      <nav className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-0 flex-1',
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export const MobileHeader = ({ 
  title, 
  showBack = false, 
  onBack,
  actions 
}: {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
}) => {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b lg:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <Menu className="h-4 w-4" />
            </Button>
          )}
          <h1 className="font-semibold text-lg truncate">{title}</h1>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};