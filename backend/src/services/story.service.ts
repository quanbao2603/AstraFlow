import type { IStoryRepository } from '../interfaces/IStoryRepository.js';
import type { IStoryService } from '../interfaces/IStoryService.js';

export class StoryService implements IStoryService {
  constructor(private readonly storyRepo: IStoryRepository) {}

  async getStoriesByAuthor(authorId: string): Promise<any[]> {
    return this.storyRepo.findByAuthor(authorId);
  }
}
