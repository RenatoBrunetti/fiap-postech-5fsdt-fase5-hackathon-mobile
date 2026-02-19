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

import { classService } from "@/services/class.service";
import { schoolService } from "@/services/school.service";
import { Class } from "@/types/class";

export default function SchoolClasses() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [schoolName, setSchoolName] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      // Buscamos os dados da escola para exibir o nome no header
      const school = await schoolService.getById(id);
      setSchoolName(school.name);

      // Buscamos as turmas vinculadas a esta escola
      const data = await classService.getBySchoolId(id);
      setClasses(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as turmas.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [id]),
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.title}>Turmas</Text>
          <Text style={styles.subtitle}>{schoolName}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push(`/admin/schools/${id}/classes/create`)}
        >
          <Ionicons name="add-circle" size={30} color="#003166" />
          <Text style={{ color: "#003166", fontWeight: "600" }}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#003166"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={classes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Nenhuma turma cadastrada nesta escola.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.classCard}
              onPress={() =>
                router.push(`/admin/schools/${id}/classes/${item.id}`)
              }
            >
              <View>
                <Text style={styles.className}>{item.name}</Text>
                <Text style={styles.classYear}>Ano Letivo: {item.year}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#D0D5DD" />
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#1A1C1E" },
  subtitle: { fontSize: 13, color: "#667085" },
  list: { padding: 20 },
  classCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E1E7EF",
  },
  className: { fontSize: 16, fontWeight: "bold", color: "#1A1C1E" },
  classYear: { fontSize: 14, color: "#667085", marginTop: 4 },
  empty: { textAlign: "center", marginTop: 40, color: "#98A2B3" },
});
