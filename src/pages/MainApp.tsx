import React from 'react';
import RoleBasedLayout from '@/components/RoleBasedLayout';
import AdminDashboard from '@/components/AdminDashboard';
import ValidatedForm from '@/components/ValidatedForm';
import { addCityMarketProduct } from '@/services/cityMarketService';

// Example: get user role from context/auth
const getUserRole = () => {
  // Replace with your actual logic
  return 'admin'; // 'admin' | 'agent' | 'user'
};

const productFields = [
  { name: 'market_id', label: 'Market ID', required: true },
  { name: 'product_type', label: 'Product Type', required: true },
  { name: 'quantity', label: 'Quantity', type: 'number', required: true },
  { name: 'price', label: 'Price', type: 'number', required: true },
];

const MainApp: React.FC = () => {
  const role = getUserRole();
  const user = { id: 'user-uuid', market_id: 'market-uuid' } as const;
  return (
    <RoleBasedLayout
      role={role as 'admin' | 'agent' | 'user'}
      user={user as any}
      admin={<AdminDashboard isAdmin={role === 'admin'} />}
      agent={
        <ValidatedForm
          fields={productFields}
          onSubmit={async (values) => {
            const product = {
              market_id: values.market_id,
              product_type: values.product_type,
              quantity: Number(values.quantity),
              price: Number(values.price),
              seller_user_id: user.id,
              category: 'default',
              auction_status: 'open',
              status: 'active',
            } as any;
            return await addCityMarketProduct(product);
          }}
          submitLabel="Add Product"
        />
      }
      userView={<div />}
    >
      {/* Common app content */}
    </RoleBasedLayout>
  );
};

export default MainApp;
