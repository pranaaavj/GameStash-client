import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from './baseApi';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => ({ url: '/user/profile', credentials: 'include' }),
    }),
  }),
});

export const { useGetUserInfoQuery } = userApi;
