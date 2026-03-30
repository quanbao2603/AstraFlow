/**
 * story.routes.ts
 * Chịu trách nhiệm DUY NHẤT: khai báo routing cho Story endpoints.
 */
import { Router } from 'express';
import { verifyToken } from '../../core/middlewares/auth.middleware.js';
import { syncProfile } from '../../core/middlewares/profileSync.middleware.js';
import type { StoryController } from './story.controller.js';

export function createStoryRouter(storyController: StoryController): Router {
  const router = Router();

  /**
   * [GET] /api/v1/stories
   * Lấy danh sách Stories của user đang đăng nhập
   */
  router.get('/', verifyToken, syncProfile, storyController.getStories);

  /**
   * [POST] /api/v1/stories/generate
   * Gửi ý tưởng để AI sinh core Blueprint và lưu thành Story
   */
  router.post('/generate', verifyToken, syncProfile, storyController.generateStory);

  return router;
}

