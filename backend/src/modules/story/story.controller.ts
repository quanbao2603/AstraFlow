import type { Request, Response } from 'express';
import type { IStoryService } from './interfaces/IStoryService.js';
import type { GenerateStoryUseCase } from './useCases/generateStory.useCase.js';

export class StoryController {
  constructor(
    private readonly storyService: IStoryService,
    private readonly generateStoryUseCase: GenerateStoryUseCase
  ) {}

  getStories = async (req: any, res: Response) => {
    try {
      const stories = await this.storyService.getStoriesByAuthor(req.user.sub);
      res.json({ success: true, data: stories });
    } catch (error: any) {
      console.error('[StoryController.getStories]', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };

  generateStory = async (req: any, res: Response) => {
    try {
      const payload = req.body;
      const userId = req.user.sub;

      if (!payload || Object.keys(payload).length === 0) {
        res.status(400).json({ success: false, error: 'Thiếu thông tin ý tưởng đầu vào' });
        return;
      }

      // 1. Gọi UseCase sinh Blueprint
      const blueprint = await this.generateStoryUseCase.execute(userId, payload);

      // 2. Lưu xuống DB
      const savedStory = await this.storyService.createGeneratedStory(userId, blueprint);

      // 3. Trả về chuẩn KAIROS
      res.json({ success: true, data: savedStory });
    } catch (error: any) {
      console.error('[StoryController.generateStory]', error);
      res.status(500).json({ success: false, error: error.message || 'Lỗi hệ thống khi sinh truyện' });
    }
  };
}
