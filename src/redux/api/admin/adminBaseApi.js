import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuthAdmin } from '../baseQueryAdmin';

export const adminBaseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReAuthAdmin,
  tagTypes: ['Product', 'Brand', 'Genre', 'User', 'Address'],
  endpoints: () => ({}),
});
