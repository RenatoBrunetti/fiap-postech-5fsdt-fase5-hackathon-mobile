import { api } from "@/api/client";
import { Feedback } from "@/types/feedback";

export const feedbackService = {
  async getAllByUser(userId: string): Promise<Feedback[]> {
    const response = await api.get<Feedback[]>(`/feedbacks/user/${userId}`);
    return response.data;
  },

  async getFeedbackById(id: string): Promise<Feedback> {
    const response = await api.get<Feedback>(`/feedbacks/${id}`);
    return response.data;
  },

  async createFeedbackAndQuestions(data: {
    title: string;
    classId: string;
    userId: string;
    questions: { title: string; description?: string; order: number }[];
  }): Promise<Feedback> {
    const response = await api.post<Feedback>("/feedbacks/questions", data);
    return response.data;
  },
};
