
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BusinessAdvertisementForm from '@/components/business/BusinessAdvertisementForm';
import BusinessAdvertisementsView from '@/components/business/BusinessAdvertisementsView';
import SystemHealthStatus from '@/components/system/SystemHealthStatus';
import { DollarSign, TrendingUp, Users, BarChart3 } from 'lucide-react';

const BusinessMarketing: React.FC = () => {
  const [activeTab, setActiveTab] = useState('advertise');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Business Marketing & System Status
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Advertise your agricultural business to thousands of farmers, check data collection status, and monitor system health
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="advertise">Advertise Business</TabsTrigger>
            <TabsTrigger value="browse">Browse Ads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="system">System Status</TabsTrigger>
          </TabsList>

          <TabsContent value="advertise" className="mt-6">
            <BusinessAdvertisementForm onSuccess={() => setActiveTab('browse')} />
          </TabsContent>

          <TabsContent value="browse" className="mt-6">
            <BusinessAdvertisementsView />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">$20</div>
                      <div className="text-sm text-muted-foreground">Per Advertisement</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">1000+</div>
                      <div className="text-sm text-muted-foreground">Daily Visitors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <div>
                      <div className="text-2xl font-bold">30</div>
                      <div className="text-sm text-muted-foreground">Days Duration</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold">47</div>
                      <div className="text-sm text-muted-foreground">Counties Reached</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Advertising Benefits</CardTitle>
                <CardDescription>
                  Why advertise your agricultural business with us
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center">
                    <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-medium mb-2">Targeted Audience</h3>
                    <p className="text-sm text-muted-foreground">
                      Reach farmers, cooperatives, and agribusiness professionals actively seeking agricultural solutions
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="font-medium mb-2">Proven Results</h3>
                    <p className="text-sm text-muted-foreground">
                      Track clicks, views, and engagement with our comprehensive analytics dashboard
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <DollarSign className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-medium mb-2">Affordable Pricing</h3>
                    <p className="text-sm text-muted-foreground">
                      Just $20 for 30 days of visibility across our entire agricultural network
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="mt-6">
            <SystemHealthStatus />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BusinessMarketing;
