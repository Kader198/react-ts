import { BaseService } from '../../../services/api/baseService';
import { DashboardStats } from '../types';

class DashboardService extends BaseService {
  private static instance: DashboardService;

  private constructor() {
    super();
  }

  static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

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
}

export const dashboardService = DashboardService.getInstance(); 