import { apiService } from './api';

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
    const response = await apiService.fetchWithRetry(
      `${apiService.baseUrl}auth/login`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.json();
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.fetchWithRetry(
      `${apiService.baseUrl}auth/register`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.json();
  }

  async logout(): Promise<void> {
    await apiService.fetchWithRetry(
      `${apiService.baseUrl}auth/logout`,
      { method: 'POST' }
    );
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await apiService.fetchWithRetry(
      `${apiService.baseUrl}auth/me`
    );
    return response.json();
  }
}

export const authService = new AuthService(); 