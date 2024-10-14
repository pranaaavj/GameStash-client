import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

export const ProtectRegisterRoute = ({ children }) => {
  const { otpStatus } = useSelector((state) => state.auth);

  if (otpStatus === 'pending' || otpStatus === '') {
    return <Navigate to='/auth/verify' />;
  }

  if (otpStatus === 'verified') {
    return children;
  }

  return <Navigate to='/auth/login' />;
};

ProtectRegisterRoute.propTypes = {
  requiredStatus: PropTypes.string,
  redirectPath: PropTypes.string,
  children: PropTypes.any,
};
