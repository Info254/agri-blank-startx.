import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Ship, Users, Package, Tractor } from 'lucide-react';
import exploreMarketplace from '@/assets/explore_marketplace.png';

const GlobalMarketplace: React.FC = () => {
  return (
    <section 
      className="relative py-32 text-foreground overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800"
      style={{
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.90)), url(${exploreMarketplace})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 text-primary drop-shadow-sm">EXPLORE MARKETPLACE</h1>
        <p className="text-xl mb-8 text-gray-700 dark:text-gray-300">
          Export Marketplace | Contract Farming | Farm Input | Equipment Marketplace | Commodity Trading
        </p>
        <p className="text-lg mb-12 max-w-3xl mx-auto text-gray-600 dark:text-gray-400">
          Your Hub for Global Agri-Commerce
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          <Link to="/export-marketplace">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all cursor-pointer border-2 border-primary/20">
              <CardContent className="p-6 text-center">
                <Ship className="h-12 w-12 mx-auto mb-3 text-primary" />
                <p className="font-semibold text-foreground">Export Marketplace</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/contract-farming">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all cursor-pointer border-2 border-primary/20">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-3 text-primary" />
                <p className="font-semibold text-foreground">Contract Farming</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/farm-input-marketplace">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all cursor-pointer border-2 border-primary/20">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 mx-auto mb-3 text-primary" />
                <p className="font-semibold text-foreground">Farm Input</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/equipment-marketplace">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all cursor-pointer border-2 border-primary/20">
              <CardContent className="p-6 text-center">
                <Tractor className="h-12 w-12 mx-auto mb-3 text-primary" />
                <p className="font-semibold text-foreground">Equipment Marketplace</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/commodity-trading">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-white dark:hover:bg-gray-700 hover:shadow-lg transition-all cursor-pointer border-2 border-primary/20">
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 mx-auto mb-3 text-primary" />
                <p className="font-semibold text-foreground">Commodity Trading</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GlobalMarketplace;
