// src/repositories/postgres.repo.ts
// Repository cho PostgreSQL (VPS) thông qua Prisma ORM
import prisma from '../db/prisma.js';

export const postgresRepo = {
  // --- PROFILE ---
  async findProfileById(id: string) {
    return prisma.profile.findUnique({ where: { id } });
  },

  async findProfileByEmail(email: string) {
    return prisma.profile.findUnique({ where: { email } });
  },

  async upsertProfile(data: {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role?: string;
  }) {
    return prisma.profile.upsert({
      where: { id: data.id },
      update: {
        displayName: data.displayName,
        photoURL: data.photoURL,
      },
      create: {
        id: data.id,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        role: data.role ?? 'user',
      },
    });
  },

  // --- STORY ---
  async findStoriesByAuthor(authorId: string) {
    return prisma.story.findMany({
      where: { authorId },
      orderBy: { createdAt: 'desc' },
      include: { chapters: { orderBy: { chapterIndex: 'asc' } } },
    });
  },

  async findStoryById(id: string) {
    return prisma.story.findUnique({
      where: { id },
      include: { author: true, chapters: { orderBy: { chapterIndex: 'asc' } } },
    });
  },

  async createStory(data: {
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
    return prisma.story.create({ data });
  },

  // --- CHAPTER ---
  async createChapter(data: {
    storyId: string;
    chapterIndex: number;
    title?: string;
    content: string;
    wordCount?: number;
  }) {
    return prisma.chapter.create({ data });
  },

  async findChaptersByStory(storyId: string) {
    return prisma.chapter.findMany({
      where: { storyId },
      orderBy: { chapterIndex: 'asc' },
    });
  },

  // --- HEALTH CHECK ---
  async ping() {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  },
};

export default postgresRepo;
