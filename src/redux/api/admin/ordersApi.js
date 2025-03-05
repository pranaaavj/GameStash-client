import { adminBaseApi } from './adminBaseApi';

const ordersApi = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all orders
    getAllOrders: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: 'admin/order',
        params: { page, limit },
      }),
      providesTags: [{ type: 'Order', id: 'LIST' }],
    }),

    // Update order status
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `admin/order/${orderId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
  }),
});

export const { useGetAllOrdersQuery, useUpdateOrderStatusMutation } = ordersApi;
