import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackStats from "@/components/feedback/FeedbackStats";
import { useAuth } from "@/contexts/AuthContext";
import { feedbackService } from "@/services/feedback.service";
import { Feedback } from "@/types/feedback";
import FeedbackView from "@/components/feedback/FeedbackView";

export default function FeedbackDetails() {
  const router = useRouter();
  const { id }: { id: string } = useLocalSearchParams();
  const { user, signOut } = useAuth();

  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useFocusEffect(
    useCallback(() => {
      loadFeedback();
    }, [id]),
  );

  const loadFeedback = async () => {
    try {
      // Call the backend details endpoint
      const feedbackData = await feedbackService.getFeedbackById(id);
      setFeedback(feedbackData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (user?.roleName.toLowerCase() === "student" && !feedback?.isAnswered) {
    return (
      <FeedbackForm
        feedback={feedback}
        answers={answers}
        setAnswers={setAnswers}
        router={router}
      />
    );
  } else if (
    user?.roleName.toLowerCase() === "student" &&
    feedback?.isAnswered
  ) {
    return <FeedbackView feedback={feedback} router={router} />;
  } else {
    return <FeedbackStats feedback={feedback} router={router} />;
  }
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
