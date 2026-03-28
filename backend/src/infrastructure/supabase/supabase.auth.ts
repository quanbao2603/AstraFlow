/**
 * supabase.auth.ts
 * Chịu trách nhiệm DUY NHẤT: xác thực JWT token từ Supabase và trả về user payload.
 * Health check: xem infrastructure/supabase/supabase.health.ts
 */
import supabase from '../../db/supabase.js';

export interface SupabaseUserPayload {
  id: string;
  sub: string;
  email: string;
  role: string;
}

/**
 * Xác thực JWT Token từ Supabase.
 * Trả về payload user nếu token hợp lệ, null nếu không hợp lệ.
 */
export async function verifySupabaseToken(token: string): Promise<SupabaseUserPayload | null> {
  try {
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      console.error('[supabase.auth] getUser error:', error?.message);
      return null;
    }
    return {
      id: data.user.id,
      sub: data.user.id,
      email: data.user.email || '',
      role: data.user.role ?? 'user',
    };
  } catch (error: any) {
    console.error('[supabase.auth] Unexpected error:', error.message);
    return null;
  }
}
