import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userEmail: null,
    otpStatus: null,
    authStatus: null,
  },
  reducers: {
    setUserEmail: (state, action) => {
      state.userEmail = action.email;
    },
    setOtpStatus: (state, action) => {
      state.otpStatus = action.otpStatus;
    },
    setAuthStatus: (state, action) => {
      state.authStatus = action.authStatus;
    },
  },
});

export const { setAuthStatus, setOtpStatus, setUserEmail } = authSlice.actions;

export default authSlice.reducer;
