import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/shadcn/components/ui/button';
import { InputField } from '../../components/common';

import { useRegisterUserMutation } from '@/redux/api/user/authApi';
import { resetAuthState } from '@/redux/slices/authSlice';

import { validateRegister, showToast, handleApiError } from '@/utils';

const initialInput = {
  name: '',
  phoneNumber: '',
  password: '',
  cPassword: '',
};

export const Register = () => {
  const { authEmail } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInput, setUserInput] = useState(initialInput);
  const [validation, setValidation] = useState(initialInput);

  const [registerUser, { isLoading }] = useRegisterUserMutation();

  useEffect(() => {
    setValidation(initialInput);
  }, [userInput]);

  const handleChange = ({ target: { name, value } }) => {
    setUserInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateRegister(userInput);
    if (Object.keys(validation).length > 0) {
      setValidation(validation);
      return;
    }

    //TODO: Replace this with destructuring in prod
    delete userInput.cPassword;

    try {
      const response = await registerUser({
        ...userInput,
        email: authEmail,
      }).unwrap();

      if (response?.success) {
        showToast.success(response.message);
        dispatch(resetAuthState());
        setUserInput(initialInput);

        navigate('/login');
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <div className='flex min-h-screen w-full pt-10 justify-center'>
      <div className='flex flex-col space-y-6 w-full max-w-md px-6 sm:px-8 py-4 sm:py-6 text-primary-text'>
        <h1 className='text-2xl sm:text-3xl font-semibold text-white text-center font-poppins'>
          Complete Registration
        </h1>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col'>
          <div className='space-y-4 sm:space-y-5 font-poppins'>
            <InputField
              type='text'
              value={userInput.name}
              onChange={handleChange}
              label='Full Name'
              name='name'
              placeHolder='Your Full Name'
              isInvalid={!!validation.name}
              errorMessage={validation.name}
            />
            <InputField
              type='number'
              value={userInput.phoneNumber}
              onChange={handleChange}
              label='Phone Number'
              name='phoneNumber'
              placeHolder='+91 9876543210'
              isInvalid={!!validation.phoneNumber}
              errorMessage={validation.phoneNumber}
            />
            <InputField
              type='password'
              value={userInput.password}
              onChange={handleChange}
              label='Password'
              name='password'
              placeHolder='Your Password'
              isInvalid={!!validation.password}
              errorMessage={validation.password}
              helperText={
                !validation.password
                  ? 'Password must be at least 6 characters and include at least one letter and one number.'
                  : null
              }
            />
            <InputField
              type='password'
              value={userInput.cPassword}
              onChange={handleChange}
              label='Confirm Password'
              name='cPassword'
              placeHolder='Confirm Password'
              isInvalid={!!validation.cPassword}
              errorMessage={validation.cPassword}
            />
          </div>

          <Button
            className='bg-accent-red hover:bg-accent-blue mt-8 sm:mt-10 text-white py-2 rounded-lg text-md sm:text-lg font-semibold uppercase'
            disabled={isLoading}>
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className='text-xs sm:text-sm text-gray-400 mt-4 text-center'>
          Already have an account?
          <Link
            to='/login'
            className='text-red-500 hover:underline ml-2 font-sans'>
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};
