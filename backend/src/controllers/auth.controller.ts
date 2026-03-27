// src/controllers/auth.controller.ts
import type { Request, Response } from 'express';
import supabase from '../db/supabase.js';
import profileRepo from '../repositories/profile.repo.js';

export const authController = {
  /**
   * [GET] /api/v1/auth/google/url
   * Lấy URL để đăng nhập Google thông qua Supabase
   */
  async getGoogleUrl(req: Request, res: Response) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/auth/callback`,
        },
      });

      if (error) throw error;
      res.json({ success: true, data: { url: data.url } });
    } catch (error: any) {
      console.error('[authController.getGoogleUrl] Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * [GET] /api/v1/auth/callback
   * Xử lý sau khi người dùng đăng nhập Google thành công
   */
  async handleCallback(req: Request, res: Response) {
    const code = req.query.code as string;
    const next = (req.query.next as string) || '/';

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=no_code`);
    }

    try {
      // 1. Đổi code lấy session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;

      const { session, user } = data;
      if (!session || !user) throw new Error('No session or user returned');

      // 2. Upsert profile vào Postgres DB của chúng ta
      await profileRepo.upsert({
        id: user.id,
        email: user.email!,
        displayName: user.user_metadata.full_name || user.user_metadata.name,
        photoURL: user.user_metadata.avatar_url || user.user_metadata.picture,
      });

      // 3. Redirect về Frontend kèm token (hoặc lưu vào cookie tùy thiết kế)
      // Ở đây dùng query param cho đơn giản với SPA, thực tế nên dùng secure cookie
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?access_token=${session.access_token}&refresh_token=${session.refresh_token}`);
    } catch (error: any) {
      console.error('[authController.handleCallback] Error:', error.message);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=${encodeURIComponent(error.message)}`);
    }
  },

  /**
   * [GET] /api/v1/auth/me
   * Trả về thông tin user hiện tại từ token JWT
   */
  async getMe(req: any, res: Response) {
    // payload từ Supabase JWT: sub = userId, email, user_metadata
    const payload = req.user;
    const userData = {
      id: payload.sub,
      email: payload.email,
      displayName: payload.user_metadata?.full_name || payload.user_metadata?.name || payload.email,
      photoURL: payload.user_metadata?.avatar_url || payload.user_metadata?.picture || null,
      role: payload.role || 'authenticated',
    };
    res.json({ success: true, data: userData });
  }
};

export default authController;
