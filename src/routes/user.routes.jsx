import { ErrorPage } from '@/components/common';
import { SignIn, UserLayout, SignUp } from '@/components/user';

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
