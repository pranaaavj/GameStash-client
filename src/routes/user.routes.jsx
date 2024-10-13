import { ErrorPage } from '@/components/common';
import { UserLayout } from '@/components/user';
import { SignIn, SignUp } from '@/pages/user';

const routes = [
  {
    path: '/',
    element: <UserLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'login',
        element: <SignIn />,
      },
      {
        path: 'register',
        element: <SignUp />,
      },
      {
        path: 'forgot-password',
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
