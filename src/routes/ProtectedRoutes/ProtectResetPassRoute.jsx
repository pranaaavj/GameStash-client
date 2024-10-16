import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

export const ProtectResetPassword = ({ children }) => {
  const { otpStatus, otpType } = useSelector((state) => state.auth);

  if (otpStatus === 'pending' || otpStatus === '') {
    return <Navigate to='/auth/verify-otp-pass' />;
  }

  if (otpStatus === 'verified' && otpType === 'forgotPassword') {
    return children;
  }

  return <Navigate to='/auth/login' />;
};

ProtectResetPassword.propTypes = {
  children: PropTypes.any,
};
