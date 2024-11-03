import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    authStatus: null,
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      const { user } = action.payload;
      state.userInfo = user;
      state.authStatus = user.status;
    },
    setToken: (state, action) => {
      state.token = action.payload.token;
    },
    setStatus: (state, action) => {
      state.authStatus = action.payload.status;
    },
    logout: (state) => {
      state.userInfo = null;
      state.authStatus = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { logout, setUser, setToken, setStatus } = userSlice.actions;

export default userSlice.reducer;
