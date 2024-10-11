import { InputField } from '../common';
import { useState } from 'react';
import { Button } from '@/shadcn/components/ui/button';

export const SignIn = () => {
  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
  });

  const handleChange = ({ target: { value, name } }) => {
    setUserInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className='flex h-[calc(100vh-120px)] w-full items-center justify-center'>
      <div className='flex flex-col space-y-10 w-full max-w-md px-6  md:px-20 text-primary-text'>
        <form
          action='/'
          onSubmit={handleSubmit}
          className='flex flex-col'>
          <div className='space-y-5 font-poppins relative'>
            <InputField
              type='email'
              value={userInput.email}
              onChange={handleChange}
              label='Email'
              name='email'
              isInvalid={false}
              errorMessage=''
              helperText="We'll never share your email"
            />
            <p className='hidden sm:block absolute right-0 text-xs top-[110px] font-roboto font-medium hover:text-8xl'>
              Forgot Password ?
            </p>
            <InputField
              type='password'
              value={userInput.password}
              onChange={handleChange}
              label='Password'
              name='password'
              isInvalid={false}
              errorMessage=''
            />
          </div>
          <Button className='bg-accent-red hover:bg-hover-red mt-10'>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
