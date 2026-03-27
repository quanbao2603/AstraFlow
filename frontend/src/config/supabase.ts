// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)');
}

/**
 * Supabase client dùng ở Frontend.
 * Mỗi tab/window sẽ chia sẻ cùng một session thông qua localStorage.
 */
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
