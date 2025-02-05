// First, let's create an API service
import { ApiSettings, Task, Project, Team, User } from '../types/models';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

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
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}tasks`);
      const result = await response.json();
      return result;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createTask(data: Partial<Task>): Promise<Task> {
    try {
      const response = await this.fetchWithRetry(
        `${this.baseUrl}tasks`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      this.handleSuccess('Task created successfully');
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    try {
      const response = await this.fetchWithRetry(
        `${this.baseUrl}tasks/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      this.handleSuccess('Task updated successfully');
      return result;
    } catch (error) {
      this.handleError(error);
    }
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

  // Dashboard APIs
  async getDashboardStats(): Promise<{
    totalTasks: number;
    teamMembers: number;
    hoursTracked: number;
    activeProjects: number;
    tasksByStatus: Array<{ status: string; count: number }>;
    projectProgress: Array<{ project: string; progress: number }>;
    recentActivity: Array<{
      id: string;
      user: string;
      action: string;
      timestamp: string;
    }>;
  }> {
    try {
      const response = await this.fetchWithRetry(`${this.baseUrl}dashboard/stats`);
      const result = await response.json();
      return result;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Project APIs
  async listProjects(): Promise<Project[]> {
    const response = await this.fetchWithRetry(`${this.baseUrl}projects`);
    return response.json();
  }

  async createProject(data: Partial<Project>): Promise<Project> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}projects`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.json();
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await this.fetchWithRetry(
      `${this.baseUrl}projects/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return response.json();
  }

  async deleteProject(id: string): Promise<void> {
    await this.fetchWithRetry(
      `${this.baseUrl}projects/${id}`,
      { method: 'DELETE' }
    );
  }

  // Teams API methods
  async listTeams(): Promise<Team[]> {
    const response = await this.fetchWithRetry(`${this.baseUrl}teams`);
    return response.json();
  }

  private handleSuccess(message: string) {
    toast.success(message);
  }

  private handleError(error: unknown) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    toast.error(message);
    throw error;
  }

  async createTeam(data: Partial<Team>): Promise<Team> {
    try {
      const response = await this.fetchWithRetry(
        `${this.baseUrl}teams`,
        {
          method: 'POST',
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      this.handleSuccess('Team created successfully');
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateTeam(id: string, data: Partial<Team>): Promise<Team> {
    try {
      const response = await this.fetchWithRetry(
        `${this.baseUrl}teams/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      this.handleSuccess('Team updated successfully');
      return result;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteTeam(id: string): Promise<void> {
    try {
      await this.fetchWithRetry(
        `${this.baseUrl}teams/${id}`,
        { method: 'DELETE' }
      );
      this.handleSuccess('Team deleted successfully');
    } catch (error) {
      this.handleError(error);
    }
  }

  async listUsers(): Promise<User[]> {
    const response = await this.fetchWithRetry(`${this.baseUrl}users`);
    return response.json();
  }

  async addTeamMember(teamId: string, userId: string): Promise<void> {
    try {
      await this.fetchWithRetry(
        `${this.baseUrl}teams/${teamId}/members`,
        { 
          method: 'POST',
          body: JSON.stringify({ userId })
        }
      );
      this.handleSuccess('Member added successfully');
    } catch (error) {
      this.handleError(error);
    }
  }

  async removeTeamMember(teamId: string, userId: string): Promise<void> {
    try {
      await this.fetchWithRetry(
        `${this.baseUrl}teams/${teamId}/members`,
        { 
          method: 'DELETE',
          body: JSON.stringify({ userId })
        }
      );
      this.handleSuccess('Member removed successfully');
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const apiService = ApiService.getInstance(); 