import { supabase } from '@/integrations/supabase/client';

export interface BuyRequest {
  id?: string;
  buyer_id: string;
  product_name: string;
  quantity: number;
  unit: string;
  max_price: number;
  location: string;
  deadline: string;
  description?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export const buyRequestService = {
  // Create a new buy request
  async createBuyRequest(request: Omit<BuyRequest, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('buy_requests')
      .insert({
        ...request,
        status: request.status || 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all buy requests with optional filters
  async getBuyRequests(filters: {
    status?: string;
    location?: string;
    product_name?: string;
    buyer_id?: string;
  } = {}) {
    let query = supabase.from('buy_requests').select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    if (filters.product_name) {
      query = query.ilike('product_name', `%${filters.product_name}%`);
    }
    if (filters.buyer_id) {
      query = query.eq('buyer_id', filters.buyer_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get a single buy request by ID
  async getBuyRequestById(id: string) {
    const { data, error } = await supabase
      .from('buy_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Update a buy request
  async updateBuyRequest(id: string, updates: Partial<BuyRequest>) {
    const { data, error } = await supabase
      .from('buy_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a buy request
  async deleteBuyRequest(id: string) {
    const { error } = await supabase
      .from('buy_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Get buy requests near a location
  async getBuyRequestsNearLocation(location: string, radius: number = 50) {
    // For now, we'll do a simple text search
    // In a real app, you'd use PostGIS for proper geospatial queries
    const { data, error } = await supabase
      .from('buy_requests')
      .select('*')
      .ilike('location', `%${location}%`)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Mark a buy request as fulfilled
  async markAsFulfilled(id: string) {
    return this.updateBuyRequest(id, { status: 'fulfilled' });
  },

  // Cancel a buy request
  async cancelBuyRequest(id: string) {
    return this.updateBuyRequest(id, { status: 'cancelled' });
  }
};