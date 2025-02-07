export type AppRoute = {
  path: string;
  name: string;
  icon: IconType;
  element: React.ReactNode;
};

export const APP_ROUTES = {
  DASHBOARD: '/',
  TASKS: '/tasks',
  USERS: '/users',
  // ... other routes
} as const; 