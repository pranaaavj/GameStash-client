import { adminBaseApi } from './adminBaseApi';

const salesApi = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query({
      query: ({ period, startDate, endDate }) => ({
        url: '/admin/sales',
        params: { period, startDate, endDate },
      }),
      providesTags: ['SalesReport'],
    }),
    getSalesData: builder.query({
      query: ({ page = 1, limit = 10, startDate, endDate }) => ({
        url: '/admin/sales/data',
        params: { page, limit, startDate, endDate },
      }),
      providesTags: ['SalesData'],
    }),
    downloadSalesExcel: builder.mutation({
      query: ({ startDate, endDate }) => ({
        url: '/admin/sales/excel',
        params: { startDate, endDate },
        responseHandler: async (response) => {
          const blob = await response.blob();
          return window.URL.createObjectURL(blob);
        },
        cache: 'no-cache',
      }),
    }),
    downloadSalesPDF: builder.mutation({
      query: ({ startDate, endDate }) => ({
        url: `/admin/sales/pdf?startDate=${startDate}&endDate=${endDate}`,
        method: 'GET',
        responseHandler: async (response) => {
          const blob = await response.blob();
          return window.URL.createObjectURL(blob);
        },
      }),
    }),
  }),
});

export const {
  useGetSalesReportQuery,
  useGetSalesDataQuery,
  useDownloadSalesExcelMutation,
  useDownloadSalesPDFMutation,
} = salesApi;
