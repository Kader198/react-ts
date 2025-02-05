export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'in-review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assigneeId: string;
  projectId?: string;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold';
  progress: number;
  startDate: string;
  endDate: string;
  members: User[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  taskId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  taskId: string;
  uploadedBy: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  type: 'meeting' | 'deadline' | 'reminder';
  attendees: User[];
  location?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: User[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  tasksByStatus: {
    status: Task['status'];
    count: number;
  }[];
  tasksByPriority: {
    priority: Task['priority'];
    count: number;
  }[];
  projectProgress: {
    projectId: string;
    name: string;
    progress: number;
  }[];
  teamPerformance: {
    userId: string;
    name: string;
    tasksCompleted: number;
    onTimeDelivery: number;
  }[];
}

export interface ApiSettings {
  baseUrl: string;
  apiKey?: string;
  timeout: number;
  retryAttempts: number;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'es' | 'fr';
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  displayDensity: 'comfortable' | 'compact';
  timezone: string;
}

export interface Settings {
  api: ApiSettings;
  user: UserSettings;
  lastUpdated: string;
} 