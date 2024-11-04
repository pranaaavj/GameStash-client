import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setToken, setStatus } from '../../slices/userSlice';
import { toast } from 'sonner';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SERVER_URL,
  credentials: 'include',

  // Adding authorization headers with every request
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.user?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let response = await baseQuery(args, api, extraOptions);
  console.log('Response', response);

  if (response?.error?.status === 403 || response?.error?.status === 401) {
    const refreshResponse = await baseQuery(
      '/auth/refresh-token',
      api,
      extraOptions
    );
    console.log('Refresh Response', response);

    // Updating token if refresh is successful
    if (refreshResponse?.data?.success) {
      api.dispatch(
        setToken({ token: refreshResponse?.data?.data?.accessToken })
      );

      // Retrying initial with new access token
      response = await baseQuery(args, api, extraOptions);
    } else {
      if (
        response?.error?.status === 403 &&
        response?.error?.data?.message === 'User has been blocked'
      ) {
        api.dispatch(setStatus({ status: 'blocked' }));
        toast.error('Your account has been blocked.');

        return response;
      }
      // Logout if refresh fails
      api.dispatch(logout());
    }
  }

  return response;
};