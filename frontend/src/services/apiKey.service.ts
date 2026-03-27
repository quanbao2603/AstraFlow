import { ApiService } from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export interface ApiKey {
  id: string;
  provider: string;
  label?: string;
  maskedKey: string;
  isDefault: boolean;
  createdAt: string;
}

export const ApiKeyService = {
  getKeys: async (): Promise<ApiKey[]> => {
    const headers = await ApiService.getHeaders();
    const res = await fetch(`${API_BASE_URL}/keys`, { headers });
    if (!res.ok) throw new Error('Không thể tải danh sách khóa');
    const json = await res.json();
    return json.data || [];
  },

  addKey: async (provider: string, label: string, key: string): Promise<void> => {
    const headers = await ApiService.getHeaders();
    const res = await fetch(`${API_BASE_URL}/keys`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ provider, label, key })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Thêm khóa thất bại');
  },

  deleteKey: async (id: string): Promise<void> => {
    const headers = await ApiService.getHeaders();
    const res = await fetch(`${API_BASE_URL}/keys/${id}`, {
      method: 'DELETE',
      headers
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.error || 'Xóa khóa thất bại');
    }
  }
};
