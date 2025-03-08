import { adminBaseApi } from './adminBaseApi';

const couponsEndpoints = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/coupons?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.coupons.map(({ _id }) => ({
                type: 'Coupon',
                id: _id,
              })),
              { type: 'Coupon', id: 'LIST' },
            ]
          : [{ type: 'Coupon', id: 'LIST' }],
    }),

    getOneCoupon: builder.query({
      query: (couponId) => ({ url: `/admin/coupons/${couponId}` }),
      providesTags: (result, error, couponId) => [
        { type: 'Coupon', id: couponId },
      ],
    }),

    addCoupon: builder.mutation({
      query: (newCouponDetails) => ({
        url: '/admin/coupons',
        method: 'POST',
        body: newCouponDetails,
      }),
      invalidatesTags: [{ type: 'Coupon', id: 'LIST' }],
    }),

    editCoupon: builder.mutation({
      query: ({ couponId, ...updatedCoupon }) => ({
        url: `/admin/coupons/${couponId}`,
        method: 'PUT',
        body: updatedCoupon,
      }),
      invalidatesTags: (result, error, { couponId }) => [
        { type: 'Coupon', id: couponId },
        { type: 'Coupon', id: 'LIST' },
      ],
    }),

    toggleCouponList: builder.mutation({
      query: (couponId) => ({
        url: `/admin/coupons/${couponId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, couponId) => [
        { type: 'Coupon', id: couponId },
        { type: 'Coupon', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useGetOneCouponQuery,
  useAddCouponMutation,
  useEditCouponMutation,
  useToggleCouponListMutation,
} = couponsEndpoints;
