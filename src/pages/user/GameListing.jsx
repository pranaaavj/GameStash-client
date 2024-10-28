import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { GameCard } from './GameCard';

// Mock data for games
const games = [
  {
    id: 1,
    title: 'Cyberpunk 2077',
    baseGame: true,
    price: 59.99,
    discountedPrice: 39.99,
    discount: 33,
    image:
      'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    title: 'Red Dead Redemption 2',
    baseGame: true,
    price: 59.99,
    image:
      'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    title: 'The Witcher 3: Wild Hunt',
    baseGame: true,
    price: 39.99,
    discountedPrice: 19.99,
    discount: 50,
    image:
      'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    title: 'Grand Theft Auto V',
    baseGame: true,
    price: 29.99,
    image:
      'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    title: 'Elden Ring',
    baseGame: true,
    price: 59.99,
    image:
      'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    title: 'God of War',
    baseGame: true,
    price: 49.99,
    discountedPrice: 39.99,
    discount: 20,
    image:
      'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
  },
  {
    id: 7,
    title: 'Horizon Zero Dawn',
    baseGame: true,
    price: 49.99,
    image:
      'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
  },
  {
    id: 8,
    title: 'Death Stranding',
    baseGame: true,
    price: 59.99,
    discountedPrice: 29.99,
    discount: 50,
    image:
      'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
  },
];

export const GameListing = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const gamesPerPage = 4;
  const totalPages = Math.ceil(games.length / gamesPerPage);

  return (
    <div className='bg-[#121212] py-10 sm:py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-[#e5e5e5] text-2xl sm:text-3xl font-bold font-poppins flex items-center'>
            Discover Something New
            <ChevronRight className='ml-2 h-6 w-6' />
          </h2>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {games
            .slice(currentPage * gamesPerPage, (currentPage + 1) * gamesPerPage)
            .map((game) => (
              <GameCard
                key={game.id}
                game={game}
              />
            ))}
        </div>
        <div className='flex justify-center mt-8'>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`h-3 w-3 rounded-full mx-1 ${
                index === currentPage ? 'bg-white' : 'bg-[#a8a8a8]'
              }`}
              onClick={() => setCurrentPage(index)}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
