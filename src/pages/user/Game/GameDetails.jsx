/* eslint-disable react/prop-types */
import {
  Carousel,
  CarouselItem,
  CarouselNext,
  CarouselContent,
  CarouselPrevious,
} from '@/shadcn/components/ui/carousel';
import {
  useGetProductQuery,
  useGetReviewByProductQuery,
  useGetProductsByGenreQuery,
} from '@/redux/api/user/userApi';
import { Button } from '@/shadcn/components/ui/button';
import { Reviews } from '../Reviews';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ImageZoomPreview } from '@/components/user/ImageZoom';
import { RelatedGamesFallback } from '@/components/error/RelatedFallback';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { GameListing, StarRating, SystemRequirements } from '..';

export function GameDetails() {
  const { productId } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [pageState, setPageState] = useState({
    relatedGames: 1,
  });

  const {
    data: responseProducts,
    isError: isProductsError,
    error: productsError,
    isSuccess: isProductsSuccess,
  } = useGetProductQuery(productId);

  const { data: responseRelated, isSuccess: isRelatedProductSuccess } =
    useGetProductsByGenreQuery(
      {
        page: pageState.relatedGames,
        limit: 5,
        genre: responseProducts?.data?.genre?.name,
      },
      { skip: !responseProducts?.data?.genre?.name }
    );

  const {
    data: responseReviews,
    isProductsError: isReviewError,
    productsError: reviewError,
  } = useGetReviewByProductQuery(productId);

  const filteredRelatedProducts =
    isRelatedProductSuccess &&
    responseRelated?.data?.products?.filter(
      (product) => product._id !== productId
    );

  console.log(filteredRelatedProducts);

  if (isReviewError) {
    console.log(reviewError);
  }

  if (isProductsError) {
    console.log(productsError);
  }

  return (
    isProductsSuccess && (
      <div className='min-h-screen bg-primary-bg text-primary-text font-sans px-4 sm:px-8 lg:px-16'>
        <div className='container mx-auto py-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Left Column - Carousel */}
            <div className='space-y-6'>
              <div>
                <h1 className='text-4xl md:text-6xl font-bold mb-2'>
                  {responseProducts?.data?.name}
                </h1>
                <div className='my-5 flex items-center'>
                  <StarRating rating={responseProducts?.data?.averageRating} />
                  <span className='ml-2'>
                    ({responseProducts?.data?.reviewCount})
                  </span>
                </div>
              </div>
              <Carousel className='w-full mx-10'>
                <CarouselContent>
                  {responseProducts?.data?.images.map((image, index) => (
                    <CarouselItem
                      key={index}
                      className='flex items-center justify-center'>
                      <ImageZoomPreview
                        src={image}
                        alt={`image ${index + 1}`}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>

            {/* Right Column - Game Info and Action Buttons */}
            <div className='ml-5 md:ml-10 lg:ml-20 mt-10 lg:mt-20 space-y-6'>
              <div>
                <div className='flex items-baseline gap-2 mb-1'>
                  <span className='text-primary-text text-2xl'>
                    ₹ {responseProducts?.data?.price}
                  </span>
                </div>

                {responseProducts?.data?.stock === 0 ? (
                  <p className='text-red-500 text-sm font-semibold'>
                    No more stock left
                  </p>
                ) : responseProducts?.data?.stock < 10 ? (
                  <p className='text-red-500 text-sm font-semibold'>
                    Only {responseProducts?.data?.stock} left in stock!
                  </p>
                ) : null}
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
                <Button
                  className='w-full bg-[#0074E4] hover:bg-[#0063C1] text-white font-semibold py-3'
                  disabled={responseProducts?.data?.stock < 1}>
                  {responseProducts?.data?.stock > 1
                    ? 'Buy Now'
                    : 'No Stocks Left'}
                </Button>

                <Button
                  variant='secondary'
                  className='w-full bg-[#2A2A2A] hover:bg-[#353535] text-white'
                  disabled={responseProducts?.data?.stock < 1}>
                  <ShoppingCart className='w-4 h-4 mr-2' />
                  {responseProducts?.data?.stock > 1
                    ? 'Add To Cart'
                    : 'No Stocks Left'}
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
                    <span className='font-semibold'>Brand:</span>{' '}
                    {responseProducts?.data?.brand.name}
                  </p>
                  <p>
                    <span className='font-semibold'>Platform:</span>{' '}
                    {responseProducts?.data?.platform}
                  </p>
                  <p>
                    <span className='font-semibold'>Genre:</span>{' '}
                    {responseProducts?.data?.genre.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Game Details, Description, System Requirements, Reviews */}
          <div className='mt-12 space-y-8'>
            <div>
              <h2 className='text-2xl font-bold mb-2'>Description</h2>
              <p className='text-secondary-text'>
                {responseProducts?.data?.description}
              </p>
            </div>

            <div>
              <h2 className='text-2xl font-bold mb-2'>System Requirements</h2>
              {responseProducts?.data?.systemRequirements ? (
                <SystemRequirements
                  requirements={responseProducts?.data?.systemRequirements}
                />
              ) : (
                'No system requirements'
              )}
            </div>

            <div>
              <h2 className='text-2xl font-bold mb-2'>Reviews</h2>
              {responseReviews?.data ? (
                <Reviews reviews={responseReviews?.data} />
              ) : (
                'No Reviews'
              )}
            </div>
          </div>

          <div className='mt-12 space-y-8'>
            {filteredRelatedProducts?.length ? (
              <GameListing
                title='Related Games'
                games={filteredRelatedProducts}
                currentPage={responseRelated?.data.currentPage}
                totalPage={responseRelated?.data.totalPages}
                onPageChange={(page) =>
                  setPageState((prev) => ({ ...prev, latestGames: page }))
                }
              />
            ) : (
              <RelatedGamesFallback />
            )}
          </div>
        </div>
      </div>
    )
  );
}
