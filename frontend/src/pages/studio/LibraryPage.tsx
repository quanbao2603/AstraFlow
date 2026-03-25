import { BookOpen } from 'lucide-react';
import { useState } from 'react';

export default function LibraryPage() {
  const [stories] = useState([]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Thư viện Truyện</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all"
          />
        </div>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-slate-500 opacity-60" />
          </div>
          <p className="text-lg text-slate-300 font-semibold">Thư viện của bạn đang trống</p>
          <p className="text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">
            Bạn chưa sáng tác truyện nào. Hãy nhấn vào mục **"Khởi tạo Truyện mới"** để bắt đầu dệt nên những cuộc phiêu lưu!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        </div>
      )}
    </div>
  );
}
