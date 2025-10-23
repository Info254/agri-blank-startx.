import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Package, MapPin, Clock } from 'lucide-react';

const LogisticsIssues: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="py-12 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Logistics Issues & Solutions</h1>
          <p className="text-muted-foreground max-w-3xl">
            Addressing transportation and logistics challenges in Kenya's agricultural supply chain
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Transportation Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Connect with reliable transporters and logistics providers across Kenya.</p>
              <Link to="/logistics">
                <Button className="w-full">Find Transporters</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Delivery Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Post your delivery requirements and get competitive quotes.</p>
              <Link to="/delivery-requests">
                <Button className="w-full">Request Delivery</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Warehouse Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Find storage facilities and warehousing services near you.</p>
              <Link to="/warehouses">
                <Button className="w-full">Find Warehouses</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Real-Time Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Track your shipments and monitor delivery status in real-time.</p>
              <Link to="/supply-chain-dashboard">
                <Button className="w-full">Track Shipments</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LogisticsIssues;
