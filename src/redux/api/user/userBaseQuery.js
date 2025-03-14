import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setToken } from '../../slices/userSlice';
import { toast } from 'sonner';
import { flushSync } from 'react-dom';

const userBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SERVER_URL,
  credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.user?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
let isLoggingOut = false; // ✅ Local flag to prevent duplicate logouts

export const userBaseQueryWithReAuth = async (args, api, extraOptions) => {
  let response = await userBaseQuery(args, api, extraOptions);
  console.log('Response: ', response);

  // 🔹 If token is invalid or expired
  if (response?.error?.status === 403 || response?.error?.status === 401) {
    const refreshResponse = await userBaseQuery(
      '/auth/refresh-token',
      api,
      extraOptions
    );

    console.log('Refresh response: ', refreshResponse);

    if (refreshResponse?.data?.success) {
      api.dispatch(
        setToken({ token: refreshResponse?.data?.data?.accessToken })
      );
      response = await userBaseQuery(args, api, extraOptions);
    } else {
      console.log(response.error);

      // 🔥 Handling user block scenario properly
      if (
        response?.error?.status === 403 &&
        (response?.error?.data?.message === 'User has been blocked.' ||
          response?.error?.data?.message ===
            'You have been blocked by the admin.')
      ) {
        if (!isLoggingOut) {
          isLoggingOut = true;

          flushSync(() => {
            toast.error('Your account has been blocked.');
          });

          setTimeout(() => {
            api.dispatch(logout());
            isLoggingOut = false;
          }, 500);
        }
        return response;
      }

      // 🔹 Handle session expiration & logout
      if (!isLoggingOut) {
        isLoggingOut = true;

        flushSync(() => {
          toast.error('Your session has expired. Please log in again.');
        });

        setTimeout(() => {
          api.dispatch(logout());
          isLoggingOut = false;
        }, 500);
      }

      console.log('User logged out');
    }
  }

  return response;
};
