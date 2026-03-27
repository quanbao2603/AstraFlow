import { Key, Eye, EyeOff, Plus, Loader2 } from 'lucide-react';
import { useApiKeyForm } from '../../hooks/useApiKeyForm';

interface Props {
  onSuccess?: () => void;
}

export default function ApiKeyForm({ onSuccess }: Props) {
  const { showKey, isSubmitting, errorMsg, successMsg, toggleKeyVisibility, handleSubmit } = useApiKeyForm(onSuccess);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Key className="w-5 h-5 text-indigo-400" />
        Thêm API Key mới
      </h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        
        {/* Error / Success Messages */}
        {errorMsg && (
          <div className="p-3 border rounded-lg bg-red-500/10 border-red-500/50 text-red-500 text-sm">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 border rounded-lg bg-emerald-500/10 border-emerald-500/50 text-emerald-500 text-sm">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Nhà cung cấp (Provider)</label>
            <select name="provider" className="w-full bg-slate-800 border-slate-700 rounded-lg text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="openai">OpenAI (ChatGPT)</option>
              <option value="gemini">Google (Gemini)</option>
              <option value="openrouter">OpenRouter</option>
              <option value="9router">9Router</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Tên gợi nhớ (Label)</label>
            <input 
              name="label"
              type="text" 
              placeholder="Ví dụ: My OpenAI Key"
              className="w-full bg-slate-800 border-slate-700 rounded-lg text-white px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">API Key</label>
          <div className="relative">
            <input 
              name="key"
              type={showKey ? "text" : "password"} 
              placeholder="sk-..."
              className="w-full bg-slate-800 border-slate-700 rounded-lg text-white px-4 py-2 pr-10 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button 
              type="button"
              onClick={toggleKeyVisibility}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {isSubmitting ? 'Đang xác thực và Lưu...' : 'Thêm khóa'}
          </button>
        </div>
      </form>
    </div>
  );
}
