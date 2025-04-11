import { userBaseApi } from './userBaseApi';

const productApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, limit = 5, type }) => ({
        url: '/user/products',
        params: { page, limit, type },
      }),
      providesTags: (result) =>
        result
          ? result.data.products.map(({ id }) => ({ type: 'Product', id }))
          : [{ type: 'Product', id: 'LIST' }],
    }),

    searchProducts: builder.query({
      query: ({ page = 1, limit = 5, queryOptions = null }) => ({
        url: '/user/products/search',
        params: { page, limit, ...queryOptions },
      }),
    }),

    getProductsByGenre: builder.query({
      query: ({ page = 1, limit = 5, genre }) => ({
        url: `/user/products/${genre}`,
        params: { page, limit },
      }),
    }),

    getRelatedProducts: builder.query({
      query: ({ page = 1, limit = 5, productId }) => ({
        url: `/user/product/related/${productId}`,
        params: { page, limit },
      }),
    }),

    getProduct: builder.query({
      query: (productId) => ({
        url: `/user/product/${productId}`,
      }),
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    getReviewByProduct: builder.query({
      query: (productId) => ({
        url: `/user/review/${productId}`,
      }),
    }),

    getAllGenres: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/user/genres?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [{ type: 'Genre', id: 'LIST' }]
          : [{ type: 'Genre', id: 'LIST' }],
    }),

    getAllBrands: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/user/brands?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [{ type: 'Brand', id: 'LIST' }]
          : [{ type: 'Brand', id: 'LIST' }],
    }),
  }),
});

export const {
  // User home
  useGetProductQuery,
  useGetProductsQuery,
  useGetProductsByGenreQuery,
  useGetReviewByProductQuery,
  useGetRelatedProductsQuery,
  useGetAllGenresQuery,
  useGetAllBrandsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
} = productApi;
