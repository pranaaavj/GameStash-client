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
import { useLoginUserMutation } from '@/redux/api/authApi';
import { InputGroup, InputRightElement } from '@chakra-ui/react';

const emptyInput = { email: '', password: '' };

export const AdminLoginPage = () => {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);
  const [userInput, setUserInput] = useState(emptyInput);
  const [validation, setValidation] = useState(emptyInput);
  const [forgotEmail, setForgotEmail] = useState('');

  const [signInUser, { isError, error, reset }] = useLoginUserMutation();
  useEffect(() => {
    setValidation(emptyInput);
    if (isError) reset();
    // eslint-disable-next-line
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
    <div className='flex flex-col md:flex-row h-screen w-full items-center justify-center'>
      <div className='flex flex-col space-y-8 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8 lg:py-10 text-primary-text'>
        <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white text-center font-poppins'>
          Admin Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className='flex flex-col'>
          <div className='space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 font-poppins relative'>
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
                <p className='z-10 absolute right-0 text-[9px] sm:text-[10px] md:text-[12px] lg:text-[14px] top-[68px] sm:top-[70px] md:top-[75px] lg:top-[78px] font-roboto font-medium hover:text-accent-red cursor-pointer'>
                  Forgot Password ?
                </p>
              </DialogTrigger>
              <DialogContent className='sm:max-w-xs md:max-w-md lg:max-w-lg bg-primary-bg text-primary-text border-none font-poppins'>
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

                <div className='flex justify-start gap-4 sm:gap-5 mt-4 sm:mt-6'>
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
                      className='bg-accent-red hover:bg-hover-red text-md sm:text-lg md:text-xl lg:text-2xl font-medium font-sans'
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
                  {showPass ? <Eye size={'20px'} /> : <EyeOff size={'20px'} />}
                </div>
              </InputRightElement>
            </InputGroup>
          </div>

          <Button className='bg-accent-red hover:bg-hover-red mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-md sm:text-lg md:text-xl lg:text-2xl font-semibold uppercase font-sans'>
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

        <p className='text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 mt-3 sm:mt-4 text-center'>
          Not an admin ?
          <Link
            to={'/auth/login'}
            className='text-red-500 hover:underline ml-1 sm:ml-2'>
            Click here to login
          </Link>
        </p>
        <Toaster position='top-right' />
      </div>
    </div>
  );
};
