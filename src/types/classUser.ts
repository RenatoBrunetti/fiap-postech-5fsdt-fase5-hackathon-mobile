import { Class } from "./class";
import { User } from "./user";

export interface ClassUser {
  id: string;
  startDate: string;
  endDate: string;
  classId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  class: Class;
  user: User;
}
