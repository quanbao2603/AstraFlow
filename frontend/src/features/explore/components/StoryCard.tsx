import { Eye, Heart, Star } from 'lucide-react';
import type { Story } from '../types/explore';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <div className="group bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-1">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-800">
        <img 
          src={story.coverUrl || 'https://via.placeholder.com/300x400/0f172a/1e293b?text=AstraFlow'} 
          alt={story.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {story.isFeatured && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-xs font-bold px-2.5 py-1 rounded-lg">
            💎 Đặc Sắc
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {story.genres.slice(0, 2).map((genre, idx) => (
            <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
              {genre}
            </span>
          ))}
        </div>

        <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors line-clamp-1 mb-1">
          {story.title}
        </h3>
        
        <p className="text-xs text-slate-400 mb-3 flex items-center gap-1.5">
          <span>bởi</span> 
          <span className="font-medium text-slate-300 hover:underline cursor-pointer">{story.author.name}</span>
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-slate-500 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Eye size={14} /> {story.views.toLocaleString()}</span>
            <span className="flex items-center gap-1"><Heart size={14} /> {story.likes.toLocaleString()}</span>
          </div>
          <span className="flex items-center gap-1 text-amber-500 font-semibold"><Star size={14} className="fill-amber-500" /> {story.rating}</span>
        </div>
      </div>
    </div>
  );
}
