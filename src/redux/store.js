import authReducer from './slices/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/userApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

export { Provider } from 'react-redux';
