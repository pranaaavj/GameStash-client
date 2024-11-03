import { useSelector } from 'react-redux';

export const useAdmins = () => {
  const admin = useSelector((state) => state.admin);
  return admin;
};
