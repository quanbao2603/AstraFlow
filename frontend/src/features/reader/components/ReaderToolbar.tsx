import React from 'react';
import { Settings, ChevronLeft, ChevronRight, List } from 'lucide-react';

interface ReaderToolbarProps {
  onPrev: () => void;
  onNext: () => void;
  onOpenSettings: () => void;
  onOpenChapters: () => void;
  title: string;
  hasPrev: boolean;
  hasNext: boolean;
}

const ReaderToolbar: React.FC<ReaderToolbarProps> = ({ 
  onPrev, onNext, onOpenSettings, onOpenChapters, title, hasPrev, hasNext 
}) => {
  return (
    <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl mb-6 sticky top-4 z-10 shadow-lg">
      <div className="flex items-center gap-3">
        <button 
          onClick={onOpenChapters}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
          <List size={20} />
        </button>
        <h1 className="text-sm md:text-base font-semibold text-slate-200 truncate max-w-[150px] md:max-w-md">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-800 rounded-xl p-1">
          <button 
            disabled={!hasPrev}
            onClick={onPrev}
            className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="w-px h-4 bg-slate-700 mx-1" />
          <button 
            disabled={!hasNext}
            onClick={onNext}
            className="p-2 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <button 
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
          <Settings size={20} />
        </button>
      </div>
    </div>
  );
};

export default ReaderToolbar;
