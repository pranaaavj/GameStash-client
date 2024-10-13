import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast, Toaster } from 'sonner';
import { Alert } from '../../components/common';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSendOtpUserMutation } from '@/redux/api/authApi';
import { HStack, PinInput, PinInputField } from '@chakra-ui/react';
import { setAuthEmail, setOtpStatus } from '@/redux/slices/authSlice';

export const VerifyOtpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userOtp, setUserOtp] = useState('');
  const [sendOtpUser, { isError, error }] = useSendOtpUserMutation();
  console.log(setUserOtp);
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(userOtp);
    try {
      const response = await sendOtpUser(userOtp).unwrap();
      if (response.success) {
        dispatch(setAuthEmail({ email: userOtp }));
        dispatch(setOtpStatus({ otpStatus: 'pending' }));
        toast.success('Otp sent successfully, Please check your email', {
          duration: 1500,
          onAutoClose: () => navigate('/verify-otp'),
        });
      }
    } catch (error) {
      console.log('Error from sentOtpUser: ', error);
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
                onComplete={handleSubmit}
                onChange={(value) => setUserOtp(value)}>
                <PinInputField />
                <PinInputField />
                <PinInputField />
                <PinInputField />
              </PinInput>
            </HStack>
          </div>

          <Button className='bg-accent-red hover:bg-hover-red mt-8 sm:mt-10 text-md sm:text-lg font-semibold uppercase font-sans'>
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
