import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, X, FastForward } from 'lucide-react';
import { ApiService } from '../../../services/api';

interface AudioPlayerProps {
  content: string;
  chapterTitle: string;
  onNextChapter: () => void;
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ content, chapterTitle, onNextChapter, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const chunksRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const isPausedRef = useRef(isPaused);
  const autoPlayNextRef = useRef(false);

  useEffect(() => {
     isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    // Stop current audio if playing
    if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.src = "";
    }
    
    // Nếu không phải là chuyển chương tự động thì ta reset trạng thái
    if (!autoPlayNextRef.current) {
       setIsPlaying(false);
       setIsPaused(false);
    }
    currentIndexRef.current = 0;

    if (content) {
        // Chunking strategy for Google TTS limit (~180-200 chars)
        const rawChunks = content.split(/(?<=[.!?\n]+)/); // Split after punctuation
        const safeChunks: string[] = [];
        let current = '';
        for (const chunk of rawChunks) {
           const trimmed = chunk.trim();
           if (!trimmed) continue;
           
           if (current.length + trimmed.length > 180) {
              if (current) safeChunks.push(current);
              // if a single giant sentence is > 180 chars, split it roughly by commas or spaces
              if (trimmed.length > 180) {
                 const words = trimmed.split(' ');
                 let subCurrent = '';
                 for (const word of words) {
                    if (subCurrent.length + word.length > 180) {
                       safeChunks.push(subCurrent);
                       subCurrent = word + ' ';
                    } else {
                       subCurrent += word + ' ';
                    }
                 }
                 current = subCurrent.trim();
              } else {
                 current = trimmed;
              }
           } else {
              current += (current ? ' ' : '') + trimmed;
           }
        }
        if (current) safeChunks.push(current.trim());
        chunksRef.current = safeChunks;
    } else {
        chunksRef.current = [];
    }

    // Nếu vừa mới tự động chuyển trang, ta tiếp tục đọc ngay lập tức!
    if (autoPlayNextRef.current && chunksRef.current.length > 0) {
        autoPlayNextRef.current = false;
        // Đợi 1 chút để màn hình cuộn xuống xong rồi mới đọc
        setTimeout(() => speakChunk(0), 1000);
    }

    return () => {
       if (currentAudioRef.current) {
          currentAudioRef.current.pause();
          currentAudioRef.current.removeAttribute('src');
       }
    };
  }, [content]);

  const speakChunk = (index: number) => {
    if (index >= chunksRef.current.length) {
      // Đánh dấu để chương sau tự động phát
      autoPlayNextRef.current = true;
      onNextChapter();
      return;
    }

    const text = chunksRef.current[index];
    // Sử dụng proxy từ backend để tránh lỗi CORS/Referer
    const url = ApiService.getTtsUrl(text);
    
    if (currentAudioRef.current) {
        currentAudioRef.current.pause();
    }

    const audio = new Audio(url);
    audio.playbackRate = rate;
    audio.onended = () => {
       currentIndexRef.current = index + 1;
       if (!isPausedRef.current) {
           speakChunk(currentIndexRef.current);
       }
    };
    audio.onerror = () => {
       console.warn("TTS Fetch Error, skipping chunk");
       currentIndexRef.current = index + 1;
       if (!isPausedRef.current) {
           speakChunk(currentIndexRef.current);
       }
    };

    currentAudioRef.current = audio;
    audio.play().catch(e => {
        console.warn("Play interrupted", e);
    });
  };

  const handlePlay = () => {
    if (isPaused && currentAudioRef.current) {
      currentAudioRef.current.play();
      setIsPaused(false);
      setIsPlaying(true);
    } else if (!isPlaying) {
      setIsPlaying(true);
      setIsPaused(false);
      speakChunk(currentIndexRef.current);
    }
  };

  const handlePause = () => {
    if (isPlaying && currentAudioRef.current) {
      currentAudioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (currentAudioRef.current) {
       currentAudioRef.current.pause();
       currentAudioRef.current.currentTime = 0;
    }
    autoPlayNextRef.current = false;
    setIsPlaying(false);
    setIsPaused(false);
    currentIndexRef.current = 0;
  };

  const changeRate = () => {
    const nextRate = rate >= 2 ? 0.75 : rate === 0.75 ? 1 : rate + 0.25;
    setRate(nextRate);
    if (currentAudioRef.current) {
        currentAudioRef.current.playbackRate = nextRate;
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-bottom flex items-center gap-4 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 rounded-3xl shadow-2xl shadow-violet-500/20">
      <div className="hidden sm:flex flex-col justify-center w-32 md:w-48 overflow-hidden pr-4 border-r border-slate-700">
        <p className="text-white text-sm font-bold truncate">{chapterTitle || 'Sách nói'}</p>
        <p className="text-violet-400 text-xs font-medium uppercase tracking-widest truncate">{isPlaying ? 'Đang phát...' : isPaused ? 'Tạm dừng' : 'Sẵn sàng'}</p>
      </div>
      
      <div className="flex items-center gap-2">
        {!isPlaying ? (
          <button onClick={handlePlay} className="p-3 bg-violet-600 text-white rounded-full hover:bg-violet-500 transition-all shadow-lg">
            <Play size={20} fill="currentColor" className="ml-1" />
          </button>
        ) : (
          <button onClick={handlePause} className="p-3 bg-slate-700 text-white rounded-full hover:bg-slate-600 transition-all">
            <Pause size={20} fill="currentColor" />
          </button>
        )}
        
        <button onClick={handleStop} className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all">
          <Square size={18} fill="currentColor" />
        </button>

        <button onClick={changeRate} className="p-2 w-12 text-center text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all ml-2" title="Tốc độ">
          {rate}x
        </button>

        <button onClick={onNextChapter} className="p-2.5 text-slate-400 hover:text-violet-400 hover:bg-violet-400/10 rounded-full transition-all ml-1" title="Chuyển chương tiếp theo">
           <FastForward size={18} />
        </button>
        
        <div className="ml-2 px-3 py-1 bg-violet-500/10 text-violet-300 border border-violet-500/20 text-xs rounded-xl font-medium" title="Cloud TTS Engine">
           Chị Google
        </div>
      </div>

      <div className="pl-4 border-l border-slate-700 flex">
        <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-all rounded-full hover:bg-slate-800">
           <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default AudioPlayer;
