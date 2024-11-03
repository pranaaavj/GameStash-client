import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateResetPassword = ({ children }) => {
  const { otpStatus, otpType } = useSelector((state) => state.auth);

  if (otpStatus === 'pending' || otpStatus === '')
    return <Navigate to='/auth/otp/verify-pass' />;

  if (otpStatus === 'verified' && otpType === 'forgotPassword') return children;

  return <Navigate to='/auth/login' />;
};

PrivateResetPassword.propTypes = {
  children: PropTypes.any,
};
