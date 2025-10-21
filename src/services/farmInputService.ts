import { supabase } from '@/integrations/supabase/client';

// --- CATEGORIES ---
export const getCategories = async () => {
  return (supabase as any).from('farm_input_categories').select('*');
};
export const createCategory = async (data: any) => {
  return (supabase as any).from('farm_input_categories').insert([data]);
};

// --- SUPPLIERS ---
export const createSupplier = async (data: any) => {
  return (supabase as any).from('farm_input_suppliers').insert([data]);
};
export const updateSupplier = async (id: string, data: any) => {
  return (supabase as any).from('farm_input_suppliers').update(data).eq('id', id);
};
export const getSuppliers = async () => {
  return (supabase as any).from('farm_input_suppliers').select('*');
};

// --- PRODUCTS ---
export const createProduct = async (data: any) => {
  return (supabase as any).from('farm_input_products').insert([data]);
};
export const updateProduct = async (id: string, data: any) => {
  return (supabase as any).from('farm_input_products').update(data).eq('id', id);
};
export const getProducts = async (filters?: any) => {
  let query = (supabase as any).from('farm_input_products').select('*');
  if (filters?.product_category) query = query.eq('product_category', filters.product_category);
  if (filters?.search) query = query.ilike('product_name', `%${filters.search}%`);
  return query;
};

// --- ORDERS ---
export const createOrder = async (data: any) => {
  const { order_status, ...rest } = data;
  return (supabase as any).from('farm_input_orders').insert([
    {
      status: order_status || 'pending',
      ...rest,
    },
  ]);
};
export const getOrders = async (filters?: any) => {
  let query = (supabase as any).from('farm_input_orders').select('*');
  if (filters?.buyer_id) query = query.eq('buyer_id', filters.buyer_id);
  if (filters?.supplier_id) query = query.eq('supplier_id', filters.supplier_id);
  return query;
};
export const updateOrder = async (id: string, data: any) => {
  return (supabase as any).from('farm_input_orders').update(data).eq('id', id);
};

// --- ORDER ITEMS ---
export const createOrderItem = async (data: any) => {
  return (supabase as any).from('farm_input_order_items').insert([data]);
};
export const updateOrderItem = async (id: string, data: any) => {
  return (supabase as any).from('farm_input_order_items').update(data).eq('id', id);
};

// --- DELETE FUNCTIONS ---
export const deleteSupplier = async (id: string) => {
  return (supabase as any).from('farm_input_suppliers').delete().eq('id', id);
};
export const deleteProduct = async (id: string) => {
  return (supabase as any).from('farm_input_products').delete().eq('id', id);
};
export const deleteOrder = async (id: string) => {
  return (supabase as any).from('farm_input_orders').delete().eq('id', id);
};

// --- PRODUCT LIKES ---
export const likeProduct = async (productId: string) => {
  const { data: { user } } = await (supabase as any).auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  return (supabase as any).from('farm_input_product_likes').insert([
    { user_id: user.id, product_id: productId }
  ]);
};

export const unlikeProduct = async (productId: string) => {
  const { data: { user } } = await (supabase as any).auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  return (supabase as any).from('farm_input_product_likes')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId);
};

// --- PRODUCT RATINGS ---
export const rateProduct = async (productId: string, rating: number, comment?: string) => {
  const { data: { user } } = await (supabase as any).auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  return (supabase as any).from('farm_input_product_ratings').upsert([
    { user_id: user.id, product_id: productId, rating, comment }
  ]);
};

// --- SUPPLIER LIKES ---
export const likeSupplier = async (supplierId: string) => {
  const { data: { user } } = await (supabase as any).auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  return (supabase as any).from('farm_input_supplier_likes').insert([
    { user_id: user.id, supplier_id: supplierId }
  ]);
};

export const unlikeSupplier = async (supplierId: string) => {
  const { data: { user } } = await (supabase as any).auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  return (supabase as any).from('farm_input_supplier_likes')
    .delete()
    .eq('user_id', user.id)
    .eq('supplier_id', supplierId);
};

// --- SUPPLIER RATINGS ---
export const rateSupplier = async (supplierId: string, rating: number, comment?: string) => {
  const { data: { user } } = await (supabase as any).auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  return (supabase as any).from('farm_input_supplier_ratings').upsert([
    { user_id: user.id, supplier_id: supplierId, rating, comment }
  ]);
};

// --- PRODUCT BOOKMARKS ---
export const bookmarkProduct = async (productId: string) => {
  const { data: { user } } = await (supabase as any).auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  return (supabase as any).from('farm_input_product_bookmarks').insert([
    { user_id: user.id, product_id: productId }
  ]);
};

export const unbookmarkProduct = async (productId: string) => {
  const { data: { user } } = await (supabase as any).auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  return (supabase as any).from('farm_input_product_bookmarks')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId);
};

// --- ENTITY FLAGGING ---
export const flagEntity = async (entityType: 'supplier' | 'product', entityId: string, reason: string, description?: string) => {
  const { data: { user } } = await (supabase as any).auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  return (supabase as any).from('farm_input_entity_flags').insert([
    { reporter_id: user.id, entity_type: entityType, entity_id: entityId, reason, description }
  ]);
};

// --- BAN RECOMMENDATIONS ---
export const recommendBan = async (entityType: 'supplier' | 'user', entityId: string, reason: string, evidence?: string) => {
  const { data: { user } } = await (supabase as any).auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  return (supabase as any).from('farm_input_ban_recommendations').insert([
    { reporter_id: user.id, entity_type: entityType, entity_id: entityId, reason, evidence }
  ]);
};

