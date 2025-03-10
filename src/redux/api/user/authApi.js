import { createApi } from '@reduxjs/toolkit/query/react';
import { userBaseQueryWithReAuth } from './userBaseQuery';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: userBaseQueryWithReAuth,
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
    // Google signin
    googleSignIn: builder.mutation({
      query: (idToken) => ({
        url: '/auth/google',
        method: 'POST',
        body: { idToken },
      }),
    }),
    // User logout
    logoutUser: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
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
  useLogoutUserMutation,
  useVerifyOtpUserMutation,
  useResetPassUserMutation,
  useResetOtpUserMutation,
  useGoogleSignInMutation,
} = authApi;
