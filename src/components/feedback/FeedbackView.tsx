import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { EMOJI_MAP } from "@/constants/emojis";
import { Answer } from "@/types/answer";
import { Feedback } from "@/types/feedback";
import { answerService } from "@/services/answer.service";

export default function FeedbackView({
  feedback,
  router,
}: {
  feedback: Feedback;
  router: Router;
}) {
  const [answers, setAnswers] = useState<Answer[] | []>([]);

  useEffect(() => {
    const fetchAnswers = async () => {
      if (feedback) {
        const answers = await answerService.getAllByFeedbackId(feedback.id);
        setAnswers(answers);
      }
    };
    fetchAnswers();
  }, [feedback]);

  // Helper to find the specific answer for a question
  const getAnswerForQuestion = (questionId: string) => {
    const answer = answers.find((a) => a.questionId === questionId);
    return answer ? answer.outcome : null;
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="#1A1C1E"
          onPress={() => router.back()}
        />
        <Text style={styles.headerTitle}>Meu Feedback</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Respondido</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={40} color="#039855" />
          <Text style={styles.successTitle}>Obrigado por avaliar!</Text>
          <Text style={styles.successSub}>
            Sua opinião ajuda a melhorar nossas aulas.
          </Text>
        </View>

        <Text style={styles.title}>{feedback.title}</Text>
        <View style={styles.divider} />

        {feedback.questions.map((question, index) => {
          const outcome = getAnswerForQuestion(question.id);
          return (
            <View key={question.id} style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {index + 1}. {question.title}
              </Text>

              <View style={styles.answerRow}>
                <View style={styles.selectedEmojiBox}>
                  <Text style={styles.emojiIcon}>
                    {outcome !== null ? EMOJI_MAP[outcome] : "😶"}
                  </Text>
                  <Text style={styles.emojiText}>Nota {outcome}</Text>
                </View>
                <Text style={styles.timestamp}>
                  Avaliado em{" "}
                  {new Date(feedback.createdAt).toLocaleDateString("pt-BR")}
                </Text>
              </View>
            </View>
          );
        })}
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
  badge: {
    backgroundColor: "#ECFDF3",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: { color: "#027A48", fontSize: 12, fontWeight: "600" },
  content: { padding: 20 },
  successBox: {
    backgroundColor: "#F6FEF9",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#D1FADF",
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#027A48",
    marginTop: 8,
  },
  successSub: {
    color: "#067647",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#1A1C1E" },
  divider: { height: 1, backgroundColor: "#EAECF0", marginVertical: 20 },
  questionContainer: { marginBottom: 24 },
  questionText: {
    fontSize: 16,
    color: "#344054",
    marginBottom: 12,
    fontWeight: "500",
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedEmojiBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#EAECF0",
  },
  emojiIcon: { fontSize: 24, marginRight: 8 },
  emojiText: { fontWeight: "bold", color: "#1A1C1E" },
  timestamp: { fontSize: 12, color: "#98A2B3" },
});
