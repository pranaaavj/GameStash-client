import { userBaseApi } from './userBaseApi';

const wishlistApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => ({
        url: '/user/wishlist',
      }),
      providesTags: (result) =>
        result
          ? [{ type: 'Wishlist', id: 'LIST' }]
          : [{ type: 'Wishlist', id: 'LIST' }],
    }),

    addToWishlist: builder.mutation({
      query: (productId) => ({
        url: '/user/wishlist',
        method: 'POST',
        body: { productId },
      }),
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),

    removeFromWishlist: builder.mutation({
      query: (productId) => ({
        url: `/user/wishlist/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Wishlist', id: 'LIST' }],
    }),

    moveToCart: builder.mutation({
      query: (productId) => ({
        url: `/user/wishlist/${productId}/cart`,
        method: 'POST',
      }),
      invalidatesTags: [
        { type: 'Wishlist', id: 'LIST' },
        { type: 'Cart', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useMoveToCartMutation,
} = wishlistApi;
