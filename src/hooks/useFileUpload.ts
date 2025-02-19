import { useMutation } from "@tanstack/react-query";
import { fileApi } from "@/services/file";

export const useFileUpload = () => {
  return useMutation({
    mutationFn: async ({
      file,
      filename,
    }: {
      file: File;
      filename: string;
    }) => {
      return fileApi.upload(file, filename);
    },
  });
};
