/* eslint-disable react/prop-types */
import {
  ShoppingCart,
  Heart,
  ChevronRight,
  ChevronLeft,
  Minus,
  Plus,
} from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/shadcn/components/ui/button';
import { cn } from '@/shadcn/lib/utils';

export function GameTest() {
  const [quantity, setQuantity] = useState(1);

  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailsRef = useRef(null);

  const scrollThumbnails = (direction) => {
    if (thumbnailsRef.current) {
      const scrollAmount = 200;
      thumbnailsRef.current.scrollLeft +=
        direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  // Mock game data (replace with actual data fetching logic)
  // Mock game data
  const gameData = {
    title: 'My Time at Sandrock',
    price: '₹1,899',
    discountedPrice: '₹1,329.30',
    discount: '-30%',
    saleEnds: 'Sale ends 11/1/2024 at 8:30 PM',
    developer: 'Pathea Games',
    images: [
      '/placeholder.svg?height=600&width=1000',
      '/placeholder.svg?height=600&width=1000',
      '/placeholder.svg?height=600&width=1000',
      '/placeholder.svg?height=600&width=1000',
      '/placeholder.svg?height=600&width=1000',
      '/placeholder.svg?height=600&width=1000',
    ],
    description:
      "As a fledgling Builder in a wild and rugged townscape, it's up to you and your trusty toolset to gather resources, build machines, and fix up your workshop to save the town from the jaws of economic ruin, despite some unexpected complications.",
  };
  return (
    <div className='min-h-screen bg-[#121212] text-white'>
      <div className='max-w-[1400px] mx-auto p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8'>
          {/* Left Column - Carousel */}
          <div className='space-y-4'>
            {/* Main Image */}
            <div className='relative aspect-[16/9] overflow-hidden rounded-lg'>
              <div className='absolute inset-0 transition-opacity duration-300'>
                <img
                  src={gameData.images[activeIndex]}
                  alt={`Screenshot ${activeIndex + 1}`}
                  className='w-full h-full object-cover'
                />
              </div>
            </div>

            {/* Thumbnails */}
            <div className='relative'>
              <button
                onClick={() => scrollThumbnails('left')}
                className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors'>
                <ChevronLeft className='w-5 h-5' />
              </button>

              <div
                ref={thumbnailsRef}
                className='flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth px-8'>
                {gameData.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      'flex-shrink-0 w-[180px] aspect-video rounded-lg overflow-hidden transition-all',
                      activeIndex === index
                        ? 'ring-2 ring-blue-500'
                        : 'opacity-70 hover:opacity-100'
                    )}>
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={() => scrollThumbnails('right')}
                className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors'>
                <ChevronRight className='w-5 h-5' />
              </button>
            </div>

            {/* Description */}
            <p className='text-gray-300 mt-6 leading-relaxed'>
              {gameData.description}
            </p>
          </div>

          {/* Right Column - Game Info */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold mb-4'>{gameData.title}</h1>
              <div className='flex items-baseline gap-2 mb-1'>
                <span className='bg-blue-500 text-white px-2 py-0.5 text-sm rounded'>
                  {gameData.discount}
                </span>
                <span className='text-gray-400 line-through text-sm'>
                  {gameData.price}
                </span>
                <span className='text-2xl font-bold'>
                  {gameData.discountedPrice}
                </span>
              </div>
              <p className='text-sm text-gray-400'>{gameData.saleEnds}</p>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='text-lg font-semibold'>Quantity:</span>
              <div className='flex items-center'>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className='h-4 w-4' />
                </Button>
                <span className='mx-4 text-lg'>{quantity}</span>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={() => setQuantity(quantity + 1)}>
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='space-y-3'>
              <Button className='w-full bg-[#0074E4] hover:bg-[#0063C1] text-white font-semibold py-3'>
                Buy Now
              </Button>

              <Button
                variant='secondary'
                className='w-full bg-[#2A2A2A] hover:bg-[#353535] text-white'>
                <ShoppingCart className='w-4 h-4 mr-2' />
                Add To Cart
              </Button>

              <Button
                variant='secondary'
                className='w-full bg-[#2A2A2A] hover:bg-[#353535] text-white'>
                <Heart className='w-4 h-4 mr-2' />
                Add to Wishlist
              </Button>
            </div>

            <div className='space-y-4 pt-4 border-t border-gray-800'>
              <div className='flex justify-between'>
                <span className='text-gray-400'>Developer</span>
                <span>{gameData.developer}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
