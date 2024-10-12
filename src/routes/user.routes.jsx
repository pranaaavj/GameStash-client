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
        path: 'sign-in',
        element: <SignIn />,
      },
      {
        path: 'sign-up',
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
