import { NotFound } from '@/components/error';
import { UserLayout } from '@/components/user';
import { AuthorizedRoute } from './ProtectedRoutes';
import { GameDetails, GameBrowse, UserProfile, Home } from '@/pages/user';

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
            element: <UserProfile />,
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
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
