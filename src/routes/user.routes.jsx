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
  Cart,
} from '@/pages/user';

export const userRoutes = [
  {
    path: '',
    element: <UserLayout />,
    meta: { breadcrumb: 'Home' },
    children: [
      {
        index: true,
        element: <Home />,
        meta: { breadcrumb: 'Home' },
      },
      {
        path: '',
        element: <AuthorizedRoute />,
        children: [
          {
            path: 'profile',
            element: <UserProfile />,
            meta: { breadcrumb: 'Profile' },
          },
          {
            path: 'orders',
            element: <Orders />,
            meta: { breadcrumb: 'Orders' },
          },
          {
            path: 'wishlist',
            element: <Wishlist />,
            meta: { breadcrumb: 'Wishlist' },
          },
          {
            path: 'orders/:orderId',
            element: <OrderDetails />,
            meta: {
              breadcrumb: 'Order Details',
              parent: 'orders',
            },
          },
          {
            path: 'checkout',
            element: <ProtectCheckout />,
            meta: {
              breadcrumb: 'Checkout',
              parent: 'cart',
            },
          },
          {
            path: '/order-confirmation',
            element: <OrderConfirmationWrapper />,
            meta: {
              breadcrumb: 'Order Confirmation',
              parent: 'orders',
            },
          },
        ],
      },
      {
        path: 'games',
        element: <GameBrowse />,
        meta: { breadcrumb: 'Games' },
      },
      {
        path: 'cart',
        element: <Cart />,
        meta: { breadcrumb: 'Cart' },
      },
      {
        path: 'games/:productId',
        element: <GameDetails />,
        meta: {
          breadcrumb: 'Game Details',
          parent: 'games',
        },
      },
      {
        path: 'about',
        element: <About />,
        meta: { breadcrumb: 'About' },
      },
      {
        path: 'support',
        element: <Support />,
        meta: { breadcrumb: 'Support' },
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
    meta: { breadcrumb: 'Not Found' },
  },
];
