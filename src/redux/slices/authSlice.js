import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authEmail: null,
  otpType: null,
  otpStatus: null,
  otpReset: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthEmail: (state, action) => {
      const { email, type } = action.payload;
      state.authEmail = email;
      state.otpType = type;
    },
    setOtpReset: (state, action) => {
      state.otpReset = action.payload?.reset;
    },
    setOtpStatus: (state, action) => {
      state.otpStatus = action.payload?.status;
    },
    resetOtpState: () => {
      return initialState;
    },
  },
});

export const { setOtpStatus, setAuthEmail } = authSlice.actions;

export default authSlice.reducer;
