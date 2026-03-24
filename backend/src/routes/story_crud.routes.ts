import { Router } from 'express';
import { createStory, getStoryById, getUserStories } from '../controllers/story_crud.controller.js';

const router = Router();

router.post('/', createStory);
router.get('/:id', getStoryById);
router.get('/user/:userId', getUserStories);

export default router;
