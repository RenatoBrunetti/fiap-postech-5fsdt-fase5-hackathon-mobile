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
      {/* 1. HOME TAB */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* 2. PROFILE TAB (Reusing the dynamic screen) */}
      <Tabs.Screen
        name="admin/users/[id]"
        options={{
          title: "Perfil",
          // Trick: Force the link to the logged-in user's ID
          href: user ? `/admin/users/${user.id}` : null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />

      {/* 3. LOGOUT TAB (Action button only) */}
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

      {/* Hide the entire schools folder */}
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

      {/* Hide user creation (other than profile) */}
      <Tabs.Screen name="admin/users/create" options={{ href: null }} />
    </Tabs>
  );
}
