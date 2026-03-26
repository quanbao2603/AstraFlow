import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReaderToolbar from '../../features/reader/components/ReaderToolbar';
import ReadingView from '../../features/reader/components/ReadingView';
import type { Story } from '../../types/story';
import { ApiService } from '../../services/api';
import { X, Sun, Moon, Coffee, Sparkles, AlertCircle } from 'lucide-react';

const ReaderPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  
  const [story, setStory] = useState<Story | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('dark');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChaptersOpen, setIsChaptersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      if (storyId) {
        const data = await ApiService.getStoryById(storyId);
        setStory(data);
        setLoading(false);
      }
    };
    fetchStory();
  }, [storyId]);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="animate-pulse text-violet-500 font-bold tracking-widest uppercase">Đang tải nội dung...</div>
    </div>
  );

  if (!story) return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
      <AlertCircle size={64} className="text-red-500/50 mb-6" />
      <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy tác phẩm</h2>
      <p className="text-slate-400 mb-8 max-w-sm">Có vẻ như đường dẫn này không hợp lệ hoặc tác phẩm đã bị xóa.</p>
      <button 
        onClick={() => navigate('/studio/library')}
        className="px-6 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-500 transition-all font-medium"
      >
        Quay lại Thư viện
      </button>
    </div>
  );

  const chapters = story.chapters || [];
  const currentChapter = chapters[currentChapterIndex];

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-20 px-4 ${theme === 'dark' ? 'bg-slate-950' : theme === 'sepia' ? 'bg-[#f8f3e8]' : 'bg-slate-50'}`}>
      <div className="max-w-4xl mx-auto pt-4 md:pt-8">
        <ReaderToolbar 
          title={currentChapter ? currentChapter.title : story.title}
          hasPrev={currentChapterIndex > 0}
          hasNext={currentChapterIndex < chapters.length - 1}
          onPrev={() => setCurrentChapterIndex(prev => prev - 1)}
          onNext={() => setCurrentChapterIndex(prev => prev + 1)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenChapters={() => setIsChaptersOpen(true)}
        />

        {chapters.length > 0 ? (
          <ReadingView 
            content={currentChapter.content}
            fontSize={fontSize}
            theme={theme}
          />
        ) : (
          <div className="mt-20 flex flex-col items-center justify-center text-center p-12 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 border-dashed">
            <Sparkles className="w-16 h-16 text-violet-400 mb-6 animate-bounce" />
            <h3 className="text-2xl font-bold text-white mb-2">Chưa có nội dung chương</h3>
            <p className="text-slate-400 max-w-md mb-8">
              Tác phẩm **"{story.title}"** vừa được khởi tạo và chưa có chương nào. Hãy bắt đầu hành trình của bạn ngay!
            </p>
            <button className="flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-violet-500/20 active:scale-95">
              Dùng AI viết Chương 1
            </button>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-sm shadow-2xl text-left">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Cấu hình Trình đọc</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-slate-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-400 mb-3 uppercase tracking-wider font-semibold">Cỡ chữ: {fontSize}px</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">A</span>
                  <input 
                    type="range" min="14" max="32" value={fontSize} 
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="flex-1 accent-violet-500"
                  />
                  <span className="text-xl text-slate-300">A</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-400 mb-3 uppercase tracking-wider font-semibold">Chủ đề (Theme)</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', icon: <Sun size={18} />, label: 'Sáng' },
                    { id: 'dark', icon: <Moon size={18} />, label: 'Tối' },
                    { id: 'sepia', icon: <Coffee size={18} />, label: 'Giấy cũ' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id as any)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${theme === t.id ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                    >
                      {t.icon}
                      <span className="text-xs">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chapters Overlay */}
      {isChaptersOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border-l border-slate-800 h-full w-full max-w-sm p-6 shadow-2xl animate-in slide-in-from-right duration-300 text-left">
             <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Danh sách chương</h3>
              <button onClick={() => setIsChaptersOpen(false)} className="p-2 text-slate-400 hover:text-white"><X size={24} /></button>
            </div>

            <div className="space-y-2 overflow-y-auto h-[80vh] custom-scrollbar">
              {chapters.length > 0 ? (
                chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      setCurrentChapterIndex(index);
                      setIsChaptersOpen(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${currentChapterIndex === index ? 'bg-violet-500/10 border-violet-500/50 text-violet-400' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600'}`}
                  >
                    <p className="font-semibold">{chapter.title}</p>
                    <p className="text-xs opacity-60 mt-1 uppercase tracking-widest">{chapter.content.length} ký tự</p>
                  </button>
                ))
              ) : (
                <div className="text-center py-12 text-slate-500 text-sm">Chưa có dữ liệu chương.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderPage;
