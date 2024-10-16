import { AdminLayout } from '@/components/admin';
import { AdminDashboard, AdminLogin } from '@/pages/admin';

export const adminRoutes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'login',
        element: <AdminLogin />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
    ],
  },
];
