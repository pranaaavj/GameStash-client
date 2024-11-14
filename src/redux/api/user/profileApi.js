import { userBaseApi } from './userBaseApi';

const profileApi = userBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Profile
    getProfileDetails: builder.query({
      query: (userId) => ({
        url: `/user/details/${userId}`,
      }),
    }),

    // Edit profile
    editUserProfile: builder.mutation({
      query: ({ userId, newUserInfo }) => ({
        url: `/user/details/${userId}`,
        method: 'PATCH',
        body: newUserInfo,
      }),
    }),

    // Change user password
    changeUserPass: builder.mutation({
      query: ({ userId, passData }) => ({
        url: `/user/details/change-pass/${userId}`,
        method: 'PATCH',
        body: passData,
      }),
    }),
  }),
});

export const {
  // User Profile
  useGetProfileDetailsQuery,
  useEditUserProfileMutation,
  useChangeUserPassMutation,
} = profileApi;
