import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { schoolService } from "@/services/school.service";
import { School } from "@/types/school";

export default function SchoolsManagement() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSchools = async () => {
    try {
      const data = await schoolService.getAll();
      setSchools(data);
    } catch (error) {
      console.error("Erro ao carregar escolas", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSchools();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchools();
  };

  const handleDeleteSchool = (id: string) => {
    Alert.alert(
      "Excluir Escola",
      "Tem certeza que deseja remover esta escola? Esta ação excluirá todas as turmas e vínculos vinculados a ela e não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);
              await schoolService.deleteById(id);

              setSchools((prev) => prev.filter((school) => school.id !== id));

              Alert.alert("Sucesso", "Escola removida com sucesso.");
            } catch (error) {
              console.error("Erro ao excluir escola:", error);
              Alert.alert(
                "Erro",
                "Não foi possível excluir a escola. Verifique se existem dependências ativas.",
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Minhas Escolas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/admin/schools/create")}
        >
          <Ionicons name="add-circle" size={24} color="#007AFF" />
          <Text style={{ color: "#007AFF", fontWeight: "600" }}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={schools}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchSchools} />
        }
        renderItem={({ item }) => (
          <View style={styles.schoolCard}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.schoolName}>{item.name}</Text>
                <Text style={styles.schoolDoc}>CNPJ: {item.document}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteSchool(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#F04438" />
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, { borderColor: "#007AFF" }]}
                onPress={() =>
                  router.push(`/admin/schools/${item.id}/teachers`)
                }
              >
                <Ionicons name="people" size={18} color="#007AFF" />
                <Text style={[styles.actionText, { color: "#007AFF" }]}>
                  Professores
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { borderColor: "#003166" }]}
                onPress={() => router.push(`/admin/schools/${item.id}/classes`)}
              >
                <Ionicons name="school" size={18} color="#003166" />
                <Text style={[styles.actionText, { color: "#003166" }]}>
                  Turmas
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F7FA", padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    marginTop: 40,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  schoolCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E1E7EF",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1C1E",
    paddingRight: 6, // Espaço para evitar que o nome encoste no botão de excluir
  },
  schoolDoc: {
    fontSize: 14,
    color: "#667085",
    marginTop: 4,
  },
  deleteButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 0,
  },
  buttonRow: { flexDirection: "row", gap: 12 },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: "#007AFF",
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    // color: "#007AFF",
  },
});
