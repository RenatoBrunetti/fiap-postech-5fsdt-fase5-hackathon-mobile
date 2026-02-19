import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useAuth } from "@/contexts/AuthContext";
import AdminPanel from "@/components/home/AdminPanel";
import FeedbackList from "@/components/home/FeedbackList";
import role from "@/utils/role";

export default function Home() {
  const router = useRouter();

  const { user, signOut } = useAuth();
  const [userRoleName, setUserRoleName] = useState("");
  const [loading, setLoading] = useState(true);

  // Carrega sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      if (user) {
        const roleName = role.formatRoleName(user.roleName);
        setUserRoleName(roleName);
        setLoading(false);
      }
    }, [user]),
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.welcome}>
          Olá,{"\n"}
          {user?.name}!
        </Text>
        <Text style={styles.roleTag}>{userRoleName}</Text>
      </View>

      {user?.roleName !== "Admin" && (
        <FeedbackList
          user={user}
          router={router}
          setLoading={setLoading}
          userRoleName={user?.roleName || "Student"}
        />
      )}

      {user?.roleName === "Admin" && <AdminPanel router={router} />}

      {/* <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
        <Text style={styles.logoutText}>Sair do App</Text>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 32,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    borderColor: "#E1E7EF",
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  welcome: { fontSize: 28, fontWeight: "bold", color: "#1A1C1E" },
  roleTag: {
    alignSelf: "flex-start",
    backgroundColor: "#E1E7EF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: "bold",
    color: "#475467",
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: "#FEF3F2",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#FABCB8",
    borderWidth: 1,
  },
  logoutText: { color: "#B42318", fontWeight: "bold" },
});
