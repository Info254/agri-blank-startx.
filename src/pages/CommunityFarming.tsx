import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Tractor, Wheat, MapPin } from 'lucide-react';
import { MobileHeader, MobileNav } from '@/components/ui/mobile-nav';
import { useNavigate } from 'react-router-dom';
import serviceProvidersBg from '@/assets/service-providers-bg.jpg';

const CommunityFarming: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <MobileHeader title="Community Farming" />
      
      {/* Hero Section with Background */}
      <section 
        className="relative h-[300px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${serviceProvidersBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/70 to-green-700/80" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg flex items-center justify-center gap-3">
            <Users className="h-10 w-10" />
            Community Farming
          </h1>
          <p className="text-xl text-white font-medium drop-shadow-md max-w-2xl mx-auto">
            Join farming cooperatives and collaborate with fellow farmers
          </p>
        </div>
      </section>
      
      <main className="py-6 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Tractor className="h-4 w-4" />
                Equipment Sharing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Share tractors, irrigation systems, and other farming equipment with community members
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wheat className="h-4 w-4" />
                Joint Production
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Pool resources and land for collective farming operations
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Local Cooperatives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Connect with farming cooperatives in your county and region
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Community Farming Features</h2>
          <p className="text-muted-foreground mb-6">
            Coming soon: Join or create farming cooperatives, share resources, and grow together
          </p>
          <Button onClick={() => navigate('/cooperatives')}>
            Explore Cooperatives
          </Button>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default CommunityFarming;