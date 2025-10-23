import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Ship, Users, Package, Tractor } from 'lucide-react';
import marketplaceBg from '@/assets/agricultural-marketplace-bg.png';

const GlobalMarketplace: React.FC = () => {
  return (
    <section 
      className="relative py-32 text-white overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${marketplaceBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 drop-shadow-2xl">GLOBAL AGRICULTURAL MARKETPLACE</h1>
        <p className="text-xl mb-8 drop-shadow-lg opacity-95">
          Export Marketplace | Contract Farming | Farm Input | Equipment Marketplace | Commodity Trading
        </p>
        <p className="text-lg mb-12 max-w-3xl mx-auto drop-shadow-md">
          Your Hub for Global Agri-Commerce
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
          <Link to="/export-marketplace">
            <Card className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Ship className="h-12 w-12 mx-auto mb-3" />
                <p className="font-semibold">Export Marketplace</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/contract-farming">
            <Card className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 mx-auto mb-3" />
                <p className="font-semibold">Contract Farming</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/farm-input-marketplace">
            <Card className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Package className="h-12 w-12 mx-auto mb-3" />
                <p className="font-semibold">Farm Input</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/equipment-marketplace">
            <Card className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Tractor className="h-12 w-12 mx-auto mb-3" />
                <p className="font-semibold">Equipment Marketplace</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/commodity-trading">
            <Card className="bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all cursor-pointer">
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 mx-auto mb-3" />
                <p className="font-semibold">Commodity Trading</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GlobalMarketplace;
