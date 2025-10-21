import { ApiBase } from './base';
import { supabase } from '@/integrations/supabase/client';

export class ProfilesApi extends ApiBase<'profiles'> {
  constructor() {
    super('profiles');
  }

  async getCurrentProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateProfile(data: {
    full_name?: string;
    phone_number?: string;
    location?: string;
    user_type?: string;
    bio?: string;
    profile_image_url?: string;
  }) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: result, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  }

  async getProfileByUserId(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  }
}

export const profilesApi = new ProfilesApi();