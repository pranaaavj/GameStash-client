import { adminBaseApi } from './adminBaseApi';

const offersEndpoints = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOffers: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/offers?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.offers.map(({ _id }) => ({
                type: 'Offer',
                id: _id,
              })),
              { type: 'Offer', id: 'LIST' },
            ]
          : [{ type: 'Offer', id: 'LIST' }],
    }),

    getOneOffer: builder.query({
      query: (offerId) => ({ url: `/admin/offers/${offerId}` }),
      providesTags: (result, error, offerId) => [
        { type: 'Offer', id: offerId },
      ],
    }),

    addOffer: builder.mutation({
      query: (newOfferDetails) => ({
        url: '/admin/offers',
        method: 'POST',
        body: newOfferDetails,
      }),
      invalidatesTags: [
        { type: 'Offer', id: 'LIST' },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    editOffer: builder.mutation({
      query: ({ offerId, ...updatedOffer }) => ({
        url: `/admin/offers/${offerId}`,
        method: 'PUT',
        body: updatedOffer,
      }),
      invalidatesTags: (result, error, { offerId }) => [
        { type: 'Offer', id: offerId },
        { type: 'Offer', id: 'LIST' },
        { type: 'Product', id: 'LIST' },
      ],
    }),

    toggleOfferList: builder.mutation({
      query: (offerId) => ({
        url: `/admin/offers/${offerId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, offerId) => [
        { type: 'Offer', id: offerId },
        { type: 'Offer', id: 'LIST' },
        { type: 'Product', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetAllOffersQuery,
  useGetOneOfferQuery,
  useAddOfferMutation,
  useEditOfferMutation,
  useToggleOfferListMutation,
} = offersEndpoints;
