import { adminBaseApi } from './adminBaseApi';

const brandsEndpoints = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/brands?page=${page}&limit=${limit}`,
      }),
      providesTags: [{ type: 'Brand', id: 'LIST' }],
    }),

    getOneBrand: builder.query({
      query: (brandId) => ({ url: `/admin/brands/${brandId}` }),
      providesTags: (result, error, brandId) => [
        { type: 'Brand', id: brandId },
      ],
    }),

    addBrand: builder.mutation({
      query: (newBrandDetails) => ({
        url: '/admin/brands',
        method: 'POST',
        body: newBrandDetails,
      }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),

    editBrand: builder.mutation({
      query: (updatedBrand) => ({
        url: '/admin/brands',
        method: 'PUT',
        body: updatedBrand,
      }),
      invalidatesTags: (result, error, { brandId }) => [
        { type: 'Brand', id: 'LIST' },
        { type: 'Brand', id: brandId },
      ],
    }),

    toggleBrandList: builder.mutation({
      query: (brandId) => ({
        url: '/admin/brands',
        method: 'PATCH',
        body: { brandId },
      }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
    }),
  }),
});

export const {
  useAddBrandMutation,
  useEditBrandMutation,
  useGetAllBrandsQuery,
  useGetOneBrandQuery,
  useToggleBrandListMutation,
} = brandsEndpoints;
