import { FiUsers } from 'react-icons/fi';
import { Users } from '../pages/Users';
// ... other imports ...

export const navigationConfig: AppRoute[] = [
  // ... existing routes ...
  {
    path: APP_ROUTES.USERS,
    name: 'Users',
    icon: FiUsers,
    element: <Users />,
  },
  // ... other routes ...
]; 