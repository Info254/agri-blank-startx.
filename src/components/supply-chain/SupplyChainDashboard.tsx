import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Tractor, 
  Truck, 
  Warehouse, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package
} from 'lucide-react';

interface SupplyChainStage {
  id: string;
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'issue';
  progress: number;
  issues?: string[];
  data?: any;
}

interface FarmRecord {
  id: string;
  crop: string;
  plantingDate: string;
  expectedHarvest: string;
  area: number;
  yieldEstimate: number;
  currentStage: string;
}

const SupplyChainDashboard: React.FC = () => {
  const [selectedFarm, setSelectedFarm] = useState<string>('farm-1');

  const farmRecords: FarmRecord[] = [
    {
      id: 'farm-1',
      crop: 'Maize',
      plantingDate: '2024-03-15',
      expectedHarvest: '2024-07-15',
      area: 5.2,
      yieldEstimate: 2.8,
      currentStage: 'flowering'
    },
    {
      id: 'farm-2',
      crop: 'Beans',
      plantingDate: '2024-04-01',
      expectedHarvest: '2024-07-01',
      area: 2.1,
      yieldEstimate: 1.2,
      currentStage: 'pod-formation'
    }
  ];

  const supplyChainStages: SupplyChainStage[] = [
    {
      id: 'farming',
      name: 'Farm Production',
      status: 'in-progress',
      progress: 65,
      data: {
        planted: '5.2 hectares',
        expectedYield: '14.6 tons',
        currentStage: 'Flowering'
      }
    },
    {
      id: 'harvest',
      name: 'Harvest & Collection',
      status: 'pending',
      progress: 0,
      data: {
        estimatedDate: '2024-07-15',
        laborRequired: '12 workers'
      }
    },
    {
      id: 'storage',
      name: 'Storage & Processing',
      status: 'pending',
      progress: 0,
      issues: ['No storage facility confirmed'],
      data: {
        requiredCapacity: '15 tons',
        processingNeeded: 'Drying, cleaning'
      }
    },
    {
      id: 'transport',
      name: 'Transportation',
      status: 'pending',
      progress: 0,
      issues: ['Transport not arranged', 'Route A1 highway congestion expected'],
      data: {
        distance: '120 km',
        estimatedCost: 'KES 25,000'
      }
    },
    {
      id: 'market',
      name: 'Market Sales',
      status: 'pending',
      progress: 0,
      data: {
        targetMarket: 'Nairobi Central Market',
        expectedPrice: 'KES 45/kg'
      }
    }
  ];

  const profitAnalysis = {
    totalCosts: 185000,
    expectedRevenue: 657000,
    expectedProfit: 472000,
    profitMargin: 71.8,
    costBreakdown: {
      inputs: 85000,
      labor: 45000,
      transport: 25000,
      storage: 15000,
      processing: 15000
    }
  };

  const getStatusIcon = (status: SupplyChainStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Package className="h-5 w-5 text-blue-600" />;
      case 'issue':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: SupplyChainStage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'issue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Farm Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tractor className="h-6 w-6" />
            Farm Records & Supply Chain Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {farmRecords.map((farm) => (
              <Card 
                key={farm.id}
                className={`cursor-pointer transition-colors ${
                  selectedFarm === farm.id ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedFarm(farm.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{farm.crop}</h3>
                    <Badge variant="outline">{farm.area} ha</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Current: {farm.currentStage}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Expected: {farm.yieldEstimate}t/ha
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supply Chain Stages */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplyChainStages.map((stage, index) => (
              <div key={stage.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(stage.status)}
                    <h3 className="font-semibold">{stage.name}</h3>
                    <Badge className={getStatusColor(stage.status)}>
                      {stage.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <span className="text-sm font-medium">{stage.progress}%</span>
                </div>
                
                <Progress value={stage.progress} className="mb-3" />
                
                {stage.issues && stage.issues.length > 0 && (
                  <Alert className="mb-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Issues:</strong>
                      <ul className="mt-1 space-y-1">
                        {stage.issues.map((issue, idx) => (
                          <li key={idx} className="text-sm">• {issue}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {stage.data && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {Object.entries(stage.data).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                        </span>
                        <p className="font-medium">{String(value)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Profit Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Costs:</span>
                <span className="font-semibold text-red-600">
                  KES {profitAnalysis.totalCosts.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Expected Revenue:</span>
                <span className="font-semibold text-green-600">
                  KES {profitAnalysis.expectedRevenue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span>Expected Profit:</span>
                <span className="font-bold text-green-600">
                  KES {profitAnalysis.expectedProfit.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Profit Margin:</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-600">
                    {profitAnalysis.profitMargin}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(profitAnalysis.costBreakdown).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="capitalize">{category}:</span>
                  <span className="font-medium">
                    KES {amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Problem Identification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            Identified Problems & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Storage Issue:</strong> No confirmed storage facility for 15 tons of maize.
                <br />
                <strong>Recommendation:</strong> Contact nearby storage providers or consider on-farm storage solutions.
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Transport Challenge:</strong> A1 highway congestion expected during harvest season.
                <br />
                <strong>Recommendation:</strong> Consider alternative routes or schedule transport during off-peak hours.
              </AlertDescription>
            </Alert>
            
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong>Market Opportunity:</strong> Current maize prices in Nairobi are 15% above average.
                <br />
                <strong>Action:</strong> Ensure quality standards to capture premium pricing.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplyChainDashboard;