import React from 'react';
import { Settings, List, ArrowLeft, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ReaderToolbarProps {
  onOpenSettings: () => void;
  onOpenChapters: () => void;
  onToggleAudioMode: () => void;
  isAudioMode: boolean;
  title: string;
}

const ReaderToolbar: React.FC<ReaderToolbarProps> = ({ 
  onOpenSettings, onOpenChapters, onToggleAudioMode, isAudioMode, title
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl mb-6 sticky top-4 z-10 shadow-lg">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/studio/library')}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
          title="Quay lại thư viện"
        >
          <ArrowLeft size={20} />
        </button>
        <button 
          onClick={onOpenChapters}
          className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all md:hidden"
          title="Danh sách chương"
        >
          <List size={20} />
        </button>
        <h1 className="text-sm md:text-base font-semibold text-slate-200 truncate max-w-[150px] md:max-w-md">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={onToggleAudioMode}
          className={`p-2.5 rounded-xl transition-all ${isAudioMode ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'}`}
          title="Sách nói (Audio Book)"
        >
          <Headphones size={20} />
        </button>

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
