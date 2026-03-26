import React, { useState } from 'react';

export const useAuthForm = (initialValues: any = {}) => {
  const [formData, setFormData] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const setSubmitting = (value: boolean) => setIsSubmitting(value);

  return {
    formData,
    showPassword,
    isSubmitting,
    togglePasswordVisibility,
    handleChange,
    setSubmitting,
    setFormData
  };
};
