import { userBaseApi } from './userBaseApi';

const addressApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all addresses of user
    getAllAddresses: builder.query({
      query: () => ({
        url: '/user/address',
      }),
      providesTags: ['Address'],
    }),

    // Get a specific address by ID
    getOneAddress: builder.query({
      query: (addressId) => ({
        url: `/user/address/${addressId}`,
      }),
      providesTags: ['Address'],
    }),

    // Add a new address
    addAddress: builder.mutation({
      query: (newAddress) => ({
        url: '/user/address',
        method: 'POST',
        body: newAddress,
      }),
      invalidatesTags: ['Address'],
    }),

    // Update an address by ID
    editAddress: builder.mutation({
      query: ({ addressId, updatedAddress }) => ({
        url: `/user/address/${addressId}`,
        method: 'PATCH',
        body: updatedAddress,
      }),
      invalidatesTags: ['Address'],
    }),

    // Delete an address by ID
    deleteAddress: builder.mutation({
      query: (addressId) => ({
        url: `/user/address/${addressId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  // User address
  useAddAddressMutation,
  useDeleteAddressMutation,
  useEditAddressMutation,
  useGetAllAddressesQuery,
  useGetOneAddressQuery,
} = addressApi;
