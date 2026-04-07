import type { Request, Response } from 'express';
import https from 'https';
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

      if (story.status === 'completed') {
         return res.status(400).json({ success: false, error: 'Truyện này đã kết thúc, không thể sinh thêm chương mới' });
      }

      // Calculate context
      const nextChapterIndex = (story.chapters?.length || 0) + 1;
      
      // Determine if this is the final chapter
      const expectedChapters = (story.blueprintJson as any)?.expected_chapters || 10;
      if (nextChapterIndex > expectedChapters) {
         return res.status(400).json({ success: false, error: 'Trượt chỉ tiêu số chương. Truyện này đã đạt giới hạn chương tối đa.' });
      }
      const isFinalChapter = nextChapterIndex === expectedChapters;

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
        previousContext,
        isFinalChapter
      );

      // Save to DB
      const newChapter = await this.storyService.addChapter(id, nextChapterIndex, chapterContent);

      // Nếu đây là chương cuối, cập nhật trạng thái truyện thành completed
      if (isFinalChapter) {
        await this.storyService.updateStory(id, userId, { status: 'completed' });
      }

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
  /**
   * [PUT] /api/v1/stories/:id
   * Cập nhật thông tin truyện
   */
  updateStory = async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedStory = await this.storyService.updateStory(id, req.user.id, data);
      res.json({ success: true, data: updatedStory });
    } catch (error: any) {
      console.error('[StoryController.updateStory]', error);
      if (error.message.includes('quyền chỉnh sửa')) {
        return res.status(403).json({ success: false, error: error.message });
      }
      res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };

  /**
   * [GET] /api/v1/stories/:id/export
   * Xuất truyện ra file TXT
   */
  exportStory = async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const story = await this.storyService.getStoryById(id);
      if (!story) {
        return res.status(404).json({ success: false, error: 'Truyện không tồn tại' });
      }
      if (story.authorId !== req.user.id && story.status !== 'published') {
        return res.status(403).json({ success: false, error: 'Bạn không có quyền tải truyện này' });
      }

      let content = `TÊN TRUYỆN: ${story.title.toUpperCase()}\n`;
      content += `TÓM TẮT: ${story.summary || ''}\n`;
      content += `THỂ LOẠI: ${story.genre || ''}\n`;
      content += `==============================================\n\n`;

      if (story.chapters && story.chapters.length > 0) {
        const sortedChapters = [...story.chapters].sort((a, b) => a.chapterIndex - b.chapterIndex);
        for (const chapter of sortedChapters) {
          content += `CHƯƠNG ${chapter.chapterIndex}${chapter.title ? `: ${chapter.title}` : ''}\n\n`;
          content += `${chapter.content}\n\n`;
          content += `----------------------------------------------\n\n`;
        }
      } else {
        content += `Truyện chưa có chương nào.\n`;
      }

      // Format filename, e.g. replacing spaces with hyphens, removing special chars
      let safeTitle = story.title.replace(/[\/\\?%*:|"<>]/g, '').replace(/\s+/g, '-');
      const fileName = `${safeTitle}.txt`;
      const encodedFileName = encodeURIComponent(fileName);

      res.setHeader('Content-disposition', `attachment; filename*=UTF-8''${encodedFileName}`);
      res.setHeader('Content-type', 'text/plain; charset=utf-8');
      return res.send(content);
    } catch (error: any) {
      console.error('[StoryController.exportStory]', error);
      return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
  };

  /**
   * [GET] /api/v1/stories/tts/proxy
   * Proxy Google TTS để vượt rào cản từ trình duyệt
   */
  proxyGoogleTts = (req: Request, res: Response) => {
    const text = req.query.text as string;
    if (!text) return res.status(400).send('No text provided');

    const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=vi&client=tw-ob`;

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    }, (externalRes) => {
      res.setHeader('Content-Type', 'audio/mpeg');
      // Pass through Google's headers if needed, or just pipe
      externalRes.pipe(res);
    }).on('error', (err) => {
      console.error('[StoryController.proxyGoogleTts]', err);
      res.status(500).send('Error fetching TTS');
    });
  };
}
