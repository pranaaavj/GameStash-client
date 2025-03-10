import { userBaseApi } from './userBaseApi';

const cartApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => '/user/cart',
      providesTags: ['Cart'],
    }),

    addItemToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: '/user/cart',
        method: 'POST',
        body: { productId, quantity },
      }),
      invalidatesTags: (result, error, productId) => [
        'Cart',
        { type: 'Product', id: productId },
      ],
    }),

    updateCartItem: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: '/user/cart',
        method: 'PATCH',
        body: { productId, quantity },
      }),
      invalidatesTags: (result, error, productId) => [
        'Cart',
        { type: 'Product', id: productId },
      ],
    }),

    removeItemFromCart: builder.mutation({
      query: (productId) => ({
        url: `/user/cart/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, productId) => [
        'Cart',
        { type: 'Product', id: productId },
      ],
    }),

    clearCart: builder.mutation({
      query: () => ({
        url: '/user/cart',
        method: 'DELETE',
      }),
      invalidatesTags: ['Cart'],
    }),
  }),
});

export const {
  // Cart
  useGetCartQuery,
  useAddItemToCartMutation,
  useClearCartMutation,
  useRemoveItemFromCartMutation,
  useUpdateCartItemMutation,
} = cartApi;
