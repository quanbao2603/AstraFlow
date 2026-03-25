import { Router } from 'express';
import { StoryController } from '../controllers/story.controller.js';

const router = Router();
const storyController = new StoryController();

/**
 * @route POST /api/story/generate-chapter
 * @description Kích hoạt luồng Agent Orchestrator sinh chương truyện lai (Hybrid)
 */
router.post('/generate-chapter', (req, res, next) => {
    storyController.createStory(req, res, next).catch(next);
});

/**
 * @route GET /api/story/graph-neighborhood/:nodeId
 * @description Kiểm tra sự lan truyền hiệu ứng của RAG
 */
router.get('/graph-neighborhood/:nodeId', (req, res, next) => {
    // storyController.checkGraphPropagation(req, res).catch(next);
});

export default router;
