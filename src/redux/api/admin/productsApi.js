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

    // Get one product
    getOneProduct: builder.query({
      query: (productId) => ({ url: `/admin/products/${productId}` }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // Add a product
    addProduct: builder.mutation({
      query: (newProductDetails) => ({
        url: '/admin/products',
        method: 'POST',
        body: newProductDetails,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // Edit a product
    editProduct: builder.mutation({
      query: (updatedProduct) => ({
        url: '/admin/products',
        method: 'PUT',
        body: updatedProduct,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    // Toggle listing of products
    toggleProductList: builder.mutation({
      query: (productId) => ({
        url: '/admin/products',
        method: 'PATCH',
        body: { productId },
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
} = productsEndpoints;
