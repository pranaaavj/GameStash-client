import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from './baseApi';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, limit = 5, queryOptions = {} }) => ({
        url: '/user/products',
        params: { page, limit, ...queryOptions },
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
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetReviewByProductQuery,
} = userApi;
