import { Button } from '@/shadcn/components/ui/button';
import { useAdmins } from '@/hooks';
import { useDispatch } from 'react-redux';
import { handleApiError, showToast, validateLogin } from '@/utils';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Alert, InputField, PageTransition } from '../../components/common';
import { Loading } from '@/components/error';
import { useEffect, useState } from 'react';
import { CircleX, Eye, EyeOff } from 'lucide-react';
import { useLoginAdminMutation } from '@/redux/api/admin/adminBaseApi';
import { setAdmin, setTokenAdmin } from '@/redux/slices/adminSlice';
import { InputGroup, InputRightElement } from '@chakra-ui/react';

const emptyInput = { email: '', password: '' };

export const AdminLogin = () => {
  const admin = useAdmins();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [adminInput, setAdminInput] = useState(emptyInput);
  const [validation, setValidation] = useState(emptyInput);
  const [isLoading, setIsLoading] = useState(location.state?.fromLogout);

  const [loginAdmin, { isError, error, reset }] = useLoginAdminMutation();

  useEffect(() => {
    if (location.state?.fromLogout) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        window.history.replaceState({}, '');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  useEffect(() => {
    if (admin?.adminInfo?.role === 'admin' && admin.authStatus === 'active') {
      navigate('/admin/dashboard');
    }

    setValidation(emptyInput);
    if (isError) reset();
  }, [adminInput, admin]);

  const handleChange = ({ target: { value, name } }) => {
    setAdminInput((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateLogin(adminInput);
    if (Object.keys(validation).length > 0) {
      setValidation(validation);
      return;
    }

    try {
      const response = await loginAdmin(adminInput).unwrap();

      if (response.success) {
        dispatch(setAdmin({ admin: response?.data?.user }));
        dispatch(setTokenAdmin({ token: response?.data?.accessToken }));

        showToast.success('Login successful', {
          duration: 1000,
        });
        navigate('/admin/dashboard');
      }
    } catch (error) {
      handleApiError(error, 'Login failed, please try again.');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <PageTransition>
      <div className='flex flex-col md:flex-row h-screen w-full items-center justify-center'>
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
                value={adminInput.email}
                onChange={handleChange}
                label='Email'
                name='email'
                placeHolder='name@work.com'
                isInvalid={!!validation.email}
                errorMessage={validation.email}
              />

              <InputGroup>
                <InputField
                  type={showPass ? 'text' : 'password'}
                  value={adminInput.password}
                  onChange={handleChange}
                  label='Password'
                  name='password'
                  placeHolder='Your Password'
                  isInvalid={!!validation.password}
                  errorMessage={validation.password}
                />
                <InputRightElement marginTop={'30px'}>
                  <div onClick={() => setShowPass((prev) => !prev)}>
                    {showPass ? (
                      <Eye size={'20px'} />
                    ) : (
                      <EyeOff size={'20px'} />
                    )}
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
              to={'/login'}
              className='text-red-500 hover:underline ml-1 sm:ml-2'>
              Click here to login
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};
