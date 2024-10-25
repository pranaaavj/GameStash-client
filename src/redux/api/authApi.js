import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_SERVER_URL }),
  endpoints: (builder) => ({
    // User login
    loginUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/login',
        method: 'POST',
        body: userInfo,
      }),
    }),
    // User registration after opt verification
    registerUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/register',
        method: 'POST',
        body: userInfo,
      }),
    }),
    // User logout
    logoutUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/logout',
        method: 'POST',
        body: userInfo,
      }),
    }),
    // Sending otp for reset password / registration
    sendOtpUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/send-otp',
        method: 'POST',
        body: userInfo,
      }),
    }),
    // Resending the otp
    resetOtpUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/reset-otp',
        method: 'POST',
        body: userInfo,
      }),
    }),
    // Verifying the otp
    verifyOtpUser: builder.mutation({
      query: (userInfo) => ({
        url: '/auth/verify-otp',
        method: 'POST',
        body: userInfo,
      }),
    }),

    // User password resetting
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
