import {
  Login,
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
    path: '',
    element: <UserLayout />,
    errorElement: <NotFound />,
    meta: { breadcrumb: 'Home' },
    children: [
      {
        path: '',
        element: <UnauthorizedRoute />,
        children: [
          {
            path: 'login',
            element: <Login />,
            meta: { breadcrumb: 'Login' },
          },
          {
            path: 'register',
            element: (
              <ProtectOtp requiredOtpType='registration'>
                <Register />
              </ProtectOtp>
            ),
            meta: { breadcrumb: 'Register' },
          },
          {
            path: 'send-otp',
            element: <SendOtpEmail />,
            meta: { breadcrumb: 'Send OTP' },
          },
          {
            path: 'verify-email',
            element: <VerifyOtpEmail />,
            meta: { breadcrumb: 'Verify Email' },
          },
          {
            path: 'verify-pass',
            element: <VerifyOtpPassword />,
            meta: { breadcrumb: 'Verify Password' },
          },
          {
            path: 'reset-pass',
            element: (
              <ProtectOtp requiredOtpType='forgotPassword'>
                <ResetPassword />
              </ProtectOtp>
            ),
            meta: { breadcrumb: 'Reset Password' },
          },
        ],
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />,
        meta: { breadcrumb: 'Unauthorized' },
      },
    ],
  },
];
