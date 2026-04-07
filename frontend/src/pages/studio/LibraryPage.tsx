import { BookOpen, PlusCircle, Trash2, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Story } from '../../types/story';
import { ApiService } from '../../services/api';
import CoverImageUpload from '../../components/common/CoverImageUpload';
import { X, Image as ImageIcon } from 'lucide-react';
import supabase from '../../config/supabase';

export default function LibraryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCoverFor, setEditingCoverFor] = useState<Story | null>(null);

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
      const storyToDelete = stories.find(s => s.id === id);
      
      // Dọn dẹp rác Storage: Xóa file ảnh bìa trước khi xóa truyện
      if (storyToDelete?.coverImage) {
        const pathPart = storyToDelete.coverImage.split('/covers/').pop();
        if (pathPart) {
          supabase.storage.from('covers').remove([pathPart]).catch(console.warn);
        }
      }

      await ApiService.deleteStory(id);
      fetchStories();
    }
  };

  const handleExport = async (e: React.MouseEvent, storyId: string, title: string) => {
    e.preventDefault();
    try {
      await ApiService.exportStory(storyId, title);
    } catch (error) {
      alert('Có lỗi xảy ra khi tải xuống.');
    }
  };

  const handleUpdateCover = async (publicUrl: string) => {
    if (!editingCoverFor) return;
    try {
      await ApiService.updateStory(editingCoverFor.id, { coverImage: publicUrl });
      setEditingCoverFor(null);
      fetchStories();
    } catch (e) {
      alert('Có lỗi xảy ra khi lưu ảnh bìa.');
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
                  src={story.coverImage || 'https://via.placeholder.com/300x400/0f172a/1e293b?text=AstraFlow'} 
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={(e) => handleExport(e, story.id, story.title)}
                    className="p-2 bg-blue-500/10 backdrop-blur-md border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white"
                    title="Tải về (.txt)"
                  >
                    <Download size={16} />
                  </button>

                  <button 
                    onClick={(e) => { e.preventDefault(); setEditingCoverFor(story); }}
                    className="p-2 bg-violet-500/10 backdrop-blur-md border border-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500 hover:text-white"
                    title="Đổi ảnh bìa"
                  >
                    <ImageIcon size={16} />
                  </button>

                  <button 
                    onClick={(e) => handleDelete(story.id, e)}
                    className="p-2 bg-red-500/10 backdrop-blur-md border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                    title="Xóa truyện"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

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

      {/* Modal Cập nhật Ảnh bìa */}
      {editingCoverFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
            <button 
              onClick={() => setEditingCoverFor(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">Đổi ảnh bìa</h3>
            <p className="text-sm text-slate-400 mb-6 truncate">{editingCoverFor.title}</p>
            
            <div className="flex justify-center mb-6">
              <CoverImageUpload 
                currentImageUrl={editingCoverFor.coverImage} 
                onUploadSuccess={handleUpdateCover} 
              />
            </div>
            
            <div className="text-center text-xs text-slate-500">
              Ảnh bìa sẽ được cập nhật tự động sau khi tải lên thành công.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
