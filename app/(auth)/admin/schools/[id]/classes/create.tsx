import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  FlatList,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { classService } from "@/services/class.service";
import { gradeService } from "@/services/grade.service";
import { Grade } from "@/types/grade";

export default function CreateClass() {
  const router = useRouter();
  const { id: schoolId } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    year: new Date().getFullYear().toString(),
    gradeId: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const gradeData = await gradeService.getAll();
      setGrades(gradeData);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar as séries.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [schoolId]),
  );

  const selectedGradeLabel = grades.find((g) => g.id === form.gradeId)
    ? `${grades.find((g) => g.id === form.gradeId)?.name} - ${grades.find((g) => g.id === form.gradeId)?.category}`
    : "Selecione uma série";

  const handleSave = async () => {
    if (!form.name.trim() || !form.year.trim() || !form.gradeId) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      await classService.create({
        name: form.name,
        year: parseInt(form.year),
        schoolId,
        gradeId: form.gradeId,
      });

      Alert.alert("Sucesso", "Turma criada com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || "Erro ao criar turma.";
      Alert.alert("Erro", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Turma</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.illustrationBox}>
          <View style={styles.iconCircle}>
            <Ionicons name="people" size={32} color="#003166" />
          </View>
          <Text style={styles.instruction}>
            Configure os detalhes da turma.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome da Turma</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 3º Ano A - Matutino"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            autoFocus
          />

          <Text style={styles.label}>Ano Letivo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 2026"
            value={form.year}
            onChangeText={(text) =>
              setForm({ ...form, year: text.replace(/[^0-9]/g, "") })
            }
            keyboardType="numeric"
            maxLength={4}
          />

          <Text style={styles.label}>Série</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowGradeModal(true)}
          >
            <Text
              style={[
                styles.dropdownText,
                !form.gradeId && { color: "#98A2B3" },
              ]}
            >
              {selectedGradeLabel}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#667085" />
          </TouchableOpacity>

          {/* Selection Modal */}
          <Modal
            visible={showGradeModal}
            animationType="slide"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Selecione a Série</Text>
                  <TouchableOpacity onPress={() => setShowGradeModal(false)}>
                    <Ionicons name="close" size={24} color="#1A1C1E" />
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={grades}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.gradeItem}
                      onPress={() => {
                        setForm({ ...form, gradeId: item.id });
                        setShowGradeModal(false);
                      }}
                    >
                      <View>
                        <Text style={styles.gradeName}>{item.name}</Text>
                        <Text style={styles.gradeCategory}>
                          {item.category}
                        </Text>
                      </View>
                      {form.gradeId === item.id && (
                        <Ionicons name="checkmark" size={20} color="#003166" />
                      )}
                    </TouchableOpacity>
                  )}
                  ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                  )}
                />
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Criar Turma</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1A1C1E" },
  backBtn: { padding: 8 },
  content: { padding: 24 },
  illustrationBox: { alignItems: "center", marginBottom: 32 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EAECF0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  instruction: { fontSize: 16, color: "#667085", textAlign: "center" },
  form: { gap: 16 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
    marginBottom: -8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#1A1C1E",
  },
  saveButton: {
    backgroundColor: "#003166",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  disabledButton: { backgroundColor: "#B2D7FF" },
  dropdownButton: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#1A1C1E",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "70%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1C1E",
  },
  gradeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  gradeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1C1E",
  },
  gradeCategory: {
    fontSize: 13,
    color: "#667085",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#F2F4F7",
  },
});
