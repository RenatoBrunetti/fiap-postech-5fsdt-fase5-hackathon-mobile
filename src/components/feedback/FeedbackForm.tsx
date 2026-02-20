import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Router } from "expo-router";

import { EMOJI_MAP } from "@/constants/emojis";
import { answerService } from "@/services/answer.service";
import { Question } from "@/types/question";
import { Feedback } from "@/types/feedback";
import answer from "@/utils/answer";

export default function FeedbackForm({
  feedback,
  answers,
  setAnswers,
  router,
}: {
  feedback: Feedback | null;
  answers: Record<string, any>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  router: Router;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateAnswer = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    // 1. Validation: Check if all questions have been answered
    const totalQuestions = feedback?.questions?.length || 0;
    const answeredQuestions = Object.keys(answers).length;

    if (answeredQuestions < totalQuestions) {
      Alert.alert(
        "Formulário Incompleto",
        "Por favor, responda todas as perguntas antes de enviar.",
      );
      return;
    }

    setIsSubmitting(true);
    try {
      if (feedback) {
        // 2. Transformation: Convert the answers object to the backend format
        const payload = {
          feedbackId: feedback.id,
          questions: Object.entries(answers).map(([questionId, outcome]) => ({
            questionId,
            outcome,
          })),
        };

        // 3. API call
        await answerService.submitAnswers(payload);

        Alert.alert("Sucesso", "Obrigado pelo seu feedback!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      console.error("Erro ao enviar respostas", error);
      const message =
        error.response?.data?.message ||
        "Não foi possível processar seu feedback.";
      Alert.alert("Erro no envio", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete =
    feedback &&
    feedback?.questions?.length > 0 &&
    Object.keys(answers).length === feedback.questions.length;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Responder Feedback</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{feedback?.title}</Text>
        <Text style={styles.description}>{feedback?.class?.school?.name}</Text>
        <Text style={styles.description}>
          Turma: {feedback?.class?.name} ({feedback?.class?.year})
        </Text>

        <View style={styles.divider} />

        {feedback?.questions.map((question: Question, index: number) => (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {index + 1}. {question.title}
            </Text>

            {
              <View style={styles.emojiContainer}>
                {[1, 2, 3, 4, 5].map((num) => {
                  const isSelected = answers[question.id] === num;
                  return (
                    <TouchableOpacity
                      key={num}
                      style={[
                        styles.emojiButton,
                        isSelected && styles.emojiButtonActive,
                      ]}
                      onPress={() => handleUpdateAnswer(question.id, num)}
                    >
                      <Text style={styles.emojiIcon}>{EMOJI_MAP[num]}</Text>
                      <Text
                        style={[
                          styles.emojiValue,
                          isSelected && styles.emojiValueActive,
                        ]}
                      >
                        {answer.getMappedAnswer(num)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            }
          </View>
        ))}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!isFormComplete || isSubmitting) && { backgroundColor: "#D0D5DD" }, // Disabled color
          ]}
          onPress={handleSubmit}
          disabled={!isFormComplete || isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Enviando..." : "Enviar Feedback"}
          </Text>
        </TouchableOpacity>
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
  content: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1A1C1E",
    marginBottom: 8,
  },
  description: { fontSize: 16, color: "#667085", lineHeight: 24 },
  divider: { height: 1, backgroundColor: "#EAECF0", marginVertical: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A1C1E",
    marginBottom: 12,
  },
  infoText: { color: "#98A2B3" },
  questionContainer: { marginBottom: 18 },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 12,
  },
  scaleContainer: { flexDirection: "row", justifyContent: "space-between" },
  scaleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scaleButtonActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  scaleText: { fontSize: 16, color: "#344054" },
  scaleTextActive: { color: "#fff", fontWeight: "bold" },
  textArea: {
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  submitButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
    paddingBottom: 16,
  },
  emojiButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F2F4F7",
    backgroundColor: "#F9FAFB",
    width: "18%", // Ensures 5 items fit in a row with spacing
  },
  emojiButtonActive: {
    backgroundColor: "#E0F2FE",
    borderColor: "#007AFF",
  },
  emojiIcon: {
    fontSize: 28, // Larger emoji for emphasis
    marginBottom: 4,
  },
  emojiValue: {
    fontSize: 7.25,
    color: "#495267",
    textAlign: "center",
  },
  emojiValueActive: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
