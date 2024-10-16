import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

export const PrivateRegistration = ({ children }) => {
  const { otpStatus, otpType } = useSelector((state) => state.auth);

  if (otpStatus === 'pending' || otpStatus === '') {
    return <Navigate to='/auth/verify-otp' />;
  }

  if (otpStatus === 'verified' && otpType === 'registration') {
    return children;
  }

  return <Navigate to='/auth/login' />;
};

PrivateRegistration.propTypes = {
  children: PropTypes.any,
};
