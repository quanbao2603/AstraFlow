import { Router } from 'express';
import userRoutes from './user.routes.js';
import templateRoutes from './template.routes.js';
import storyCrudRoutes from './story_crud.routes.js';
import storyAiRoutes from './story.routes.js';

const router = Router();

router.use('/users', userRoutes);
router.use('/story-templates', templateRoutes);
router.use('/stories', storyCrudRoutes);
router.use('/stories', storyAiRoutes); // Bundled under /api/stories

export default router;
