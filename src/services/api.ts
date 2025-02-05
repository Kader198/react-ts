// First, let's create an API service
import { ApiSettings, Task } from '../types/models';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';

class ApiService {
  private static instance: ApiService;
  private baseUrl: string;
  private timeout: number;
  private retryAttempts: number;
  private currentRetry: number = 0;

  private constructor() {
    const { settings } = useSettingsStore.getState();
    this.baseUrl = settings.api.baseUrl;
    this.timeout = settings.api.timeout;
    this.retryAttempts = settings.api.retryAttempts;
  }

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  updateConfig(settings: Partial<ApiSettings>) {
    if (settings.baseUrl) this.baseUrl = settings.baseUrl;
    if (settings.timeout) this.timeout = settings.timeout;
    if (settings.retryAttempts) this.retryAttempts = settings.retryAttempts;
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return { success: true, message: 'Connection successful' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Connection failed' 
      };
    }
  }

  // Add these CRUD methods for tasks
  async listTasks(): Promise<Task[]> {
    const response = await this.fetchWithRetry(`${this.baseUrl}tasks`);
    return response.json();
  }

  async createTask(data: Partial<Task>): Promise<Task> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}tasks`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.json();
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}tasks/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return response.json();
  }

  async deleteTask(id: string): Promise<void> {
    await this.fetchWithRetry(
      `${this.baseUrl}tasks/${id}`,
      { method: 'DELETE' }
    );
  }

  private async fetchWithRetry(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = useAuthStore.getState().token;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          ...options.headers,
        },
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        if (response.status === 401) {
          useAuthStore.getState().logout();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (this.currentRetry < this.retryAttempts) {
        this.currentRetry++;
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, this.currentRetry) * 1000)
        );
        return this.fetchWithRetry(url, options);
      }
      throw error;
    }
  }
}

export const apiService = ApiService.getInstance(); 