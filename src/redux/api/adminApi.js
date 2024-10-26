import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from './baseApi';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    // Products - CRUD Operations
    getAllProducts: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/products?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.products.map(({ id }) => ({
                type: 'Product',
                id,
              })), // Tag each product by its unique ID
              { type: 'Product', id: 'LIST' },
            ] // Tag the entire list
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getOneProduct: builder.query({
      query: (productId) => ({ url: `/admin/products/${productId}` }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    addProduct: builder.mutation({
      query: (newProductDetails) => ({
        url: '/admin/products',
        method: 'POST',
        body: newProductDetails,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    editProduct: builder.mutation({
      query: (updatedProduct) => ({
        url: '/admin/products',
        method: 'PUT',
        body: updatedProduct,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    toggleProductList: builder.mutation({
      query: (productId) => ({
        url: '/admin/products',
        method: 'PATCH',
        body: { productId },
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
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
  useGetOneProductQuery,
  useAddProductMutation,
  useEditProductMutation,
  useToggleProductListMutation,
  useGetAllBrandsQuery,
  useGetAllGenresQuery,
} = adminApi;
