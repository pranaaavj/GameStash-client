// import { userBaseApi } from './userBaseApi';

// const couponsApi = userBaseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     getAllCoupons: builder.query({
//       query: () => '/user/coupons',
//       providesTags: ['Coupons'],
//     }),
//     getEligibleCoupons: builder.query({
//       query: () => '/user/coupons/eligible',
//       providesTags: ['Coupons'],
//     }),
//   }),
// });

// export const { useGetAllCouponsQuery } = couponsApi;

import { userBaseApi } from './userBaseApi';

const couponsApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: () => '/admin/coupons',
      providesTags: ['Coupons'],
    }),
    getEligibleCoupons: builder.query({
      query: () => '/user/coupons/eligible',
      providesTags: ['Coupons'],
    }),
    getOneCoupon: builder.query({
      query: (couponId) => `/admin/coupons/${couponId}`,
      providesTags: ['Coupons'],
    }),
    // applyCoupon: builder.mutation({
    //   query: (couponCode) => ({
    //     url: '/user/cart/apply-coupon',
    //     method: 'POST',
    //     body: { code: couponCode },
    //   }),
    //   invalidatesTags: ['Cart', 'Coupons'],
    // }),
    // removeCoupon: builder.mutation({
    //   query: () => ({
    //     url: '/user/cart/remove-coupon',
    //     method: 'DELETE',
    //   }),
    //   invalidatesTags: ['Cart', 'Coupons'],
    // }),
  }),
});

export const {
  useGetAllCouponsQuery,
  useGetEligibleCouponsQuery,
  useGetOneCouponQuery,
  useApplyCouponMutation,
  useRemoveCouponMutation,
} = couponsApi;
