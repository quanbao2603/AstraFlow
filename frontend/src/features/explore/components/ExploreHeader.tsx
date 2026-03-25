import { Search, Sparkles } from 'lucide-react';

interface ExploreHeaderProps {
  onSearch: (query: string) => void;
}

export default function ExploreHeader({ onSearch }: ExploreHeaderProps) {
  return (
    <div className="relative mb-12 text-center py-10">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent -z-10" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl -z-10" />

      <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
        Khám Phá Thế Giới Truyện
      </h1>
      <p className="text-slate-400 max-w-lg mx-auto mb-8 text-sm md:text-base">
        Duyệt hàng ngàn tác phẩm độc đáo được dệt nên bởi sự giao thoa giữa trí tuệ con người và thuật toán AI.
      </p>

      <div className="max-w-xl mx-auto relative group px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-60 group-hover:opacity-100" />
        <div className="relative flex items-center bg-slate-900/80 border border-slate-800 rounded-2xl p-1.5 backdrop-blur-xl group-hover:border-slate-700 transition-colors">
          <div className="pl-4 text-slate-500">
            <Search size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Tìm kiếm tác phẩm, tác giả..." 
            onChange={(e) => onSearch(e.target.value)}
            className="w-full bg-transparent px-3 py-3 text-white outline-none placeholder:text-slate-500 text-sm md:text-base" 
          />
          <button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white p-3 rounded-xl flex items-center justify-center transition-all">
            <Sparkles size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
