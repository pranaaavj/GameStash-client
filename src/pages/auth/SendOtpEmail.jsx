import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/shadcn/components/ui/button';
import { InputField } from '../../components/common';
import { useSendOtpUserMutation } from '@/redux/api/user/authApi';
import { setAuthEmail, setOtpStatus } from '@/redux/slices/authSlice';
import { handleApiError, showToast } from '@/utils';

export const SendOtpEmail = () => {
  const { otpStatus } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userEmail, setUserEmail] = useState('');
  const [validationEmail, setValidationEmail] = useState('');
  const [sendOtpUser, { isLoading }] = useSendOtpUserMutation();

  useEffect(() => {
    setValidationEmail('');
  }, [userEmail, otpStatus]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!userEmail.trim()) {
        setValidationEmail('Email cannot be empty.');
        return;
      } else if (!emailRegex.test(userEmail)) {
        setValidationEmail('Please enter a valid email address.');
        return;
      }

      try {
        const response = await sendOtpUser({
          email: userEmail,
          type: 'registration',
        }).unwrap();

        if (response?.success) {
          dispatch(setAuthEmail({ email: userEmail, type: 'registration' }));
          dispatch(setOtpStatus({ status: 'pending' }));
          showToast.success(response.message);
          navigate('/verify-email');
        }
      } catch (err) {
        handleApiError(err);
      }
    },
    [userEmail, sendOtpUser, dispatch, navigate]
  );

  return (
    <div className='flex flex-col md:flex-row pt-20 h-min-screen w-full items-center justify-center'>
      <div className='flex flex-col space-y-8 w-full max-w-sm sm:max-w-md lg:max-w-lg px-6 sm:px-8 md:px-12 lg:px-20 py-6 text-primary-text'>
        <h1 className='text-2xl sm:text-3xl font-semibold text-white text-center font-poppins'>
          Enter Your Email to Get Started
        </h1>
        <p className='text-center font-sans font-light text-sm sm:text-md text-secondary-text'>
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

          <Button
            className='bg-accent-red hover:bg-hover-red mt-8 sm:mt-10 text-md sm:text-lg font-semibold uppercase font-sans'
            disabled={isLoading}>
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </Button>
        </form>

        <p className='text-xs sm:text-sm text-gray-400 mt-4 text-center'>
          Already have an account ?
          <Link
            to='/login'
            className='text-red-500 hover:underline ml-1 sm:ml-2'>
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};
