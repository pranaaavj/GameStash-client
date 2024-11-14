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
import { NotFound } from '@/components/error';
import { UserLayout } from '@/components/user';
import { UnauthorizedRoute, ProtectOtp } from './ProtectedRoutes';

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
              <ProtectOtp requiredOtpType='registration'>
                <Register />
              </ProtectOtp>
            ),
          },
          {
            path: 'reset-pass',
            element: (
              <ProtectOtp requiredOtpType='forgotPassword'>
                <ResetPassword />
              </ProtectOtp>
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
