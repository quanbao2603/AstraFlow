/**
 * supabase.health.ts
 * Chịu trách nhiệm DUY NHẤT: kiểm tra tình trạng kết nối Supabase (health check).
 */
import supabase from '../../db/supabase.js';

/**
 * Ping Supabase để kiểm tra kết nối.
 * Trả về true nếu kết nối thành công, false nếu có lỗi.
 */
export async function pingSupabase(): Promise<boolean> {
  try {
    const { error } = await supabase.auth.getSession();
    return !error;
  } catch {
    return false;
  }
}
