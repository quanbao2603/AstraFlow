import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export interface WorldEntity {
  id: number;
  type: string;
  name: string;
  description: string;
  conflict: string;
}

export interface StoryFormData {
  title: string;
  theme: string;
  genre: string;
  setting: string;
  mcName: string;
  mcGender: string;
  mcBio: string;
  writingStyle: string;
  crueltyLevel: string;
  aiInstructions: string;
  useSavedExp: boolean;
  allowNsfw: boolean;
  worldEntities: WorldEntity[];
}

export const useCreateStoryForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<StoryFormData>({
    title: '',
    theme: '',
    genre: '',
    setting: '',
    mcName: '',
    mcGender: 'nam',
    mcBio: '',
    writingStyle: '',
    crueltyLevel: 'normal',
    aiInstructions: '',
    useSavedExp: true,
    allowNsfw: false,
    worldEntities: [{ id: 1, type: 'faction', name: '', description: '', conflict: '' }]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddEntity = () => {
    setFormData(prev => ({
      ...prev,
      worldEntities: [...prev.worldEntities, { id: Date.now(), type: 'faction', name: '', description: '', conflict: '' }]
    }));
  };

  const handleRemoveEntity = (id: number) => {
    setFormData(prev => ({
      ...prev,
      worldEntities: prev.worldEntities.filter(entity => entity.id !== id)
    }));
  };

  const handleEntityChange = (id: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      worldEntities: prev.worldEntities.map(entity =>
        entity.id === id ? { ...entity, [field]: value } : entity
      )
    }));
  };

  const resetFormData = () => {
    setFormData(prev => ({
      ...prev,
      title: '',
      mcName: '',
      theme: '',
      mcBio: '',
      worldEntities: [{ id: 1, type: 'faction', name: '', description: '', conflict: '' }]
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.mcName.trim()) {
      alert("Vui lòng nhập Tên truyện và Tên nhân vật chính!");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting formData:", formData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      navigate('/studio/library');
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến Server!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    handleChange,
    handleAddEntity,
    handleRemoveEntity,
    handleEntityChange,
    handleSubmit,
    resetFormData,
    setFormData
  };
};
