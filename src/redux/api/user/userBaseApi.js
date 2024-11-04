import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReAuth } from '../baseQuery';

export const userBaseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['Product', 'Brand', 'Genre', 'User', 'Address'],
  endpoints: () => ({}),
});
