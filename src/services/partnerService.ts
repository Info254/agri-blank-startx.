import { supabase } from '@/integrations/supabase/client';

export async function createPartner(partner: any) {
  return supabase.from('partners').insert([partner]).select();
}

export async function getMyPartner() {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase.from('partners').select('*').eq('user_id', user?.id).single();
}

export async function updatePartner(id: string, updates: any) {
  return supabase.from('partners').update(updates).eq('id', id).select();
}

export async function createPartnerEvent(event: any) {
  return supabase.from('partner_events').insert([event]).select();
}

export async function getPartnerEvents(partnerId?: string) {
  const query = supabase.from('partner_events').select('*');
  return partnerId ? query.eq('partner_id', partnerId) : query;
}

export async function updatePartnerEvent(id: string, updates: any) {
  return supabase.from('partner_events').update(updates).eq('id', id).select();
}
