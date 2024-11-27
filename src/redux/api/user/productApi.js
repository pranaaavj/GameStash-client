import { userBaseApi } from './userBaseApi';

const productApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all the products
    getProducts: builder.query({
      query: ({ page = 1, limit = 5, queryOptions = null }) => ({
        url: '/user/products',
        params: { page, limit, queryOptions },
      }),
    }),

    // Search products
    searchProducts: builder.query({
      query: ({ page = 1, limit = 5, queryOptions = null }) => ({
        url: '/user/products/search',
        params: { page, limit, ...queryOptions },
      }),
    }),

    // Getting products by genre
    getProductsByGenre: builder.query({
      query: ({ page = 1, limit = 5, genre }) => ({
        url: `/user/products/${genre}`,
        params: { page, limit },
      }),
    }),

    // Get single product
    getProduct: builder.query({
      query: (productId) => ({
        url: `/user/product/${productId}`,
      }),
    }),

    // Get all the reviews of a product
    getReviewByProduct: builder.query({
      query: (productId) => ({
        url: `/user/review/${productId}`,
      }),
    }),

    // Get all genres
    getAllGenres: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/user/genres?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [{ type: 'Genre', id: 'LIST' }]
          : [{ type: 'Genre', id: 'LIST' }],
    }),

    // Get all brands
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
  useGetAllGenresQuery,
  useGetAllBrandsQuery,
  useSearchProductsQuery,
  useLazySearchProductsQuery,
} = productApi;
