import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from './baseApi';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    // All products listing
    getAllProducts: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/products?page=${page}&limit=${limit}`,
      }),
    }),

    // Adding product
    addProduct: builder.mutation({
      query: (productDetails) => ({
        url: '/admin/products',
        method: 'POST',
        body: productDetails,
      }),
    }),

    // Getting all genres
    getAllGenres: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/genres?page=${page}&limit=${limit}`,
      }),
    }),

    //Getting all brands
    getAllBrands: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/brands?page=${page}&limit=${limit}`,
      }),
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useAddProductMutation,
  useGetAllBrandsQuery,
  useGetAllGenresQuery,
} = adminApi;
