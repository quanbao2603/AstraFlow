import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StoryFormData } from '../types/studio';
import { useWorldEntities } from './useWorldEntities';
import { ApiService } from '../../../services/api';

const INITIAL_BASE_DATA: StoryFormData = {
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
  worldEntities: [],
};

export const useCreateStoryForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [baseFormData, setBaseFormData] = useState<Omit<StoryFormData, 'worldEntities'>>(INITIAL_BASE_DATA);
  const { 
    entities, 
    handleAddEntity, 
    handleRemoveEntity, 
    handleEntityChange, 
    resetEntities 
  } = useWorldEntities([{ id: 1, type: 'faction', name: '', description: '', conflict: '' }]);

  const formData = useMemo(() => ({
    ...baseFormData,
    worldEntities: entities
  }), [baseFormData, entities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    setBaseFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const resetFormData = () => {
    setBaseFormData(INITIAL_BASE_DATA);
    resetEntities();
  };

  const handleSubmit = async () => {
    if (!baseFormData.title.trim() || !baseFormData.mcName.trim()) {
      alert("Vui lòng nhập Tên truyện và Tên nhân vật chính!");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullData: StoryFormData = { ...baseFormData, worldEntities: entities };
      await ApiService.createStory(fullData);
      
      navigate('/studio/library');
    } catch (error: any) {
      console.error("Lỗi khi tạo truyện:", error);
      alert(error.message || "Không thể kết nối đến Server/AI!");
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
    resetFormData
  };
};
