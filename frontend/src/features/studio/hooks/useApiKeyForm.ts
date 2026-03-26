import { useState } from 'react';

export const useApiKeyForm = () => {
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleKeyVisibility = () => setShowKey(!showKey);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Logic xử lý thêm API key sẽ được triển khai sau
      console.log("Submit API Key...");
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    showKey,
    isSubmitting,
    toggleKeyVisibility,
    handleSubmit
  };
};
