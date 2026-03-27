import { useState } from 'react';
import { ApiKeyService } from '../../../services/apiKey.service';

export const useApiKeyForm = (onSuccess?: () => void) => {
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const toggleKeyVisibility = () => setShowKey(!showKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const provider = formData.get('provider') as string;
      const label = formData.get('label') as string;
      const key = formData.get('key') as string;

      if (!key) throw new Error('Vui lòng nhập API Key');

      await ApiKeyService.addKey(provider, label, key);
      
      setSuccessMsg('Thêm API Key thành công!');
      if (onSuccess) onSuccess();
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      
      // Xoá thông báo thành công sau 3 giây
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error: any) {
        setErrorMsg(error.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showKey,
    isSubmitting,
    errorMsg,
    successMsg,
    toggleKeyVisibility,
    handleSubmit
  };
};
