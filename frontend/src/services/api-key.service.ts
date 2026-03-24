import type { IApiKey, IApiKeyFormData } from '../types/api-key';

class ApiKeyService {
  private keys: IApiKey[] = [];

  async getApiKeys(): Promise<IApiKey[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...this.keys]), 300);
    });
  }

  async addApiKey(formData: IApiKeyFormData): Promise<IApiKey> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newKey: IApiKey = {
          id: Math.random().toString(36).substring(7),
          ...formData,
          userId: 'current_user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        this.keys = [newKey, ...this.keys];
        resolve(newKey);
      }, 800);
    });
  }

  async deleteApiKey(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = this.keys.length;
        this.keys = this.keys.filter(k => k.id !== id);
        resolve(this.keys.length !== initialLength);
      }, 300);
    });
  }
}

export const apiKeyService = new ApiKeyService();
