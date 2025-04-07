import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/shadcn/components/ui/button';
import { useTimer } from '@/hooks';
import { showToast, handleApiError } from '@/utils';
import { setOtpReset, setOtpStatus } from '@/redux/slices/authSlice';
import {
  useVerifyOtpUserMutation,
  useResetOtpUserMutation,
} from '@/redux/api/user/authApi';

import { HStack, PinInput, PinInputField } from '@chakra-ui/react';

export const VerifyOtpPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { authEmail, otpStatus, otpType, otpReset } = useSelector(
    (state) => state.auth
  );

  const [otpInput, setOtpInput] = useState('');
  const [otpInputValid, setOtpInputValid] = useState('');

  const [verifyOtpPassUser, { isLoading }] = useVerifyOtpUserMutation();
  const [resetOtp, { isLoading: isResetOtpLoading }] =
    useResetOtpUserMutation();

  const otpTimer = useTimer(60, isLoading);

  useEffect(() => {
    if (otpStatus !== 'pending' && otpType !== 'forgotPassword') {
      navigate('/auth/login');
    }
  }, [otpStatus, otpType, navigate]);

  useEffect(() => {
    setOtpInputValid('');
  }, [otpInput]);

  useEffect(() => {
    if (otpInputValid) {
      showToast.error(otpInputValid);
    }
  }, [otpInputValid]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpInput.trim()) {
      setOtpInputValid('Please enter your OTP');
      return;
    }

    if (otpInput.length < 6) {
      setOtpInputValid('OTP needs to be exactly 6 digits.');
      return;
    }

    try {
      const response = await verifyOtpPassUser({
        otp: otpInput,
        email: authEmail,
        type: otpType,
      }).unwrap();

      if (response?.success) {
        dispatch(setOtpStatus({ status: 'verified' }));
        showToast.success(response.message);
        navigate('/auth/reset-pass');
        setOtpInput('');
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleResetPass = async () => {
    try {
      const response = await resetOtp({
        email: authEmail,
        type: otpType,
      }).unwrap();

      if (response?.success) {
        dispatch(setOtpReset({ reset: true }));
        showToast.success(response.message);
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className='flex flex-col md:flex-row pt-20 w-full items-center justify-center'>
      <div className='flex flex-col space-y-8 w-full max-w-sm sm:max-w-md md:max-w-lg px-6 sm:px-8 md:px-12 lg:px-20 py-6 text-primary-text'>
        <h1 className='text-xl sm:text-2xl font-semibold text-white text-center font-poppins'>
          OTP Verification for Password Reset
        </h1>

        <p className='text-center font-sans font-light text-sm sm:text-md text-secondary-text'>
          Enter the OTP sent to your email.
        </p>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col'>
          <div className='space-y-4 sm:space-y-5 font-poppins'>
            <HStack
              display='flex'
              justify='center'>
              <PinInput
                otp
                autoFocus
                focusBorderColor='#ff5252'
                value={otpInput}
                onChange={(value) => setOtpInput(value)}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </div>

          <Button
            className='bg-accent-red hover:bg-hover-red mt-8 sm:mt-10 text-sm sm:text-md font-semibold uppercase font-sans'
            type='submit'
            disabled={isLoading || isResetOtpLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </form>

        {!otpReset && (
          <p className='font-mont text-sm text-center text-primary-text'>
            Didn&#39;t receive OTP?{' '}
            {otpTimer > 0 ? (
              <span className='text-gray-500'>
                Please wait {otpTimer} seconds.
              </span>
            ) : (
              <span
                className={`${
                  otpTimer > 0 && 'text-muted-text'
                }hover:text-accent-red text-accent-red cursor-pointer transition-colors duration-200 ease-in-out`}
                disabled={isResetOtpLoading}
                onClick={handleResetPass}>
                {isResetOtpLoading ? 'Resending...' : 'Resend OTP'}
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};
