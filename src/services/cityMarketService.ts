import { supabase } from '@/integrations/supabase/client';

// Engagement
export async function likeCityMarket(market_id: string, user_id: string) {
  const { data, error } = await (supabase as any).from('city_market_likes').insert({ market_id, user_id });
  return { data, error };
}

export async function rateCityMarket(market_id: string, user_id: string, rating: number, comment?: string) {
  const { data, error } = await (supabase as any).from('city_market_ratings').insert({ market_id, user_id, rating, comment });
  return { data, error };
}

export async function commentCityMarket(market_id: string, user_id: string, comment: string) {
  const { data, error } = await (supabase as any).from('city_market_comments').insert({ market_id, user_id, comment });
  return { data, error };
}

export async function flagCityMarket(market_id: string, user_id: string, reason: string) {
  const { data, error } = await (supabase as any).from('city_market_flags').insert({ market_id, user_id, reason });
  return { data, error };
}

export async function recommendBanCityMarket(market_id: string, user_id: string, reason: string) {
  const { data, error } = await (supabase as any).from('city_market_ban_recommendations').insert({ market_id, user_id, reason });
  return { data, error };
}

// Seller Products
export async function addCityMarketProduct(product: any) {
  const { data, error } = await (supabase as any).from('city_market_products').insert(product);
  return { data, error };
}

export async function editCityMarketProduct(product_id: string, updates: any) {
  const { data, error } = await (supabase as any).from('city_market_products').update(updates).eq('id', product_id);
  return { data, error };
}

export async function deleteCityMarketProduct(product_id: string) {
  const { data, error } = await (supabase as any).from('city_market_products').delete().eq('id', product_id);
  return { data, error };
}

export async function setCityMarketProductCategory(product_id: string, category: 'imperfect' | 'surplus' | 'standard') {
  const { data, error } = await (supabase as any).from('city_market_products').update({ category }).eq('id', product_id);
  return { data, error };
}

export async function getCityMarketProductsByCategory(category: string) {
  const { data, error } = await (supabase as any).from('city_market_products').select('*').eq('category', category);
  return { data, error };
}

// Recipients
export async function addRecipient(recipient: any) {
  const { data, error } = await (supabase as any).from('recipients').insert(recipient);
  return { data, error };
}

export async function getRecipients(type?: string) {
  let query = (supabase as any).from('recipients').select('*');
  if (type) query = query.eq('type', type);
  const { data, error } = await query;
  return { data, error };
}

export async function deleteRecipient(recipient_id: string) {
  const { data, error } = await (supabase as any).from('recipients').delete().eq('id', recipient_id);
  return { data, error };
}

export async function updateCityMarketProductStatus(product_id: string, status: 'fresh' | 'near_expiry' | 'spoilt') {
  const { data, error } = await (supabase as any).from('city_market_products').update({ status }).eq('id', product_id);
  return { data, error };
}

export async function donateCityMarketProduct(product_id: string, home_id: string, agent_id: string) {
  const { data, error } = await (supabase as any).from('city_market_donations').insert({ product_id, home_id, agent_id });
  if (!error) {
    await (supabase as any).from('city_market_products').update({ status: 'donated' }).eq('id', product_id);
  }
  return { data, error };
}

export async function getCityMarketProducts(market_id: string) {
  const { data, error } = await (supabase as any).from('city_market_products').select('*').eq('market_id', market_id);
  return { data, error };
}

// Auctions
export async function createCityMarketAuction(auction: any) {
  const { data, error } = await (supabase as any).from('city_market_auctions').insert(auction);
  return { data, error };
}

export async function placeCityMarketBid(bid: any) {
  const { data, error } = await (supabase as any).from('city_market_bids').insert(bid);
  return { data, error };
}

export async function getCityMarketAuctions(market_id: string) {
  const { data, error } = await (supabase as any)
    .from('city_market_auctions')
    .select('*, product:city_market_products(*)')
    .in('product.market_id', [market_id]);
  return { data, error };
}

// Agents
export async function addAgent(agent: any) {
  const { data, error } = await (supabase as any).from('agents').insert(agent);
  return { data, error };
}

export async function verifyAgent(agent_id: string) {
  const { data, error } = await (supabase as any).from('agents').update({ verified: true }).eq('id', agent_id);
  return { data, error };
}

export async function getAgents(market_id?: string) {
  let query = (supabase as any).from('agents').select('*');
  if (market_id) query = query.eq('market_id', market_id);
  const { data, error } = await query;
  return { data, error };
}

// Moderation
export async function getFlaggedCityMarkets() {
  const { data, error } = await (supabase as any).from('city_market_flags').select('*');
  return { data, error };
}

export async function getBanRecommendations() {
  const { data, error } = await (supabase as any).from('city_market_ban_recommendations').select('*');
  return { data, error };
}

