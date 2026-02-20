import React, { useCallback, useRef, useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Router, useFocusEffect } from "expo-router";

import { feedbackService } from "@/services/feedback.service";
import { Feedback } from "@/types/feedback";
import { User } from "@/types/user";

export default function FeedbackList({
  user,
  router,
  setLoading,
  userRoleName,
}: {
  user: User | any;
  router: Router;
  setLoading: (loading: boolean) => void;
  userRoleName: string;
}) {
  const flatListRef = useRef<FlatList>(null);

  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      if (!user) return;
      const data = await feedbackService.getAllByUser(user.id);
      const filteredData =
        userRoleName === "Teacher"
          ? data.filter((feedback) => feedback.userId === user.id)
          : data;
      setFeedbacks(filteredData);
    } catch (error) {
      console.error("Erro ao carregar feedbacks", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFeedbacks();
      scrollToTop();
    }, [user]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
    scrollToTop();
  };

  return (
    <View style={styles.content}>
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Avaliações</Text>
        <View style={styles.actions}>
          {userRoleName !== "Student" && (
            <TouchableOpacity onPress={() => router.push("/feedback/create")}>
              <Ionicons name="add" size={20} color="#007AFF" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={feedbacks}
        keyExtractor={(item) => item.id}
        ref={flatListRef}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nenhum feedback disponível no momento.
          </Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              userRoleName !== "Student"
                ? styles.cardDefaultBackground
                : userRoleName === "Student" && item.isAnswered
                  ? styles.cardAnsweredBackground
                  : styles.cardUnansweredBackground,
            ]}
            onPress={() => router.push(`/feedback/${item.id}`)} // Dynamic navigation
          >
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>
                Turma: {item.class.name} ({item.class.year})
              </Text>
              <Text style={styles.cardFooter}>
                Criado por: {item.user.name}
              </Text>
            </View>
            <Ionicons
              name={
                userRoleName !== "Student"
                  ? "eye"
                  : item.isAnswered
                    ? "checkmark-circle"
                    : "alert-circle"
              }
              size={24}
              color={
                userRoleName !== "Student"
                  ? "#667085"
                  : item.isAnswered
                    ? "#34D399"
                    : "#F87171"
              }
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1 },
  actions: { flexDirection: "row", gap: 22 },
  subtitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#344054",
  },
  info: { fontSize: 16, color: "#667085", marginBottom: 20 },
  cardDefaultBackground: {
    backgroundColor: "#FFF",
    borderColor: "#E1E7EF",
  },
  cardAnsweredBackground: {
    backgroundColor: "#E6F4EA",
    borderColor: "#34D399",
  },
  cardUnansweredBackground: {
    backgroundColor: "#FEF3F2",
    borderColor: "#F87171",
  },
  card: {
    backgroundColor: "#FFF",
    borderColor: "#E1E7EF",
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: { fontSize: 16, fontWeight: "bold", color: "#1A1C1E" },
  cardSubtitle: { color: "#667085", marginTop: 4 },
  cardFooter: { fontSize: 12, color: "#98A2B3", marginTop: 8 },
  empty: { textAlign: "center", color: "#98A2B3", marginTop: 40 },
});
