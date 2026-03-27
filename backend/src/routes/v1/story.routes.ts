// src/routes/v1/story.routes.ts
import { Router } from 'express';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import type { StoryController } from '../../controllers/story.controller.js';

export function createStoryRouter(storyController: StoryController): Router {
  const router = Router();

  /**
   * [GET] /api/v1/stories
   * Lấy danh sách Stories của user đang đăng nhập
   */
  router.get('/', verifyToken, storyController.getStories);

  return router;
}
