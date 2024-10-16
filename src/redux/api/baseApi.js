import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout, setToken } from '../slices/userSlice';

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

// Automatic refetching of accessToken
export const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let response = await baseQuery(args, api, extraOptions);
  console.log('response: ' + response);

  // Checking for unauthorized error
  if (response?.error && response?.error?.status === 401) {
    const refreshResponse = await baseQuery(
      '/auth/refresh-token',
      api,
      extraOptions
    );
    console.log('refresh response' + refreshResponse);
    // Setting token in redux store
    if (refreshResponse.success) {
      api.dispatch(setToken({ token: refreshResponse?.accessToken }));

      // Retrying the initial query
      response = await baseQuery(args, api, extraOptions);
    } else {
      // Logging out user
      api.dispatch(logout());
    }
  }
  return response;
};
