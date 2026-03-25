import React from 'react';
import { MessageSquareDashed, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "Chưa có bài viết nào", 
  description = "Hãy là người đầu tiên chia sẻ cảm hứng và sáng tạo của bạn với cộng đồng AstraFlow!" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-slate-900/40 border border-slate-800/60 rounded-3xl backdrop-blur-sm animate-in fade-in zoom-in duration-700">
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-violet-500/10 blur-2xl rounded-full animate-pulse" />
        <div className="relative w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-950 rounded-2xl border border-slate-700/50 flex items-center justify-center shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <MessageSquareDashed size={40} className="text-slate-500 group-hover:text-violet-400 transition-colors duration-500" />
        </div>
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 p-1.5 rounded-lg shadow-lg rotate-12 animate-bounce transition-transform">
          <Sparkles size={14} className="text-white" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
        {title}
      </h3>
      <p className="text-slate-400 text-center max-w-sm text-sm leading-relaxed mb-8">
        {description}
      </p>
      
      <button className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white transition-all transform hover:scale-105 active:scale-95">
        Bắt đầu thảo luận
      </button>
    </div>
  );
};

export default EmptyState;
