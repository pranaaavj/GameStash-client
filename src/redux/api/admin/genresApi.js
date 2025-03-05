import { adminBaseApi } from './adminBaseApi';

const genresEndpoints = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGenres: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/genres?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [{ type: 'Genre', id: 'LIST' }]
          : [{ type: 'Genre', id: 'LIST' }],
    }),

    getOneGenre: builder.query({
      query: (genreId) => ({ url: `/admin/genres/${genreId}` }),
      invalidatesTags: [{ type: 'Genre', id: 'LIST' }],
    }),

    addGenre: builder.mutation({
      query: (newGenreDetails) => ({
        url: '/admin/genres',
        method: 'POST',
        body: newGenreDetails,
      }),
      invalidatesTags: [{ type: 'Genre', id: 'LIST' }],
    }),

    editGenre: builder.mutation({
      query: (updatedGenre) => ({
        url: '/admin/genres',
        method: 'PUT',
        body: updatedGenre,
      }),
      invalidatesTags: [{ type: 'Genre', id: 'LIST' }],
    }),

    toggleGenreList: builder.mutation({
      query: (genreId) => ({
        url: '/admin/genres',
        method: 'PATCH',
        body: { genreId },
      }),
      invalidatesTags: [{ type: 'Genre', id: 'LIST' }],
    }),
  }),
});

export const {
  useAddGenreMutation,
  useEditGenreMutation,
  useGetAllGenresQuery,
  useGetOneGenreQuery,
  useToggleGenreListMutation,
} = genresEndpoints;
