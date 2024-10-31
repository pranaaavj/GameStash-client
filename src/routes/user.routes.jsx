import { UserLayout } from '@/components/user';
import { NotFound } from '@/pages/error';
import { Home } from '@/pages/user';
import { AuthorizedRoute } from './ProtectedRoutes';
import { GameDetails } from '@/pages/user';
import { GameTest } from '@/pages/user/Game/GameTest';

export const userRoutes = [
  {
    path: '/',
    element: <UserLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'profile',
        element: <AuthorizedRoute />,
      },
      {
        path: 'product',
        children: [
          {
            path: ':productId',
            element: <GameDetails />,
          },
        ],
      },
      {
        path: 'test',
        element: <GameTest />,
      },
    ],
  },
];
