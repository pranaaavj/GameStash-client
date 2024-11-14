import { NotFound } from '@/components/error';
import { UserLayout } from '@/components/user';
import { AuthorizedRoute, ProtectCheckout } from './ProtectedRoutes';
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
        path: '',
        element: <AuthorizedRoute />,
        children: [
          {
            path: 'profile',
            element: <UserProfile />,
          },
          {
            path: 'checkout',
            element: <ProtectCheckout />,
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
