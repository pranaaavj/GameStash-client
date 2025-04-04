import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { toast } from 'sonner';
import { validateRegister } from '@/utils';
import { Alert, InputField } from '../../components/common';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRegisterUserMutation } from '@/redux/api/user/authApi';
import { resetAuthState } from '@/redux/slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';

const emptyInput = {
  name: '',
  phoneNumber: '',
  password: '',
  cPassword: '',
};

export const Register = () => {
  const { authEmail } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [userInput, setUserInput] = useState(emptyInput);
  const [validation, setValidation] = useState(emptyInput);

  const [registerUser, { isError, error }] = useRegisterUserMutation();

  useEffect(() => {
    setValidation(emptyInput);
  }, [userInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateRegister(userInput);
    if (Object.keys(validation).length > 0) {
      setValidation(validation);
      return;
    }

    delete userInput.cPassword;

    try {
      const response = await registerUser({
        ...userInput,
        email: authEmail,
      }).unwrap();

      if (response.success) {
        setUserInput(emptyInput);
        dispatch(resetAuthState());

        toast.success(response?.message, {
          duration: 1500,
        });

        setTimeout(() => navigate('/auth/login'), 1500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = ({ target: { value, name } }) => {
    setUserInput((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className='flex min-h-screen w-full pt-10 justify-center'>
      <div className='flex flex-col space-y-6 w-full max-w-md px-6 sm:px-8 py-4 sm:py-6 text-primary-text'>
        <h1 className='text-2xl sm:text-3xl font-semibold text-white text-center font-poppins'>
          Complete Registration
        </h1>

        <form
          className='flex flex-col'
          onSubmit={handleSubmit}>
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
              label='Phone number'
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
              placeHolder=' Your Password'
              isInvalid={!!validation.password}
              errorMessage={validation.password}
              helperText={
                !validation.password
                  ? 'Password must be at least 6 characters long and include at least one letter and one number'
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

          <Button className='bg-accent-red hover:bg-accent-blue mt-8 sm:mt-10 text-white py-2 rounded-lg text-md sm:text-lg font-semibold uppercase'>
            Register
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
          Already have an account?
          <Link
            to={'/auth/login'}
            className='text-red-500 hover:underline ml-2 font-sans'>
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
};
