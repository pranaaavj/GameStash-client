import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    authStatus: null,
    role: null,
    token: null,
  },
  reducers: {
    setUser: (state, action) => {
      const { user, accessToken } = action.payload;
      state.userInfo = user;
      state.token = accessToken;
      state.role = user.role;
      state.authStatus =
        user.status === 'blocked' ? 'blocked' : 'authenticated';
    },
    logout: (state) => {
      state.userInfo = null;
      state.authStatus = null;
      state.role = null;
      state.token = null;
    },
  },
});

export const { logout, setUser } = userSlice.actions;

export default userSlice.reducer;
