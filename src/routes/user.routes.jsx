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
  Wishlist,
  OrderConfirmationWrapper,
  About,
  Support,
} from '@/pages/user';
import CartPage from '@/pages/user/Cart';
import { StableWrapper } from '@/pages/Stable';

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
            path: 'wishlist',
            element: <Wishlist />,
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
            path: '/order-confirmation',
            element: <OrderConfirmationWrapper />,
          },
          {
            path: '/about',
            element: <About />,
          },
          {
            path: '/support',
            element: <Support />,
          },
        ],
      },
      {
        path: 'games',
        element: <GameBrowse />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      {
        path: 'test',
        element: <StableWrapper />,
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
