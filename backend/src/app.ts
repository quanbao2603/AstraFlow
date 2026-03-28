/**
 * app.ts
 * Chịu trách nhiệm DUY NHẤT: tạo và cấu hình Express application.
 * - Đăng ký global middleware (cors, body parser)
 * - Mount routes
 * - Không biết gì về server lifecycle (port, startup, shutdown)
 */
import express, { type Express } from 'express';
import cors from 'cors';
import type { Router } from 'express';

export interface AppRoutes {
  stories: Router;
  auth: Router;
  apiKeys: Router;
}

export interface AppOptions {
  routes: AppRoutes;
  healthCheck: () => Promise<{ postgres: string; neo4j: string; supabase: string }>;
}

/**
 * Tạo Express application với middleware và routes đã được cấu hình.
 * Nhận routes và healthCheck từ ngoài vào (DI) để dễ test và mở rộng.
 */
export function createApp({ routes, healthCheck }: AppOptions): Express {
  const app = express();

  // ── Global Middlewares ─────────────────────────────────────────────────────
  app.use(cors());
  app.use(express.json());

  // ── Health Check Route ─────────────────────────────────────────────────────
  app.get('/', async (_req, res) => {
    const databases = await healthCheck();
    res.json({
      success: true,
      message: 'AstraFlow API v1 - Kiến Trúc Tam Quốc',
      databases,
    });
  });

  // ── API Routes V1 ──────────────────────────────────────────────────────────
  app.use('/api/v1/stories', routes.stories);
  app.use('/api/v1/auth', routes.auth);
  app.use('/api/v1/keys', routes.apiKeys);

  return app;
}

