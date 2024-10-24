import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateRegistration = ({ children }) => {
  const { otpStatus, otpType } = useSelector((state) => state.auth);

  if (otpStatus === 'pending' || otpStatus === '') {
    return <Navigate to='/auth/otp/verify-email' />;
  }

  if (otpStatus === 'verified' && otpType === 'registration') {
    return children;
  }

  return <Navigate to='/auth/login' />;
};

PrivateRegistration.propTypes = {
  children: PropTypes.any,
};
