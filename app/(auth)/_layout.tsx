import React from "react";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/contexts/AuthContext";

export default function AuthLayout() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    Alert.alert("Sair", "Deseja realmente encerrar sua sessão?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: () => signOut() },
    ]);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#667085",
        tabBarStyle: {
          height: 65 + (insets.bottom > 0 ? insets.bottom : 10),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          borderTopColor: "#E4E4E7",
          borderTopWidth: 1,
        },
      }}
    >
      {/* 1. ABA HOME */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* 2. ABA PERFIL (Reutilizando sua tela dinâmica) */}
      <Tabs.Screen
        name="admin/users/[id]"
        options={{
          title: "Perfil",
          // Truque: Forçamos o link para o ID do usuário logado
          href: user ? `/admin/users/${user.id}` : null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />

      {/* 3. ABA SAIR (Apenas como botão de ação) */}
      <Tabs.Screen
        name="logout"
        options={{
          title: "Sair",
          tabBarIcon: () => (
            <Ionicons name="log-out-outline" size={24} color="#F04438" />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            handleLogout();
          },
        }}
      />

      {/* Esconde a pasta de escolas inteira */}
      <Tabs.Screen name="admin/schools/index" options={{ href: null }} />
      <Tabs.Screen name="admin/schools/create" options={{ href: null }} />
      <Tabs.Screen
        name="admin/schools/[id]/classes/index"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="admin/schools/[id]/classes/create"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="admin/schools/[id]/classes/[classId]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="admin/schools/[id]/classes/[classId]/link"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="admin/schools/[id]/teachers/index"
        options={{ href: null }}
      />
      <Tabs.Screen name="feedback/[id]" options={{ href: null }} />
      <Tabs.Screen name="feedback/create" options={{ href: null }} />

      {/* Esconde a criação de usuário (que não seja o perfil) */}
      <Tabs.Screen name="admin/users/create" options={{ href: null }} />
    </Tabs>
  );
}
