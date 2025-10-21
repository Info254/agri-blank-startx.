import React from 'react';
import { supabase } from '@/integrations/supabase/client';

// Minimal list to satisfy imports and show basic data
interface BulkOrder {
  id: string;
  product_type: string;
  quantity: number;
  unit: string;
  location: string;
  status: string;
  deadline: string;
}

type Props = {
  onSelect?: (order: BulkOrder) => void;
};

const BulkOrderList: React.FC<Props> = ({ onSelect }) => {
  const [orders, setOrders] = React.useState<BulkOrder[]>([]);

  React.useEffect(() => {
    const load = async () => {
      const { data } = await (supabase as any)
        .from('bulk_orders')
        .select('id, product_type, quantity, unit, location, status, deadline')
        .order('created_at', { ascending: false });
      if (data) setOrders(data as BulkOrder[]);
    };
    load();
  }, []);

  return (
    <section aria-labelledby="bulk-orders-heading">
      <h1 id="bulk-orders-heading">Bulk Orders</h1>
      <ul>
        {orders.map((o) => (
          <li key={o.id} onClick={() => onSelect?.(o)} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
            {o.product_type} - {o.quantity} {o.unit} - {o.location} - {o.status}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default BulkOrderList;
