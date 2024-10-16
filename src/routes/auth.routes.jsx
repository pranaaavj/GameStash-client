import {
  Login,
  Register,
  ResetPassword,
  SendOtpEmail,
  VerifyOtpEmail,
  VerifyOtpPassword,
} from '@/pages/auth';
import { UserLayout } from '@/components/user';
import { NotFound } from '@/pages/error';
import {
  PrivateRegistration,
  PrivateResetPassword,
  UnauthorizedRoute,
} from './ProtectedRoutes';

export const authRoutes = [
  {
    path: 'auth',
    element: <UserLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <UnauthorizedRoute />,
        children: [
          {
            path: 'login',
            element: <Login />,
          },
          {
            path: 'send-otp',
            element: <SendOtpEmail />,
          },
          {
            path: 'verify-otp',
            element: <VerifyOtpEmail />,
          },
          {
            path: 'register',
            element: (
              <PrivateRegistration>
                <Register />
              </PrivateRegistration>
            ),
          },
          {
            path: 'verify-otp-pass',
            element: <VerifyOtpPassword />,
          },
          {
            path: 'reset-pass',
            element: (
              <PrivateResetPassword>
                <ResetPassword />
              </PrivateResetPassword>
            ),
          },
        ],
      },
    ],
  },
];
