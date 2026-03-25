import { Hash, MessageSquare, Compass, HelpCircle, Heart } from 'lucide-react';

const CHANNELS = [
  { id: 'all', label: 'Tất Cả', icon: Compass },
  { id: 'general', label: 'Chung', icon: Hash },
  { id: 'creation', label: 'Sáng Tạo', icon: MessageSquare },
  { id: 'help', label: 'Hỏi Đáp', icon: HelpCircle },
  { id: 'favorites', label: 'Yêu Thích', icon: Heart },
];

export default function CommunityNav() {
  return (
    <div className="sticky top-24 w-full md:w-60 bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-1">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 px-3">Danh Mục</h3>
      {CHANNELS.map((ch) => {
        const Icon = ch.icon;
        return (
          <button 
            key={ch.id}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 group text-left"
          >
            <Icon size={18} className="group-hover:text-violet-400 transition-colors" />
            <span>{ch.label}</span>
          </button>
        );
      })}
    </div>
  );
}
