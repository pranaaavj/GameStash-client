import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuthAdmin } from './baseApiAdmin';

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: baseQueryWithReAuthAdmin,
  endpoints: (builder) => ({
    // Authorization
    loginAdmin: builder.mutation({
      query: (adminInfo) => ({
        url: '/admin/login',
        method: 'POST',
        body: adminInfo,
      }),
    }),
    logoutAdmin: builder.mutation({
      query: (adminInfo) => ({
        url: '/admin/logout',
        method: 'POST',
        body: adminInfo,
      }),
    }),
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
    // Brands - CRUD Operations
    getAllBrands: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/brands?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.brands.map(({ id }) => ({
                type: 'Brand',
                id,
              })), // Tag each brand by its unique ID
              { type: 'Brand', id: 'LIST' },
            ] // Tag the entire list
          : [{ type: 'Brand', id: 'LIST' }],
    }),
    getOneBrand: builder.query({
      query: (brandId) => ({ url: `/admin/brands/${brandId}` }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),
    addBrand: builder.mutation({
      query: (newBrandDetails) => ({
        url: '/admin/brands',
        method: 'POST',
        body: newBrandDetails,
      }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),
    editBrand: builder.mutation({
      query: (updatedBrand) => ({
        url: '/admin/brands',
        method: 'PUT',
        body: updatedBrand,
      }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),
    toggleBrandList: builder.mutation({
      query: (brandId) => ({
        url: '/admin/brands',
        method: 'PATCH',
        body: { brandId },
      }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),

    // Getting all genres
    getAllGenres: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/genres?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.genres.map(({ id }) => ({
                type: 'Genre',
                id,
              })), // Tag each genre by its unique ID
              { type: 'Genre', id: 'LIST' },
            ] // Tag the entire list
          : [{ type: 'Genre', id: 'LIST' }],
    }),
    getOneGenre: builder.query({
      query: (genreId) => ({ url: `/admin/genres/${genreId}` }),
      invalidatesTags: [{ type: 'Genre', id: 'LIST' }],
    }),
    addGenre: builder.mutation({
      query: (newGenreDetails) => ({
        url: '/admin/genres',
        method: 'POST',
        body: newGenreDetails,
      }),
      invalidatesTags: [{ type: 'Genre', id: 'LIST' }],
    }),
    editGenre: builder.mutation({
      query: (updatedGenre) => ({
        url: '/admin/genres',
        method: 'PUT',
        body: updatedGenre,
      }),
      invalidatesTags: [{ type: 'Genre', id: 'LIST' }],
    }),
    toggleGenreList: builder.mutation({
      query: (genreId) => ({
        url: '/admin/genres',
        method: 'PATCH',
        body: { genreId },
      }),
      invalidatesTags: [{ type: 'Genre', id: 'LIST' }],
    }),

    // User Management
    // Get all users with pagination
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/users?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.users.map(({ id }) => ({
                type: 'User',
                id,
              })), // Tag each user by its unique ID
              { type: 'User', id: 'LIST' },
            ] // Tag the entire list
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Get a single user by ID
    getOneUser: builder.query({
      query: (userId) => ({ url: `/admin/users/${userId}` }),
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),

    // Toggle block/unblock user status
    toggleBlockUser: builder.mutation({
      query: (userId) => ({
        url: '/admin/users',
        method: 'PATCH',
        body: { userId },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  // Authorization
  useLoginAdminMutation,
  useLogoutAdminMutation,
  // Product CRUD Hooks
  useGetAllProductsQuery,
  useGetOneProductQuery,
  useAddProductMutation,
  useEditProductMutation,
  useToggleProductListMutation,
  // Brand CRUD Hooks
  useGetAllBrandsQuery,
  useGetOneBrandQuery,
  useAddBrandMutation,
  useEditBrandMutation,
  useToggleBrandListMutation,
  // Genre CRUD Hooks
  useGetAllGenresQuery,
  useGetOneGenreQuery,
  useAddGenreMutation,
  useEditGenreMutation,
  useToggleGenreListMutation,
  // User Management
  useGetAllUsersQuery,
  useGetOneUserQuery,
  useToggleBlockUserMutation,
} = adminApi;
