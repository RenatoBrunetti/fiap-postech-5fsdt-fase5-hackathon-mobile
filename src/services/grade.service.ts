import { api } from "@/api/client";
import { Grade } from "@/types/grade";

export const gradeService = {
  async getAll(): Promise<Grade[]> {
    const response = await api.get<Grade[]>("/grades");
    return response.data;
  },
};
