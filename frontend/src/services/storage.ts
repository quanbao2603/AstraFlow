import type { Story } from '../types/story';

const STORAGE_KEY = 'astra_flow_stories';

export const StorageService = {
  getStories: (): Story[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  getStoryById: (id: string): Story | undefined => {
    const stories = StorageService.getStories();
    return stories.find(s => s.id === id);
  },

  saveStory: (story: Story) => {
    const stories = StorageService.getStories();
    const index = stories.findIndex(s => s.id === story.id);
    
    if (index > -1) {
      stories[index] = story;
    } else {
      stories.push(story);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  },

  deleteStory: (id: string) => {
    const stories = StorageService.getStories().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  }
};
