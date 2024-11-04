import {
  useResetOtpUserMutation,
  useVerifyOtpUserMutation,
} from '@/redux/api/user/authApi';
import { toast } from 'sonner';
import { Alert } from '../../components/common';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { useTimer } from '@/hooks';
import { useNavigate } from 'react-router-dom';
import { setOtpReset, setOtpStatus } from '@/redux/slices/authSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HStack, PinInput, PinInputField } from '@chakra-ui/react';

export const VerifyOtpPassword = () => {
  // Redux authorization slice
  const { authEmail, otpStatus, otpType, otpReset } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otpInput, setOtpInput] = useState('');
  const [otpInputValid, setOtpInputValid] = useState('');

  // Rtk query hook for verifying otp for password reset
  const [verifyOtpPassUser, { isError, error, isLoading, reset }] =
    useVerifyOtpUserMutation();
  const [
    resetOtp,
    { isError: isResetError, error: resetError, reset: resetResetOtp },
  ] = useResetOtpUserMutation();

  const otpTimer = useTimer(60, isLoading);

  useEffect(() => {
    // Checking for users who did not request for Otp
    if (otpStatus !== 'pending' && otpType !== 'forgotPassword') {
      navigate('/auth/login');
    }
  }, [otpStatus, otpType, navigate]);

  useEffect(() => {
    // Resetting validation when user types
    setOtpInputValid('');
    if (isError) reset();
    if (isResetError) resetResetOtp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpInput.trim()) {
      setOtpInputValid('Please enter your OTP');
      return;
    } else if (otpInput.length < 6) {
      setOtpInputValid('OTP needs to be exactly 6 digits.');
      return;
    }

    try {
      // Api request for verifying the otp
      const response = await verifyOtpPassUser({
        otp: otpInput,
        email: authEmail,
        type: otpType,
      }).unwrap();

      if (response?.success) {
        dispatch(setOtpStatus({ status: 'verified' }));

        toast.success(response?.message, {
          duration: 1500,
        });

        setTimeout(() => navigate('/auth/reset-pass'), 1500);
        setOtpInput('');
      }
    } catch (error) {
      toast.error('Something went wrong! Please try again.', {
        duration: 1400,
      });
      console.log('Error from verifyOtpUser: ', error);
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

        toast.success(response?.message, {
          duration: 1500,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row h-[calc(100vh-100px)] w-full items-center justify-center'>
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
            type='submit'>
            Verify
          </Button>
        </form>
        {/* API call errors */}
        {isError && (
          <Alert
            Icon={CircleX}
            variant='destructive'
            description={error?.data?.message}
          />
        )}
        {isResetError && (
          <Alert
            Icon={CircleX}
            variant='destructive'
            description={resetError?.data?.message}
          />
        )}

        {/* Otp input validation error */}
        {otpInputValid && (
          <Alert
            Icon={CircleX}
            variant='destructive'
            description={otpInputValid}
          />
        )}
        {/* Run the timer when the OTP is sent */}
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
                onClick={handleResetPass}>
                Resend OTP
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};
