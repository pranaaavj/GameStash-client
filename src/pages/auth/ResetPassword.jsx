import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/shadcn/components/ui/button';
import { InputField } from '../../components/common';
import { useResetPassUserMutation } from '@/redux/api/user/authApi';
import { resetAuthState } from '@/redux/slices/authSlice';
import { showToast, handleApiError } from '@/utils';

const initialInput = {
  password: '',
  cPassword: '',
};

export const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authEmail } = useSelector((state) => state.auth);

  const [userInput, setUserInput] = useState(initialInput);
  const [validation, setValidation] = useState(initialInput);

  const [resetPass, { isLoading }] = useResetPassUserMutation();

  useEffect(() => {
    setValidation(initialInput);
  }, [userInput]);

  const handleChange = ({ target: { name, value } }) => {
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    if (userInput.password !== userInput.cPassword) {
      setValidation((prev) => ({
        ...prev,
        cPassword: 'Passwords do not match',
      }));
      return;
    }

    if (!passwordRegex.test(userInput.password)) {
      setValidation((prev) => ({
        ...prev,
        password:
          'Password must be at least 6 characters long and include at least one letter and one number.',
      }));
      return;
    }

    try {
      const response = await resetPass({
        password: userInput.password,
        email: authEmail,
      }).unwrap();

      if (response?.success) {
        showToast.success(response.message);
        dispatch(resetAuthState());
        navigate('/auth/login');
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className='flex flex-col md:flex-row pt-20 w-full items-center justify-center'>
      <div className='flex flex-col space-y-8 w-full max-w-sm sm:max-w-md md:max-w-lg px-6 sm:px-8 md:px-12 lg:px-16 py-6 text-primary-text'>
        <h1 className='text-xl sm:text-2xl font-semibold text-white text-center font-poppins'>
          Set Your New Password
        </h1>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col'>
          <div className='space-y-4 sm:space-y-5 font-poppins'>
            <InputField
              type='password'
              value={userInput.password}
              onChange={handleChange}
              label='New Password'
              name='password'
              placeHolder='Enter your new password'
              isInvalid={!!validation.password}
              errorMessage={validation.password}
              helperText={
                !validation.password
                  ? 'Password must be at least 6 characters long and include at least one letter and one number.'
                  : null
              }
            />

            <InputField
              type='password'
              value={userInput.cPassword}
              onChange={handleChange}
              label='Confirm New Password'
              name='cPassword'
              placeHolder='Re-enter your new password'
              isInvalid={!!validation.cPassword}
              errorMessage={validation.cPassword}
            />
          </div>

          <Button
            className='bg-accent-red hover:bg-hover-red mt-8 sm:mt-10 text-sm sm:text-md font-semibold uppercase font-sans'
            disabled={isLoading}>
            {isLoading ? 'Resetting password...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};
