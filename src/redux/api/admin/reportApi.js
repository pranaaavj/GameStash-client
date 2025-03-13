import { adminBaseApi } from './adminBaseApi';

const reportApi = adminBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSalesReport: builder.query({
      query: ({ period, startDate, endDate }) => ({
        url: '/admin/reports/sales',
        params: { period, startDate, endDate },
      }),
      providesTags: ['SalesReport'],
    }),
    getSalesData: builder.query({
      query: ({ page = 1, limit = 10, startDate, endDate }) => ({
        url: '/admin/reports/sales/data',
        params: { page, limit, startDate, endDate },
      }),
      providesTags: ['SalesData'],
    }),
    downloadSalesExcel: builder.mutation({
      query: ({ startDate, endDate }) => ({
        url: '/admin/reports/sales/excel',
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
        url: '/admin/reports/sales/pdf',
        params: { startDate, endDate },
        responseHandler: async (response) => {
          const blob = await response.blob();
          return window.URL.createObjectURL(blob);
        },
        cache: 'no-cache',
      }),
    }),
  }),
});

export const {
  useGetSalesReportQuery,
  useGetSalesDataQuery,
  useDownloadSalesExcelMutation,
  useDownloadSalesPDFMutation,
} = reportApi;
