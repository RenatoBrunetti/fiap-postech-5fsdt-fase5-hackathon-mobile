import axios from "axios";

import storage from "@/utils/storage";

const baseURL = process.env.EXPO_PUBLIC_API_URL as string;

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de Requisição: Injeta o Token
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor de Resposta: Lida com 401 (Token Expirado)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Não fazer refresh se for a própria rota de login ou refresh
    if (
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    // Se erro for 401 e não for uma tentativa de renovação infinita
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 1. Tenta renovar o token (ajuste o endpoint conforme seu backend)
        // Normalmente enviamos o token antigo ou um refresh_token salvo
        const currentRefreshToken = await storage.getRefreshToken();
        if (!currentRefreshToken) {
          await storage.removeToken();
          await storage.removeRefreshToken();
          // Em vez de throw, apenas rejeite para o AuthContext lidar
          return Promise.reject(error);
        }

        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken: currentRefreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // 2. Salva o novo token
        await storage.saveToken(accessToken);
        await storage.saveRefreshToken(newRefreshToken);

        // 3. Atualiza o header da requisição que falhou e tenta de novo
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Se o refresh falhar, aí sim deslogamos
        await storage.removeToken();
        await storage.removeRefreshToken();
        // Você pode emitir um evento ou o AuthContext notará a falta do token
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
