import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSegments } from "expo-router";

import { userService } from "@/services/user.service";
import storage from "@/utils/storage";
import { authService } from "@/services/auth.service";

interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const segments = useSegments();

  // 1. Check auth state on route change
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isAtRoot = segments.length < 1 || segments[0] === "index";

    if (user) {
      if (!inAuthGroup) {
        // If logged in and trying to access public route, redirect to home
        router.replace("/home");
      }
    } else {
      // If not logged in and trying to access private route, redirect to login
      if (inAuthGroup || isAtRoot) {
        setTimeout(() => {
          router.replace("/login");
        }, 1);
      }
    }
  }, [user, segments, isLoading]);

  // 2. Try to restore session on app launch
  useEffect(() => {
    async function loadStorageData() {
      const token = await storage.getToken();

      if (token) {
        try {
          const userData = await userService.getMe();
          const normalizedUser = {
            ...userData,
            roleName: userData.role?.name || "Student",
          };
          setUser(normalizedUser);
        } catch (error: any) {
          console.error("Erro ao restaurar sessão:", error);
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            await storage.removeToken();
            await storage.removeRefreshToken();
            setUser(null);
          }
        }
      }

      setTimeout(() => {
        setIsLoading(false);
      }, 4000);
    }
    loadStorageData();
  }, []);

  async function signIn({ email, password }: any) {
    try {
      const {
        accessToken,
        refreshToken,
        user: userData,
      } = await authService.login({ email, password });
      const normalizedUser = {
        ...userData,
        roleName: userData.role?.name || "Student",
      };

      await storage.saveToken(accessToken);
      await storage.saveRefreshToken(refreshToken);

      setUser(normalizedUser);
    } catch (error) {
      // Let the calling component handle the error (e.g., show alert)
      throw error;
    }
  }

  async function signOut() {
    await storage.removeToken();
    await storage.removeRefreshToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
