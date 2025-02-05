import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '../components/layouts/AuthLayout';
import { Dashboard } from '../pages/Dashboard';
import { Tasks } from '../pages/Tasks';
import { Projects } from '../pages/Projects';
import { Calendar } from '../pages/Calendar';
import { Settings } from '../pages/Settings';
import { Teams } from '../pages/Teams';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'tasks',
        element: <Tasks />,
      },
      {
        path: 'projects',
        element: <Projects />,
      },
      {
        path: 'teams',
        element: <Teams />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
]); 