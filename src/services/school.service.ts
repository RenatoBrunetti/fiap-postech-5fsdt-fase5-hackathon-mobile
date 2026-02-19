import { api } from "@/api/client";
import { School } from "@/types/school";

export const schoolService = {
  async getAll(): Promise<School[]> {
    const response = await api.get<School[]>("/schools");
    return response.data;
  },

  async getById(id: string): Promise<School> {
    const response = await api.get<School>(`/schools/${id}`);
    return response.data;
  },

  async deleteById(id: string): Promise<void> {
    await api.delete(`/schools/${id}`);
  },

  async create(data: { name: string; document: string }): Promise<School> {
    const response = await api.post<School>("/schools", data);
    return response.data;
  },
};
