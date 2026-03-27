// src/middlewares/auth.middleware.ts
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import supabaseRepo from '../repositories/supabase.repo.js';
import profileRepo from '../repositories/profile.repo.js';

dotenv.config();

// Cache to prevent upserting on every request
const syncedUsers = new Set<string>();

/**
 * Middleware xác thực JWT từ Supabase.
 * Gắn payload vào req.user nếu thành công.
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

  const payload = await supabaseRepo.verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid token' });
  }

  // Ensure user exists in Prisma Profile table
  if (!syncedUsers.has(payload.id)) {
    try {
      await profileRepo.upsert({
        id: payload.id,
        email: payload.email,
        role: payload.role,
      });
      syncedUsers.add(payload.id);
    } catch (upsertError) {
      console.error('Error syncing profile in middleware:', upsertError);
      // We don't block the request if upsert fails, it might just be a race condition
      // but it could cause ForeignKey errors later if it really failed
    }
  }

  req.user = payload;
  next();
};
