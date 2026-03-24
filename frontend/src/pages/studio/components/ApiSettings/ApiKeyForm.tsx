import { useState } from 'react';
import { Bot, Key, Save, Plus, Loader2, UserCog, Tag, AlertCircle } from 'lucide-react';
import type { IApiKeyFormData } from '../../../../types/api-key';
import { API_AGENTS, API_ROLES } from '../../../../constants/api-key';

interface ApiKeyFormProps {
  onSubmit: (data: IApiKeyFormData) => Promise<boolean>;
  isSubmitting: boolean;
}

const INITIAL_FORM_DATA: IApiKeyFormData = {
  agent: API_AGENTS[0].id,
  role: API_ROLES[0].id,
  name: '',
  key: ''
};

export function ApiKeyForm({ onSubmit, isSubmitting }: ApiKeyFormProps) {
  const [formData, setFormData] = useState<IApiKeyFormData>(INITIAL_FORM_DATA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.key.trim()) return;

    const success = await onSubmit(formData);
    if (success) {
      setFormData(INITIAL_FORM_DATA);
    }
  };

  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20 shadow-inner">
          <Plus size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Thêm Key Mới</h3>
          <p className="text-sm text-slate-400 mt-1">Kết nối với các nhà cung cấp AI hàng đầu</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Bot size={16} className="text-violet-400" /> AI Provider
          </label>
          <div className="relative">
            <select 
              name="agent" 
              value={formData.agent} 
              onChange={handleChange}
              className="w-full pl-4 pr-10 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer"
            >
              {API_AGENTS.map(agent => (
                <option key={agent.id} value={agent.id} className="bg-[#0b0f19]">{agent.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <UserCog size={16} className="text-violet-400" /> Vai trò (Role)
          </label>
          <div className="relative">
            <select 
              name="role" 
              value={formData.role} 
              onChange={handleChange}
              className="w-full pl-4 pr-10 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all appearance-none cursor-pointer"
            >
              {API_ROLES.map(role => (
                <option key={role.id} value={role.id} className="bg-[#0b0f19]">{role.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Tag size={16} className="text-violet-400" /> Tên gợi nhớ
          </label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            required
            placeholder="VD: Key Gemini cho Dự án Phiêu lưu..." 
            className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-slate-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
          />
        </div>

        <div className="md:col-span-2 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Key size={16} className="text-violet-400" /> Mã API Key
          </label>
          <input 
            type="password" 
            name="key" 
            value={formData.key} 
            onChange={handleChange}
            required
            placeholder="Nhập chuỗi khóa bí mật của bạn..." 
            className="w-full px-4 py-3.5 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-slate-600 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-mono"
          />
          <div className="flex items-start gap-2 mt-3 text-[13px] text-slate-400 bg-white/5 p-3.5 rounded-xl border border-white/5">
            <AlertCircle size={16} className="text-violet-400 shrink-0 mt-0.5" />
            <p>Khóa API của bạn sẽ được mã hóa an toàn trước khi lưu vào cơ sở dữ liệu. Chúng tôi chỉ sử dụng khóa này để thực hiện các truy vấn AI thay mặt bạn.</p>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={isSubmitting || !formData.name || !formData.key}
            className={`flex items-center gap-2 px-8 py-3.5 font-medium rounded-xl transition-all shadow-lg ${
              isSubmitting || !formData.name || !formData.key
                ? 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed' 
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-500/25'
            }`}
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            <span>{isSubmitting ? 'Đang lưu...' : 'Lưu cấu hình'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
