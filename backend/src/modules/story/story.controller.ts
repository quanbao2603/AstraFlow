import type { Request, Response } from 'express';
import type { IStoryService } from './interfaces/IStoryService.js';
import type { GenerateStoryUseCase } from './useCases/generateStory.useCase.js';
import type { GenerateNextChapterUseCase } from './useCases/generateNextChapter.useCase.js';

export class StoryController {
  constructor(
    private readonly storyService: IStoryService,
    private readonly generateStoryUseCase: GenerateStoryUseCase,
    private readonly generateNextChapterUseCase: GenerateNextChapterUseCase
  ) {}

  /**
   * [GET] /api/v1/stories
   * Lấy danh sách Stories của user đang đăng nhập
   */
  getStories = async (req: any, res: Response) => {
    try {
      // Fix Bug 3: dùng req.user.id (nhất quán với middleware)
      const stories = await this.storyService.getStoriesByAuthor(req.user.id);
      res.json({ success: true, data: stories });
    } catch (error: any) {
      console.error('[StoryController.getStories]', error);
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };

  /**
   * [GET] /api/v1/stories/:id
   * Lấy chi tiết một Story theo ID
   */
  getStoryById = async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const story = await this.storyService.getStoryById(id);
      if (!story) {
        return res.status(404).json({ success: false, error: 'Truyện không tồn tại' });
      }
      // Chỉ trả về story nếu thuộc về user đang đăng nhập hoặc đã published
      if (story.authorId !== req.user.id && story.status !== 'published') {
        return res.status(403).json({ success: false, error: 'Bạn không có quyền xem truyện này' });
      }
      return res.json({ success: true, data: story });
    } catch (error: any) {
      console.error('[StoryController.getStoryById]', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };

  /**
   * [POST] /api/v1/stories/generate
   * Gửi ý tưởng để AI sinh core Blueprint và lưu thành Story
   */
  generateStory = async (req: any, res: Response) => {
    try {
      const payload = req.body;
      const userId = req.user.id;

      if (!payload || Object.keys(payload).length === 0) {
        res.status(400).json({ success: false, error: 'Thiếu thông tin ý tưởng đầu vào' });
        return;
      }

      // 1. Gọi UseCase sinh Blueprint
      const blueprint = await this.generateStoryUseCase.execute(userId, payload);

      // 2. Lưu xuống DB (bao gồm blueprintJson)
      const savedStory = await this.storyService.createGeneratedStory(userId, blueprint);

      // 3. Trả về chuẩn
      res.json({ success: true, data: savedStory });
    } catch (error: any) {
      console.error('[StoryController.generateStory]', error);
      res.status(500).json({ success: false, error: error.message || 'Lỗi hệ thống khi sinh truyện' });
    }
  };

  /**
   * [POST] /api/v1/stories/:id/chapters/generate
   * Sinh chương tiếp theo
   */
  generateNextChapter = async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const story = await this.storyService.getStoryById(id);
      if (!story) {
         return res.status(404).json({ success: false, error: 'Truyện không tồn tại' });
      }

      if (story.authorId !== userId) {
         return res.status(403).json({ success: false, error: 'Bạn không có quyền thao tác trên truyện này' });
      }

      // Calculate context
      const nextChapterIndex = (story.chapters?.length || 0) + 1;
      let previousContext = 'Đây là chương đầu tiên';
      
      if (story.chapters && story.chapters.length > 0) {
        const lastChapter = story.chapters[story.chapters.length - 1];
        // For simplicity, just use the last chapter's context, trimmed if too long
        previousContext = lastChapter.content.substring(Math.max(0, lastChapter.content.length - 1500));
      }

      // Call UseCase
      const chapterContent = await this.generateNextChapterUseCase.execute(
        userId,
        story.blueprintJson,
        nextChapterIndex,
        previousContext
      );

      // Save to DB
      const newChapter = await this.storyService.addChapter(id, nextChapterIndex, chapterContent);

      return res.json({ success: true, data: newChapter });
    } catch (error: any) {
      console.error('[StoryController.generateNextChapter]', error);
      res.status(500).json({ success: false, error: error.message || 'Lỗi hệ thống khi sinh chương truyện' });
    }
  };

  /**
   * [DELETE] /api/v1/stories/:id
   * Xóa một Story
   */
  deleteStory = async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.storyService.deleteStory(id, req.user.id);
      
      if (!success) {
        return res.status(404).json({ success: false, error: 'Truyện không tồn tại hoặc đã bị xóa' });
      }
      
      return res.json({ success: true, message: 'Đã xóa truyện thành công' });
    } catch (error: any) {
      console.error('[StoryController.deleteStory]', error);
      if (error.message.includes('quyền truy cập') || error.message.includes('quyền xóa')) {
         return res.status(403).json({ success: false, error: error.message });
      }
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };
}
