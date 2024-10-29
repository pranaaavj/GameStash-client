import { UserLayout } from '@/components/user';
import { NotFound } from '@/pages/error';
import { Home } from '@/pages/user';
import { AuthorizedRoute } from './ProtectedRoutes';
import { ProductDetailsPage } from '@/pages/user/Game/GameDetails';

export const userRoutes = [
  {
    path: 'user',
    element: <UserLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
      {
        path: 'profile',
        element: <AuthorizedRoute />,
      },
      {
        path: 'product',
        element: <ProductDetailsPage />,
      },
    ],
  },
];
