import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useAuth } from "@/contexts/AuthContext";
import { classUserService } from "@/services/classUser.service";
import { feedbackService } from "@/services/feedback.service";

export default function CreateFeedback() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [classes, setClasses] = useState<any[]>([]);
  const [questions, setQuestions] = useState([{ title: "" }]); // Start with one question

  useFocusEffect(
    useCallback(() => {
      setTitle("");
      setSelectedClass("");
      setQuestions([{ title: "" }]);
    }, []),
  );

  // 1. Load the available classes for the teacher
  useEffect(() => {
    async function loadClasses() {
      if (!user) return;
      const classUsers = await classUserService.getAllByUser(user.id);
      const mappedClasses = classUsers.map((classUser) => classUser.class);
      setClasses(mappedClasses);
    }
    loadClasses();
  }, []);

  const addQuestion = () => setQuestions([...questions, { title: "" }]);

  const updateQuestion = (index: number, text: string) => {
    const newQuestions = [...questions];
    newQuestions[index].title = text;
    setQuestions(newQuestions);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleCreate = async () => {
    if (
      !title ||
      !selectedClass ||
      questions.some((q) => !q.title) ||
      user === null
    ) {
      Alert.alert("Erro", "Preencha todos os campos e perguntas.");
      return;
    }

    try {
      await feedbackService.createFeedbackAndQuestions({
        title,
        classId: selectedClass,
        userId: user!.id,
        questions: questions.map((q, index) => ({
          title: q.title,
          order: index + 1,
        })),
      });

      Alert.alert("Sucesso", "Feedback criado com sucesso!");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar feedback.");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Ionicons name="close" size={24} onPress={() => router.back()} />
        <Text style={styles.headerTitle}>Novo Feedback</Text>
        <TouchableOpacity onPress={handleCreate}>
          <Text style={styles.saveText}>Criar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Título da Avaliação</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Avaliação da Aula de Node.js"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Selecione a Turma</Text>
        <View style={styles.classPicker}>
          {classes.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.classOption,
                selectedClass === c.id && styles.classOptionActive,
              ]}
              onPress={() => setSelectedClass(c.id)}
            >
              <Text style={selectedClass === c.id ? styles.whiteText : {}}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>Perguntas</Text>
        {questions.map((q, index) => (
          <View key={index} style={styles.questionRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder={`Pergunta ${index + 1}`}
              value={q.title}
              onChangeText={(text) => updateQuestion(index, text)}
            />
            <TouchableOpacity
              onPress={() => removeQuestion(index)}
              style={styles.removeBtn}
            >
              <Ionicons name="trash-outline" size={20} color="#F04438" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addBtn} onPress={addQuestion}>
          <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.addBtnText}>Adicionar Pergunta</Text>
        </TouchableOpacity>
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
  saveText: { color: "#007AFF", fontWeight: "bold", fontSize: 16 },
  content: { padding: 20 },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  classPicker: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  classOption: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 20,
  },
  classOptionActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  whiteText: { color: "#fff" },
  divider: { height: 1, backgroundColor: "#EEE", marginVertical: 20 },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  removeBtn: { padding: 5 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 },
  addBtnText: { color: "#007AFF", fontWeight: "600" },
});
