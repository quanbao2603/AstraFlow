/**
 * auth.middleware.ts
 * Chịu trách nhiệm DUY NHẤT: xác thực JWT token từ Supabase và gắn payload vào req.user.
 * Để đồng bộ profile vào Postgres, dùng profileSync.middleware.ts theo sau.
 */
import type { Request, Response, NextFunction } from 'express';
import { verifySupabaseToken } from '../../infrastructure/supabase/supabase.auth.js';

/**
 * Middleware xác thực JWT từ Supabase.
 * Gắn payload vào req.user nếu token hợp lệ.
 * Trả về 401 nếu không có token hoặc token không hợp lệ.
 */
export const verifyToken = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Token is missing' });
  }

  const payload = await verifySupabaseToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }

  req.user = payload;
  next();
};

