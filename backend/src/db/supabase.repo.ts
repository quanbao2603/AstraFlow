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
  async verifyToken(token: string): Promise<{ id: string; sub: string; email: string; role: string } | null> {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data.user) {
        console.error('Supabase getUser error:', error?.message);
        return null;
      }
      return {
        id: data.user.id,
        sub: data.user.id,
        email: data.user.email || '',
        role: data.user.role ?? 'user',
      };
    } catch (error: any) {
      console.error('Supabase auth error:', error.message);
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
