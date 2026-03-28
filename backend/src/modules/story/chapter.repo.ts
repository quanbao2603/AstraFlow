import prisma from '../../db/prisma.js';
import type { IChapterRepository } from './interfaces/IChapterRepository.js';

export class ChapterRepository implements IChapterRepository {
  async create(data: {
    storyId: string;
    chapterIndex: number;
    title?: string;
    content: string;
    wordCount?: number;
  }) {
    return prisma.chapter.create({ data });
  }

  async findByStory(storyId: string) {
    return prisma.chapter.findMany({
      where: { storyId },
      orderBy: { chapterIndex: 'asc' },
    });
  }
}

