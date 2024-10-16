import { AdminLayout } from '@/components/admin';
import { AdminDashboardPage, AdminLoginPage } from '@/pages/admin';

export const adminRoutes = [
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'login',
        element: <AdminLoginPage />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
    ],
  },
];
