import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import type { Post } from '../types/community';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700/80 transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700">
            {post.author.avatar ? (
              <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-bold text-violet-400 text-sm">{post.author.name[0].toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white hover:underline cursor-pointer">
                {post.author.name}
              </h4>
              {post.author.role === 'admin' && (
                <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-500 font-extrabold px-1.5 py-0.5 rounded">MOD</span>
              )}
            </div>
            <span className="text-xs text-slate-500">{post.createdAt}</span>
          </div>
        </div>
        <button className="text-slate-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="font-bold text-white text-base mb-2 group-hover:text-violet-400 cursor-pointer">
          {post.title}
        </h3>
        <p className="text-sm text-slate-300 line-clamp-3 leading-relaxed mb-3">
          {post.content}
        </p>
        {post.image && (
          <div className="rounded-xl overflow-hidden border border-slate-800 mb-3 max-h-64 bg-slate-800 flex items-center justify-center">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {post.tags.map((tag, idx) => (
            <span key={idx} className="text-xs font-medium text-violet-400 hover:underline cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 pt-3 border-t border-slate-800/40 text-slate-500">
        <button className="flex items-center gap-1.5 hover:text-red-400 transition-colors text-xs font-medium">
          <Heart size={16} />
          <span>{post.likes}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-violet-400 transition-colors text-xs font-medium">
          <MessageCircle size={16} />
          <span>{post.comments}</span>
        </button>
        <button className="flex items-center gap-1.5 ml-auto hover:text-white transition-colors text-xs font-medium">
          <Share2 size={16} />
        </button>
      </div>
    </div>
  );
}
