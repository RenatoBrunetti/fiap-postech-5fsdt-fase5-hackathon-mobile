import { api } from "@/api/client";
import { User } from "@/types/user";

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>("/users/me");
    return response.data;
  },
  async searchUsers({
    roleName,
    searchQuery,
  }: {
    roleName: string;
    searchQuery?: string;
  }): Promise<User[]> {
    const response = await api.get<User[]>("/users/search", {
      params: { roleName, searchQuery },
    });
    return response.data;
  },

  async getStudentsByClass(classId: string): Promise<User[]> {
    const response = await api.get<User[]>(`users/students/${classId}`);
    return response.data;
  },

  async getTeachersByClass(classId: string): Promise<User[]> {
    const response = await api.get<User[]>(`users/teachers/${classId}`);
    return response.data;
  },

  async createAndAssign(data: {
    name: string;
    email: string;
    password: string;
    document: string;
    roleId: string;
    classId: string;
  }): Promise<User> {
    const response = await api.post<User>("/users/create-and-assign", data);
    return response.data;
  },
};
