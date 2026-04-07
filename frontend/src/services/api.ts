import supabase from '../config/supabase';
import type { Story, StoryFormData } from '../types/story';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

/**
 * AstraFlow API Client
 * Kết nối với Backend API. Có fallback sang localStorage nếu cần.
 */
export const ApiService = {
  // Helper to get headers with token
  getHeaders: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Content-Type': 'application/json',
      ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {})
    };
  },

  // STORIES
  getStories: async (): Promise<Story[]> => {
    try {
      const headers = await ApiService.getHeaders();
      const response = await fetch(`${API_BASE_URL}/stories`, { headers });
      
      if (response.ok) {
        const result = await response.json();
        return result.data || [];
      }

      // Fallback to localStorage if API fails or Unauthorized
      const local = localStorage.getItem('astra_flow_stories');
      return local ? JSON.parse(local) : [];
    } catch (error) {
      console.error("Error fetching stories from API:", error);
      const local = localStorage.getItem('astra_flow_stories');
      return local ? JSON.parse(local) : [];
    }
  },

  getStoryById: async (id: string): Promise<Story | null> => {
    // Tạm thời vẫn lấy từ list chung hoặc backend tùy nhu cầu
    const stories = await ApiService.getStories();
    return stories.find((s: Story) => s.id === id) || null;
  },

  createStory: async (data: StoryFormData): Promise<Story> => {
    try {
      const headers = await ApiService.getHeaders();
      const response = await fetch(`${API_BASE_URL}/stories/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || `Lỗi từ Server (${response.status})`);
      }
      
      return result.data;
    } catch (error: any) {
      console.error("Error creating story AI generate API:", error);
      throw error;
    }
  },

  generateNextChapter: async (storyId: string): Promise<any> => {
    try {
      const headers = await ApiService.getHeaders();
      const response = await fetch(`${API_BASE_URL}/stories/${storyId}/chapters/generate`, {
        method: 'POST',
        headers
      });
      
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || `Lỗi từ Server (${response.status})`);
      }
      return result.data;
    } catch (error: any) {
      console.error("Error generating next chapter API:", error);
      throw error;
    }
  },

  updateStory: async (id: string, data: Partial<Story>): Promise<Story> => {
    try {
      const headers = await ApiService.getHeaders();
      const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || `Lỗi từ Server (${response.status})`);
      }
      return result.data;
    } catch (error: any) {
      console.error("Error updating story API:", error);
      throw error;
    }
  },

  deleteStory: async (id: string): Promise<void> => {
    try {
      const headers = await ApiService.getHeaders();
      const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
        method: 'DELETE',
        headers
      });
      
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || `Lỗi từ Server (${response.status})`);
      }
    } catch (error: any) {
      console.error("Error deleting story API:", error);
      throw error;
    }
  }
};
