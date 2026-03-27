// src/db/supabase.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[db/supabase.ts] Supabase URL or Anon Key missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export default supabase;
