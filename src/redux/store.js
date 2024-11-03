import storage from 'redux-persist/es/storage';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import adminReducer from './slices/adminSlice';
import { authApi } from './api/authApi';
import { userApi } from './api/userApi';
import { adminApi } from './api/adminApi';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'admin'],
};

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  admin: adminReducer,
  [authApi.reducerPath]: authApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(userApi.middleware)
      .concat(adminApi.middleware),
});

export const persistor = persistStore(store);

export { Provider } from 'react-redux';
export { PersistGate } from 'redux-persist/integration/react';
