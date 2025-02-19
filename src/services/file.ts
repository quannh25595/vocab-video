import axiosInstance from "@/utils/axios";

interface UploadResponse {
  success: boolean;
  path: string;
}

export const fileApi = {
  upload: async (file: File, filename: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("filename", filename);

    const response = await axiosInstance.post<UploadResponse>(
      "/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
