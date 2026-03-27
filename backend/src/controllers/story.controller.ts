import type { Request, Response } from 'express';
import type { IStoryService } from '../interfaces/IStoryService.js';

export class StoryController {
  constructor(private readonly storyService: IStoryService) {}

  getStories = async (req: any, res: Response) => {
    try {
      const stories = await this.storyService.getStoriesByAuthor(req.user.sub);
      res.json({ success: true, data: stories });
    } catch (error: any) {
      console.error('[StoryController.getStories]', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
}
