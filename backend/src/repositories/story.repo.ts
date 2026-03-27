// src/repositories/story.repo.ts
import prisma from '../db/prisma.js';

export const storyRepo = {
  // --- STORY ---
  async findByAuthor(authorId: string) {
    return prisma.story.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: { chapters: { orderBy: { chapterIndex: 'asc' } } },
    });
  },

  async findById(id: string) {
    return prisma.story.findUnique({
      where: { id },
      include: { author: true, chapters: { orderBy: { chapterIndex: 'asc' } } },
    });
  },

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
  }) {
    // Handle optional fields with null/undefined correctly for Prisma 7+ strict types if needed
    return prisma.story.create({ data });
  },
};

export default storyRepo;
