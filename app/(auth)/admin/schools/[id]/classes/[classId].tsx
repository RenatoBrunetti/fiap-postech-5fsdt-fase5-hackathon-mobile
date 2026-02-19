import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { classService } from "@/services/class.service";
import { classUserService } from "@/services/classUser.service";
import { User } from "@/types/user";
import { userService } from "@/services/user.service";

export default function ClassManagement() {
  const { id: schoolId, classId } = useLocalSearchParams<{
    id: string;
    classId: string;
  }>();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"students" | "teachers">(
    "students",
  );
  const [classData, setClassData] = useState<any>(null);
  const [students, setStudents] = useState<User[]>([]);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClassDetails = async () => {
    try {
      setLoading(true);
      const classData = await classService.getById(classId);
      setClassData(classData);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os detalhes da turma.");
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      const studentsData = await userService.getStudentsByClass(classId);
      setStudents(studentsData);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar os alunos vinculados.");
    } finally {
      setLoading(false);
    }
  };

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const teachersData = await userService.getTeachersByClass(classId);
      setTeachers(teachersData);
    } catch (error) {
      Alert.alert(
        "Erro",
        "Não foi possível carregar os professores vinculados.",
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadClassDetails();
      loadStudents();
      loadTeachers();
    }, [classId]),
  );

  const handleUnlink = async (userId: string) => {
    const typeLabel = activeTab === "students" ? "aluno" : "professor";

    Alert.alert(
      "Remover Vínculo",
      `Tem certeza que deseja remover este ${typeLabel} desta turma?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              // Chamada ao serviço para desvincular
              await classUserService.unassign({
                classId,
                userId,
                endDate: new Date().toISOString(),
              });

              router.back();

              Alert.alert("Sucesso", "Vínculo removido com sucesso.");
            } catch (error: any) {
              console.error(error);
              Alert.alert("Erro", "Não foi possível remover o vínculo.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* Header com infos da Turma */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.className}>
            {classData?.name || "Carregando..."}
          </Text>
          <Text style={styles.classSub}>{classData?.year}</Text>
        </View>
      </View>

      {/* Seletor de Abas (Tabs) */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "students" && styles.activeTab]}
          onPress={() => setActiveTab("students")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "students" && styles.activeTabText,
            ]}
          >
            Alunos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "teachers" && styles.activeTab]}
          onPress={() => setActiveTab("teachers")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "teachers" && styles.activeTabText,
            ]}
          >
            Professores
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo da Aba */}
      <FlatList
        data={activeTab === "students" ? students : teachers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Nenhum {activeTab === "students" ? "aluno" : "professor"}{" "}
              vinculado.
            </Text>
            <TouchableOpacity
              style={styles.addInlineBtn}
              onPress={() => {
                // Navegação para a tela de busca e vínculo
                router.push(
                  `/admin/schools/${schoolId}/classes/${classId}/link?type=${activeTab}`,
                );
              }}
            >
              <Text style={styles.addInlineBtnText}>Vincular Agora</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemEmail}>{item.email}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => handleUnlink(item.id)}>
              <Ionicons name="close-circle" size={22} color="#F04438" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Botão Flutuante de Adição */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          router.push(
            `/admin/schools/${schoolId}/classes/${classId}/link?type=${activeTab}`,
          )
        }
      >
        <Ionicons name="person-add" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF",
  },
  headerInfo: { marginLeft: 16 },
  className: { fontSize: 20, fontWeight: "bold", color: "#1A1C1E" },
  classSub: { fontSize: 14, color: "#667085" },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  tab: { flex: 1, paddingVertical: 15, alignItems: "center" },
  activeTab: { borderBottomWidth: 2, borderBottomColor: "#007AFF" },
  tabText: { fontSize: 16, color: "#667085", fontWeight: "600" },
  activeTabText: { color: "#007AFF" },
  list: { padding: 20, paddingBottom: 100 },
  itemCard: {
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E1E7EF",
  },
  itemInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#007AFF", fontWeight: "bold" },
  itemName: { fontSize: 15, fontWeight: "bold", color: "#1A1C1E" },
  itemEmail: { fontSize: 12, color: "#667085" },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyText: { color: "#98A2B3", marginBottom: 15 },
  addInlineBtn: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  addInlineBtnText: { color: "#007AFF", fontWeight: "bold" },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#007AFF",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
