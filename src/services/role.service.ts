import { api } from "@/api/client";
import { Role } from "@/types/role";

export const roleService = {
  async getAll(): Promise<Role[]> {
    const response = await api.get<Role[]>("/roles");
    return response.data;
  },
};
