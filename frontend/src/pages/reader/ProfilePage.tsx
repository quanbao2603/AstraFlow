import { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { ApiService } from '../../services/api';
import type { Story } from '../../types/story';

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'stories' | 'bookshelf'>('stories');
  const [stories, setStories] = useState<Story[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      try {
        const userStories = await ApiService.getStories();
        setStories(userStories);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    if (!authLoading && user) {
      fetchUserData();
    }
  }, [user, authLoading]);

  // Loading state
  if (authLoading || (dataLoading && user)) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect if not logged in or viewing wrong profile (for now we only show personal profile)
  if (!user || user.id !== userId) {
    return <Navigate to="/" replace />;
  }

  // Calculate real stats
  const totalStories = stories.length;
  const totalViews = stories.reduce((sum, story) => sum + (story.views || 0), 0);
  const followersCount = 0; // Not implemented yet

  const stats = [
    {
      label: 'Truyện đã viết', value: totalStories.toString(), icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 17.477 16.5 17.477 14.754 17.477 13.168 18.477 12 19.253" />
        </svg>
      )
    },
    {
      label: 'Tổng lượt đọc', value: totalViews >= 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews.toString(), icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    {
      label: 'Người theo dõi', value: followersCount.toString(), icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-pink-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Profile Header Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative w-32 h-32 sm:w-40 h-40 rounded-full overflow-hidden border-4 border-slate-900 bg-slate-800 flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-white">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-white">{user.displayName}</h1>
                <button className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-medium text-white transition-all transform hover:scale-105">
                  Chỉnh sửa hồ sơ
                </button>
              </div>
              <p className="text-gray-400 mb-6 flex items-center justify-center md:justify-start gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" />
                </svg>
                {user.email}
              </p>

              <div className="grid grid-cols-3 gap-8 max-w-md mx-auto md:mx-0">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center md:text-left">
                    <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('stories')}
            className={`pb-4 text-sm font-medium transition-colors relative flex items-center gap-2 ${activeTab === 'stories' ? 'text-violet-400' : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            Truyện của tôi
            <span className="px-2 py-0.5 bg-white/5 rounded-full text-[10px]">{stories.length}</span>
            {activeTab === 'stories' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-400 rounded-full shadow-[0_0_8px_rgba(167,139,250,0.8)]"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('bookshelf')}
            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'bookshelf' ? 'text-violet-400' : 'text-gray-500 hover:text-gray-300'
              }`}
          >
            Tủ sách cá nhân
            {activeTab === 'bookshelf' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-violet-400 rounded-full shadow-[0_0_8px_rgba(167,139,250,0.8)]"></div>
            )}
          </button>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {activeTab === 'stories' ? (
            stories.length > 0 ? (
              stories.map((story) => (
                <Link
                  key={story.id}
                  to={`/story/${story.id}`}
                  className="group bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
                >
                  <div className="aspect-[16/9] bg-slate-800 relative overflow-hidden">
                    <img
                      src={story.coverUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80'}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span className="px-2 py-1 bg-violet-600/80 backdrop-blur-md rounded-md text-[10px] text-white font-bold uppercase tracking-wider">
                        {story.genre}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-2 line-clamp-1 group-hover:text-violet-400 transition-colors">{story.title}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {story.views || 0}
                      </span>
                      <span>{new Date(story.updatedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center text-violet-400 mb-4">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 17.477 16.5 17.477 14.754 17.477 13.168 18.477 12 19.253" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Bạn chưa viết truyện nào</h3>
                <p className="text-gray-400 max-w-sm mb-8 italic">
                  Hãy bắt đầu hành trình sáng tạo của mình ngay để dệt nên những câu chuyện kỳ diệu.
                </p>
                <Link to="/studio/create" className="px-8 py-3 bg-gradient-to-r from-violet-600 to-pink-600 rounded-xl font-bold text-white shadow-lg shadow-violet-600/20 hover:scale-105 transition-all">
                  Viết truyện mới
                </Link>
              </div>
            )
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500">
              Tủ sách hiện đang được đồng bộ hóa từ đám mây...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
