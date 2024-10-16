import { useSelector } from 'react-redux';

export const useUsers = () => {
  const user = useSelector((state) => state.user);
  return user;
};
