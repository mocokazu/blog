// 一時的にSupabaseをモック実装に戻してエラーを回避
// import { createClient } from '@supabase/supabase-js'
// import type { Database } from '@/types/database'

// モッククライアント
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: null }),
    signUp: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: null }),
        order: () => ({
          limit: async () => ({ data: [], error: null }),
        }),
      }),
      order: () => ({
        limit: async () => ({ data: [], error: null }),
      }),
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: null }),
      }),
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
        }),
      }),
    }),
    delete: () => ({
      eq: async () => ({ error: null }),
    }),
  }),
};

export const supabaseAdmin = supabase;
