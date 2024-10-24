import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from './baseApi';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => ({ url: '/admin/products', credentials: 'include' }),
    }),
  }),
});

export const { useGetAllProductsQuery } = adminApi;
