// ExploreCategories interface

interface ExploreCategoriesProps {
  activeTab: string;
  onTabChange: (id: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Tất Cả' },
  { id: 'trending', label: '📊 Xu Hướng' },
  { id: 'new', label: '✨ Mới Nhất' },
  { id: 'most-read', label: '📖 Đọc Nhiều' },
  { id: 'liked', label: '❤️ Yêu Thích' },
];

export default function ExploreCategories({ activeTab, onTabChange }: ExploreCategoriesProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar touch-pan-x">
      {CATEGORIES.map((cat) => {
        const isActive = activeTab === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onTabChange(cat.id)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border ${
              isActive 
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 border-transparent text-white shadow-lg shadow-violet-500/20' 
                : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
