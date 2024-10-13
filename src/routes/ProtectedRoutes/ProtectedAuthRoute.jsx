import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

export const ProtectedAuthRoute = ({
  requiredStatus,
  redirectPath = '/login',
  children,
}) => {
  const { otpStatus } = useSelector((state) => state.auth);

  if (otpStatus !== requiredStatus) {
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    );
  }

  return children;
};

ProtectedAuthRoute.propTypes = {
  requiredStatus: PropTypes.string,
  redirectPath: PropTypes.string,
  children: PropTypes.any,
};
