/**
 * auth.routes.ts
 * Chịu trách nhiệm DUY NHẤT: khai báo routing cho Auth endpoints.
 */
import { Router } from 'express';
import { verifyToken } from '../../core/middlewares/auth.middleware.js';
import { syncProfile } from '../../core/middlewares/profileSync.middleware.js';
import type { AuthController } from './auth.controller.js';

export function createAuthRouter(authController: AuthController): Router {
  const router = Router();

  // OAuth Routes — không cần auth
  router.get('/google/url', authController.getGoogleUrl);
  router.get('/callback', authController.handleCallback);

  // Current User Route — cần auth + sync profile
  router.get('/me', verifyToken, syncProfile, authController.getMe);

  return router;
}

