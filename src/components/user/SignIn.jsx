import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';
import { Separator } from '@/shadcn/components/ui/separator';
import { InputField } from '../common';
import { Eye, EyeOff } from 'lucide-react';
import { InputGroup, InputRightElement } from '@chakra-ui/react';

const emptyInput = { email: '', password: '' };

export const SignIn = () => {
  const [showPass, setShowPass] = useState(false);
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
            <p className='z-10 hidden sm:block absolute right-0 text-xs top-[110px] font-roboto font-medium hover:text-secondary-text cursor-pointer'>
              Forgot Password ?
            </p>
            <InputGroup>
              <InputField
                type={showPass ? 'text' : 'password'}
                value={userInput.password}
                onChange={handleChange}
                label='Password'
                name='password'
                isInvalid={false}
                errorMessage=''
              />
              <InputRightElement marginTop={'32px'}>
                <div onClick={() => setShowPass((prev) => !prev)}>
                  {showPass ? <Eye size={'16px'} /> : <EyeOff size={'16px'} />}
                </div>
              </InputRightElement>
            </InputGroup>
          </div>
          <Button className='bg-accent-red hover:bg-hover-red mt-10'>
            Sign in
          </Button>
        </form>
        <Separator />
        <Button className='bg-white text-black rounded-full'>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};
