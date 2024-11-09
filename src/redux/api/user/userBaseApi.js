import { createApi } from '@reduxjs/toolkit/query/react';
import { userBaseQueryWithReAuth } from '../user/userBaseQuery';

export const userBaseApi = createApi({
  reducerPath: 'api',
  baseQuery: userBaseQueryWithReAuth,
  tagTypes: ['Product', 'Brand', 'Genre', 'User', 'Address'],
  endpoints: () => ({}),
});
