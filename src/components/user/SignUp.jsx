import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';
import { InputField } from '../common';

const emptyInput = {
  name: '',
  email: '',
  password: '',
  cPassword: '',
  mobile: '',
};

export const SignUp = () => {
  const [userInput, setUserInput] = useState(emptyInput);

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
          <div className='space-y-2 font-poppins relative'>
            <InputField
              type='text'
              value={userInput.name}
              onChange={handleChange}
              label='Full Name'
              name='name'
              isInvalid={false}
              errorMessage=''
            />
            <InputField
              type='email'
              value={userInput.email}
              onChange={handleChange}
              label='Email'
              name='email'
              isInvalid={false}
              errorMessage=''
            />

            <InputField
              type='password'
              value={userInput.password}
              onChange={handleChange}
              label='Password'
              name='password'
              isInvalid={false}
              errorMessage=''
            />
            <InputField
              type='password'
              value={userInput.cPassword}
              onChange={handleChange}
              label='Confirm Password'
              name='cPassword'
              isInvalid={false}
              errorMessage=''
            />
          </div>
          <Button className='bg-accent-red hover:bg-hover-red mt-10'>
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
};
