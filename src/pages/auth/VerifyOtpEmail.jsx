import {
  useVerifyOtpUserMutation,
  useResetOtpUserMutation,
} from '@/redux/api/authApi';
import { Alert } from '../../components/common';
import { toast } from 'sonner';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setOtpStatus, setOtpReset } from '@/redux/slices/authSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HStack, PinInput, PinInputField } from '@chakra-ui/react';
import { useTimer } from '@/hooks';

export const VerifyOtpEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { authEmail, otpStatus, otpType, otpReset } = useSelector(
    (state) => state.auth
  );

  const [otpInput, setOtpInput] = useState('');
  const [otpInputValid, setOtpInputValid] = useState('');

  const [verifyOtpUser, { isError, error, reset, isLoading }] =
    useVerifyOtpUserMutation();
  const [
    resetOtp,
    { isError: isResetError, error: resetError, reset: resetResetOtp },
  ] = useResetOtpUserMutation();

  const timer = useTimer(60, isLoading);

  useEffect(() => {
    if (otpStatus !== 'pending' && otpType !== 'registration') {
      navigate('/auth/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpStatus, navigate, otpInput]);

  useEffect(() => {
    // Resetting validations and errors
    setOtpInputValid('');
    if (isError) reset();
    if (isResetError) resetResetOtp();
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
      const response = await verifyOtpUser({
        otp: otpInput,
        email: authEmail,
        type: otpType,
      }).unwrap();

      if (response?.success) {
        dispatch(setOtpStatus({ status: 'verified' }));

        toast.success(response?.message, {
          duration: 1500,
        });
        
        setTimeout(() => navigate('/auth/register'), 1500);
        setOtpInput('');
      }
    } catch (error) {
      toast.error(error?.data?.message, {
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
      <div className='flex flex-col space-y-8 w-full max-w-sm sm:max-w-md lg:max-w-lg px-6 sm:px-8 md:px-12 lg:px-20 py-6 text-primary-text'>
        <h1 className='text-2xl sm:text-3xl font-semibold text-white text-center font-poppins'>
          Verify Your Email with OTP
        </h1>
        <p className='text-center font-sans font-light text-md sm:text-lg text-secondary-text'>
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
                isInvalid={!!otpInputValid}
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
            className='bg-accent-red hover:bg-hover-red mt-8 sm:mt-10 text-md sm:text-lg font-semibold uppercase font-sans'
            type='submit'>
            Verify
          </Button>
        </form>
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
            {timer > 0 ? (
              <span className='text-gray-500'>
                Please wait {timer} seconds.
              </span>
            ) : (
              <span
                className={`${
                  timer > 0 && 'text-muted-text'
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
