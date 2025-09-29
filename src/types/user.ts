type Role = "admin" | "user";

export interface IUser {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}
