// src/types/story.ts

export type Gender = 'nam' | 'nu' | 'khac';
export type CrueltyLevel = 'low' | 'normal' | 'high';

export interface WorldEntity {
  id: number;
  type: 'faction' | 'location' | 'item' | 'event';
  name: string;
  description: string;
  conflict?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Author {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  genre: string;
  genres?: string[];
  theme: string;
  setting: string;
  
  // Protagonist
  mcName: string;
  mcGender: string;
  mcBio: string;
  
  // Advanced
  writingStyle?: string;
  crueltyLevel?: string;
  aiInstructions?: string;
  
  // Content
  chapters: Chapter[];
  worldEntities: WorldEntity[];
  blueprintJson?: any;
  status?: string;
  
  // Metadata
  author?: Author;
  views?: number;
  likes?: number;
  rating?: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoryFormData {
  title: string;
  theme: string;
  genre: string;
  setting: string;
  mcName: string;
  mcGender: string;
  mcBio: string;
  writingStyle: string;
  crueltyLevel: string;
  aiInstructions: string;
  useSavedExp: boolean;
  allowNsfw: boolean;
  worldEntities: WorldEntity[];
}
