import { Button } from '@/shadcn/components/ui/button';
import { useAdmins } from '@/hooks';
import { useDispatch } from 'react-redux';
import { handleApiError, showToast, validateLogin } from '@/utils';
import { useNavigate, Link } from 'react-router-dom';
import { Alert, InputField } from '../../components/common';
import { useEffect, useState } from 'react';
import { CircleX, Eye, EyeOff } from 'lucide-react';
import { useLoginAdminMutation } from '@/redux/api/admin/adminBaseApi';
import { setAdmin, setTokenAdmin } from '@/redux/slices/adminSlice';
import { InputGroup, InputRightElement } from '@chakra-ui/react';

const emptyInput = { email: '', password: '' };

export const AdminLogin = () => {
  const admin = useAdmins();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [adminInput, setAdminInput] = useState(emptyInput);
  const [validation, setValidation] = useState(emptyInput);

  const [loginAdmin, { isError, error, reset }] = useLoginAdminMutation();
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
            to={'/login'}
            className='text-red-500 hover:underline ml-1 sm:ml-2'>
            Click here to login
          </Link>
        </p>
      </div>
    </div>
  );
};
