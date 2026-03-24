import { useState, useEffect } from 'react';

interface TypewriterProps {
  /** The text to type out */
  text: string;
  /** Typing speed in milliseconds per character */
  speed?: number;
  /** Optional class name to apply to the wrapper */
  className?: string;
  /** Optional delay before typing starts in ms */
  delay?: number;
  /** Whether to loop the animation continuously */
  loop?: boolean;
  /** How long to wait before restarting the loop in ms */
  loopDelay?: number;
  /** Optional word to highlight */
  highlightWord?: string;
  /** Optional class name for the highlighted word */
  highlightClassName?: string;
}

export default function Typewriter({ 
  text, 
  speed = 100, 
  className = '', 
  delay = 0,
  loop = false,
  loopDelay = 3000,
  highlightWord,
  highlightClassName = ''
}: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  // Handle initial delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStarted(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  // Handle typing effect
  useEffect(() => {
    if (!isStarted) return;
    
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      
      return () => clearTimeout(timeout);
    } else if (loop) {
      const timeout = setTimeout(() => {
        setDisplayedText('');
        setCurrentIndex(0);
      }, loopDelay);
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, isStarted, loop, loopDelay]);

  const renderText = () => {
    if (!highlightWord) return displayedText;
    
    const highlightStartIndex = text.indexOf(highlightWord);
    if (highlightStartIndex === -1) return displayedText;
    
    if (displayedText.length <= highlightStartIndex) {
      return displayedText;
    }
    
    const normalPart = displayedText.substring(0, highlightStartIndex);
    const highlightedPart = displayedText.substring(highlightStartIndex);
    
    return (
      <>
        {normalPart}
        <span className={highlightClassName}>{highlightedPart}</span>
      </>
    );
  };

  return (
    <span className={`inline-block ${className}`}>
      {renderText()}
    </span>
  );
}
