import {
  Login,
  Register,
  ResetPassword,
  SendOtpEmail,
  VerifyOtpEmail,
  VerifyOtpPassword,
} from '@/pages/auth';
import {
  PrivateRegistration,
  PrivateResetPassword,
  UnauthorizedRoute,
} from './ProtectedRoutes';
import { UserLayout } from '@/components/user';
import { NotFound } from '@/pages/error';

export const authRoutes = [
  {
    path: 'auth',
    element: (
      <UnauthorizedRoute>
        <UserLayout />
      </UnauthorizedRoute>
    ),
    errorElement: <NotFound />,
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
        path: 'verify-otp-pass',
        element: <VerifyOtpPassword />,
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
        path: 'reset-pass',
        element: (
          <PrivateResetPassword>
            <ResetPassword />
          </PrivateResetPassword>
        ),
      },
    ],
  },
];
