/**
 * apiKey.routes.ts
 * Chịu trách nhiệm DUY NHẤT: khai báo routing cho API Key endpoints.
 * Nhận controller qua DI, áp dụng middleware xác thực.
 */
import { Router } from 'express';
import { verifyToken } from '../../core/middlewares/auth.middleware.js';
import { syncProfile } from '../../core/middlewares/profileSync.middleware.js';
import type { ApiKeyController } from './apiKey.controller.js';

export function createApiKeyRouter(apiKeyController: ApiKeyController): Router {
  const router = Router();

  // Áp dụng middleware cho tất cả routes: xác thực JWT rồi đồng bộ profile
  router.use(verifyToken, syncProfile);

  router.get('/', apiKeyController.getKeys);
  router.post('/', apiKeyController.addKey);
  router.delete('/:id', apiKeyController.deleteKey);

  return router;
}

