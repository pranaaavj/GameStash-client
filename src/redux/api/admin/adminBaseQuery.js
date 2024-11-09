import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logoutAdmin, setTokenAdmin } from '../../slices/adminSlice';

const AdminBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_SERVER_URL,
  credentials: 'include',

  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.admin?.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const AdminBaseQueryWithReAuth = async (args, api, extraOptions) => {
  let response = await AdminBaseQuery(args, api, extraOptions);

  if (response?.error?.status === 403 || response?.error?.status === 401) {
    const refreshResponse = await AdminBaseQuery(
      '/auth/refresh-token',
      api,
      extraOptions
    );

    if (refreshResponse?.data?.success) {
      api.dispatch(
        setTokenAdmin({ token: refreshResponse?.data?.data?.accessToken })
      );
      response = await AdminBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logoutAdmin());
    }
  }

  return response;
};
