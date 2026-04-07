import React from 'react';

interface ReadingViewProps {
  content: string;
  fontSize: number;
  theme: 'light' | 'dark' | 'sepia';
}

const ReadingView: React.FC<ReadingViewProps> = ({ content, fontSize, theme }) => {
  const containerThemes = {
    light: 'text-slate-900',
    dark: 'text-slate-200',
    sepia: 'text-[#5b4636]'
  };

  return (
    <div className={`transition-colors duration-500 ${containerThemes[theme]}`}>
      <div 
        className="max-w-2xl mx-auto leading-[2.2] whitespace-pre-wrap font-sans text-justify selection:bg-violet-500/30"
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
