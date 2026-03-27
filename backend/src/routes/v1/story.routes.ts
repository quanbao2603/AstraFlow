// src/routes/v1/story.routes.ts
import { Router } from 'express';
import storyRepo from '../../repositories/story.repo.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';

const router = Router();

/**
 * [GET] /api/v1/stories
 * Lấy danh sách Stories của user đang đăng nhập
 */
router.get('/', verifyToken, async (req: any, res) => {
  try {
    const stories = await storyRepo.findByAuthor(req.user.sub);
    res.json({ success: true, data: stories });
  } catch (error: any) {
    console.error('[GET /api/v1/stories]', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

export default router;
