import React from 'react';
import SupplyChainDashboard from '@/components/supply-chain/SupplyChainDashboard';
import { MobileNavigation } from '@/components/MobileNavigation';

export default function SupplyChainDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Supply Chain Dashboard</h1>
          <p className="text-muted-foreground">
            Track your farm production through every stage of the supply chain
          </p>
        </div>
        <SupplyChainDashboard />
      </div>
      <div className="pb-20 md:pb-0">
        {/* Content padding for mobile navigation */}
      </div>
      <MobileNavigation />
    </div>
  );
}