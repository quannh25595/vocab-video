import { useState, useEffect, useRef } from "react";
import { Word } from "@/types/word";

export function useWordPlayer({
  words,
  wordRepeat,
  delayBetweenWords,
  enabled,
}: {
  words: Word[];
  wordRepeat: number;
  delayBetweenWords: number;
  enabled: boolean;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    if (!currentWord || !enabled) return;

    const audio = new Audio(currentWord.audioUrl);
    audioRef.current = audio;

    const handleAudioEnd = () => {
      const shouldRepeat = playCount < wordRepeat - 1;
      timeoutRef.current = setTimeout(
        () => {
          if (shouldRepeat) {
            setPlayCount((prev) => prev + 1);
          } else {
            setPlayCount(0);
            setCurrentIndex((prev) => prev + 1);
          }
        },
        shouldRepeat ? 2000 : delayBetweenWords
      );
    };

    audio.addEventListener("ended", handleAudioEnd);
    audio.play();

    return () => {
      audio.removeEventListener("ended", handleAudioEnd);
      audio.pause();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    currentWord,
    currentIndex,
    wordRepeat,
    delayBetweenWords,
    words.length,
    playCount,
    enabled,
  ]);

  return { currentWord, progress: playCount / wordRepeat };
}
