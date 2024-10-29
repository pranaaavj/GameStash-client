/* eslint-disable react/prop-types */

import { useState } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shadcn/components/ui/carousel';
import { Star, ShoppingCart, Heart } from 'lucide-react';

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

const StarRating = ({ rating }) => (
  <div className='flex'>
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${
          star <= rating
            ? 'fill-yellow-500 text-yellow-500'
            : 'fill-muted-text text-muted-text'
        }`}
      />
    ))}
  </div>
);

const ReviewsSection = ({ reviews }) => (
  <div className='space-y-4'>
    {reviews.map((review, index) => (
      <div
        key={index}
        className='bg-secondary-bg p-4 rounded-lg'>
        <div className='flex justify-between items-center mb-2'>
          <span className='font-bold text-primary-text'>{review.name}</span>
          <StarRating rating={review.rating} />
        </div>
        <p className='text-secondary-text'>{review.comment}</p>
      </div>
    ))}
  </div>
);

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

export function ProductDetailsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className='min-h-screen bg-primary-bg mx-24 text-primary-text font-sans px-4 sm:px-8 lg:px-16'>
      <div className='container mx-auto py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {/* Left Column - Carousel */}
          <div>
            <Carousel className='w-full'>
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
          <div>
            <h1 className='text-4xl font-bold mb-4'>{gameData.title}</h1>
            <span className='text-3xl font-bold'>{gameData.price}</span>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='mt-6'>
              <TabsList className='bg-secondary-bg p-2 rounded-lg mb-6'>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='addons'>Add-Ons</TabsTrigger>
                <TabsTrigger value='achievements'>Achievements</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className='space-y-2'>
              <Button className='w-full bg-accent-blue hover:bg-hover-blue text-white'>
                Buy Now
              </Button>
              <div className='flex space-x-2'>
                <Button
                  variant='outline'
                  className='flex-1'>
                  <ShoppingCart className='mr-2 h-4 w-4' /> Add to Cart
                </Button>
                <Button
                  variant='outline'
                  className='flex-1'>
                  <Heart className='mr-2 h-4 w-4' /> Wishlist
                </Button>
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
            <ReviewsSection reviews={gameData.reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
