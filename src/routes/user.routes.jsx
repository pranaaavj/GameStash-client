import { UserLayout } from '@/components/user';
import { NotFound } from '@/pages/error';
import { HomeUsers } from '@/pages/user';
import { ProtectedUserRoute } from './ProtectedRoutes';

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
        element: <ProtectedUserRoute />,
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
