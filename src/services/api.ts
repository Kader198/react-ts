// First, let's create an API service
import { ApiSettings, Task, Project, Team, User } from '../types/models';
import { useSettingsStore } from '../stores/settingsStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface ListTasksParams {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, string>;
  fields?: string[];
}

interface ListTeamsParams {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, string>;
}

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
  async listTasks(params: ListTasksParams): Promise<{ data: Task[]; total: number }> {
    try {
      const queryParams = new URLSearchParams({
        page: String(params.page),
        pageSize: String(params.pageSize),
      });

      // Add search param if it exists and is not empty
      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }

      // Add filter params if they exist
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value);
          }
        });
      }

      const response = await this.fetchWithRetry(
        `${this.baseUrl}tasks?${queryParams.toString()}`
      );
      return response.json();
    } catch (error) {
      this.handleError(error);
      return { data: [], total: 0 }; // Return empty result on error
    }
  }

  async getTasksCount(params: { search?: string; filters?: Record<string, string> }): Promise<number> {
    try {
      const queryParams = new URLSearchParams({
        ...(params.search && { search: params.search }),
        ...(params.filters && { filters: JSON.stringify(params.filters) }),
      });

      const response = await this.fetchWithRetry(
        `${this.baseUrl}tasks/count?${queryParams.toString()}`
      );
      const data = await response.json();
      return data.count;
    } catch (error) {
      this.handleError(error);
      return 0;
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
      throw error;
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
      throw error;
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
    totalTasks: {
      current: number;
      previous: number;
    };
    teamMembers: {
      current: number;
      previous: number;
    };
    hoursTracked: {
      current: number;
      previous: number;
    };
    activeProjects: {
      current: number;
      previous: number;
    };
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
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          endDate: data.endDate,
          startDate: data.startDate,
          status: data.status,
          members: data.members,
        }),
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
  async listTeams(params: ListTeamsParams): Promise<{ data: Team[]; total: number }> {
    try {
      const queryParams = new URLSearchParams({
        page: String(params.page),
        pageSize: String(params.pageSize),
      });

      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }

      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) {
            queryParams.append(key, value);
          }
        });
      }

      const response = await this.fetchWithRetry(
        `${this.baseUrl}teams?${queryParams.toString()}`
      );
      return response.json();
    } catch (error) {
      this.handleError(error);
      return { data: [], total: 0 };
    }
  }

  private handleError(error: unknown) {
    let message = 'An unexpected error occurred';
    
    if (error instanceof Error) {
      // Handle specific error types
      if ('status' in error) {
        switch ((error as any).status) {
          case 400:
            message = 'Invalid request. Please check your input.';
            break;
          case 401:
            message = 'Session expired. Please login again.';
            break;
          case 403:
            message = 'You do not have permission to perform this action.';
            break;
          case 404:
            message = 'The requested resource was not found.';
            break;
          case 429:
            message = 'Too many requests. Please try again later.';
            break;
          case 500:
            message = 'Server error. Please try again later.';
            break;
          default:
            message = error.message || 'An error occurred';
        }
      } else {
        message = error.message;
      }
    }

    // Show toast with error details
    toast.error(message, {
      duration: 5000,
      position: 'top-right',
      icon: '❌',
      style: {
        background: '#FEE2E2',
        color: '#991B1B',
        border: '1px solid #F87171',
      },
    });

    // Log error for debugging
    console.error('[API Error]:', {
      message,
      error,
      timestamp: new Date().toISOString(),
    });

    throw error;
  }

  private handleSuccess(message: string) {
    toast.success(message, {
      duration: 3000,
      position: 'top-right',
      icon: '✅',
      style: {
        background: '#DCFCE7',
        color: '#166534',
        border: '1px solid #4ADE80',
      },
    });
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
      throw error;
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
      throw error;
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