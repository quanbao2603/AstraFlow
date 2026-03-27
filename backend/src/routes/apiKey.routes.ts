import { Router } from 'express';
import { ApiKeyController } from '../controllers/apiKey.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Áp dụng middleware yêu cầu đăng nhập cho tất cả các routes của apiKey
router.use(verifyToken);

router.get('/', ApiKeyController.getKeys);
router.post('/', ApiKeyController.addKey);
router.delete('/:id', ApiKeyController.deleteKey);

export default router;
