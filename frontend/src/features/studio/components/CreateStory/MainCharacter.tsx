import { User, Sparkles } from 'lucide-react';
import React from 'react';

interface MainCharacterProps {
  formData: {
    mcName: string;
    mcGender: string;
    mcBio: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function MainCharacter({ formData, onChange }: MainCharacterProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
          <User size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">2. Nhân Vật Chính</h3>
          <p className="text-xs text-slate-500">Người hùng dệt nên sợi dây kịch tính cho câu chuyện</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Tên Nhân Vật</label>
          <input 
            type="text" 
            name="mcName" 
            value={formData.mcName} 
            onChange={onChange} 
            placeholder="VD: Nguyễn Văn A, Lý Thường Kiệt..." 
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Giới Tính</label>
          <div className="relative">
            <select 
              name="mcGender" 
              value={formData.mcGender} 
              onChange={onChange} 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-pink-500 appearance-none cursor-pointer"
            >
              <option value="nam">Nam</option>
              <option value="nu">Nữ</option>
              <option value="khac">Khác</option>
            </select>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="flex justify-between items-end mb-2">
            <label className="block text-sm font-medium text-slate-300">Tiểu Sử / Bối Cảnh</label>
            <button 
              type="button" 
              className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 bg-pink-500/5 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Sparkles size={14} /> Gợi ý bằng AI
            </button>
          </div>
          <textarea 
            name="mcBio" 
            value={formData.mcBio} 
            onChange={onChange} 
            placeholder="Bối cảnh gia đình, chấn thương tâm lý, kỹ năng sinh tồn..." 
            rows={3} 
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500/30 transition-all resize-none" 
          />
        </div>
      </div>
    </div>
  );
}
