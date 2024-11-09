import { adminBaseApi } from './adminBaseApi';

const brandsEndpoints = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Brands - CRUD Operations
    getAllBrands: builder.query({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/brands?page=${page}&limit=${limit}`,
      }),
      providesTags: (result) =>
        result
          ? [{ type: 'Brand', id: 'LIST' }]
          : [{ type: 'Brand', id: 'LIST' }],
    }),

    getOneBrand: builder.query({
      query: (brandId) => ({ url: `/admin/brands/${brandId}` }),
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
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
      invalidatesTags: [{ type: 'Brand', id: 'LIST' }],
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
  useGetAllBrandsQuery,
  useGetOneBrandQuery,
  useAddBrandMutation,
  useEditBrandMutation,
  useToggleBrandListMutation,
} = brandsEndpoints;
