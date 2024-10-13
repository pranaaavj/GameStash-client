import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { setAuthEmail } from '@/redux/slices/authSlice';
import { toast, Toaster } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { InputField, Alert } from '../../components/common';
import { useEffect, useState } from 'react';
import { useSendOtpUserMutation } from '@/redux/api/authApi';
import { useDispatch } from 'react-redux';

export const SendOtpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userEmail, setUserEmail] = useState('');
  const [validationEmail, setValidationEmail] = useState('');
  const [sendOtpUser, { isError, error }] = useSendOtpUserMutation();

  useEffect(() => {
    setValidationEmail('');
  }, [userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (userEmail == '') {
      setValidationEmail('Email cannot be empty');
      return;
    } else if (!emailRegex.test(userEmail)) {
      setValidationEmail('Please enter a valid email');
      return;
    }

    try {
      const response = await sendOtpUser(userEmail).unwrap();
      if (response.success) {
        dispatch(setAuthEmail({ email: userEmail, otpStatus: 'pending' }));
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
          Enter Your Email to Get Started
        </h1>
        <p className='text-center font-sans font-light text-md sm:text-lg text-secondary-text'>
          We&#39;ll send an OTP to verify your email.
        </p>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col'>
          <div className='space-y-4 sm:space-y-5 font-poppins relative'>
            <InputField
              type='email'
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              label='Email'
              name='email'
              placeHolder='name@work.com'
              isInvalid={!!validationEmail}
              errorMessage={validationEmail}
              helperText={
                !validationEmail ? "We'll never share your email" : null
              }
            />
          </div>

          <Button className='bg-accent-red hover:bg-hover-red mt-8 sm:mt-10 text-md sm:text-lg font-semibold uppercase font-sans'>
            Send OTP
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
          Already have an account ?
          <Link
            to={'/login'}
            className='text-red-500 hover:underline ml-1 sm:ml-2 '>
            Login now
          </Link>
        </p>
        <Toaster position='top-right' />
      </div>
    </div>
  );
};
