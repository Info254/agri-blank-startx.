import { supabase } from '@/integrations/supabase/client';

export interface BulkOrderBid {
  id?: string;
  order_id: string;
  bidder_id: string;
  bid_price: number;
  quantity: number;
  delivery_terms?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at?: string;
  updated_at?: string;
}

export async function createBulkOrderBid(bid: Omit<BulkOrderBid, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('bulk_order_bids')
    .insert(bid)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBulkOrderBids(orderId: string) {
  const { data, error } = await supabase
    .from('bulk_order_bids')
    .select(`
      *,
      profiles:bidder_id(full_name)
    `)
    .eq('order_id', orderId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateBulkOrderBid(bidId: string, updates: Partial<BulkOrderBid>) {
  const { data, error } = await supabase
    .from('bulk_order_bids')
    .update(updates)
    .eq('id', bidId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function acceptBulkOrderBid(bidId: string) {
  return updateBulkOrderBid(bidId, { status: 'accepted' });
}

export async function rejectBulkOrderBid(bidId: string) {
  return updateBulkOrderBid(bidId, { status: 'rejected' });
}

export async function withdrawBulkOrderBid(bidId: string) {
  return updateBulkOrderBid(bidId, { status: 'withdrawn' });
}
