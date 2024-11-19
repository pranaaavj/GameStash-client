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
    }),
    // Get all orders
    getOrders: builder.query({
      query: ({ page = 1, limit = 5, queryOptions = null }) => ({
        url: '/user/order',
        params: { page, limit, queryOptions },
      }),
    }),
  }),
});

export const {
  // Orders
  usePlaceOrderMutation,
  useGetOrdersQuery,
} = ordersApi;
