import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGetProductQuery } from '@/redux/api/user/productApi';

export const Breadcrumbs = () => {
const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const [gameName, setGameName] = useState(null);

  const gameIndex = pathSegments.indexOf('games');
  const gameId = gameIndex !== -1 ? pathSegments[gameIndex + 1] : null;

  const { data: response } = useGetProductQuery(gameId, {
    skip: !gameId,
  });

  useEffect(() => {
    if (response?.data?.name) {
      setGameName(response?.data?.name);
    }
  }, [response]);

  const formatSegment = (segment, isGame) => {
    if (isGame && gameName) return gameName;
    if (isGame) return 'Game';
    return segment.charAt(0).toUpperCase() + segment.slice(1);
  };

  return (
    <nav className='flex items-center space-x-2 text-sm font-medium text-primary-text mt-4 mb-4'>
      {/* Home Link */}
      <Link
        to='/'
        className='flex items-center space-x-1 text-accent-red hover:text-accent-blue'>
        <Home className='h-4 w-4' />
        <span>Home</span>
      </Link>

      {/* Separator */}
      {pathSegments.length > 0 && (
        <ChevronRight className='h-4 w-4 text-secondary-text' />
      )}

      {/* Breadcrumb Links */}
      {pathSegments.map((segment, index) => {
        if (index === gameIndex + 1) return null;

        const isGameSegment = index === gameIndex && gameId;
        const formattedSegment = formatSegment(segment, isGameSegment);

        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;

        return (
          <div
            key={path}
            className='flex items-center space-x-2'>
            {/* If it's the "Games" segment, make it a clickable link */}
            {!isGameSegment && !isLast ? (
              <Link
                to={path}
                className='hover:text-accent-blue capitalize text-accent-red'>
                {formattedSegment}
              </Link>
            ) : (
              // If it's the game name (last breadcrumb), show as text only
              <span className='capitalize font-semibold text-accent-red'>
                {formattedSegment}
              </span>
            )}
            {!isLast && <ChevronRight className='h-4 w-4 text-accent-red' />}
          </div>
        );
      })}
    </nav>
  );
};
