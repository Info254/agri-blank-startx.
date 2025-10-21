import React, { useState } from 'react';
import { BluetoothMarketplace } from '@/components/bluetooth/BluetoothMarketplace';
import { BluetoothGuide } from '@/components/bluetooth/BluetoothGuide';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BluetoothMarketplacePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Bluetooth Marketplace</h1>
          <p className="text-muted-foreground">
            Connect with nearby traders even without internet
          </p>
        </div>
        
        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="guide">How to Use</TabsTrigger>
          </TabsList>
          
          <TabsContent value="marketplace" className="space-y-4">
            <BluetoothMarketplace />
          </TabsContent>
          
          <TabsContent value="guide" className="space-y-4">
            <BluetoothGuide />
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="pb-20 md:pb-0">
        {/* Content padding for mobile navigation */}
      </div>
      <MobileNavigation />
    </div>
  );
}