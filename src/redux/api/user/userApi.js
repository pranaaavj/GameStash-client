import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from './baseQuery';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    // Home
    getProducts: builder.query({
      query: ({ page = 1, limit = 5, queryOptions = null }) => ({
        url: '/user/products',
        params: { page, limit, queryOptions },
      }),
    }),
    getProductsByGenre: builder.query({
      query: ({ page = 1, limit = 5, genre }) => ({
        url: `/user/products/${genre}`,
        params: { page, limit },
      }),
    }),
    getProduct: builder.query({
      query: (productId) => ({
        url: `/user/product/${productId}`,
      }),
    }),
    getReviewByProduct: builder.query({
      query: (productId) => ({
        url: `/user/review/${productId}`,
      }),
    }),

    // Profile
    getProfileDetails: builder.query({
      query: (userId) => ({
        url: `/user/details/${userId}`,
      }),
    }),
    editUserProfile: builder.mutation({
      query: ({ userId, newUserInfo }) => ({
        url: `/user/details/${userId}`,
        method: 'PATCH',
        body: newUserInfo,
      }),
    }),
    changeUserPass: builder.mutation({
      query: ({ userId, passData }) => ({
        url: `/user/details/change-pass/${userId}`,
        method: 'PATCH',
        body: passData,
      }),
    }),
  }),
});

export const {
  // User home
  useGetProductQuery,
  useGetProductsQuery,
  useGetProductsByGenreQuery,
  useGetReviewByProductQuery,
  // User Profile
  useGetProfileDetailsQuery,
  useEditUserProfileMutation,
  useChangeUserPassMutation,
} = userApi;
