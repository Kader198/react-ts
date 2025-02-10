import { z } from "zod";

export const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  role: z.enum(["admin", "user", "manager"]),
  department: z.string().optional(),
});

export const userEditSchema = userFormSchema.partial();

export type UserFormInput = z.infer<typeof userFormSchema>;
export type UserEditInput = z.infer<typeof userEditSchema>;

// Common interfaces
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  data: User[];
  total: number;
} 