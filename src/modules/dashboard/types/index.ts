export interface DashboardStats {
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