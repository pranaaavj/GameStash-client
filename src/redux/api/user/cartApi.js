import { userBaseApi } from './userBaseApi';

const cartApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get the cart for a specific user
    getCart: builder.query({
      query: () => '/user/cart',
      providesTags: ['Cart'],
    }),

    // Add an item to the cart
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

    // Update the quantity of a specific item
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

    // Remove a specific item from the cart
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

    // Clear the entire cart
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
