import { createApi } from '@reduxjs/toolkit/query/react';
import { userBaseQueryWithReAuth } from './userBaseQuery';

export const userBaseApi = createApi({
  reducerPath: 'userApi',
  baseQuery: userBaseQueryWithReAuth,
  tagTypes: [
    'Product',
    'Brand',
    'Genre',
    'User',
    'Address',
    'Cart',
    'Orders',
    'Wallet',
    'Coupons',
  ],
  endpoints: () => ({}),
});
