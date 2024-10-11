import { ErrorPage } from '@/components/common';
import { SignIn, UserLayout } from '@/components/user';

const routes = [
  {
    path: '/',
    element: <UserLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'sign-in',
        element: <SignIn />,
      },
    ],
  },
];

export default routes;
