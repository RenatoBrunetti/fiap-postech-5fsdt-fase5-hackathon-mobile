export interface User {
  id: string;
  name: string;
  email: string;
  roleId: string;
  createdAt: string;
  updatedAt: string;
  role: {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
}
