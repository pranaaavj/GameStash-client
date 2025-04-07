import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from '@/shadcn/components/ui/dialog';
import {
  useLoginUserMutation,
  useSendOtpUserMutation,
  useGoogleSignInMutation,
} from '@/redux/api/user/authApi';

import { Button } from '@/shadcn/components/ui/button';
import googleLogo from '../../assets/images/google-logo.png';

import { setUser, setToken } from '@/redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import { handleApiError, validateLogin, showToast } from '@/utils';
import { InputField, PageTransition } from '../../components/common';
import { useEffect, useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { setAuthEmail, setOtpStatus } from '@/redux/slices/authSlice';
import { InputGroup, InputRightElement } from '@chakra-ui/react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { signInWithPopup, auth, provider } from '../../utils/firebase';

const initLoginInput = { email: '', password: '' };

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [showPass, toggleShowPass] = useState(false);
  const [loginInput, setLoginInput] = useState(initLoginInput);
  const [resetEmail, setResetEmail] = useState('');
  const [loginValidation, setLoginValidation] = useState(initLoginInput);
  const [resetEmailValid, setResetEmailValid] = useState('');

  const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
  const [sendOtpUser, { isLoading: isPassLoading }] = useSendOtpUserMutation();
  const [googleSignIn, { isLoading: isGoogleLoading }] =
    useGoogleSignInMutation();

  useEffect(() => {
    setLoginValidation(initLoginInput);
    setResetEmailValid('');
  }, [loginInput, resetEmail]);

  const handleChange = useCallback(({ target: { value, name } }) => {
    setLoginInput((prevState) => ({ ...prevState, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateLogin(loginInput);
    if (Object.keys(validation).length > 0) {
      setLoginValidation(validation);
      return;
    }

    try {
      const response = await loginUser(loginInput).unwrap();
      if (response?.success) {
        showToast.success(response.message, { duration: 1500 });
        dispatch(setUser({ user: response.data.user }));
        dispatch(setToken({ token: response.data.accessToken }));
        navigate(location.state?.from || '/');
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleForgotPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!resetEmail) return setResetEmailValid('Email cannot be empty');
    if (!emailRegex.test(resetEmail))
      return setResetEmailValid('Please enter a valid email');

    try {
      const response = await sendOtpUser({
        email: resetEmail,
        type: 'forgotPassword',
      }).unwrap();

      if (response?.success) {
        dispatch(setAuthEmail({ email: resetEmail, type: 'forgotPassword' }));
        dispatch(setOtpStatus({ status: 'pending' }));

        showToast.success(response.message, { duration: 1500 });
        navigate('/verify-pass');
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const response = await googleSignIn(idToken).unwrap();

      if (response?.success) {
        showToast.success(response.message, { duration: 1500 });

        dispatch(setUser({ user: response.data.user }));
        dispatch(setToken({ token: response.data.accessToken }));
        navigate('/');
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  return (
    <PageTransition>
      <div className='flex pt-10 justify-center min-h-screen w-full overflow-hidden'>
        <div className='flex flex-col space-y-8 w-full max-w-sm sm:max-w-md lg:max-w-lg px-6 sm:px-8 md:px-12 lg:px-20 py-6 text-primary-text'>
          <h1 className='text-2xl sm:text-3xl font-semibold text-white text-center font-poppins'>
            Login to Your Account
          </h1>

          <form
            onSubmit={handleSubmit}
            className='flex flex-col'>
            <div className='space-y-4 sm:space-y-5 font-poppins relative'>
              <InputField
                type='email'
                value={loginInput.email}
                onChange={handleChange}
                label='Email'
                name='email'
                placeHolder='name@work.com'
                isInvalid={!!loginValidation.email}
                errorMessage={loginValidation.email}
                helperText={
                  !loginValidation.email ? "We'll never share your email" : null
                }
              />
              <Dialog
                onOpenChange={() => {
                  setResetEmail('');
                  setResetEmailValid('');
                }}>
                <DialogTrigger asChild>
                  <p className='z-10 absolute right-0 top-[105px] text-[10px] sm:text-[12px] font-roboto font-medium hover:text-accent-red cursor-pointer'>
                    Forgot Password?
                  </p>
                </DialogTrigger>
                <DialogContent className='sm:max-w-md bg-primary-bg text-primary-text border-none font-poppins'>
                  <DialogHeader>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogDescription className='font-sans text-secondary-text'>
                      Enter the email associated with your account
                    </DialogDescription>
                  </DialogHeader>
                  <div className='flex items-center space-x-2'>
                    <div className='grid flex-1 gap-2'>
                      <InputField
                        type='email'
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        label='Email'
                        name='email'
                        placeHolder='name@work.com'
                        isInvalid={!!resetEmailValid}
                        errorMessage={resetEmailValid}
                      />
                    </div>
                  </div>
                  <div className='flex justify-start gap-5 mt-2'>
                    <DialogFooter className='p-0'>
                      <DialogClose asChild>
                        <Button
                          type='button'
                          variant='secondary'
                          className='font-sans'
                          onClick={() => {
                            setResetEmail('');
                            setResetEmailValid('');
                          }}>
                          Close
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                    <Button
                      className='bg-accent-red hover:bg-hover-red text-md font-medium font-sans'
                      onClick={handleForgotPassword}
                      disabled={isPassLoading}>
                      {isPassLoading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <InputGroup>
                <InputField
                  type={showPass ? 'text' : 'password'}
                  value={loginInput.password}
                  onChange={handleChange}
                  label='Password'
                  name='password'
                  placeHolder='Your Password'
                  isInvalid={!!loginValidation.password}
                  errorMessage={loginValidation.password}
                />
                <InputRightElement marginTop={'30px'}>
                  <div onClick={() => toggleShowPass((prev) => !prev)}>
                    {showPass ? <Eye size='16px' /> : <EyeOff size='16px' />}
                  </div>
                </InputRightElement>
              </InputGroup>
            </div>
            <Button
              className='bg-accent-red hover:bg-hover-red mt-8 sm:mt-10 text-md sm:text-lg font-semibold uppercase font-sans'
              disabled={isLoginLoading || isGoogleLoading}>
              {isLoginLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className='flex items-center justify-between mt-5 sm:mt-6'>
            <hr className='w-full border-gray-600' />
            <span className='mx-2 sm:mx-4 text-xs sm:text-sm text-gray-400'>
              OR
            </span>
            <hr className='w-full border-gray-600' />
          </div>

          <Button
            className='bg-primary-text hover:bg-secondary-text text-black rounded-full text-sm sm:text-md'
            disabled={isGoogleLoading || isLoginLoading}
            onClick={handleGoogleLogin}>
            {isGoogleLoading ? (
              <>
                <img
                  src={googleLogo}
                  alt='google logo'
                  className='w-5 sm:w-6 mr-2'
                />
                Signing in...
              </>
            ) : (
              <>
                <img
                  src={googleLogo}
                  alt='google logo'
                  className='w-5 sm:w-6 mr-2'
                />
                Continue with Google
              </>
            )}
          </Button>

          <p className='text-xs sm:text-sm text-gray-400 mt-4 text-center'>
            Don&#39;t have an Account?
            <Link
              to='/send-otp'
              className='text-red-500 hover:underline ml-1 sm:ml-2'>
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};
