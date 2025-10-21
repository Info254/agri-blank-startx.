import { ApiBase } from './base';
import { supabase } from '@/integrations/supabase/client';

export class MarketplaceApi extends ApiBase<'marketplace_listings'> {
  constructor() {
    super('marketplace_listings');
  }

  async getActiveListings() {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select(`
        *,
        seller:profiles!seller_id(full_name, location),
        product:products(name, category, unit_of_measure)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async getMyListings(userId: string) {
    const { data, error } = await supabase
      .from('marketplace_listings')
      .select(`
        *,
        product:products(name, category, unit_of_measure)
      `)
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  async searchListings(query: string, category?: string, location?: string) {
    let queryBuilder = supabase
      .from('marketplace_listings')
      .select(`
        *,
        seller:profiles!seller_id(full_name, location),
        product:products(name, category, unit_of_measure)
      `)
      .eq('status', 'active');

    if (query) {
      queryBuilder = queryBuilder.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
    }

    if (category) {
      queryBuilder = queryBuilder.eq('products.category', category);
    }

    if (location) {
      queryBuilder = queryBuilder.ilike('location', `%${location}%`);
    }

    const { data, error } = await queryBuilder.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
}

export const marketplaceApi = new MarketplaceApi();