// First, let's create an API service
import { BaseService } from '../../../services/api/baseService';
import { Project, Task, Team, User } from '../../../types/models';

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

interface DashboardStats {
  totalTasks: number;
  teamMembers: number;
  hoursTracked: number;
  activeProjects: number;
  tasksByStatus: {
    status: string;
    count: number;
  }[];
  projectProgress: {
    project: string;
    progress: number;
    total: number;
    completed: number;
  }[];
  teamPerformance: {
    date: string;
    completedTasks: number;
    hoursLogged: number;
  }[];
  recentActivity: {
    id: string;
    user: string;
    action: string;
    timestamp: string;
  }[];
}

class TaskService extends BaseService {
  private static instance: TaskService;

  private constructor() {
    super();
  }

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async listTasks(params: ListTasksParams): Promise<{ data: Task[]; total: number }> {
    try {
      const queryParams = new URLSearchParams({
        page: String(params.page),
        pageSize: String(params.pageSize),
      });

      if (params.search?.trim()) {
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
        `${this.baseUrl}tasks?${queryParams.toString()}`
      );
      return response.json();
    } catch (error) {
      this.handleError(error);
      return { data: [], total: 0 };
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

  // Dashboard APIs
  async getDashboardStats(): Promise<DashboardStats> {
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

export const taskService = TaskService.getInstance(); 