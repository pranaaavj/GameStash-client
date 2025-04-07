import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectOtp = ({ children, requiredOtpType }) => {
  const { otpStatus, otpType } = useSelector((state) => state.auth);

  if (otpStatus === 'verified' && otpType === requiredOtpType) return children;

  if (!otpStatus || !otpType) return null;

  if (otpType === 'forgotPassword') {
    return (
      <Navigate
        to={`/verify-pass`}
        replace
      />
    );
  } else if (otpType === 'registration') {
    return (
      <Navigate
        to={`/verify-email`}
        replace
      />
    );
  } else {
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }
};

ProtectOtp.propTypes = {
  children: PropTypes.any,
  requiredOtpType: PropTypes.string,
};
