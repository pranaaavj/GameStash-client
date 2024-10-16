import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_SERVER_URL }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/login',
        method: 'POST',
        body: userInfo,
      }),
    }),
    registerUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }),
    }),
    logoutUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/logout',
        method: 'POST',
        body: userInfo,
      }),
    }),
    sendOtpUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: userInfo,
      }),
    }),
    resetOtpUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/reset-otp',
        method: 'POST',
        body: userInfo,
      }),
    }),
    verifyOtpUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: userInfo,
      }),
    }),
    resetPassUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/reset-pass',
        method: 'POST',
        body: userInfo,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useSendOtpUserMutation,
  useVerifyOtpUserMutation,
  useResetPassUserMutation,
  useResetOtpUserMutation,
} = authApi;
