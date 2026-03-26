// src/services/api.ts
import type { Story, StoryFormData } from '../types/story';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * AstraFlow API Client
 * This is a bridge for backend integration. Currently uses localStorage as a fallback.
 */
export const ApiService = {
  // STORIES
  getStories: async (): Promise<Story[]> => {
    try {
      // Phase 1: Local Storage
      const local = localStorage.getItem('astra_flow_stories');
      return local ? JSON.parse(local) : [];
    } catch (error) {
      console.error("Error reading from storage:", error);
      return [];
    }
  },

  getStoryById: async (id: string): Promise<Story | null> => {
    const stories = await ApiService.getStories();
    return stories.find((s: Story) => s.id === id) || null;
  },

  createStory: async (data: StoryFormData): Promise<Story> => {
    // Simulate Backend logic
    const newStory: Story = {
      ...data,
      id: `s-${Date.now()}`,
      description: data.title + " - Một câu chuyện thú vị.",
      chapters: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      coverUrl: `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80`,
      views: 0,
      likes: 0,
      rating: 0,
      isFeatured: false,
      author: {
        id: 'u-1',
        name: 'Bạn'
      }
    };

    const stories = await ApiService.getStories();
    localStorage.setItem('astra_flow_stories', JSON.stringify([...stories, newStory]));
    return newStory;
  },

  deleteStory: async (id: string): Promise<void> => {
    const stories = await ApiService.getStories();
    const filtered = stories.filter((s: Story) => s.id !== id);
    localStorage.setItem('astra_flow_stories', JSON.stringify(filtered));
  }
};
