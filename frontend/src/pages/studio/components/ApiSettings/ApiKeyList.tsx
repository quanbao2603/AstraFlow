import { Shield, CheckCircle2, Key } from 'lucide-react';
import { ApiKeyCard } from './ApiKeyCard';
import type { IApiKey } from '../../../../types/api-key';

interface ApiKeyListProps {
  apiKeys: IApiKey[];
  onDelete: (id: string) => void;
}

export function ApiKeyList({ apiKeys, onDelete }: ApiKeyListProps) {
  return (
    <div className="p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
            <Shield size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">API Key Đã Lưu</h3>
            <p className="text-sm text-slate-400 mt-1">Danh sách các khóa đang hoạt động trong dự án</p>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-sm font-medium text-slate-300 flex items-center gap-2 self-start sm:self-auto">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>{apiKeys.length} khóa</span>
        </div>
      </div>

      {apiKeys.length === 0 ? (
        <div className="text-center py-16 px-4 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center bg-black/20">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-5 text-slate-500 ring-4 ring-white/5">
            <Key size={32} />
          </div>
          <p className="text-slate-300 mb-2 font-medium text-lg">Bạn chưa lưu cấu hình nào</p>
          <p className="text-slate-500 max-w-sm mx-auto">Hãy thêm API Key đầu tiên ở form bên trên để bắt đầu sử dụng trợ lý AI của AstraFlow.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {apiKeys.map((item) => (
            <ApiKeyCard 
              key={item.id} 
              apiKey={item} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
