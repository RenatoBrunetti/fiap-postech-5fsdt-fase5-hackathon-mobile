import { api } from "@/api/client";
import { ClassUser } from "@/types/classUser";

export const classUserService = {
  async getAllByUser(userId: string): Promise<ClassUser[]> {
    const response = await api.get<ClassUser[]>(`classUsers/user/${userId}`);
    return response.data;
  },

  async unassign(data: {
    classId: string;
    userId: string;
    endDate: string;
  }): Promise<void> {
    await api.post(`classUsers/unassign`, data);
  },

  async assign(data: {
    classId: string;
    userId: string;
    startDate: string;
  }): Promise<void> {
    await api.post(`classUsers/assign`, data);
  },
};
