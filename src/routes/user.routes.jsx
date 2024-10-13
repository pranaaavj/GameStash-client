import { UserLayout } from '@/components/user';
import { NotFoundPage } from '@/pages/error';
import { LoginPage, RegisterPage } from '@/pages/auth';

const routes = [
  {
    path: '/',
    element: <UserLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <RegisterPage />,
      },
    ],
  },
];

export default routes;
