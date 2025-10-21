import { supabase } from '@/integrations/supabase/client';

export interface ReverseAuctionBid {
  id?: string;
  auction_id: string;
  bidder_id: string;
  bid_price: number;
  quantity_offered: number;
  delivery_timeframe?: string;
  status?: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  created_at?: string;
  updated_at?: string;
}

export async function createReverseAuctionBid(bid: Omit<ReverseAuctionBid, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('reverse_auction_bids')
    .insert(bid)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getReverseAuctionBids(auctionId: string) {
  const { data, error } = await supabase
    .from('reverse_auction_bids')
    .select(`
      *,
      profiles:bidder_id(full_name)
    `)
    .eq('auction_id', auctionId)
    .order('bid_price', { ascending: true }) // Lowest bid first (reverse auction)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateReverseAuctionBid(bidId: string, updates: Partial<ReverseAuctionBid>) {
  const { data, error } = await supabase
    .from('reverse_auction_bids')
    .update(updates)
    .eq('id', bidId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function acceptReverseAuctionBid(bidId: string, auctionId: string) {
  // Accept the bid and update auction with winning bid
  const { error: bidError } = await supabase
    .from('reverse_auction_bids')
    .update({ status: 'accepted' })
    .eq('id', bidId);

  if (bidError) throw bidError;

  const { error: auctionError } = await supabase
    .from('reverse_bulk_auctions')
    .update({ 
      winning_bid_id: bidId,
      status: 'completed'
    })
    .eq('id', auctionId);

  if (auctionError) throw auctionError;

  return { success: true };
}

export async function rejectReverseAuctionBid(bidId: string) {
  return updateReverseAuctionBid(bidId, { status: 'rejected' });
}

export async function withdrawReverseAuctionBid(bidId: string) {
  return updateReverseAuctionBid(bidId, { status: 'withdrawn' });
}
