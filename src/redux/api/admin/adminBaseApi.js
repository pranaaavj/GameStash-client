import { createApi } from '@reduxjs/toolkit/query/react';
import { AdminBaseQueryWithReAuth } from './adminBaseQuery';

export const adminBaseApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: AdminBaseQueryWithReAuth,
  tagTypes: ['Product', 'Brand', 'Genre', 'User', 'Address'],
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (adminInfo) => ({
        url: '/admin/login',
        method: 'POST',
        body: adminInfo,
      }),
    }),
    logoutAdmin: builder.mutation({
      query: (adminInfo) => ({
        url: '/admin/logout',
        method: 'POST',
        body: adminInfo,
      }),
    }),
  }),
});

export const { useLoginAdminMutation, useLogoutAdminMutation } = adminBaseApi;
