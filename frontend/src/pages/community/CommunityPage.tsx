import { PenTool } from 'lucide-react';
import CommunityNav from '../../features/community/components/CommunityNav';
import CommunityTrending from '../../features/community/components/CommunityTrending';
import EmptyState from '../../features/community/components/EmptyState';

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 max-w-6xl animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row gap-6 items-start mt-6">
        {/* Left Sidebar */}
        <div className="w-full md:w-auto md:flex-none">
          <CommunityNav />
        </div>

        {/* Center Feed */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Create Post Bar */}
          <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3 hover:border-slate-700 transition-colors cursor-pointer group">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <span className="font-bold text-violet-400 text-sm">A</span>
            </div>
            <div className="flex-1 h-10 bg-slate-950/80 border border-slate-800 rounded-xl px-4 flex items-center text-slate-500 text-sm group-hover:text-slate-400">
              Bạn đang nghĩ gì thế? Chia sẻ với cộng đồng nhé...
            </div>
            <button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white p-2.5 rounded-xl flex items-center justify-center transition-all">
              <PenTool size={18} />
            </button>
          </div>

          {/* Post Lists - Now Empty State */}
          <EmptyState />
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-auto md:flex-none">
          <CommunityTrending />
        </div>
      </div>
    </div>
  );
}
