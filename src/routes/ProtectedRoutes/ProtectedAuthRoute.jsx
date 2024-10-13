import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedAuthRoute = ({
  requiredStatus,
  redirectPath = '/login',
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

  return <Outlet />;
};

ProtectedAuthRoute.propTypes = {
  requiredStatus: PropTypes.string,
  redirectPath: PropTypes.string,
};
