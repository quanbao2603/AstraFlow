import { Settings2 } from 'lucide-react';
import React from 'react';

interface AdvancedSettingsProps {
  formData: {
    writingStyle: string;
    crueltyLevel: string;
    aiInstructions: string;
    useSavedExp: boolean;
    allowNsfw: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function AdvancedSettings({ formData, onChange }: AdvancedSettingsProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl shadow-xl animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
          <Settings2 size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">3. Thiết Lập Nâng Cao</h3>
          <p className="text-xs text-slate-500">Giới hạn luật chơi, tông điệu văn phong cho AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Phong cách viết</label>
          <input 
            type="text" 
            name="writingStyle" 
            value={formData.writingStyle} 
            onChange={onChange} 
            placeholder="VD: Kinh dị, hồi hộp, trinh thám..." 
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all" 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Độ tàn khốc của thế giới</label>
          <div className="relative">
            <select 
              name="crueltyLevel" 
              value={formData.crueltyLevel} 
              onChange={onChange} 
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 appearance-none cursor-pointer"
            >
              <option value="normal">Bình thường</option>
              <option value="hard">Ngặt nghèo - Khốc liệt</option>
              <option value="hell">Địa ngục</option>
            </select>
            <div className="absolute top-1/2 right-4 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">Hướng dẫn chung cho AI</label>
          <textarea 
            name="aiInstructions" 
            value={formData.aiInstructions} 
            onChange={onChange} 
            placeholder="AI ghi nhớ: Tuyệt đối không để nhân vật chính chết ở Tập 1..." 
            rows={2} 
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all resize-none" 
          />
        </div>

        <div className="md:col-span-2 flex flex-wrap gap-6 mt-2">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-800 bg-slate-800 group-hover:border-orange-500 transition-colors">
              <input 
                type="checkbox" 
                name="useSavedExp" 
                checked={formData.useSavedExp} 
                onChange={onChange} 
                className="peer sr-only" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-amber-500 rounded opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Áp Dụng Kinh Nghiệm AI Đã Lưu</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 rounded border border-slate-800 bg-slate-800 group-hover:border-orange-500 transition-colors">
              <input 
                type="checkbox" 
                name="allowNsfw" 
                checked={formData.allowNsfw} 
                onChange={onChange} 
                className="peer sr-only" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-amber-500 rounded opacity-0 peer-checked:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>
            <span className="text-sm text-slate-300 group-hover:text-white transition-colors">Cho phép nội dung NSFW</span>
          </label>
        </div>
      </div>
    </div>
  );
}
