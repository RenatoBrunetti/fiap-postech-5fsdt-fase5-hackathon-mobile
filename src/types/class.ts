import { School } from "./school";

export interface Class {
  id: string;
  name: string;
  year: number;
  school: School;
}
