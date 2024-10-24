import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const OtpProtectedRoute = ({ children, requiredOtpType }) => {
  const { otpStatus, otpType } = useSelector((state) => state.auth);

  if (otpStatus === 'verified' && otpType === requiredOtpType) {
    return children;
  }

  if (!otpStatus || !otpType) {
    return null;
  }

  if (otpType === 'forgotPassword') {
    return (
      <Navigate
        to={`/auth/otp/verify-pass`}
        replace
      />
    );
  } else if (otpType === 'registration') {
    return (
      <Navigate
        to={`/auth/otp/verify-email`}
        replace
      />
    );
  } else {
    return (
      <Navigate
        to='/auth/login'
        replace
      />
    );
  }
};

OtpProtectedRoute.propTypes = {
  children: PropTypes.any,
  requiredOtpType: PropTypes.string,
};
