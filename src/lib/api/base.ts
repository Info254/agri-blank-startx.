import { supabase } from '@/integrations/supabase/client';

// Generic CRUD operations with relaxed typing to avoid schema drift
export class ApiBase<TTable extends string = string, TRow = any, TInsert = any, TUpdate = any> {
  protected tableName: TTable;

  constructor(tableName: TTable) {
    this.tableName = tableName;
  }

  async getAll(filters?: Partial<TRow>) {
    let query = (supabase as any).from(this.tableName as string).select('*');
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data as TRow[];
  }

  async getById(id: string) {
    const { data, error } = await (supabase as any)
      .from(this.tableName as string)
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) throw error;
    return data as TRow | null;
  }

  async create(data: TInsert) {
    const { data: result, error } = await (supabase as any)
      .from(this.tableName as string)
      .insert(data as any)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return result as TRow | null;
  }

  async update(id: string, data: TUpdate) {
    const { data: result, error } = await (supabase as any)
      .from(this.tableName as string)
      .update(data as any)
      .eq('id', id)
      .select()
      .maybeSingle();
    
    if (error) throw error;
    return result as TRow | null;
  }

  async delete(id: string) {
    const { error } = await (supabase as any)
      .from(this.tableName as string)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
}

// Utility functions
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorMessage?: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.error(errorMessage || 'API operation failed:', error);
    throw error;
  }
};
