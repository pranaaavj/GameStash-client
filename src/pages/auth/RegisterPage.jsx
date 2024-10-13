import { Link } from 'react-router-dom';
import { Alert } from '../../components/common';
import { Button } from '@/shadcn/components/ui/button';
import { CircleX } from 'lucide-react';
import { InputField } from '../../components/common';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';
import { validateSignUp } from '@/utils';
import { useSignUpUserMutation } from '@/redux/api/authApi';
import { useEffect, useState } from 'react';

const emptyInput = {
  name: '',
  email: '',
  password: '',
  cPassword: '',
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState(emptyInput);
  const [validation, setValidation] = useState(emptyInput);
  const [signUpUser, { isError, error }] = useSignUpUserMutation();

  useEffect(() => {
    setValidation(emptyInput);
  }, [userInput]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateSignUp(userInput);
    if (Object.keys(validation).length > 0) {
      setValidation(validation);
      return;
    }
    delete userInput.cPassword;
    try {
      const response = await signUpUser(userInput).unwrap();
      if (response.success) {
        setUserInput(emptyInput);
        toast.success('Registration Successful !', {
          duration: 1500,
          onAutoClose: () => navigate('/sign-in'),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = ({ target: { value, name } }) => {
    setUserInput((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <div className='flex sm:h-[calc(100vh-60px)] w-full items-center justify-center'>
      <div className='flex flex-col space-y-6 w-full max-w-md px-6 sm:px-8 py-4 sm:py-6 text-primary-text'>
        <h1 className='text-2xl sm:text-3xl font-semibold text-white text-center font-poppins'>
          Create Your Account
        </h1>

        <form
          className='flex flex-col'
          onSubmit={handleSubmit}>
          <div className='space-y-4 sm:space-y-5 font-poppins'>
            <InputField
              type='email'
              value={userInput.email}
              onChange={handleChange}
              label='Email'
              name='email'
              placeHolder='name@work.com'
              isInvalid={!!validation.email}
              errorMessage={validation.email}
            />
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
            description={error.data.message}
          />
        )}
        <p className='text-xs sm:text-sm text-gray-400 mt-4 text-center'>
          Already have an account?
          <Link
            to={'/login'}
            className='text-red-500 hover:underline ml-2 font-sans'>
            Login now
          </Link>
        </p>
        <Toaster position='top-right' />
      </div>
    </div>
  );
};
