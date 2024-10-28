/* eslint-disable react/prop-types */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { UserPagination } from '@/components/user';

// Mock data for games (unchanged)
const games = [
  {
    id: 1,
    title: 'Cyberpunk 2077',
    baseGame: true,
    price: 59.99,
    discountedPrice: 39.99,
    discount: 33,
    image: '/placeholder.svg?height=225&width=400',
  },
  {
    id: 2,
    title: 'Red Dead Redemption 2',
    baseGame: true,
    price: 59.99,
    image: '/placeholder.svg?height=225&width=400',
  },
  {
    id: 3,
    title: 'The Witcher 3: Wild Hunt',
    baseGame: true,
    price: 39.99,
    discountedPrice: 19.99,
    discount: 50,
    image: '/placeholder.svg?height=225&width=400',
  },
  {
    id: 4,
    title: 'Grand Theft Auto V',
    baseGame: true,
    price: 29.99,
    image: '/placeholder.svg?height=225&width=400',
  },
  {
    id: 5,
    title: 'Elden Ring',
    baseGame: true,
    price: 59.99,
    image: '/placeholder.svg?height=225&width=400',
  },
  {
    id: 6,
    title: 'God of War',
    baseGame: true,
    price: 49.99,
    discountedPrice: 39.99,
    discount: 20,
    image: '/placeholder.svg?height=225&width=400',
  },
  {
    id: 7,
    title: 'Horizon Zero Dawn',
    baseGame: true,
    price: 49.99,
    image: '/placeholder.svg?height=225&width=400',
  },
  {
    id: 8,
    title: 'Death Stranding',
    baseGame: true,
    price: 59.99,
    discountedPrice: 29.99,
    discount: 50,
    image: '/placeholder.svg?height=225&width=400',
  },
];

// GameCard component (unchanged)
const GameCard = ({ game }) => (
  <motion.div
    className='bg-[#1c1c1c] rounded-lg shadow-md overflow-hidden'
    whileHover={{ scale: 1.03 }}
    transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
    <div className='relative'>
      <motion.img
        src={game.image}
        alt={game.title}
        className='w-full h-auto rounded-t-lg'
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
      {game.discount && (
        <span className='absolute top-2 left-2 bg-[#5a9bf5] text-white text-xs font-bold px-2 py-1 rounded-full'>
          -{game.discount}%
        </span>
      )}
    </div>
    <div className='p-4 text-center'>
      {game.baseGame && (
        <p className='text-[#b3b3b3] text-sm mb-1'>Base Game</p>
      )}
      <h3 className='text-white font-bold text-lg mb-2 font-poppins'>
        {game.title}
      </h3>
      <div className='flex justify-center items-center'>
        {game.discountedPrice ? (
          <>
            <span className='text-[#e5e5e5] font-bold mr-2 line-through'>
              ${game.price.toFixed(2)}
            </span>
            <span className='text-[#5a9bf5] font-bold'>
              ${game.discountedPrice.toFixed(2)}
            </span>
          </>
        ) : (
          <span className='text-[#e5e5e5] font-bold'>
            ${game.price.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

export default function GameViewerSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;
  // Fetch games data for the current page

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className='bg-primary-bg py-10 sm:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header with title and pagination at the top-right */}
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-primary-text text-2xl sm:text-3xl font-bold font-poppins flex items-center'>
            Discover Something New
            <ChevronRight className='ml-2 h-6 w-6' />
          </h2>
          <UserPagination
            currentPage={currentPage}
            totalPages={games?.totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
            {games?.map((game) => (
              <GameCard
                key={game.id}
                game={game}
              />
            ))}
          </div>
        }
      </div>
    </div>
  );
}
