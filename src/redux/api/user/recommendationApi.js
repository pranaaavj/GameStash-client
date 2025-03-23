import { userBaseApi } from './userBaseApi';

const recommendationApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecommendedGames: builder.query({
      query: ({ limit = 10 } = {}) => ({
        url: '/user/recommendations',
        params: { limit },
      }),
      providesTags: ['Recommendations'],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetRecommendedGamesQuery } = recommendationApi;
