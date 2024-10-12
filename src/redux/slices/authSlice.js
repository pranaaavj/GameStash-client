import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: null,
    authStatus: null,
    role: null,
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      const { userInfo, accessToken } = action.payload;
      state.userInfo = userInfo;
      state.token = accessToken;
      state.role = userInfo.role;
      state.authStatus =
        userInfo.status === 'blocked' ? 'blocked' : 'authenticated';
    },
    logout: (state) => {
      state.userInfo = null;
      state.authStatus = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;
