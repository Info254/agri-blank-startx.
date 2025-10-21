
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { 
  Store, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  MapPin,
  Truck,
  AlertTriangle,
  Info
} from 'lucide-react';

const MainNavigation: React.FC = () => {
  const location = useLocation();

  const marketplaceItems = [
    {
      href: '/farm-input-marketplace',
      title: 'Farm Input Marketplace',
      description: 'Quality agricultural inputs from verified suppliers',
      icon: <Store className="h-4 w-4" />
    },
    {
      href: '/marketplace',
      title: 'Agricultural Marketplace',
      description: 'Buy and sell produce, livestock, and agricultural products',
      icon: <Store className="h-4 w-4" />
    },
    {
      href: '/bulk-orders',
      title: 'Bulk Orders',
      description: 'Organize group purchases for better prices',
      icon: <Store className="h-4 w-4" />
    },
    {
      href: '/city-markets',
      title: 'City Markets',
      description: 'Connect with local city and county markets',
      icon: <MapPin className="h-4 w-4" />
    }
  ];

  const logisticsItems = [
    {
      href: '/logistics',
      title: 'Logistics Optimization',
      description: 'Smart routing and delivery solutions',
      icon: <Truck className="h-4 w-4" />
    },
    {
      href: '/logistics-solutions-map',
      title: 'Solutions Map',
      description: 'Interactive map of logistics solutions',
      icon: <Truck className="h-4 w-4" />
    },
    {
      href: '/transporter-signup',
      title: 'Join as Transporter',
      description: 'Register your transport services',
      icon: <Truck className="h-4 w-4" />
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
            "bg-transparent",
            marketplaceItems.some(item => isActive(item.href)) && "text-primary"
          )}>
            <Store className="h-4 w-4 mr-2" />
            Marketplace
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
              {marketplaceItems.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isActive(item.href) && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        {item.icon}
                        {item.title}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {item.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className={cn(
            "bg-transparent",
            logisticsItems.some(item => isActive(item.href)) && "text-primary"
          )}>
            <Truck className="h-4 w-4 mr-2" />
            Logistics
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
              {logisticsItems.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        isActive(item.href) && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2 text-sm font-medium leading-none">
                        {item.icon}
                        {item.title}
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {item.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/service-providers"
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive('/service-providers') && "text-primary"
              )}
            >
              <Users className="h-4 w-4 mr-2" />
              Service Providers
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/sentiment-analysis"
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive('/sentiment-analysis') && "text-primary"
              )}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Market Insights
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/community-forums"
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive('/community-forums') && "text-primary"
              )}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Community
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/supply-chain-problems"
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive('/supply-chain-problems') && "text-primary"
              )}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Supply Chain
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              to="/about"
              className={cn(
                "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                isActive('/about') && "text-primary"
              )}
            >
              <Info className="h-4 w-4 mr-2" />
              About
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNavigation;
