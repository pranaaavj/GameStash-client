import { userBaseApi } from './userBaseApi';

const walletApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Wallet Details
    getWallet: builder.query({
      query: () => ({
        url: '/user/wallet',
      }),
      providesTags: [{ type: 'Wallet', id: 'LIST' }],
    }),

    // Add Money to Wallet
    addMoneyToWallet: builder.mutation({
      query: (amount) => ({
        url: '/user/wallet',
        method: 'POST',
        body: { amount },
      }),
      invalidatesTags: [{ type: 'Wallet', id: 'LIST' }],
    }),

    // Verify Payment
    verifyAddMoney: builder.mutation({
      query: (paymentData) => ({
        url: '/user/wallet',
        method: 'PATCH',
        body: paymentData,
      }),
      invalidatesTags: [{ type: 'Wallet', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetWalletQuery,
  useAddMoneyToWalletMutation,
  useVerifyAddMoneyMutation,
} = walletApi;
