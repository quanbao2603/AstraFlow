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
   * [GET] /api/v1/stories/:id
   * Lấy chi tiết một Story (kèm blueprint nếu là của chính user)
   */
  router.get('/:id', verifyToken, syncProfile, storyController.getStoryById);

  /**
   * [POST] /api/v1/stories/generate
   * Gửi ý tưởng để AI sinh core Blueprint và lưu thành Story
   */
  router.post('/generate', verifyToken, syncProfile, storyController.generateStory);

  /**
   * [POST] /api/v1/stories/:id/chapters/generate
   * Sinh chương tiếp theo
   */
  router.post('/:id/chapters/generate', verifyToken, syncProfile, storyController.generateNextChapter);

  /**
   * [DELETE] /api/v1/stories/:id
   * Xóa Story
   */
  router.delete('/:id', verifyToken, syncProfile, storyController.deleteStory);

  return router;
}
