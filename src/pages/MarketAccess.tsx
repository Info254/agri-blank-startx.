import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Store, Users, TrendingUp, BarChart3 } from 'lucide-react';

const MarketAccess: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Market Access Solutions</h1>
          <p className="text-muted-foreground max-w-3xl">
            Connecting farmers directly with buyers and expanding market opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5" />
                Direct Market Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Connect directly with buyers and eliminate middlemen.</p>
              <Link to="/commodity-trading">
                <Button className="w-full">Browse Markets</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Buyer Networks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Join agricultural cooperatives and collective marketing groups.</p>
              <Link to="/community-forum">
                <Button className="w-full">Join Networks</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Price Discovery
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Access real-time market prices and trends.</p>
              <Link to="/kilimo-ams-data">
                <Button className="w-full">View Prices</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Get market insights and demand forecasts.</p>
              <Link to="/market-intelligence">
                <Button className="w-full">Access Intelligence</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MarketAccess;
