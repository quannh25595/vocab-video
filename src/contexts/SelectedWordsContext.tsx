"use client";

import { Word } from "@/types/word";
import { createContext, useContext, useState, ReactNode } from "react";

type SelectedWordsContextType = {
  selectedWords: Word[];
  toggleWordSelection: (word: Word) => void;
  isWordSelected: (wordId: string) => boolean;
};

const SelectedWordsContext = createContext<
  SelectedWordsContextType | undefined
>(undefined);

export function SelectedWordsProvider({ children }: { children: ReactNode }) {
  const [selectedWords, setSelectedWords] = useState<Word[]>([]);

  const toggleWordSelection = (word: Word) => {
    setSelectedWords((prev) =>
      prev.some((w) => w.id === word.id)
        ? prev.filter((w) => w.id !== word.id)
        : [...prev, word]
    );
  };

  const isWordSelected = (wordId: string) => {
    return selectedWords.some((w) => w.id === wordId);
  };

  return (
    <SelectedWordsContext.Provider
      value={{ selectedWords, toggleWordSelection, isWordSelected }}
    >
      {children}
    </SelectedWordsContext.Provider>
  );
}

export const useSelectedWords = () => {
  const context = useContext(SelectedWordsContext);
  if (context === undefined) {
    throw new Error(
      "useSelectedWords must be used within a SelectedWordsProvider"
    );
  }
  return context;
};
