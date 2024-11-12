import { NotFound } from '@/components/error';
import { UserLayout } from '@/components/user';
import { AuthorizedRoute } from './ProtectedRoutes';
import { GameDetails, GameBrowse, UserProfile, Home } from '@/pages/user';
import { CheckoutPage } from '@/pages/user/Checkout/Checkout';

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
            element: <CheckoutPage />,
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
