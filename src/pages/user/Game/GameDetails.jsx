/* eslint-disable react/prop-types */
import { Button } from '@/shadcn/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shadcn/components/ui/carousel';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Reviews } from '../Reviews';
import { StarRating } from '..';
import { useState } from 'react';

const gameData = {
  title: 'Rogue Waters',
  price: '₹1,069',
  description:
    'Rogue Waters is a tactical, turn-based rogue-lite set in a pirate world overtaken by a terrible curse. Gather your ragtag crew of rogues and grow them into fierce pirates.',
  developer: 'Pirate Studios',
  publisher: 'Epic Games',
  releaseDate: 'June 15, 2023',
  platform: 'Windows',
  refundType: 'Self-Refundable',
  screenshots: [
    'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506354666786-959d6d497f1a?fit=crop&w=1200&q=80',
  ],
  systemRequirements: {
    minimum: {
      os: 'Windows 10 64-bit',
      processor: '4-Core Processor',
      memory: '8GB RAM',
      graphics: 'GTX 950',
      directX: 'DirectX 11',
    },
    recommended: {
      os: 'Windows 10 64-bit',
      processor: '4-Core Processor 3.0 GHz',
      memory: '8GB RAM',
      graphics: 'GTX 1050Ti',
      directX: 'DirectX 11',
    },
  },
  reviews: [
    {
      name: 'Gamer123',
      rating: 5,
      comment: 'Amazing game with immersive gameplay and visuals!',
    },
    {
      name: 'PirateFan',
      rating: 4,
      comment: 'Great storyline, but could use more multiplayer options.',
    },
    {
      name: 'AdventureLover',
      rating: 3,
      comment: 'Enjoyed the game but had issues with performance.',
    },
  ],
};

const SystemRequirements = ({ requirements }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
    {Object.entries(requirements).map(([type, specs]) => (
      <div
        key={type}
        className='bg-secondary-bg p-4 rounded-lg'>
        <h3 className='text-lg font-bold mb-2 text-primary-text capitalize'>
          {type}
        </h3>
        <ul className='space-y-1'>
          {Object.entries(specs).map(([key, value]) => (
            <li
              key={key}
              className='flex'>
              <span className='w-1/3 text-secondary-text capitalize'>
                {key}:
              </span>
              <span className='w-2/3 text-primary-text'>{value}</span>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
);

export function GameDetails() {
  const { productId } = useParams();
  const [quantity, setQuantity] = useState(1);

  console.log(productId);

  return (
    <div className='mt-20 min-h-screen bg-primary-bg mx-24 text-primary-text font-sans px-4 sm:px-8 lg:px-16'>
      <div className='container mx-auto py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Carousel */}
          <div className='space-y-6'>
            <div>
              <h1 className='text-6xl font-bold mb-2'>{gameData.title}</h1>
              <StarRating rating={gameData.rating} />
            </div>
            <Carousel className='w-full mx-10 '>
              <CarouselContent>
                {gameData.screenshots.map((screenshot, index) => (
                  <CarouselItem
                    key={index}
                    className='flex items-center justify-center'>
                    <img
                      src={screenshot}
                      alt={`Screenshot ${index + 1}`}
                      className='rounded-lg'
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Right Column - Game Info and Action Buttons */}
          <div className=' ml-20 mt-20 space-y-6'>
            <div>
              <div className='flex items-baseline gap-2 mb-1'>
                <span className='text-primary-text text-2xl'>
                  {gameData.price}
                </span>
                {/* <span className='text-2xl font-bold'>
                  {gameData.discountedPrice}
                </span> */}
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <span className='text-lg font-semibold'>Quantity:</span>
              <div className='flex items-center'>
                <Button
                  variant='outline'
                  size='icon'
                  className='bg-[#2A2A2A] hover:bg-[#353535] text-white border-none'
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className='h-4 w-4' />
                </Button>
                <span className='mx-4 text-lg'>{quantity}</span>
                <Button
                  variant='outline'
                  className='bg-[#2A2A2A] hover:bg-[#353535] text-white border-none'
                  size='icon'
                  onClick={() => setQuantity(quantity + 1)}>
                  <Plus className='h-4 w-4 ' />
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
              <div className='text-secondary-text space-y-2'>
                <p>
                  <span className='font-semibold'>Brand:</span> {gameData.brand}
                </p>
                <p>
                  <span className='font-semibold'>Platform:</span>{' '}
                  {gameData.platform}
                </p>
                <p>
                  <span className='font-semibold'>Genre:</span> {gameData.genre}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Game Details, Description, System Requirements, Reviews */}
        <div className='mt-12 space-y-8'>
          <div>
            <h2 className='text-2xl font-bold mb-2'>Description</h2>
            <p className='text-secondary-text'>{gameData.description}</p>
          </div>

          <div>
            <h2 className='text-2xl font-bold mb-2'>System Requirements</h2>
            <SystemRequirements requirements={gameData.systemRequirements} />
          </div>

          <div>
            <h2 className='text-2xl font-bold mb-2'>Reviews</h2>
            <Reviews reviews={gameData.reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
