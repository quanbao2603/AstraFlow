// src/routes/v1/auth.routes.ts
import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import type { AuthController } from '../../controllers/auth.controller.js';

export function createAuthRouter(authController: AuthController): Router {
  const router = Router();

  /**
   * OAuth Routes
   */
  router.get('/google/url', authController.getGoogleUrl);
  router.get('/callback', authController.handleCallback);

  /**
   * Current User Route
   */
  router.get('/me', verifyToken, authController.getMe);

  return router;
}
