import { Link } from 'react-router-dom';
import { Button } from '@/shadcn/components/ui/button';
import { useState } from 'react';
import { InputField } from '../../components/common';
import { Eye, EyeOff } from 'lucide-react';
import googleLogo from '../../assets/images/google-logo.png';
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
      <div className='flex flex-col space-y-10 w-full max-w-lg px-8 py-6 md:px-20 text-primary-text'>
        <h1 className='text-3xl font-semibold text-white text-center'>
          Sign in to Your Account
        </h1>

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
              placeHolder='name@work.com'
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
                placeHolder='Your Password'
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
        <div className='flex items-center justify-between mt-6'>
          <hr className='w-full border-gray-600' />
          <span className='mx-4 text-sm text-gray-400'>OR</span>
          <hr className='w-full border-gray-600' />
        </div>
        <Button className='bg-primary-text hover:bg-secondary-text text-black rounded-full'>
          <img
            src={googleLogo}
            alt='google logo'
            className='w-6 mr-2'
          />
          Sign in with Google
        </Button>
        <p className='text-sm text-gray-400 mt-4 text-center'>
          Don&#39;t have an Account ?
          <Link
            to={'/sign-up'}
            className='text-red-500 hover:underline ml-2'>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};
