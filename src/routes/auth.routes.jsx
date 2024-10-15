import {
  LoginPage,
  RegisterPage,
  ResetPassPage,
  SendOtpPage,
  VerifyOtpPage,
  VerifyPassOtpPage,
} from '@/pages/auth';
import { UserLayout } from '@/components/user';
import { NotFoundPage } from '@/pages/error';
import { ProtectRegisterRoute } from './ProtectedRoutes';

export const authRoutes = [
  {
    path: 'auth',
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
        element: <VerifyOtpPage />,
      },
      {
        path: 'register',
        element: (
          <ProtectRegisterRoute>
            <RegisterPage />
          </ProtectRegisterRoute>
        ),
      },
      {
        path: 'verify-otp-pass',
        element: <VerifyPassOtpPage />,
      },
      {
        path: 'reset-pass',
        element: <ResetPassPage />,
      },
    ],
  },
];
