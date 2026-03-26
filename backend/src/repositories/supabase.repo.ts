// src/repositories/supabase.repo.ts
// Repository cho Supabase Authentication
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET!;

if (!supabaseUrl || !supabaseAnonKey || !supabaseJwtSecret) {
  console.warn('[supabase.repo.ts] Supabase env vars missing. Auth will not function.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseRepo = {
  /**
   * Xác thực JWT Token từ Supabase, trả về payload user nếu hợp lệ
   */
  verifyToken(token: string): { sub: string; email: string; role: string } | null {
    try {
      const decoded = jwt.verify(token, supabaseJwtSecret) as any;
      return {
        sub: decoded.sub,
        email: decoded.email,
        role: decoded.role ?? 'user',
      };
    } catch {
      return null;
    }
  },

  /**
   * Health check: Kiểm tra kết nối đến Supabase
   */
  async ping(): Promise<boolean> {
    try {
      const { error } = await supabase.auth.getSession();
      return !error;
    } catch {
      return false;
    }
  },
};

export default supabaseRepo;
