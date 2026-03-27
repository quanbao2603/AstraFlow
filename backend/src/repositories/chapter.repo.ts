// src/repositories/chapter.repo.ts
import prisma from '../db/prisma.js';

export const chapterRepo = {
  // --- CHAPTER ---
  async create(data: {
    storyId: string;
    chapterIndex: number;
    title?: string;
    content: string;
    wordCount?: number;
  }) {
    return prisma.chapter.create({ data });
  },

  async findByStory(storyId: string) {
    return prisma.chapter.findMany({
      where: { storyId },
      orderBy: { chapterIndex: 'asc' },
    });
  },
};

export default chapterRepo;
