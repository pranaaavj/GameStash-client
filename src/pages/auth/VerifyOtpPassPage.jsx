import { Alert } from '../../components/common';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { setOtpStatus } from '@/redux/slices/authSlice';
import { toast, Toaster } from 'sonner';
import { useState } from 'react';
import { useVerifyOtpPassUserMutation } from '@/redux/api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { HStack, PinInput, PinInputField } from '@chakra-ui/react';

export const VerifyOtpPassPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userOtp, setUserOtp] = useState('');
  const { authEmail } = useSelector((state) => state.auth);
  const [verifyOtpPassUser, { isError, error }] =
    useVerifyOtpPassUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await verifyOtpPassUser({
        otp: userOtp,
        email: authEmail,
      }).unwrap();
      if (response.success) {
        dispatch(setOtpStatus({ otpStatus: 'verified' }));
        
        toast.success('Email verified ! Please complete the registration', {
          duration: 1500,
        });
        setTimeout(() => {
          navigate('/auth/register');
        }, 1500);
      }
    } catch (error) {
      console.log('Error from verifyOtpUser: ', error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row h-[calc(100vh-100px)] w-full items-center justify-center'>
      <div className='flex flex-col space-y-8 w-full max-w-sm sm:max-w-md lg:max-w-lg px-6 sm:px-8 md:px-12 lg:px-20 py-6 text-primary-text'>
        <h1 className='text-2xl sm:text-3xl font-semibold text-white text-center font-poppins'>
          OTP Verification for Password Reset
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

        <Toaster position='top-right' />
      </div>
    </div>
  );
};
