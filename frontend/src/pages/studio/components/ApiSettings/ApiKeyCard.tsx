import { Bot, Trash2 } from 'lucide-react';
import type { IApiKey } from '../../../../types/api-key';
import { getAgentName, getRoleName } from '../../../../constants/api-key';

interface ApiKeyCardProps {
  apiKey: IApiKey;
  onDelete: (id: string) => void;
}

export function ApiKeyCard({ apiKey, onDelete }: ApiKeyCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 rounded-2xl border border-white/10 bg-black/40 hover:bg-white/5 hover:border-violet-500/30 transition-all duration-300 group">
      <div className="flex items-start sm:items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-white/10 flex items-center justify-center text-violet-300 shrink-0 group-hover:scale-105 transition-transform duration-300">
          <Bot size={24} strokeWidth={1.5} />
        </div>
        <div>
          <h4 className="text-white font-semibold text-lg flex items-center gap-2 mb-2">
            {apiKey.name}
          </h4>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-300 bg-white/10 px-2.5 py-1 rounded-md border border-white/5">
              {getAgentName(apiKey.agent)}
            </span>
            <span className="text-xs font-medium text-violet-300 bg-violet-500/15 px-2.5 py-1 rounded-md border border-violet-500/20">
              {getRoleName(apiKey.role)}
            </span>
            <span className="text-xs text-slate-500 ml-1">
              • Đã thêm {new Date(apiKey.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onDelete(apiKey.id)}
        className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-transparent hover:border-red-400/20 flex flex-row sm:flex-col items-center justify-center gap-2 self-start sm:self-auto shrink-0 group/btn"
        title="Xóa Key"
      >
        <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
        <span className="sm:hidden text-sm font-medium">Xóa khóa này</span>
      </button>
    </div>
  );
}
