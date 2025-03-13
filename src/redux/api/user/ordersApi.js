import { userBaseApi } from './userBaseApi';

const ordersApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (orderDetails) => ({
        url: '/user/order',
        body: orderDetails,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),

    getOrders: builder.query({
      query: ({ page = 1, limit = 5, queryOptions = null }) => ({
        url: '/user/order',
        params: { page, limit, queryOptions },
      }),
      providesTags: [{ type: 'Orders', id: 'LIST' }],
    }),

    getOrder: builder.query({
      query: ({ orderId }) => ({
        url: `/user/order/${orderId}`,
      }),
      providesTags: [{ type: 'Orders', id: 'LIST' }],
    }),

    cancelOrder: builder.mutation({
      query: ({ orderId, productId }) => ({
        url: `/user/order/${orderId}`,
        method: 'PUT',
        body: { productId },
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),

    verifyRazorpay: builder.mutation({
      query: (paymentData) => ({
        url: `/user/order/razorpay`,
        method: 'POST',
        body: paymentData,
      }),
      invalidatesTags: [{ type: 'Orders', id: 'LIST' }],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetOrdersQuery,
  useGetOrderQuery,
  useCancelOrderMutation,
  useVerifyRazorpayMutation,
} = ordersApi;
