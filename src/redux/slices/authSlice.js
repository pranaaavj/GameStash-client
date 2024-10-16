import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authEmail: null,
  otpType: null,
  otpStatus: null,
  otpReset: false,
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
    resetAuthState: () => {
      return initialState;
    },
  },
});

export const { resetAuthState, setAuthEmail, setOtpReset, setOtpStatus } =
  authSlice.actions;

export default authSlice.reducer;
