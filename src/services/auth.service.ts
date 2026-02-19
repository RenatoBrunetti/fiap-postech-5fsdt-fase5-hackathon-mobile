import { api } from "@/api/client";
import { Auth } from "@/types/auth";

export const authService = {
  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<Auth> {
    const response = await api.post<Auth>("/auth/login", { email, password });
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<Auth> {
    const response = await api.post<Auth>("/auth/refresh", { refreshToken });
    return response.data;
  },
};
