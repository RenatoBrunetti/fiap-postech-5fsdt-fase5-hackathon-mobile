import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { userService } from "@/services/user.service";
import { classUserService } from "@/services/classUser.service";
import { User } from "@/types/user";

export default function LinkUser() {
  const router = useRouter();
  const {
    id: schoolId,
    classId,
    type,
  } = useLocalSearchParams<{ id: string; classId: string; type: string }>();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLinking, setIsLinking] = useState<string | null>(null);

  const roleLabel = type === "students" ? "Aluno" : "Professor";
  const MIN_TYPE_LENGTH = 3;

  useFocusEffect(
    useCallback(() => {
      setQuery("");
    }, []),
  );

  // User search
  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length < MIN_TYPE_LENGTH) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      // Filter by type (student or teacher) and by query
      const users = await userService.searchUsers({
        searchQuery: text,
        roleName: type === "students" ? "Student" : "Teacher",
      });
      setResults(users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLink = async (userId: string) => {
    try {
      setIsLinking(userId);
      await classUserService.assign({
        classId,
        userId,
        startDate: new Date().toISOString(),
      });

      Alert.alert("Sucesso", `${roleLabel} vinculado com sucesso!`, [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao vincular usuário.";
      Alert.alert("Erro", msg);
    } finally {
      setIsLinking(null);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vincular {roleLabel}</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#667085" />
          <TextInput
            style={styles.input}
            placeholder={`Buscar ${roleLabel.toLowerCase()} por nome ou e-mail...`}
            value={query}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum usuário encontrado.</Text>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() =>
                  router.push(
                    `/admin/users/create?role=${type === "students" ? "Student" : "Teacher"}&classId=${classId}`,
                  )
                }
              >
                <Text style={styles.createBtnText}>Criar Novo {roleLabel}</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>
              <View>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.linkBtn}
              onPress={() => handleLink(item.id)}
              disabled={isLinking === item.id}
            >
              {isLinking === item.id ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.linkBtnText}>Vincular</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  searchSection: { padding: 20, backgroundColor: "#F9FAFB" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  input: { flex: 1, fontSize: 16 },
  list: { padding: 20 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F4F7",
  },
  userInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F4F7",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontWeight: "bold", color: "#667085" },
  userName: { fontWeight: "bold", color: "#1A1C1E" },
  userEmail: { fontSize: 12, color: "#667085" },
  linkBtn: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  linkBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 14 },
  emptyContainer: { alignItems: "center", marginTop: 40 },
  emptyText: { color: "#667085", marginBottom: 15 },
  createBtn: { padding: 12, borderRadius: 8, backgroundColor: "#F2F4F7" },
  createBtnText: { color: "#007AFF", fontWeight: "bold" },
});
