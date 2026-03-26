import { useState } from 'react';
import ExploreHeader from '../../features/explore/components/ExploreHeader';
import ExploreCategories from '../../features/explore/components/ExploreCategories';
import StoryCard from '../../features/explore/components/StoryCard';
import type { Story } from '../../features/explore/types/explore';
import { BookOpen, PenTool } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_STORIES: Story[] = [];

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStories = MOCK_STORIES.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (story.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    
    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'trending') return !!story.isFeatured;
    if (activeTab === 'liked') return (story.likes ?? 0) > 800; 
    return true; 
  });

  return (
    <div className="container mx-auto px-4 max-w-6xl animate-in fade-in duration-500 pb-20">
      <ExploreHeader onSearch={setSearchQuery} />
      
      <ExploreCategories activeTab={activeTab} onTabChange={setActiveTab} />

      {filteredStories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 flex flex-col items-center justify-center border border-slate-800/50 rounded-3xl bg-slate-900/40 backdrop-blur-md max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Chưa có tác phẩm nào</h3>
          <p className="text-slate-400 text-sm max-w-sm mb-6">
            Không gian lưu trữ đang đợi những câu chuyện vĩ đại đầu tiên. Hãy bắt đầu hành trình sáng tác cùng AI ngay hôm nay!
          </p>
          <Link 
            to="/studio/create" 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-violet-500/20 hover:scale-105"
          >
            <PenTool size={16} />
            Sáng tác Ngay
          </Link>
        </div>
      )}
    </div>
  );
}
