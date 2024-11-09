import { createApi } from '@reduxjs/toolkit/query/react';
import { AdminBaseQueryWithReAuth } from './adminBaseQuery';

export const adminBaseApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: AdminBaseQueryWithReAuth,
  tagTypes: ['Product', 'Brand', 'Genre', 'User', 'Address'],
  endpoints: () => ({}),
});
