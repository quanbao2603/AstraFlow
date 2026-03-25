import type { Request, Response, NextFunction } from 'express';
import { StoryService } from '../services/story.service.js';
import { ApiResponse } from '../utils/response.js';

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
   * @description Tạo truyện mới kết hợp kích hoạt Pipeline AI sinh chương mở đầu.
   * @endpoint `POST /api/stories/interactive`
   * @param req { title: string, promptIdea: string, userId: string }
   */
  createStory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { title, promptIdea, userId } = req.body;
      const result = await this.storyService.createStoryInteractive(userId, title, promptIdea);
      ApiResponse.success(res, result, 'Story with AI chapter created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @method getUserStories
   * @description Tra cứu danh sách truyện đã sáng tác của người đọc.
   * @endpoint `GET /api/stories/user/:userId`
   * @param req.params { userId: string }
   */
  getUserStories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId } = req.params;
      const stories = await this.storyService.getStoriesByUser(userId as string);
      ApiResponse.success(res, stories, 'Stories retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
