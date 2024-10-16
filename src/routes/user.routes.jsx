import { UserLayout } from '@/components/user';
import { NotFound } from '@/pages/error';
import { HomeUsers } from '@/pages/user';
import { AuthorizedRoute } from './ProtectedRoutes';

export const userRoutes = [
  {
    path: 'user',
    element: <UserLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: 'home',
        element: <HomeUsers />,
      },
      {
        path: 'profile',
        element: <AuthorizedRoute />,
        children: [
          {
            path: 'details',
            element: <h1>Hello</h1>,
          },
        ],
      },
    ],
  },
];
