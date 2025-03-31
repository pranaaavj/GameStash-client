import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGetProductQuery } from '@/redux/api/user/productApi';

const breadcrumbMap = {
  auth: { label: null },
  login: { label: 'Login' },
  register: { label: 'Register' },
  'reset-pass': { label: 'Reset Password' },
  'verify-email': { label: 'Verify Email' },
  'verify-pass': { label: 'Verify Password' },
  profile: { label: 'Your Profile' },
  orders: { label: 'My Orders' },
  wishlist: { label: 'Wishlist' },
  checkout: { label: 'Checkout' },
  'order-confirmation': { label: 'Order Confirmation' },
  cart: { label: 'Cart' },
  games: { label: 'Games' },
};

export const Breadcrumbs = () => {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const [gameName, setGameName] = useState(null);

  const gameIndex = segments.indexOf('games');
  const gameId = gameIndex !== -1 ? segments[gameIndex + 1] : null;

  const { data: response } = useGetProductQuery(gameId, { skip: !gameId });

  useEffect(() => {
    if (response?.data?.name) setGameName(response.data.name);
  }, [response]);

  const getLabel = (segment, index) => {
    if (index === gameIndex + 1 && gameName) return gameName;
    if (index === gameIndex + 1) return 'Game';
    return breadcrumbMap[segment]?.label ?? capitalize(segment);
  };

  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).replace(/-/g, ' ');

  const validSegments = segments.filter(
    (seg) => breadcrumbMap[seg]?.label !== null || seg === gameId
  );

  return (
    <nav className='flex items-center space-x-2 text-sm font-medium text-primary-text mt-4 mb-4'>
      <Link
        to='/'
        className='flex items-center space-x-1 text-accent-red hover:text-accent-blue'>
        <Home className='h-4 w-4' />
        <span>Home</span>
      </Link>

      {validSegments.length > 0 && (
        <ChevronRight className='h-4 w-4 text-secondary-text' />
      )}

      {validSegments.map((segment, index) => {
        const isLast = index === validSegments.length - 1;
        const path = `/${validSegments.slice(0, index + 1).join('/')}`;
        const label = getLabel(segment, index);

        if (!label) return null;

        return (
          <div
            key={path}
            className='flex items-center space-x-2'>
            {!isLast ? (
              <Link
                to={path}
                className='hover:text-accent-blue capitalize text-accent-red'>
                {label}
              </Link>
            ) : (
              <span className='capitalize font-semibold text-accent-red'>
                {label}
              </span>
            )}
            {!isLast && <ChevronRight className='h-4 w-4 text-accent-red' />}
          </div>
        );
      })}
    </nav>
  );
};
