import { axiosInstance } from '../lib/axios';
import type { User } from '../types/models';

export interface CreateUserData {
  name: string;
  email: string;
  role: string;
  department?: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
}

export interface UserResponse {
  data: User[];
  total: number;
}

export const userService = {
  getUsers: async (page: number, pageSize: number, search?: string, filters?: Record<string, string>): Promise<UserResponse> => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(search && { search }),
      ...filters,
    });

    const response = await axiosInstance.get(`/users?${params}`);
    return response.data;
  },

  createUser: async (data: CreateUserData): Promise<User> => {
    const response = await axiosInstance.post('/users', data);
    return response.data;
  },

  updateUser: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await axiosInstance.patch(`/users/${id}`, data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
}; 