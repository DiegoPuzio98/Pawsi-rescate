import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Leer variables desde Vite (.env)
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? 'https://jwvcgawjkltegcnyyryo.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

// Export supabase client. Guard localStorage for SSR environments.
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? (window.localStorage as any) : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
