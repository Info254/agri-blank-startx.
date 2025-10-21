import { supabase } from '@/integrations/supabase/client';

export const likePost = async (postId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('community_post_likes')
    .insert({ post_id: postId, user_id: user.id });

  if (error) throw error;
};

export const unlikePost = async (postId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('community_post_likes')
    .delete()
    .eq('post_id', postId)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const reportPost = async (postId: string, reason: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('community_post_reports')
    .insert({ post_id: postId, reporter_id: user.id, reason });

  if (error) throw error;
};

export const getPostLikesCount = async (postId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('community_post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (error) throw error;
  return count || 0;
};

export const checkIfUserLikedPost = async (postId: string): Promise<boolean> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase
    .from('community_post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) throw error;
  return !!data;
};
