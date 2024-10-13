import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authEmail: null,
    otpStatus: null,
    authStatus: null,
  },
  reducers: {
    setAuthEmail: (state, action) => {
      state.authEmail = action.email;
    },
    setOtpStatus: (state, action) => {
      state.otpStatus = action.otpStatus;
    },
    setAuthStatus: (state, action) => {
      state.authStatus = action.authStatus;
    },
  },
});

export const { setAuthStatus, setOtpStatus, setAuthEmail } = authSlice.actions;

export default authSlice.reducer;
