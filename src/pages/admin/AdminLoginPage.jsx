import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/components/ui/dialog';
import { Button } from '@/shadcn/components/ui/button';
import { toast, Toaster } from 'sonner';
import { validateSignIn } from '@/utils';
import { Alert, InputField } from '../../components/common';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CircleX, Eye, EyeOff } from 'lucide-react';
import { useSignInUserMutation } from '@/redux/api/authApi';
import { InputGroup, InputRightElement } from '@chakra-ui/react';

const emptyInput = { email: '', password: '' };

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [userInput, setUserInput] = useState(emptyInput);
  const [validation, setValidation] = useState(emptyInput);
  const [forgotEmail, setForgotEmail] = useState('');
  const [signInUser, { isError, error, reset }] = useSignInUserMutation();
  useEffect(() => {
    setValidation(emptyInput);
    if (isError) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInput]);

  const handleChange = ({ target: { value, name } }) => {
    setUserInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateSignIn(userInput);
    if (Object.keys(validation).length > 0) {
      setValidation(validation);
      return;
    }
    try {
      const response = await signInUser(userInput).unwrap();
      console.log(response.data);
      if (response.success) {
        toast.success('Login successful', {
          duration: 1000,
          onAutoClose: () => navigate('/'),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='flex flex-col md:flex-row h-[calc(100vh-60px)] w-full items-center justify-center'>
      <div className='flex flex-col space-y-8 w-full max-w-sm sm:max-w-md lg:max-w-lg px-6 sm:px-8 md:px-12 lg:px-20 py-6 text-primary-text'>
        <h1 className='text-2xl sm:text-3xl font-semibold text-white text-center font-poppins'>
          Admin Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col'>
          <div className='space-y-4 sm:space-y-5 font-poppins relative'>
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

            <Dialog>
              <DialogTrigger asChild>
                <p className='z-10 absolute right-0 text-[10px] sm:text-[12px] top-[78px] font-roboto font-medium hover:text-accent-red cursor-pointer'>
                  Forgot Password ?
                </p>
              </DialogTrigger>
              <DialogContent className='sm:max-w-md bg-primary-bg text-primary-text border-none font-poppins'>
                <DialogHeader>
                  <DialogTitle>Forgot Password</DialogTitle>
                  <DialogDescription className='font-sans text-secondary-text'>
                    Enter the email address that was associated with your
                    account
                  </DialogDescription>
                </DialogHeader>
                <div className='flex items-center space-x-2'>
                  <div className='grid flex-1 gap-2'>
                    <InputField
                      type='email'
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      label='Email'
                      name='email'
                      placeHolder='name@work.com'
                    />
                  </div>
                </div>

                <div className='flex justify-start gap-5 mt-6'>
                  <DialogFooter className='p-0'>
                    <DialogClose asChild>
                      <Button
                        type='button'
                        variant='secondary'
                        className='font-sans'
                        onClick={() => setForgotEmail('')}>
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                  <DialogClose asChild>
                    <Button
                      className='bg-accent-red hover:bg-hover-red text-md font-medium font-sans'
                      onClick={() => {
                        console.log(forgotEmail);
                        setForgotEmail('');
                      }}>
                      Send OTP
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>

            <InputGroup>
              <InputField
                type={showPass ? 'text' : 'password'}
                value={userInput.password}
                onChange={handleChange}
                label='Password'
                name='password'
                placeHolder='Your Password'
                isInvalid={!!validation.password}
                errorMessage={validation.password}
              />
              <InputRightElement marginTop={'30px'}>
                <div onClick={() => setShowPass((prev) => !prev)}>
                  {showPass ? <Eye size={'16px'} /> : <EyeOff size={'16px'} />}
                </div>
              </InputRightElement>
            </InputGroup>
          </div>

          <Button className='bg-accent-red hover:bg-hover-red mt-8 sm:mt-10 text-md sm:text-lg font-semibold uppercase font-sans'>
            Login
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
          Not an admin ?
          <Link
            to={'/auth/login'}
            className='text-red-500 hover:underline ml-1 sm:ml-2 '>
            Click here to login
          </Link>
        </p>
        <Toaster position='top-right' />
      </div>
    </div>
  );
};