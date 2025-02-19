export interface Word {
  id: string;
  word: string;
  meaning: string;
  ipa: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: Date;
}

export type CreateWordDTO = Omit<Word, "id" | "createdAt">;
