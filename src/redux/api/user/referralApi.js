import { userBaseApi } from './userBaseApi';

const referralApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    applyReferral: builder.mutation({
      query: (data) => ({
        url: '/user/referral/apply',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'User', id: 'DETAILS' }],
    }),
  }),
});

export const { useApplyReferralMutation } = referralApi;
