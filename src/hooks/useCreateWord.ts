import { wordsApi } from "@/services/words";
import { CreateWordDTO } from "@/types/word";
import { useMutation } from "@tanstack/react-query";

export function useCreateWord() {
  return useMutation({
    mutationFn: (data: CreateWordDTO) => wordsApi.create(data),
  });
}
