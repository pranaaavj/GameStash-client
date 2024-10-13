import {
  LoginPage,
  RegisterPage,
  SendOtpPage,
  VerifyOtpPage,
} from '@/pages/auth';
import { UserLayout } from '@/components/user';
import { NotFoundPage } from '@/pages/error';
import { ProtectedAuthRoute } from './ProtectedRoutes';

const routes = [
  {
    path: '/',
    element: <UserLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'send-otp',
        element: <SendOtpPage />,
      },
      {
        path: 'verify-otp',
        element: (
          <ProtectedAuthRoute
            requiredStatus='pending'
            redirectPath='/login'>
            <VerifyOtpPage />
          </ProtectedAuthRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <ProtectedAuthRoute
            requiredStatus='verified'
            redirectPath='/verify-otp'>
            <RegisterPage />,
          </ProtectedAuthRoute>
        ),
      },
    ],
  },
];

export default routes;
