import authReducer from './slices/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import { userApi } from './api/userApi';
import { loadState, saveState } from '@/utils';

// Persisted state in local storage
const persistedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: authApi.reducer,
  },
  preloadedState: persistedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(userApi.middleware),
});

// Any changes to the store would be persisted
store.subscribe(() => saveState(store.getState()));

export { Provider } from 'react-redux';
