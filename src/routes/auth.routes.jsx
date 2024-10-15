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
<<<<<<< HEAD
    element: (
      <UnauthorizedRoute>
        <UserLayout />
      </UnauthorizedRoute>
    ),
    errorElement: <NotFound />,
=======
    element: <UserLayout />,
    errorElement: <NotFoundPage />,
>>>>>>> c05ea32 (commit demo)
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
