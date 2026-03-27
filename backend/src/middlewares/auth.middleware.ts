// src/middlewares/auth.middleware.ts
import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import supabaseRepo from '../repositories/supabase.repo.js';

dotenv.config();

/**
 * Middleware xác thực JWT từ Supabase.
 * Gắn payload vào req.user nếu thành công.
 */
export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Token is missing' });
  }

  const payload = supabaseRepo.verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }

  req.user = payload;
  next();
};
