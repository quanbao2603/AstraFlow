import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReaderToolbar from '../../features/reader/components/ReaderToolbar';
import ReadingView from '../../features/reader/components/ReadingView';
import AudioPlayer from '../../features/reader/components/AudioPlayer';
import type { Story } from '../../types/story';
import { ApiService } from '../../services/api';
import { X, Sun, Moon, Coffee, Sparkles, AlertCircle } from 'lucide-react';

const ReaderPage: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  
  const [story, setStory] = useState<Story | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<'light' | 'dark' | 'sepia'>('dark');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileChaptersOpen, setIsMobileChaptersOpen] = useState(false);
  const [isAudioMode, setIsAudioMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);

  const fetchStory = async () => {
    if (storyId) {
      const data = await ApiService.getStoryById(storyId);
      setStory(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStory();
  }, [storyId]);

  // Setup IntersectionObserver to active chapter highlights
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveChapterIndex(index);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    const chapterElements = document.querySelectorAll('.chapter-content-container');
    chapterElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [story?.chapters]);

  // AUTO READ-AHEAD TRIGGER
  useEffect(() => {
    if (!story || story.status === 'completed' || isGenerating || isAutoGenerating) return;

    const chaptersCount = story.chapters?.length || 0;
    // Tự động sinh nếu đang đọc mà khoảng cách tới cuối <= 1 chương
    if (chaptersCount > 0 && (chaptersCount - 1 - activeChapterIndex <= 1)) {
       const expectedChapters = (story.blueprintJson as any)?.expected_chapters || 10;
       if (chaptersCount < expectedChapters) {
           handleAutoGenerate();
       }
    }
  }, [activeChapterIndex, story, isGenerating, isAutoGenerating]);

  const handleAutoGenerate = async () => {
    if (!storyId) return;
    setIsAutoGenerating(true);
    try {
      await ApiService.generateNextChapter(storyId);
      const data = await ApiService.getStoryById(storyId);
      if (data) setStory(data);
    } catch(err) {
       console.error("Auto-generate failed", err);
    } finally {
      setIsAutoGenerating(false);
    }
  };

  const handleGenerateNextChapter = async () => {
    if (!storyId) return;
    setIsGenerating(true);
    try {
      await ApiService.generateNextChapter(storyId);
      await fetchStory();
      // Scroll to bottom logically could happen here
    } catch (err: any) {
      alert(err.message || 'Có lỗi xảy ra khi tạo chương mới');
    } finally {
      setIsGenerating(false);
    }
  };

  const scrollToChapter = (index: number) => {
    setActiveChapterIndex(index);
    setIsMobileChaptersOpen(false);
    const element = document.getElementById(`chapter-${index}`);
    if (element) {
      // scroll slowly
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNextAudioChapter = () => {
    if (story?.chapters && activeChapterIndex < story.chapters.length - 1) {
      scrollToChapter(activeChapterIndex + 1);
    }
  };

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
  
  const formatChapterTitle = (title: string | null | undefined, index: number) => {
    if (!title) return `Chương ${index + 1}`;
    if (title.trim().toLowerCase().startsWith('chương')) {
      return title;
    }
    return `Chương ${index + 1}: ${title}`;
  };

  const SidebarContent = () => (
    <div className="space-y-2 overflow-y-auto h-[80vh] custom-scrollbar pr-2">
      {chapters.length > 0 ? (
        chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            onClick={() => scrollToChapter(index)}
            className={`w-full text-left p-4 rounded-2xl border transition-all ${activeChapterIndex === index ? 'bg-violet-500/10 border-violet-500/50 text-violet-400' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600'}`}
          >
            <p className="font-semibold text-sm line-clamp-2">{formatChapterTitle(chapter.title, index)}</p>
            <p className="text-xs opacity-60 mt-1 uppercase tracking-widest">{chapter.content?.length || 0} ký tự</p>
          </button>
        ))
      ) : (
        <div className="text-center py-12 text-slate-500 text-sm">Chưa có dữ liệu chương.</div>
      )}
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-20 pt-4 md:pt-8 px-4 lg:px-12 ${theme === 'dark' ? 'bg-slate-950' : theme === 'sepia' ? 'bg-[#f8f3e8]' : 'bg-slate-50'}`}>
      <div className="max-w-[1400px] mx-auto flex gap-12 relative items-start">
        
        {/* Desktop Sidebar (Sticky left) */}
        <aside className="hidden md:block w-72 shrink-0 sticky top-12 h-[calc(100vh-6rem)]">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 h-full flex flex-col shadow-xl">
             <h3 className="text-lg font-bold text-white uppercase tracking-tight mb-6 flex items-center justify-center">Mục lục</h3>
             <SidebarContent />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-3xl mx-auto">
          <ReaderToolbar 
            title={story.title}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenChapters={() => setIsMobileChaptersOpen(true)}
            isAudioMode={isAudioMode}
            onToggleAudioMode={() => setIsAudioMode(!isAudioMode)}
          />

          {chapters.length > 0 ? (
            <div className="flex flex-col">
              {chapters.map((chapter, index) => (
                <div 
                  key={chapter.id} 
                  id={`chapter-${index}`} 
                  data-index={index} 
                  className="chapter-content-container pb-12 mb-12 border-b border-slate-200/5"
                >
                  <h2 className={`text-2xl md:text-3xl font-bold mb-8 text-center ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    {formatChapterTitle(chapter.title, index)}
                  </h2>
                  <ReadingView 
                    content={chapter.content}
                    fontSize={fontSize}
                    theme={theme}
                  />
                </div>
              ))}
              
              <div className="flex justify-center mt-12 mb-12">
                {story.status === 'completed' ? (
                  <div className="text-center p-6 border border-slate-800 rounded-3xl bg-slate-900/50">
                    <p className="text-violet-400 font-bold uppercase tracking-widest text-lg mb-2">HẾT CHUYỆN</p>
                    <p className="text-slate-500 text-sm">Cốt truyện này đã được AI khép lại trọn vẹn và không thể sinh thêm.</p>
                  </div>
                ) : isAutoGenerating || isGenerating ? (
                  <div className="flex flex-col items-center gap-3 px-8 py-5 bg-slate-900 border border-violet-500/30 text-white rounded-3xl shadow-xl shadow-violet-500/10 opacity-80">
                    <Sparkles className="w-6 h-6 text-violet-400 animate-spin" />
                    <span className="text-sm font-medium text-slate-300">Hệ thống AI đang ngầm dệt trước chương tiếp theo cho bạn...</span>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateNextChapter}
                    disabled={isGenerating || isAutoGenerating}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 border border-violet-500/30 text-white rounded-3xl hover:bg-slate-800 hover:border-violet-500 transition-all shadow-xl shadow-violet-500/10 font-bold group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Sparkles className="w-5 h-5 text-violet-400 group-hover:animate-pulse" />
                    🪄 Bấm Vô Đây Nếu Bạn Muốn Nó Sinh Liền
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-20 flex flex-col items-center justify-center text-center p-12 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-slate-800 border-dashed">
              <Sparkles className="w-16 h-16 text-violet-400 mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold text-white mb-2">Chưa có nội dung chương</h3>
              <button 
                onClick={handleGenerateNextChapter}
                disabled={isGenerating}
                className="flex items-center gap-2 px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-violet-500/20 active:scale-95"
              >
                {isGenerating ? 'Đang viết...' : 'Dùng AI viết Chương 1'}
              </button>
            </div>
          )}
        </main>
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

      {/* Mobile Chapters Overlay */}
      {isMobileChaptersOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-center justify-end p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border-l border-slate-800 h-full w-full max-w-sm p-6 shadow-2xl animate-in slide-in-from-right duration-300 text-left">
             <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">Danh sách chương</h3>
              <button onClick={() => setIsMobileChaptersOpen(false)} className="p-2 text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Floating Audio Player */}
      {isAudioMode && chapters.length > 0 && (
        <AudioPlayer 
          content={chapters[activeChapterIndex]?.content || ''}
          chapterTitle={formatChapterTitle(chapters[activeChapterIndex]?.title, activeChapterIndex)}
          onNextChapter={handleNextAudioChapter}
          onClose={() => setIsAudioMode(false)}
        />
      )}
    </div>
  );
};

export default ReaderPage;
