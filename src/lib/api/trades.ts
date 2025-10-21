import { ApiBase } from './base';
import { supabase } from '@/integrations/supabase/client';

export class TradesApi extends ApiBase<'my_trades'> {
  constructor() {
    super('my_trades');
  }

  async getMyTrades(userId: string) {
    const { data, error } = await supabase
      .from('my_trades')
      .select(`
        *,
        buyer:profiles!buyer_id(full_name, location),
        seller:profiles!seller_id(full_name, location),
        product:products(name, category, unit_of_measure),
        listing:marketplace_listings(title)
      `)
      .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async createTrade(tradeData: {
    buyer_id: string;
    seller_id: string;
    product_id: string;
    listing_id?: string;
    quantity: number;
    unit_price: number;
    total_amount: number;
    trade_type?: string;
    payment_method?: string;
    delivery_location?: string;
    delivery_date?: string;
  }) {
    const { data, error } = await supabase
      .from('my_trades')
      .insert(tradeData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTradeStatus(tradeId: string, status: string) {
    const { data, error } = await supabase
      .from('my_trades')
      .update({ status })
      .eq('id', tradeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const tradesApi = new TradesApi();