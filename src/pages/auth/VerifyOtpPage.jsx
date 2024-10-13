import { Alert } from '../../components/common';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { useVerifyOtpUserMutation } from '@/redux/api/authApi';
import { setAuthStatus, setOtpStatus } from '@/redux/slices/authSlice';
import { HStack, PinInput, PinInputField } from '@chakra-ui/react';

export const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userOtp, setUserOtp] = useState('');
  const { authEmail } = useSelector((state) => state.auth);
  const [verifyOtpUser, { isError, error }] = useVerifyOtpUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    


    try {
      const response = await verifyOtpUser({
        otp: userOtp,
        email: authEmail,
      }).unwrap();
      console.log(response);
      if (response.success) {
        dispatch(setOtpStatus({ otpStatus: 'verified' }));
        dispatch(setAuthStatus({ authStatus: 'authenticated' }));
        toast.success('Email verified ! Please complete the register', {
          duration: 1500,
          onAutoClose: () => navigate('/register'),
        });
      }
    } catch (error) {
      console.log('Error from verifyOtpUser: ', error);
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
                otp
                autoFocus
                focusBorderColor='#ff5252'
                value={userOtp}
                onChange={(value) => setUserOtp(value)}>
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
        <p className='text-xs sm:text-sm text-gray-400 mt-4 text-center'>
          Didn&#39;t receive the OTP ?
          <span
            to={'/login'}
            className='text-red-500 hover:underline ml-1 sm:ml-2 '>
            Resend OTP
          </span>
        </p>

        <Toaster position='top-right' />
      </div>
    </div>
  );
};
