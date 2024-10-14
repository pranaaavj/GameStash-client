import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_SERVER_URL }),
  endpoints: (builder) => ({
    signInUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/login',
        method: 'POST',
        body: userInfo,
      }),
    }),
    signUpUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }),
    }),
    sendOtpUser: builder.mutation({
      query: (userEmail) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: { email: userEmail },
      }),
    }),
    verifyOtpUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: userInfo,
      }),
    }),
    forgetPassUser: builder.mutation({
      query: (userEmail) => ({
        url: '/auth/forget-pass',
        method: 'POST',
        body: { email: userEmail },
      }),
    }),
    verifyOtpPassUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/verify-otp-pass',
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
  useSignInUserMutation,
  useSignUpUserMutation,
  useSendOtpUserMutation,
  useVerifyOtpUserMutation,
  useResetPassUserMutation,
  useForgetPassUserMutation,
  useVerifyOtpPassUserMutation,
} = authApi;
