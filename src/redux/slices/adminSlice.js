import { createSlice } from '@reduxjs/toolkit';

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    adminInfo: null,
    authStatus: null,
    token: null,
  },
  reducers: {
    setAdmin: (state, action) => {
      const { admin } = action.payload;
      state.adminInfo = admin;
      state.authStatus = admin.status;
    },
    setTokenAdmin: (state, action) => {
      state.token = action.payload.token;
    },
    setStatusAdmin: (state, action) => {
      state.authStatus = action.payload.status;
    },
    logoutAdmin: (state) => {
      state.adminInfo = null;
      state.authStatus = null;
      state.token = null;
    },
  },
});

export const { logoutAdmin, setAdmin, setStatusAdmin, setTokenAdmin } =
  adminSlice.actions;

export default adminSlice.reducer;
