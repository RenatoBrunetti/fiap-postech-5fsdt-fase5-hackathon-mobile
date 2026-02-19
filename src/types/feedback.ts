import { Class } from "./class";
import { Question } from "./question";
import { User } from "./user";

export interface Feedback {
  id: string;
  title: string;
  classId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  class: Class;
  user: User;
  questions: Question[];
  isAnswered?: boolean; // Optional field to indicate whether the feedback has been answered
}
