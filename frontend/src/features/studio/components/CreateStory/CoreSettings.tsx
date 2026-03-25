import { BookOpen } from 'lucide-react';
import React from 'react';

interface CoreSettingsProps {
  formData: {
    title: string;
    theme: string;
    genre: string;
    setting: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export default function CoreSettings({ formData, onChange }: CoreSettingsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400">
          <BookOpen size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">1. Thiết Lập Cốt Lõi</h3>
          <p className="text-xs text-slate-500">Khung nền móng cho ý tưởng cốt truyện của bạn</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">Tên Truyện</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={onChange} 
            placeholder="VD: Dấu Vải, Đa Nhân Cách..." 
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all" 
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">Chủ Đề / Mô Tả Ngắn</label>
          <textarea 
            name="theme" 
            value={formData.theme} 
            onChange={onChange} 
            placeholder="VD: Hành trình khám phá nội tâm, một thế giới bị bỏ rơi..." 
            rows={2} 
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all resize-none" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Thể loại truyện</label>
          <input 
            type="text" 
            name="genre" 
            value={formData.genre} 
            onChange={onChange} 
            placeholder="VD: Tâm lý học, Khoa học viễn tưởng" 
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Bối Cảnh Chung</label>
          <input 
            type="text" 
            name="setting" 
            value={formData.setting} 
            onChange={onChange} 
            placeholder="VD: Thời hiện đại, Gia đình nghèo khó" 
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/30 transition-all" 
          />
        </div>
      </div>
    </div>
  );
}
