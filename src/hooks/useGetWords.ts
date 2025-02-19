import { useQuery } from "@tanstack/react-query";
import { wordsApi } from "@/services/words";
import { Word } from "@/types/word";

export const useGetWords = () => {
  return useQuery<Word[]>({
    queryKey: ["words"],
    queryFn: wordsApi.getAll,
  });
};
