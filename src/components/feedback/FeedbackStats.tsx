import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Router } from "expo-router";

import emoji from "@/utils/emoji";
import { Feedback } from "@/types/feedback";
import { Ionicons } from "@expo/vector-icons";
import { answerService } from "@/services/answer.service";

interface QuestionStat {
  id: string;
  title: string;
  average: number;
  totalResponses: number;
}

export default function FeedbackStats({
  feedback,
  router,
}: {
  feedback: Feedback | null;
  router: Router;
}) {
  const [stats, setStats] = React.useState<QuestionStat[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      if (feedback) {
        // Simulando cálculo de estatísticas a partir das respostas
        const answers = await answerService.getAllByFeedbackId(feedback.id);

        const calculatedStats = feedback.questions.map((question) => {
          const questionAnswers = answers.filter(
            (answer) => answer.questionId === question.id,
          );

          const average =
            questionAnswers.reduce((sum, a) => sum + a.outcome, 0) /
            (questionAnswers.length || 1);

          return {
            id: question.id,
            title: question.title,
            average,
            totalResponses: questionAnswers.length,
          };
        });
        setStats(calculatedStats);
      }
    };

    fetchStats();
  }, [feedback]);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{feedback?.title}</Text>
        <Text style={styles.subtitle}>Consolidado de Respostas</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Total de Alunos que Responderam
          </Text>
          <Text style={styles.summaryValue}>
            {stats[0]?.totalResponses || 0}
          </Text>
        </View>

        {stats.map((stat) => (
          <View key={stat.id} style={styles.statCard}>
            <Text style={styles.questionTitle}>{stat.title}</Text>

            <View style={styles.row}>
              <View style={styles.emojiContainer}>
                <Text style={styles.emoji}>
                  {emoji.getEmojiForAverage(stat.average)}
                </Text>
                <Text style={styles.averageLabel}>
                  Média: {stat.average.toFixed(1)}
                </Text>
              </View>

              {/* Barra de progresso visual */}
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressBar,
                    { width: `${(stat.average / 5) * 100}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
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
  container: { padding: 20, backgroundColor: "#F5F7FA" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1A1C1E" },
  subtitle: { fontSize: 16, color: "#667085", marginBottom: 20 },
  summaryCard: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  summaryLabel: { color: "#E0F2FE", fontSize: 14 },
  summaryValue: { color: "#FFF", fontSize: 32, fontWeight: "bold" },
  statCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EAECF0",
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#344054",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  emojiContainer: { alignItems: "center", width: 80 },
  emoji: { fontSize: 32 },
  averageLabel: { fontSize: 12, color: "#667085", marginTop: 4 },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: "#F2F4F7",
    borderRadius: 4,
    marginLeft: 20,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 4,
  },
});
