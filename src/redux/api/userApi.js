import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_SERVER_URL }),
  endpoints: (builder) => ({
    signUpUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/sign-up',
        method: 'POST',
        body: userInfo,
      }),
    }),
    signInUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/sign-in',
        method: 'POST',
        body: userInfo,
      }),
    }),
  }),
});

export const { useSignUpUserMutation, useSignInUserMutation } = authApi;
