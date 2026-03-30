import type { IStoryRepository } from './interfaces/IStoryRepository.js';
import type { IStoryService } from './interfaces/IStoryService.js';

export class StoryService implements IStoryService {
  constructor(private readonly storyRepo: IStoryRepository) {}

  async getStoriesByAuthor(authorId: string): Promise<any[]> {
    return this.storyRepo.findByAuthor(authorId);
  }

  async createGeneratedStory(authorId: string, blueprint: any): Promise<any> {
    // Lấy theme/genre đầu tiên, hoặc map từ original_ideas
    const { original_ideas, expanded_universe } = blueprint;
    
    const theme = original_ideas?.themes?.[0] || '';
    const genre = original_ideas?.genres?.[0] || '';
    const setting = expanded_universe?.setting_details || original_ideas?.settings?.join(', ') || '';
    
    // Lưu story cơ bản. (Thực tế Prisma Schema có thể cần update để lưu JSON, nhưng hiện tại dựa theo Schema cũ)
    const newStory = await this.storyRepo.create({
      authorId,
      title: 'Truyện mới tạo từ Idea', // Có thể dùng AI sinh Title riêng
      summary: expanded_universe?.plot_structure?.act_1_setup?.substring(0, 200) || '',
      genre,
      theme,
      setting,
    });

    // TODO: Lưu expanded_universe.characters vào bảng Character (nếu có schema)
    // TODO: Lưu plot_structure vào bảng Outline/Chapter (nếu có schema)
    
    return {
      ...newStory,
      _generatedBlueprint: blueprint // Trả lại payload để Client render preview
    };
  }
}
