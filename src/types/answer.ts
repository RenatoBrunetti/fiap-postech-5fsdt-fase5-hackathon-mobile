import { Question } from "./question";
import { User } from "./user";

export interface Answer {
  id: string;
  outcome: number;
  questionId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  question: Question;
}
