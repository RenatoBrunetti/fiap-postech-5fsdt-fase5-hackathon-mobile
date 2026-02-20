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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { schoolService } from "@/services/school.service";

export default function CreateSchool() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    document: "",
  });

  const initialState = {
    name: "",
    document: "",
  };

  useFocusEffect(
    useCallback(() => {
      setForm(initialState);
    }, []),
  );

  const handleSave = async () => {
    // Basic validation
    if (!form.name.trim() || !form.document.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    // Opcional: Validar tamanho do CNPJ aqui se desejar
    if (form.document.length < 11) {
      Alert.alert("Erro", "O documento informado é inválido.");
      return;
    }

    try {
      setLoading(true);
      await schoolService.create(form);

      Alert.alert("Sucesso", "Instituição cadastrada com sucesso!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Não foi possível cadastrar a escola.";
      Alert.alert("Erro no cadastro", message);
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
        <Text style={styles.headerTitle}>Nova Escola</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.illustrationBox}>
          <Ionicons name="business" size={48} color="#007AFF" />
          <Text style={styles.instruction}>
            Insira os dados da nova unidade de ensino.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nome da Escola</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Colégio Anglo Americano"
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
            autoFocus
          />

          <Text style={styles.label}>Documento (CNPJ)</Text>
          <TextInput
            style={styles.input}
            placeholder="Apenas números"
            value={form.document}
            onChangeText={(text) =>
              setForm({ ...form, document: text.replace(/[^0-9]/g, "") })
            }
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabledButton]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveButtonText}>Cadastrar Instituição</Text>
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
  illustrationBox: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 10,
  },
  instruction: {
    fontSize: 16,
    color: "#667085",
    textAlign: "center",
    marginTop: 12,
  },
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
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  disabledButton: { backgroundColor: "#B2D7FF" },
});
