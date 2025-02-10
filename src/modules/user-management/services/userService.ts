import { axiosInstance } from '../../../lib/axios';
import type { User } from '../../../types/models';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateSelfData {
  email: string;
  password: string;
  name: string;
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
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },

  updateSelf: async (data: UpdateSelfData): Promise<User> => {
    const response = await axiosInstance.patch('/users/me', data);
    return response.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
}; 