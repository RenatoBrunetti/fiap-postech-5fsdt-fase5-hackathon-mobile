import { api } from "@/api/client";
import { Answer } from "@/types/answer";

interface AnswerPayload {
  feedbackId: string;
  questions: {
    questionId: string;
    outcome: any;
  }[];
}

export const answerService = {
  async submitAnswers(payload: AnswerPayload): Promise<void> {
    await api.post("/answers", payload);
  },

  async getAllByFeedbackId(feedbackId: string): Promise<Answer[]> {
    const response = await api.get(`/answers/feedback/${feedbackId}`);
    return response.data;
  },
};
