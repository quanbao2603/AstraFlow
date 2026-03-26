import React from 'react';

interface ReadingViewProps {
  content: string;
  fontSize: number;
  theme: 'light' | 'dark' | 'sepia';
}

const ReadingView: React.FC<ReadingViewProps> = ({ content, fontSize, theme }) => {
  const themes = {
    light: 'bg-white text-slate-900',
    dark: 'bg-slate-950 text-slate-200',
    sepia: 'bg-[#f4ecd8] text-[#5b4636]'
  };

  return (
    <div className={`min-h-[70vh] rounded-3xl p-8 md:p-12 shadow-2xl transition-colors duration-500 ${themes[theme]}`}>
      <div 
        className="max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap font-serif selection:bg-violet-500/30"
        style={{ fontSize: `${fontSize}px` }}
      >
        {content || (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <p className="italic">Chưa có nội dung cho chương này...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingView;
