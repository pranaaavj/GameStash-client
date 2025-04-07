import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAddToWishlistMutation } from '@/redux/api/user/wishlistApi';
import { toast } from 'sonner';
import { showToast } from '@/utils';

export const RecommendedGameCard = ({ game }) => {
  const [addToWishlist, { isLoading: isAddingToWishlist }] =
    useAddToWishlistMutation();

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToWishlist({ productId: game._id }).unwrap();
      showToast.success('Added to wishlist');
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to add to wishlist');
    }
  };

  return (
    <Link to={`/games/${game._id}`}>
      <div className='bg-transparent rounded-lg overflow-hidden h-[23rem] w-56 transition-transform duration-300 flex flex-col justify-between cursor-pointer relative'>
        {/* Recommended tag */}
        <div className='absolute top-0 left-0 z-10 bg-gradient-to-r from-accent-blue to-transparent px-3 py-1 rounded-tl-lg rounded-br-lg'>
          <span className='text-white text-xs font-medium'>Recommended</span>
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleAddToWishlist}
          disabled={isAddingToWishlist}
          className='absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors'>
          <Heart className='h-4 w-4 text-white' />
        </button>

        <div className='relative'>
          {/* Game image with shimmer effect while loading */}
          <div className='relative w-full h-[16rem] bg-[#1a1a1a] rounded-lg overflow-hidden'>
            <motion.div
              className='absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent'
              initial={{ x: -200 }}
              animate={{ x: 200 }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1.5,
                ease: 'linear',
              }}
              style={{ display: !game?.images?.[0] ? 'block' : 'none' }}
            />
            <img
              src={game?.images?.[0] || '/placeholder.svg'}
              alt={game?.name}
              className='w-full h-full object-cover rounded-lg'
              loading='lazy'
              onLoad={(e) => e.target.classList.add('opacity-100')}
              style={{ opacity: 0, transition: 'opacity 0.3s ease-in-out' }}
            />
          </div>

          {/* For discount section  */}
          {game?.bestOffer?.discountValue && (
            <span className='absolute top-2 left-2 bg-accent-blue text-primary-text text-xs font-bold px-2 py-1 rounded-full'>
              -{game?.bestOffer?.discountValue}%
            </span>
          )}
        </div>

        <div className='p-4 text-left'>
          {<p className='text-secondary-text text-xs mb-1'>Base Game</p>}
          <h3 className='text-primary-text font-bold text-base mb-1 font-poppins truncate'>
            {game?.name}
          </h3>

          {/* Display Genre and Platform */}
          <div className='text-secondary-text text-xs mb-2 flex justify-between items-center'>
            <span>{game?.genre?.name}</span>
            <span className='text-secondary-text'>{game?.platform}</span>
          </div>

          <div className='flex justify-start items-center'>
            {/* For discount section */}
            {game?.discountedPrice ? (
              <>
                <span className='text-primary-text text-left font-semibold mr-2 line-through text-xs'>
                  ₹{game?.price.toFixed(2)}
                </span>
                <span className='text-accent-blue font-bold text-base'>
                  ₹{game?.discountedPrice.toFixed(2)}
                </span>
              </>
            ) : (
              <span className='text-primary-text text-left font-bold text-base'>
                ₹{game?.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
