import {
  Login,
  Blocked,
  Register,
  SendOtpEmail,
  Unauthorized,
  ResetPassword,
  VerifyOtpEmail,
  VerifyOtpPassword,
} from '@/pages/auth';
import { NotFound } from '@/pages/error';
import { UserLayout } from '@/components/user';
import { UnauthorizedRoute, OtpProtectedRoute } from './ProtectedRoutes';

export const authRoutes = [
  {
    path: 'auth',
    element: <UserLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: '',
        element: <UnauthorizedRoute />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'register',
            element: (
              <OtpProtectedRoute requiredOtpType='registration'>
                <Register />
              </OtpProtectedRoute>
            ),
          },
          {
            path: 'reset-pass',
            element: (
              <OtpProtectedRoute requiredOtpType='forgotPassword'>
                <ResetPassword />
              </OtpProtectedRoute>
            ),
          },
          {
            path: 'otp',
            children: [
              {
                path: 'send',
                element: <SendOtpEmail />,
              },
              {
                path: 'verify-email',
                element: <VerifyOtpEmail />,
              },
              {
                path: 'verify-pass',
                element: <VerifyOtpPassword />,
              },
            ],
          },
        ],
      },
      {
        path: 'blocked',
        element: <Blocked />,
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />,
      },
    ],
  },
];
