import { Link } from 'react-router-dom';
import { Button } from '@/shadcn/components/ui/button';
import { useEffect, useState } from 'react';
import { InputField } from '../common';
import { validateSignUp } from '@/utils';

const emptyInput = {
  name: '',
  email: '',
  password: '',
  cPassword: '',
  mobile: '',
};

export const SignUp = () => {
  const [userInput, setUserInput] = useState(emptyInput);
  const [validation, setValidation] = useState(emptyInput);

  useEffect(() => {
    setValidation(emptyInput);
  }, [userInput]);

  const handleChange = ({ target: { value, name } }) => {
    setUserInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateSignUp(userInput);
    if (Object.keys(validation).length > 0) {
      setValidation(validation);
      return;
    }
  };

  return (
    <div className='flex h-[calc(100vh-100px)] w-full items-center justify-center'>
      <div className='flex flex-col space-y-6 w-full max-w-md px-8 py-6 text-primary-text'>
        <h1 className='text-3xl font-semibold text-white text-center'>
          Create Your Account
        </h1>

        <form
          className='flex flex-col '
          onSubmit={handleSubmit}>
          <div className='space-y-5'>
            <InputField
              type='text'
              value={userInput.name}
              onChange={handleChange}
              label='Full Name'
              name='name'
              isInvalid={!!validation.name}
              errorMessage={validation.name}
            />
            <InputField
              type='email'
              value={userInput.email}
              onChange={handleChange}
              label='Email'
              name='email'
              isInvalid={!!validation.email}
              errorMessage={validation.email}
            />

            <InputField
              type='password'
              value={userInput.password}
              onChange={handleChange}
              label='Password'
              name='password'
              isInvalid={!!validation.password}
              errorMessage={validation.password}
            />
            <InputField
              type='password'
              value={userInput.cPassword}
              onChange={handleChange}
              label='Confirm Password'
              name='cPassword'
              isInvalid={!!validation.cPassword}
              errorMessage={validation.cPassword}
            />
          </div>
          <Button className='bg-accent-red hover:bg-accent-blue mt-10 text-white py-2 rounded-lg'>
            Sign Up
          </Button>
        </form>

        <p className='text-sm text-gray-400 mt-4 text-center'>
          Already have an account?
          <Link
            to={'/sign-in'}
            className='text-red-500 hover:underline ml-2'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
