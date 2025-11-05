
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import farmerBg from '@/assets/farmer-portal-bg.png';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FarmDashboard from '@/components/farm/FarmDashboard';
import ProduceManagement from '@/components/farm/ProduceManagement';
import LandManagement from '@/components/farm/LandManagement';
import CropTracking from '@/components/farm/CropTracking';
import FinancialManagement from '@/components/farm/FinancialManagement';
import AnalyticsDashboard from '@/components/farm/AnalyticsDashboard';
import FarmerProductForm from '@/components/FarmerProductForm';
import { Produce } from '@/types/farmer';
import AnimalManagement from '@/components/farm/AnimalManagement';
import BuyRequestForm from '@/components/BuyRequestForm';
import BuyRequestList from '@/components/BuyRequestList';
import { FarmTasks } from '@/components/farm/FarmTasks';
import { Animals } from '@/components/farm/Animals';
import { Inventory } from '@/components/farm/Inventory';
import { Budgets } from '@/components/farm/Budgets';

const FarmerPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProduce, setUserProduce] = useState<Produce[]>([
    {
      id: '1',
      name: 'Maize',
      category: 'Grains',
      county: 'Nakuru',
      quantity: 500,
      unit: 'kg',
      qualityGrade: 'A',
      availableFrom: '2023-10-15',
      farmer: 'John Kariuki',
      farmerId: 'farmer-1'
    },
    {
      id: '2', 
      name: 'Tomatoes',
      category: 'Vegetables',
      county: 'Kiambu',
      quantity: 200,
      unit: 'kg',
      qualityGrade: 'B',
      availableFrom: '2023-10-20',
      farmer: 'John Kariuki',
      farmerId: 'farmer-1'
    }
  ]);

  const handleDeleteProduce = (id: string) => {
    setUserProduce(prev => prev.filter(produce => produce.id !== id));
  };

  const handleEditProduce = (produce: Produce) => {
    console.log('Editing produce:', produce);
  };

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Hero Section with Farmer Background */}
      <section 
        className="relative py-16 text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${farmerBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">Farmer Portal</h1>
          <p className="text-xl drop-shadow-md opacity-95">Your Hub for Growth & Resources - Manage your farm operations, crops, and animals</p>
        </div>
      </section>
      <div className="container mx-auto py-6">
        {/* Mobile-optimized horizontal scroll tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="flex w-max min-w-full space-x-2 px-1">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="parcels">Land Parcels</TabsTrigger>
              <TabsTrigger value="crops">Crops</TabsTrigger>
              <TabsTrigger value="animals">Animals</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="budgets">Budgets</TabsTrigger>
              <TabsTrigger value="finances">Finances</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="products">My Products</TabsTrigger>
              <TabsTrigger value="buy-requests">Buy Requests</TabsTrigger>
              <TabsTrigger value="add-buy-request">Post Buy Request</TabsTrigger>
              <TabsTrigger value="add-product">Add Product</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            <FarmDashboard />
          </TabsContent>

          <TabsContent value="tasks">
            <FarmTasks />
          </TabsContent>

          <TabsContent value="parcels">
            <LandManagement />
          </TabsContent>

          <TabsContent value="crops">
            <CropTracking />
          </TabsContent>

          <TabsContent value="animals">
            <Animals />
          </TabsContent>

          <TabsContent value="inventory">
            <Inventory />
          </TabsContent>

          <TabsContent value="budgets">
            <Budgets />
          </TabsContent>

          <TabsContent value="finances">
            <FinancialManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="products">
            <ProduceManagement 
              userProduce={userProduce}
              onDeleteProduce={handleDeleteProduce}
              onEditProduce={handleEditProduce}
            />
          </TabsContent>

          <TabsContent value="buy-requests">
            <BuyRequestList />
          </TabsContent>
          <TabsContent value="add-buy-request">
            <div className="max-w-2xl mx-auto">
              <BuyRequestForm userId={user.id} />
            </div>
          </TabsContent>
          <TabsContent value="add-product">
            <div className="max-w-2xl mx-auto">
              <FarmerProductForm />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FarmerPortal;
