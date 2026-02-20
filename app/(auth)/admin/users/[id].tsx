import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { userService } from "@/services/user.service";
import { classService } from "@/services/class.service";
import { User } from "@/types/user";
import role from "@/utils/role";

export default function UserProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [user, setUser] = useState<User | any>(null);
  const [userRoleName, setUserRoleName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Safety check: If the ID hasn't arrived from the router yet, do nothing
    if (!id) return;

    async function loadUser() {
      try {
        setLoading(true); // Ensure loading starts when the ID changes
        const userData = await userService.getById(id);

        if (!userData) {
          Alert.alert("Erro", "Usuário não encontrado.");
          router.back();
          return;
        }

        // 2. Try loading the classes, but don't let it break the profile
        let filteredData: any = { ...userData };
        try {
          const classesData = await classService.getAllByUser(userData.id);
          filteredData["classes"] = classesData;
        } catch (e) {
          console.warn("Usuário sem classes ou erro na busca de turmas");
        }

        setUser(filteredData);
        setUserRoleName(userData.role?.name || "");
      } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível carregar os dados.");
        router.back();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const isTeacher = user?.role?.name?.toLowerCase() === "teacher";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Perfil do Usuário</Text>
        {/* <TouchableOpacity
          onPress={() =>
            Alert.alert("Editar", "Funcionalidade de edição em breve.")
          }
        >
          <Text style={styles.editText}>Editar</Text>
        </TouchableOpacity> */}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Main Identity Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarTextLarge}>
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <View
            style={[
              styles.roleBadge,
              { backgroundColor: isTeacher ? "#E0F2FE" : "#ECFDF3" },
            ]}
          >
            <Text
              style={[
                styles.roleText,
                { color: isTeacher ? "#007AFF" : "#027A48" },
              ]}
            >
              {role.formatRoleName(user?.role?.name)}
            </Text>
          </View>
        </View>

        {/* Contact and Document Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color="#667085" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>E-mail</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={20} color="#667085" />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>CPF</Text>
              <Text style={styles.infoValue}>
                {user?.document || "Não informado"}
              </Text>
            </View>
          </View>
        </View>

        {/* Associations (Classes/Schools) */}
        {userRoleName?.toLowerCase() !== "admin" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {isTeacher ? "Turmas que Leciona" : "Turmas Matriculadas"}
            </Text>

            {user?.classes?.length > 0 ? (
              user.classes.map((cls: any) => (
                <TouchableOpacity
                  key={cls.id}
                  style={styles.classItem}
                  onPress={() =>
                    router.push(
                      `/admin/schools/${cls.schoolId}/classes/${cls.id}`,
                    )
                  }
                  disabled={userRoleName?.toLowerCase() === "student"}
                >
                  <View>
                    <Text style={styles.classItemName}>{cls.name}</Text>
                    <Text style={styles.classItemSub}>
                      {cls.school?.name} • {cls.year}
                    </Text>
                  </View>
                  {userRoleName?.toLowerCase() !== "student" && (
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="#D0D5DD"
                    />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>Nenhum vínculo encontrado.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1C1E" },
  backBtn: { padding: 4 },
  editText: { color: "#007AFF", fontWeight: "600", fontSize: 16 },
  content: { paddingBottom: 40 },
  profileCard: {
    backgroundColor: "#FFF",
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F2F4F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarTextLarge: { fontSize: 32, fontWeight: "bold", color: "#475467" },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1C1E",
    marginBottom: 8,
  },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  roleText: { fontSize: 13, fontWeight: "bold" },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#344054",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EAECF0",
  },
  infoTextGroup: { marginLeft: 12 },
  infoLabel: { fontSize: 12, color: "#667085", marginBottom: 2 },
  infoValue: { fontSize: 15, fontWeight: "500", color: "#1A1C1E" },
  classItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EAECF0",
  },
  classItemName: { fontSize: 15, fontWeight: "bold", color: "#1A1C1E" },
  classItemSub: { fontSize: 13, color: "#667085", marginTop: 2 },
  emptyText: { color: "#98A2B3", fontStyle: "italic", marginTop: 4 },
});
