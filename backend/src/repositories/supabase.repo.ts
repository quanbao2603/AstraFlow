// src/repositories/supabase.repo.ts
import supabase from '../db/supabase.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET!;

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
