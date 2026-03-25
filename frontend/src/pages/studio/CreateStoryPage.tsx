import React, { useState } from 'react';
import { ArrowLeft, Eraser, Sparkles, Play, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import CoreSettings from '../../features/studio/components/CreateStory/CoreSettings';
import MainCharacter from '../../features/studio/components/CreateStory/MainCharacter';
import AdvancedSettings from '../../features/studio/components/CreateStory/AdvancedSettings';
import WorldBuilding from '../../features/studio/components/CreateStory/WorldBuilding';

export default function CreateStoryPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '', theme: '', genre: '', setting: '', mcName: '', mcGender: 'nam', mcBio: '',
    writingStyle: '', crueltyLevel: 'normal', aiInstructions: '', useSavedExp: true, allowNsfw: false,
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

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-16">
      <div className="mb-10 text-center md:text-left">
        <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
          Khởi tạo Tác phẩm mới
        </h2>
        <p className="text-slate-400 max-w-lg text-base">
          Thiết lập các thông số cơ bản để "Bộ não AI" hiểu rõ thế giới và câu chuyện bạn muốn kể dệt nên những cuộc phiêu lưu.
        </p>
      </div>

      <div className="flex flex-col gap-8">

        {/* Step 1: Core Settings */}
        <CoreSettings formData={formData} onChange={handleChange} />

        {/* Step 2: Main Character */}
        <MainCharacter formData={formData} onChange={handleChange} />

        {/* Step 3: Advanced Settings */}
        <AdvancedSettings formData={formData} onChange={handleChange} />

        {/* Step 4: World Building */}
        <WorldBuilding
          entities={formData.worldEntities}
          onAdd={handleAddEntity}
          onRemove={handleRemoveEntity}
          onChange={handleEntityChange}
        />

        {/* Action Buttons */}
        <div className="flex flex-col gap-5 mt-4 pt-8 border-t border-slate-800/80">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/studio/library')}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors font-semibold"
            >
              <ArrowLeft size={16} /> Quay Lại Thư viện
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, title: '', mcName: '', theme: '', mcBio: '' })}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors font-semibold"
            >
              <Eraser size={16} /> Xóa Nháp
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-2xl font-bold shadow-lg shadow-violet-500/10 hover:scale-[1.02] transform transition-all duration-300"
            >
              <Sparkles size={18} /> AI Tinh Chỉnh Cốt Truyện
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 ${isSubmitting ? 'bg-emerald-600/50 text-white/50 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/10 hover:scale-[1.02] transform'}`}
            >
              {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} className="fill-current" />}
              {isSubmitting ? 'Đang khởi tạo thế giới...' : 'Bắt Đầu Sáng Tác'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
