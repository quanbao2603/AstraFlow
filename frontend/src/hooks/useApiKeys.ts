import { useState, useEffect } from 'react';
import type { IApiKey, IApiKeyFormData } from '../types/api-key';
import { apiKeyService } from '../services/api-key.service';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState<IApiKey[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKeys = async () => {
    setIsLoading(true);
    try {
      const data = await apiKeyService.getApiKeys();
      setApiKeys(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const addApiKey = async (formData: IApiKeyFormData): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const newKey = await apiKeyService.addApiKey(formData);
      setApiKeys((prev) => [newKey, ...prev]);
      return true;
    } catch (error) {
      console.error("Failed to add API key", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteApiKey = async (id: string): Promise<boolean> => {
    if (window.confirm('Bạn có chắc chắn muốn xóa API Key này không? Hành động này không thể hoàn tác.')) {
      try {
        const success = await apiKeyService.deleteApiKey(id);
        if (success) {
          setApiKeys((prev) => prev.filter(k => k.id !== id));
        }
        return success;
      } catch (error) {
        console.error("Failed to delete API key", error);
        return false;
      }
    }
    return false;
  };

  return {
    apiKeys,
    isLoading,
    isSubmitting,
    addApiKey,
    deleteApiKey
  };
}
