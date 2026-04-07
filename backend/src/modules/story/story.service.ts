import type { IStoryRepository } from './interfaces/IStoryRepository.js';
import type { IStoryService } from './interfaces/IStoryService.js';
import type { IChapterRepository } from './interfaces/IChapterRepository.js';

export class StoryService implements IStoryService {
  constructor(
    private readonly storyRepo: IStoryRepository,
    private readonly chapterRepo: IChapterRepository
  ) {}

  async getStoriesByAuthor(authorId: string): Promise<any[]> {
    return this.storyRepo.findByAuthor(authorId);
  }

  async getStoryById(id: string): Promise<any | null> {
    return this.storyRepo.findById(id);
  }

  async createGeneratedStory(authorId: string, blueprint: any): Promise<any> {
    const { inputTitle, inputMcName, original_ideas, expanded_universe } = blueprint;

    // ── Lấy title từ input gốc của user (ưu tiên) hoặc AI-generated
    const title =
      (inputTitle && inputTitle.trim())
        ? inputTitle.trim()
        : expanded_universe?.title || original_ideas?.themes?.[0] || 'Truyện chưa đặt tên';

    const genre   = original_ideas?.genres?.[0] || '';
    const theme   = original_ideas?.themes?.[0] || '';
    const setting = expanded_universe?.setting_details
      || original_ideas?.settings?.join(', ')
      || '';

    // ── Summary: lấy từ act_1_setup của AI hoặc plot_ideas đầu tiên
    const summary = expanded_universe?.plot_structure?.act_1_setup?.substring(0, 300)
      || original_ideas?.plot_ideas?.[0]
      || '';

    // ── Lưu story vào DB (bao gồm blueprintJson để persist)
    const newStory = await this.storyRepo.create({
      authorId,
      title,
      summary,
      genre,
      theme,
      setting,
      mcName: inputMcName || original_ideas?.characters?.[0] || undefined,
      blueprintJson: blueprint, // Persist toàn bộ blueprint để reload sau
      firstChapterContent: blueprint.firstChapterContent, // Thêm nội dung chương 1 nếu có
    });

    return {
      ...newStory,
      _generatedBlueprint: blueprint, // Trả lại payload để Client render preview ngay
    };
  }

  async deleteStory(id: string, authorId: string): Promise<boolean> {
    const story = await this.storyRepo.findById(id);
    if (!story) return false;
    if (story.authorId !== authorId) throw new Error('Bạn không có quyền xóa truyện này');
    
    return this.storyRepo.delete(id);
  }

  async updateStory(id: string, authorId: string, data: any): Promise<any> {
    const story = await this.storyRepo.findById(id);
    if (!story) throw new Error('Truyện không tồn tại');
    if (story.authorId !== authorId) throw new Error('Bạn không có quyền chỉnh sửa truyện này');
    
    return this.storyRepo.update(id, data);
  }

  async addChapter(storyId: string, chapterIndex: number, content: string): Promise<any> {
    return this.chapterRepo.create({
      storyId,
      chapterIndex,
      title: `Chương ${chapterIndex}`,
      content
    });
  }
}

