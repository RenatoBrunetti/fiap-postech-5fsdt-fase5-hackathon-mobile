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

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request Interceptor: Injects the Token
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handles 401 (Expired Token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // If a refresh is already in progress, queue this request
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const currentRefreshToken = await storage.getRefreshToken();

      if (!currentRefreshToken) throw new Error("No refresh token");

      // IMPORTANT: Use raw axios here to avoid the interceptors from the 'api' instance
      const response = await axios.post(`${baseURL}/auth/refresh`, {
        refreshToken: currentRefreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      await storage.saveToken(accessToken);
      await storage.saveRefreshToken(newRefreshToken);

      // Update the main instance for subsequent calls
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      processQueue(null, accessToken);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await storage.removeToken();
      await storage.removeRefreshToken();

      // Here you could redirect or force a logout
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
