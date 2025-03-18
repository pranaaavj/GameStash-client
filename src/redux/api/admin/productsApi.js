import { adminBaseApi } from './adminBaseApi';

const productsEndpoints = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Products - CRUD Operations
    getAllProducts: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/products?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [{ type: 'Product', id: 'LIST' }]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getOneProduct: builder.query({
      query: (productId) => ({ url: `/admin/products/${productId}` }),
      providesTags: (result, error, productId) => [
        { type: 'Product', id: productId },
      ],
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
      invalidatesTags: (result, error, { _id }) => [
        { type: 'Product', id: _id },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    toggleProductList: builder.mutation({
      query: (productId) => ({
        url: '/admin/products',
        method: 'PATCH',
        body: { productId },
      }),
      // invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    uploadProductImage: builder.mutation({
      query: (formData) => ({
        url: '/admin/images/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    deleteProductImage: builder.mutation({
      query: (publicId) => ({
        url: `/admin/images/${publicId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetOneProductQuery,
  useAddProductMutation,
  useEditProductMutation,
  useToggleProductListMutation,
  useUploadProductImageMutation,
  useDeleteProductImageMutation,
} = productsEndpoints;
