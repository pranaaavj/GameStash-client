import { UserLayout } from '@/components/user';
import { NotFound } from '@/components/error';
import { Home } from '@/pages/user';
import { AuthorizedRoute } from './ProtectedRoutes';
import { GameDetails } from '@/pages/user';

import { GameBrowse } from '@/pages/user/Game/GameBrowse';
import UserProfilePage from '@/pages/user/UserProfile';

export const userRoutes = [
  {
    path: '/',
    element: <UserLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'profile',
        element: <AuthorizedRoute />,
        children: [
          {
            index: true,
            element: <UserProfilePage />,
          },
        ],
      },
      {
        path: 'game',
        children: [
          {
            path: ':productId',
            element: <GameDetails />,
          },
        ],
      },
      {
        path: 'games',
        element: <GameBrowse />,
      },
      {
        path: 'test',
        element: <GameBrowse />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
