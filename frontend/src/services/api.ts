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
    // TODO: Chuyển sang POST /api/v1/stories khi backend sẵn sàng
    // Hiện tại vẫn dùng localStorage để đảm bảo không lỗi luồng cũ
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
