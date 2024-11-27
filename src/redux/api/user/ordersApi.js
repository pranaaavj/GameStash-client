import { userBaseApi } from './userBaseApi';

const ordersApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Place an order
    placeOrder: builder.mutation({
      query: (orderDetails) => ({
        url: '/user/order',
        body: orderDetails,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
    // Get all orders
    getOrders: builder.query({
      query: ({ page = 1, limit = 5, queryOptions = null }) => ({
        url: '/user/order',
        params: { page, limit, queryOptions },
      }),
      providesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
    // Cancel order
    cancelOrders: builder.mutation({
      query: ({ orderId }) => ({
        url: `/user/order/${orderId}`,
        method: 'PATCH',
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
  }),
});

export const {
  // Orders
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useCancelOrdersMutation,
} = ordersApi;
