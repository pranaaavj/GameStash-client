import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from './baseApi';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
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
    getProfileDetails: builder.query({
      query: (userId) => ({
        url: `/user/details/${userId}`,
      }),
    }),
  }),
});

export const {
  useGetProductQuery,
  useGetProductsQuery,
  useGetProductsByGenreQuery,
  useGetReviewByProductQuery,
  useGetProfileDetailsQuery,
} = userApi;
