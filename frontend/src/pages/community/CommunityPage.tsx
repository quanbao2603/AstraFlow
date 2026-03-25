import { PenTool } from 'lucide-react';
import CommunityNav from '../../features/community/components/CommunityNav';
import CommunityTrending from '../../features/community/components/CommunityTrending';
import PostCard from '../../features/community/components/PostCard';
import type { Post } from '../../features/community/types/community';

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    title: 'Cách mình tạo Prompt cho nhân vật dạo gần đây!',
    content: 'Mình vừa khám phá ra công thức tạo chuỗi Prompt cực đẹp cho thể loại Dark Fantasy trên AstraFlow. Đầu tiên các bạn chia nhỏ...',
    author: { id: 'u1', name: 'ZodiacWriter', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop' },
    tags: ['prompt_tips', 'dark_fantasy'],
    likes: 89, comments: 24, createdAt: '2 giờ trước'
  },
  {
    id: 'p2',
    title: 'Tìm cộng sự viết chung truyện Sci-Fi dài tập 🚀',
    content: 'Mình đang có Idea về một thế giới đa tầng nơi Robot nắm quyền kiểm soát. Cần một bạn phụ trách về lore building. Inbox mình nhen!',
    author: { id: 'u2', name: 'NovaSync', role: 'admin' },
    tags: ['tim_team', 'sci_fi'],
    likes: 54, comments: 18, createdAt: '5 giờ trước'
  },
  {
    id: 'p3',
    title: 'Liệu AI có thay thế được cốt truyện lãng mạn?',
    content: 'Chiều nay mình test thử module Romance thấy cảm xúc viết ra khá mượt, nhưng hình như vẫn thiếu chút "độc bản". Mọi người nghĩ sao?',
    author: { id: 'u3', name: 'Aesthetic.Vibe' },
    tags: ['thao_luan', 'romance_ai'],
    likes: 112, comments: 45, createdAt: 'Hôm qua',
    image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=500&auto=format&fit=crop'
  }
];

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

          {/* Post Lists */}
          <div className="flex flex-col gap-4">
            {MOCK_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full md:w-auto md:flex-none">
          <CommunityTrending />
        </div>
      </div>
    </div>
  );
}
