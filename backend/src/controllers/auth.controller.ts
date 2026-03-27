// src/controllers/auth.controller.ts
import type { Request, Response } from 'express';
import type { IAuthService } from '../interfaces/IAuthService.js';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  /**
   * [GET] /api/v1/auth/google/url
   * Lấy URL để đăng nhập Google thông qua Supabase
   */
  getGoogleUrl = async (req: Request, res: Response) => {
    try {
      const redirectUrl = `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/v1/auth/callback`;
      const url = await this.authService.getGoogleUrl(redirectUrl);
      res.json({ success: true, data: { url } });
    } catch (error: any) {
      console.error('[authController.getGoogleUrl] Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };

  /**
   * [GET] /api/v1/auth/callback
   * Xử lý sau khi người dùng đăng nhập Google thành công
   */
  handleCallback = async (req: Request, res: Response) => {
    const code = req.query.code as string;
    const next = (req.query.next as string) || '/';

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=no_code`);
    }

    try {
      const { accessToken, refreshToken } = await this.authService.handleGoogleCallback(code);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`);
    } catch (error: any) {
      console.error('[authController.handleCallback] Error:', error.message);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth?error=${encodeURIComponent(error.message)}`);
    }
  };

  /**
   * [GET] /api/v1/auth/me
   * Trả về thông tin user hiện tại từ token JWT
   */
  getMe = async (req: any, res: Response) => {
    try {
      const userData = this.authService.getMe(req.user);
      res.json({ success: true, data: userData });
    } catch (error: any) {
      console.error('[authController.getMe] Error:', error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };
}
