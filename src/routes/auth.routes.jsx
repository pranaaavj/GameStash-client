import {
  Login,
  Register,
  ResetPassword,
  SendOtpEmail,
  VerifyOtpEmail,
  VerifyOtpPassword,
} from '@/pages/auth';
import {
  // PrivateRegistration,
  // PrivateResetPassword,
  UnauthorizedRoute,
  OtpProtectedRoute,
} from './ProtectedRoutes';
import { UserLayout } from '@/components/user';
import { NotFound } from '@/pages/error';

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
    ],
  },
];
