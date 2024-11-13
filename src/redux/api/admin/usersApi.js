import { adminBaseApi } from './adminBaseApi';

const usersEndpoints = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User management
    getAllUsers: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/users?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [{ type: 'User', id: 'LIST' }] // Tag the entire user list only
          : [{ type: 'User', id: 'LIST' }],
    }),

    // Get a single user by ID
    getOneUser: builder.query({
      query: (userId) => ({ url: `/admin/users/${userId}` }),
      providesTags: (result, error, userId) => [{ type: 'User', id: userId }],
    }),

    // Toggle block/unblock user status
    toggleBlockUser: builder.mutation({
      query: (userId) => ({
        url: '/admin/users',
        method: 'PATCH',
        body: { userId },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetOneUserQuery,
  useToggleBlockUserMutation,
} = usersEndpoints;
