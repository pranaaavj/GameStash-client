import { NotFound } from '@/components/error';
import { UserLayout } from '@/components/user';
import { AuthorizedRoute, ProtectCheckout } from './ProtectedRoutes';
import {
  GameDetails,
  GameBrowse,
  UserProfile,
  Home,
  Orders,
  OrderDetails,
} from '@/pages/user';
import CartPage from '@/pages/user/Cart';

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
            path: 'orders',
            element: <Orders />,
          },
          {
            path: 'orders/:orderId',
            element: <OrderDetails />,
          },
          {
            path: 'checkout',
            element: <ProtectCheckout />,
          },
          {
            path: 'cart',
            element: <CartPage />,
          },
        ],
      },
      {
        path: 'games',
        element: <GameBrowse />,
      },
      {
        path: 'games/:productId',
        element: <GameDetails />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
