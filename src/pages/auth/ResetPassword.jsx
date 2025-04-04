import { toast } from 'sonner';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { resetAuthState } from '@/redux/slices/authSlice';
import { InputField, Alert } from '../../components/common';
import { useEffect, useState } from 'react';
import { useResetPassUserMutation } from '../../redux/api/user/authApi';
import { useSelector, useDispatch } from 'react-redux';

const emptyInput = { password: '', cPassword: '' };

export const ResetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authEmail } = useSelector((state) => state.auth);
  const [userInput, setUserInput] = useState(emptyInput);
  const [validation, setValidation] = useState(emptyInput);
  const [resetPass, { isError, error, reset }] = useResetPassUserMutation();

  useEffect(() => {
    setValidation(emptyInput);
    if (isError) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput, isError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    if (userInput.password !== userInput.cPassword) {
      setValidation((prevState) => ({
        ...prevState,
        cPassword: 'Password do not match',
      }));
      return;
    }
    if (!passwordRegex.test(userInput.password)) {
      setValidation((prevState) => ({
        ...prevState,
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
        toast.success(response?.message, {
          duration: 1500,
        });

        dispatch(resetAuthState());
        setTimeout(() => navigate('/auth/login'), 1500);
      }
    } catch (error) {
      toast.error(
        error?.data?.message || 'Something went wrong! Please try again.',
        {
          duration: 1500,
        }
      );
      console.log(error);
    }
  };

  const handleChange = ({ target: { value, name } }) => {
    setUserInput((prevState) => ({ ...prevState, [name]: value }));
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
          <div className='space-y-4 sm:space-y-5 font-poppins relative'>
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
              type={'password'}
              value={userInput.cPassword}
              onChange={handleChange}
              label='Confirm New Password'
              name='cPassword'
              placeHolder='Re-enter your new password'
              isInvalid={!!validation.cPassword}
              errorMessage={validation.cPassword}
            />
          </div>

          <Button className='bg-accent-red hover:bg-hover-red mt-8 sm:mt-10 text-sm sm:text-md font-semibold uppercase font-sans'>
            Reset Password
          </Button>
        </form>
        {isError && (
          <Alert
            Icon={CircleX}
            variant='destructive'
            description={error?.data?.message}
          />
        )}
      </div>
    </div>
  );
};
