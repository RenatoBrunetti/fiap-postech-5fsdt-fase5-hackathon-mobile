import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { userService } from "@/services/user.service";
import { schoolService } from "@/services/school.service";
import { User } from "@/types/user";

export default function SchoolTeachers() {
  const { id: schoolId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [teachers, setTeachers] = useState<User[]>([]);
  const [schoolName, setSchoolName] = useState("");

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const school = await schoolService.getById(schoolId);
      setSchoolName(school.name);

      const data = await userService.getTeachersBySchool(schoolId);
      setTeachers(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar a lista de professores.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTeachers();
    }, [schoolId]),
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Professores</Text>
          <Text style={styles.subtitle}>{schoolName}</Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push(`/admin/users/create?role=Teacher&schoolId=${schoolId}`)
          }
        >
          <Ionicons name="person-add" size={26} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={teachers}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="people-outline" size={48} color="#D0D5DD" />
              <Text style={styles.emptyText}>
                Nenhum professor vinculado a esta escola.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.teacherCard}
              onPress={() => router.push(`/admin/users/${item.id}`)}
            >
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.teacherInfo}>
                <Text style={styles.teacherName}>{item.name}</Text>
                <Text style={styles.teacherEmail}>{item.email}</Text>
                {/* If the backend returns the classes, you can list them here */}
                <View style={styles.tagContainer}>
                  <Text style={styles.roleTag}>Professor</Text>
                </View>
              </View>
              {/* <TouchableOpacity
                onPress={() =>
                  Alert.alert("Info", "Detalhes do professor em breve.")
                }
              > */}
              <Ionicons name="chevron-forward" size={20} color="#D0D5DD" />
              {/* </TouchableOpacity> */}
            </TouchableOpacity>
          )}
        />
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  headerText: { flex: 1, marginLeft: 15 },
  title: { fontSize: 18, fontWeight: "bold", color: "#1A1C1E" },
  subtitle: { fontSize: 13, color: "#667085" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  list: { padding: 20 },
  teacherCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E1E7EF",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E0F2FE",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#007AFF", fontWeight: "bold", fontSize: 18 },
  teacherInfo: { flex: 1, marginLeft: 12 },
  teacherName: { fontSize: 16, fontWeight: "bold", color: "#1A1C1E" },
  teacherEmail: { fontSize: 13, color: "#667085", marginTop: 2 },
  tagContainer: { flexDirection: "row", marginTop: 8 },
  roleTag: {
    backgroundColor: "#F2F4F7",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    fontSize: 11,
    color: "#344054",
    fontWeight: "600",
  },
  empty: { alignItems: "center", marginTop: 60 },
  emptyText: {
    textAlign: "center",
    color: "#98A2B3",
    marginTop: 12,
    fontSize: 14,
  },
});
