import type { Request, Response } from 'express';
import { StoryService } from '../services/story.service.js';

/**
 * @class StoryController
 * @description Lớp điều hướng Request/Response HTTP cho thực thể Stories.
 * Giúp giải phóng tệp tin `index.ts` khỏi các xử lý logic lồng ghép hỗn loạn.
 */
export class StoryController {
  private storyService: StoryService;

  constructor() {
    this.storyService = new StoryService();
  }

  /**
   * @method createStory
   * @endpoint `POST /api/stories/interactive`
   */
  createStory = async (req: Request, res: Response) => {
    try {
      const { title, promptIdea, userId } = req.body;
      const result = await this.storyService.createStoryInteractive(userId, title, promptIdea);
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create AI-generated story' });
    }
  }

  /**
   * @method getUserStories
   * @endpoint `GET /api/stories/user/:userId`
   */
  getUserStories = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      if (!userId) {
         res.status(400).json({ error: 'User ID is required' });
         return;
      }
      const stories = await this.storyService.getStoriesByUser(userId as string);
      res.json(stories);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve stories' });
    }
  }
}
