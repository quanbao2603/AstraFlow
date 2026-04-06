import prisma from '../../db/prisma.js';
import type { IStoryRepository } from './interfaces/IStoryRepository.js';

export class StoryRepository implements IStoryRepository {
  // --- STORY ---
  async findByAuthor(authorId: string) {
    return prisma.story.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: { chapters: { orderBy: { chapterIndex: 'asc' } } },
    });
  }

  async findById(id: string) {
    return prisma.story.findUnique({
      where: { id },
      include: { author: true, chapters: { orderBy: { chapterIndex: 'asc' } } },
    });
  }

  async create(data: {
    authorId: string;
    title: string;
    summary?: string;
    genre?: string;
    theme?: string;
    setting?: string;
    mcName?: string;
    mcGender?: string;
    writingStyle?: string;
    crueltyLevel?: string;
    blueprintJson?: any;
    firstChapterContent?: string;
  }) {
    const { firstChapterContent, ...storyData } = data;
    const createInput: any = { ...storyData };
    
    // Nếu có nội dung chương 1 được sinh ra, tự động tạo records Chapter 1 lồng vào Story
    if (firstChapterContent) {
      createInput.chapters = {
        create: [{
          title: "Chương 1",
          content: firstChapterContent,
          chapterIndex: 1
        }]
      };
    }
    
    return prisma.story.create({ data: createInput });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.story.delete({ where: { id } });
      return true;
    } catch (e) {
      return false; // Not found or error
    }
  }
}

// Keep export default for backward compatibility
const storyRepo = new StoryRepository();
export default storyRepo;
