import React, { useState, useEffect } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/user.service";
import { roleService } from "@/services/role.service";

export default function CreateUser() {
  const { user } = useAuth();
  const router = useRouter();
  // Get the schoolId, classId, and role (friendly string) from the URL
  const {
    schoolId,
    classId,
    role: roleType,
  } = useLocalSearchParams<{
    schoolId: string;
    classId: string;
    role: string;
  }>();

  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    document: "",
    roleId: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    async function loadRoles() {
      try {
        const data = await roleService.getAll();
        setRoles(data);
        // Find the roleId that matches the given type (Student or Teacher)
        const targetRole = data.find((r: any) => r.name === roleType);
        if (targetRole) setForm((prev) => ({ ...prev, roleId: targetRole.id }));
      } catch (e) {
        console.error("Erro ao carregar roles", e);
      }
    }
    loadRoles();
  }, [roleType]);

  const handleSave = async () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim() ||
      !form.document.trim()
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);
      if (!user) throw new Error("Usuário não autenticado");
      const payload = {
        ...form,
        roleId: roles.find((r) => r.name === roleType)?.id,
        schoolId,
        classId,
      };

      // Smart route for creating and assigning user
      await userService.createAndAssign(payload);

      setForm({
        ...initialFormState,
        roleId: roles.find((r) => r.name === roleType)?.id || "",
      });
      setShowPassword(false);
      setShowConfirmPassword(false);

      Alert.alert("Sucesso", "Usuário criado com sucesso!", [
        {
          text: "OK",
          onPress: () =>
            classId
              ? router.replace(`/admin/schools/${schoolId}/classes/${classId}`)
              : router.replace(`/admin/schools/${schoolId}/teachers`),
        },
      ]);
    } catch (error: any) {
      const msg = error.response?.data?.message || "Erro ao criar usuário.";
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  const initialFormState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    document: "",
    roleId: "",
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Novo {roleType === "Student" ? "Aluno" : "Professor"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
            placeholder="Renato Brunetti"
          />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            value={form.email}
            onChangeText={(t) => setForm({ ...form, email: t })}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="renato.brunetti@mail.com"
          />

          <Text style={styles.label}>CPF (Apenas números)</Text>
          <TextInput
            style={styles.input}
            value={form.document}
            onChangeText={(t) =>
              setForm({ ...form, document: t.replace(/[^0-9]/g, "") })
            }
            keyboardType="numeric"
            placeholder="87713922032"
          />

          <Text style={styles.label}>Senha</Text>
          <View>
            <TextInput
              style={styles.input}
              value={form.password}
              onChangeText={(t) => setForm({ ...form, password: t })}
              secureTextEntry={!showPassword}
              placeholder="********"
            />
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              style={styles.passwordIcon}
              size={24}
              color={showPassword ? "#007AFF" : "#ddd"}
              onPress={() => setShowPassword(!showPassword)}
            />
          </View>
          <Text style={styles.label}>Confirmar</Text>
          <View>
            <TextInput
              style={styles.input}
              value={form.confirmPassword}
              onChangeText={(t) => setForm({ ...form, confirmPassword: t })}
              secureTextEntry={!showConfirmPassword}
              placeholder="********"
            />
            <Ionicons
              name={showConfirmPassword ? "eye" : "eye-off"}
              style={styles.passwordIcon}
              size={24}
              color={showConfirmPassword ? "#007AFF" : "#ddd"}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, loading && styles.disabled]}
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveText}>
                {classId ? "Cadastrar e Vincular" : "Cadastrar"}
              </Text>
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
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderColor: "#EEE",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  content: { padding: 24 },
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
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  passwordIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
  disabled: { backgroundColor: "#B2D7FF" },
});
