import type { Story } from '../generated/prisma/index.js';

export interface IStoryRepository {
  findByAuthor(authorId: string): Promise<any[]>; // using any[] to quickly match Prisma's "include" shape without defining complex inferred types
  findById(id: string): Promise<any | null>;
  create(data: {
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
  }): Promise<Story>;
}
