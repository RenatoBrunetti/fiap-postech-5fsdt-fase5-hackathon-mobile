import { api } from "@/api/client";
import { Class } from "@/types/class";

export const classService = {
  async getById(id: string): Promise<Class> {
    const response = await api.get<Class>(`/classes/${id}`);
    return response.data;
  },

  async getAllByUser(userId: string): Promise<Class[]> {
    const response = await api.get<Class[]>(`classes/user/${userId}`);
    return response.data;
  },

  async getBySchoolId(schoolId: string): Promise<Class[]> {
    const response = await api.get<Class[]>(`/classes/school/${schoolId}`);
    return response.data;
  },

  async create(data: {
    name: string;
    year: number;
    schoolId: string;
    gradeId: string;
  }): Promise<Class> {
    const response = await api.post<Class>("/classes", data);
    return response.data;
  },
};
