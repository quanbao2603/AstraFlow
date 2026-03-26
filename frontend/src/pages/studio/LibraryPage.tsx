import { BookOpen, PlusCircle, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Story } from '../../types/story';
import { ApiService } from '../../services/api';

export default function LibraryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    const data = await ApiService.getStories();
    setStories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm('Bạn có chắc chắn muốn xóa tác phẩm này?')) {
      await ApiService.deleteStory(id);
      fetchStories();
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">Thư viện của tôi</h2>
          <p className="text-slate-400 text-sm">Quản lý và tiếp tục sáng tác các tác phẩm của bạn.</p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/studio/create"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all shadow-lg shadow-violet-500/20"
          >
            <PlusCircle size={18} />
            Tạo mới
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Đang tải thư viện...</div>
      ) : stories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 backdrop-blur-sm">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-slate-500 opacity-60" />
          </div>
          <p className="text-lg text-slate-300 font-semibold">Thư viện của bạn đang trống</p>
          <p className="text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">
             Bạn chưa sáng tác truyện nào. Hãy nhấn vào mục **"Tạo mới"** để bắt đầu dệt nên những cuộc phiêu lưu!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stories.map((story) => (
            <Link 
              key={story.id} 
              to={`/read/${story.id}`}
              className="group bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-violet-500/50 transition-all hover:shadow-xl hover:shadow-violet-500/5 hover:-translate-y-1"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img 
                  src={story.coverUrl || 'https://via.placeholder.com/300x400/0f172a/1e293b?text=AstraFlow'} 
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                <button 
                  onClick={(e) => handleDelete(story.id, e)}
                  className="absolute top-3 right-3 p-2 bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={16} />
                </button>

                <div className="absolute bottom-3 left-3 right-3">
                  <span className="px-2 py-1 rounded-md bg-violet-500/20 backdrop-blur-md border border-violet-500/30 text-[10px] uppercase tracking-wider font-bold text-violet-300">
                    {story.genre}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-slate-100 font-bold truncate group-hover:text-violet-400 transition-colors">
                  {story.title}
                </h3>
                <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                  {story.description}
                </p>
                <div className="flex items-center justify-between mt-4 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                  <span>{new Date(story.createdAt).toLocaleDateString('vi-VN')}</span>
                  <span className="flex items-center gap-1 text-violet-400">
                    <BookOpen size={12} /> Đọc ngay
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
