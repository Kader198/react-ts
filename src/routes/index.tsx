import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '../components/layouts/AuthLayout';
import { ForgetPassword } from '../modules/auth/ForgetPassword';
import { VerifyOTP } from '../modules/auth/VerifyOTP';
import { Dashboard } from '../modules/dashboard/pages/Dashboard';
import { Tasks } from '../modules/task-management/pages/Tasks';
import { Settings } from '../pages/Settings';


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
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'forget-password',
        element: <ForgetPassword method="email" />
      },
      {
        path: 'verify-otp',
        element: <VerifyOTP />
      },
    ],
  },
]); 