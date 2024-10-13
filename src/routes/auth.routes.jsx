import { UserLayout } from '@/components/user';
import { NotFoundPage } from '@/pages/error';
import {
  LoginPage,
  RegisterPage,
  SendOtpPage,
  VerifyOtpPage,
} from '@/pages/auth';

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
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'send-otp',
        element: <SendOtpPage />,
      },
      {
        path: 'verify-otp',
        element: <VerifyOtpPage />,
      },
    ],
  },
];

export default routes;
