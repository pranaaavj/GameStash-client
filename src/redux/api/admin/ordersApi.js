import { adminBaseApi } from './adminBaseApi';

const ordersApi = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: 'admin/order',
        params: { page, limit },
      }),
      providesTags: [{ type: 'Order', id: 'LIST' }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `admin/order/${orderId}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    requestReturnAdmin: builder.mutation({
      query: ({ orderId, productId, action }) => ({
        url: `admin/order/${orderId}`,
        method: 'PUT',
        body: { productId, action },
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useRequestReturnAdminMutation,
} = ordersApi;
