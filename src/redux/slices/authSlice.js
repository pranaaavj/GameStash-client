import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    authEmail: null,
    otpStatus: null,
  },
  reducers: {
    setAuthEmail: (state, action) => {
      const { email, otpStatus } = action.payload;
      state.authEmail = email;
      state.otpStatus = otpStatus;
    },
    setOtpStatus: (state, action) => {
      state.otpStatus = action.payload.otpStatus;
    },
  },
});

export const { setAuthStatus, setOtpStatus, setAuthEmail } = authSlice.actions;

export default authSlice.reducer;
