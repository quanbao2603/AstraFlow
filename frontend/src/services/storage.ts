import type { Story } from '../types/story';

const STORAGE_KEY = 'astra_flow_stories';
const AUTH_TOKEN_KEY = 'astra_flow_token';
const USER_DATA_KEY = 'astra_flow_user';

export const StorageService = {
  // --- AUTH ---
  setToken: (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },
  
  getToken: (): string | null => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  
  removeToken: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  removeUser: () => {
    localStorage.removeItem(USER_DATA_KEY);
  },

  setUser: (user: any) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  },

  getUser: (): any | null => {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  },

  // --- STORIES ---
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
