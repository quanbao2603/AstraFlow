/**
 * profileSync.middleware.ts
 * Chịu trách nhiệm DUY NHẤT: đồng bộ thông tin user vào bảng Profile (Postgres).
 * Middleware này PHẢI đặt SAU verifyToken trong chuỗi middleware.
 * Dùng in-memory cache để tránh upsert liên tục trên mỗi request.
 */
import type { Response, NextFunction } from 'express';
import profileRepo from '../../modules/profile/profile.repo.js';

// Cache in-memory: tránh upsert DB trên mỗi request cho cùng một user
const syncedUsers = new Set<string>();

/**
 * Middleware đồng bộ profile Supabase vào Postgres.
 * Yêu cầu: req.user phải được gắn bởi verifyToken trước đó.
 */
export const syncProfile = async (req: any, res: Response, next: NextFunction) => {
  const user = req.user;

  // Nếu không có user (verifyToken không chạy trước), bỏ qua
  if (!user?.id) {
    return next();
  }

  // Chỉ upsert nếu user chưa được sync trong session này
  if (!syncedUsers.has(user.id)) {
    try {
      await profileRepo.upsert({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      syncedUsers.add(user.id);
    } catch (upsertError) {
      // Không block request, chỉ log lỗi
      // ForeignKey errors sẽ bắt được ở tầng service nếu thực sự thất bại
      console.error('[profileSync] Error syncing profile:', upsertError);
    }
  }

  next();
};
