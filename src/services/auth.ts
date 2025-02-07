import { axiosInstance } from '../lib/axios';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await axiosInstance.post('/auth/logout');
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  }
}

export const authService = new AuthService(); 