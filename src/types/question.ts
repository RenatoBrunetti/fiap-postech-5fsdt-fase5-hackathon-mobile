export interface Question {
  id: string;
  title: string;
  description?: string;
  order: number;
  feedbackId: string;
  createdAt: string;
  updatedAt: string;
}
