import axiosInstance from "@/utils/axios";
import { CreateWordDTO, Word } from "@/types/word";

export const wordsApi = {
  create: async (data: CreateWordDTO): Promise<Word> => {
    const response = await axiosInstance.post<{ data: Word }>(
      "/api/words",
      data
    );
    return response.data.data;
  },
  getAll: async (): Promise<Word[]> => {
    const response = await axiosInstance.get("/api/words");
    return response.data.data;
  },
};
