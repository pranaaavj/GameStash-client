import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  AlertCircle,
  PenLine,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/shadcn/components/ui/button';
import { Badge } from '@/shadcn/components/ui/badge';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Pagination } from '@/shadcn/components/ui/pagination';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shadcn/components/ui/tooltip';

import { Reviews } from '../../components/user/Reviews';
import { SystemRequirements, StarRating, GameListing } from '@/components/user';
import { GameDetailsError, GameDetailsLoading } from '@/components/error';

import {
  useGetProductQuery,
  useGetRelatedProductsQuery,
  useGetReviewByProductQuery,
} from '@/redux/api/user/productApi';
import {
  useAddItemToCartMutation,
  useGetCartQuery,
} from '@/redux/api/user/cartApi';
import { useAddToWishlistMutation } from '@/redux/api/user/wishlistApi';

import { useUsers } from '@/hooks';
import { handleApiError, requireLogin, showToast } from '@/utils';
import { PageTransition } from '@/components/common';

export const GameDetails = () => {
  const user = useUsers();
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State management
  const [currentImage, setCurrentImage] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
  const [pageState, setPageState] = useState({
    relatedGames: 1,
    reviews: 1,
  });
  const [reviewsPerPage] = useState(5);

  // API queries
  const {
    data: responseProduct,
    isError: isProductError,
    error: productError,
    isSuccess: isProductsSuccess,
    isLoading: isProductLoading,
  } = useGetProductQuery(productId);

  const { data: cartData } = useGetCartQuery(user?.userInfo?.id, {
    skip: !user?.userInfo?.id,
  });

  const { data: responseReviews } = useGetReviewByProductQuery(productId);

  const relatedQuery = useGetRelatedProductsQuery(
    {
      page: pageState.relatedGames,
      limit: 4,
      productId: responseProduct?.data?._id,
    },
    { skip: !responseProduct?.data?._id }
  );

  // API mutations
  const [addItemToCart, addItemToCartMeta] = useAddItemToCartMutation();
  const [addToWishlist, addToWishlistMeta] = useAddToWishlistMutation();

  // Effects
  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  useEffect(() => {
    if (cartData?.data?.items?.length > 0) {
      const item = cartData.data.items.find(
        (item) => item?.product?._id === productId
      );
      const stockLeft = responseProduct?.data?.stock - (item?.quantity || 0);
      setIsOutOfStock(stockLeft <= 0);
    }
  }, [cartData, responseProduct, productId]);

  // Handlers
  const handleAddToCart = async () => {
    if (!requireLogin(user, navigate, location)) return;

    const item = cartData?.data?.items.find(
      (item) => item.product._id === productId
    );

    if (item?.quantity + quantity > 5) {
      showToast.error('Maximum quantity added.');
      return;
    }

    if (responseProduct?.data?.stock <= item?.quantity) {
      setIsOutOfStock(true);
      return;
    }

    try {
      const response = await addItemToCart({ productId, quantity }).unwrap();
      if (response.success) {
        showToast.success('Added to cart successfully!');

        const updatedStock = responseProduct?.data?.stock - quantity;

        if (updatedStock <= 0) {
          setIsOutOfStock(true);
        }
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const handleAddToWishlist = async () => {
    if (!requireLogin(user, navigate, location)) return;

    try {
      const response = await addToWishlist(productId).unwrap();

      if (response?.success) {
        showToast.success(response.message, { duration: 1500 });
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const nextImage = () => {
    if (!responseProduct?.data?.images?.length) return;
    setCurrentImage((prev) => (prev + 1) % responseProduct.data.images.length);
  };

  const previousImage = () => {
    if (!responseProduct?.data?.images?.length) return;
    setCurrentImage(
      (prev) =>
        (prev - 1 + responseProduct.data.images.length) %
        responseProduct.data.images.length
    );
  };

  const handleMouseMove = (event) => {
    const { left, top, width, height } = event.target.getBoundingClientRect();
    const x = ((event.clientX - left) / width) * 100;
    const y = ((event.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  const calculateDiscount = () => {
    if (!responseProduct?.data?.discountedPrice) return null;

    const originalPrice = responseProduct?.data?.price;
    const discountedPrice = responseProduct?.data?.discountedPrice;

    if (discountedPrice >= originalPrice) return null;

    const difference = originalPrice - discountedPrice;
    const percentOff = Math.round((difference / originalPrice) * 100);

    if (responseProduct?.data?.bestOffer?.discountType === 'percentage') {
      return `${percentOff}% OFF`;
    }

    return `₹${difference.toFixed(0)} OFF`;
  };

  // Derived state
  const discount = calculateDiscount();

  const paginatedReviews = responseReviews?.data
    ? responseReviews.data.slice(
        (pageState.reviews - 1) * reviewsPerPage,
        pageState.reviews * reviewsPerPage
      )
    : [];

  const totalReviewPages = responseReviews?.data
    ? Math.ceil(responseReviews.data.length / reviewsPerPage)
    : 0;

  if (isProductLoading) {
    return <GameDetailsLoading />;
  }

  if (isProductError) {
    return <GameDetailsError error={productError} />;
  }

  return (
    <PageTransition>
      {isProductsSuccess && (
        <div className='min-h-screen bg-transparent text-primary-text font-sans select-none'>
          <div className='container mx-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10'>
              {/* Left Column */}
              <div className='space-y-4 sm:space-y-6'>
                <div>
                  <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 break-words'>
                    {responseProduct?.data?.name}
                  </h1>
                  <div className='my-4 flex flex-wrap items-center gap-2'>
                    <StarRating rating={responseProduct?.data?.averageRating} />
                    <span className='text-secondary-text text-sm sm:text-base'>
                      ({responseProduct?.data?.reviewCount} reviews)
                    </span>
                    {responseProduct?.data?.averageRating > 0 && (
                      <span className='font-bold text-accent-green text-sm sm:text-base'>
                        {responseProduct?.data?.averageRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                <div className='w-full transition-all duration-300 hover:shadow-xl overflow-hidden'>
                  <div className='flex gap-3 sm:gap-4 flex-col sm:flex-row'>
                    <div className='flex sm:flex-col gap-2 sm:gap-3 overflow-x-auto sm:overflow-visible scrollbar-hide'>
                      {responseProduct?.data?.images?.map((image, index) => (
                        <div
                          key={index}
                          className={`${
                            currentImage === index
                              ? 'border-2 border-accent-red'
                              : ''
                          } w-14 h-14 sm:w-16 sm:h-16 p-1 border-0 rounded-lg shadow-sm hover:shadow-md transition-shadow flex-shrink-0`}>
                          <img
                            src={image || '/placeholder.svg'}
                            alt={`Thumbnail ${index + 1}`}
                            className='w-full h-full object-cover rounded-sm'
                            onMouseEnter={() => setCurrentImage(index)}
                            loading='lazy'
                          />
                        </div>
                      ))}
                    </div>

                    {/* Main Image Card */}
                    <Card className='relative overflow-hidden rounded-xl w-full shadow-lg aspect-square border-0'>
                      <CardContent className='p-0 w-full h-full'>
                        <div className='relative w-full h-full'>
                          <AnimatePresence mode='wait'>
                            <motion.div
                              key={currentImage}
                              className='absolute inset-0'
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.1 }}>
                              <img
                                src={
                                  responseProduct?.data?.images?.[
                                    currentImage
                                  ] || '/placeholder.svg'
                                }
                                alt={`Image ${currentImage + 1}`}
                                className='w-full h-full object-cover'
                                style={{
                                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                                  transform: isZoomed ? 'scale(2)' : 'scale(1)',
                                  transition: 'transform 0.2s ease-out',
                                }}
                                onMouseEnter={() => setIsZoomed(true)}
                                onMouseLeave={() => setIsZoomed(false)}
                                onMouseMove={handleMouseMove}
                                loading='lazy'
                              />
                            </motion.div>
                          </AnimatePresence>

                          {/* Navigation Buttons */}
                          <button
                            onClick={previousImage}
                            className='absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-10 bg-accent-red/80 rounded-full p-2 shadow-md transition-transform hover:scale-[1.1]'
                            aria-label='Previous image'>
                            <ChevronLeft className='h-5 w-5 sm:h-6 sm:w-6 text-gray-800' />
                          </button>
                          <button
                            onClick={nextImage}
                            className='absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-10 bg-accent-red/80 rounded-full p-2 shadow-md transition-transform hover:scale-[1.1]'
                            aria-label='Next image'>
                            <ChevronRight className='h-5 w-5 sm:h-6 sm:w-6 text-gray-800' />
                          </button>
                        </div>

                        <div className='flex justify-center gap-2 mt-3 sm:mt-4 pb-4'>
                          {responseProduct?.data?.images?.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImage(index)}
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                                currentImage === index
                                  ? 'bg-primary scale-125'
                                  : 'bg-gray-300'
                              }`}
                              aria-label={`Go to image ${index + 1}`}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Right Column - Game Info and Action Buttons */}
              <div className='ml-0 md:ml-4 lg:ml-6 mt-6 lg:mt-0 space-y-6'>
                <div className='bg-secondary-bg/30 px-4 py-5 sm:px-5 sm:py-6 rounded-xl'>
                  <div className='flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2'>
                    {responseProduct?.data?.discountedPrice > 0 ? (
                      <>
                        <span className='text-primary-text text-2xl sm:text-3xl font-bold'>
                          ₹{responseProduct?.data?.discountedPrice?.toFixed(0)}
                        </span>
                        <span className='text-secondary-text text-lg sm:text-xl line-through'>
                          ₹{responseProduct?.data?.price?.toFixed(0)}
                        </span>
                        {discount && (
                          <Badge className='bg-accent-green hover:bg-hover-green text-black font-medium'>
                            {discount}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <span className='text-primary-text text-2xl sm:text-3xl font-bold'>
                        ₹{responseProduct?.data?.price?.toFixed(0)}
                      </span>
                    )}
                  </div>

                  {responseProduct?.data?.stock === 0 ? (
                    <div className='flex items-center mt-3'>
                      <AlertCircle className='w-4 h-4 text-accent-red mr-2 flex-shrink-0' />
                      <p className='text-accent-red text-sm font-semibold'>
                        Out of Stock
                      </p>
                    </div>
                  ) : responseProduct?.data?.stock < 10 ? (
                    <div className='flex items-center mt-3'>
                      <AlertCircle className='w-4 h-4 text-hover-red mr-2 flex-shrink-0' />
                      <p className='text-hover-red text-sm font-semibold'>
                        Hurry! Only {responseProduct?.data?.stock} units left in
                        stock!
                      </p>
                    </div>
                  ) : (
                    <p className='text-secondary-text text-sm mt-3'>
                      In Stock: {responseProduct?.data?.stock} units available
                    </p>
                  )}
                </div>

                <div className='flex items-center space-x-4'>
                  <span className='text-lg font-semibold'>Quantity:</span>
                  <div className='flex items-center'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8 rounded-full border border-primary-bg/30 bg-primary-bg/5 hover:bg-accent-blue/20 hover:border-accent-blue/50 transition-colors'
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
                            disabled={quantity <= 1}>
                            <Minus className='h-3 w-3 md:h-4 md:w-4' />
                            <span className='sr-only'>Decrease quantity</span>
                          </Button>
                        </TooltipTrigger>
                        {quantity <= 1 && (
                          <TooltipContent>
                            <p>Minimum quantity is 1</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>

                    {/* Fixed width for quantity display */}
                    <span className='mx-4 text-lg w-[2ch] text-center'>
                      {quantity}
                    </span>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8 rounded-full border border-primary-bg/30 bg-primary-bg/5 hover:bg-accent-blue/20 hover:border-accent-blue/50 transition-colors'
                            onClick={() => setQuantity(quantity + 1)}
                            disabled={
                              quantity >= responseProduct?.data?.stock ||
                              quantity >= 5
                            }>
                            <Plus className='h-3 w-3 md:h-4 md:w-4' />
                            <span className='sr-only'>Increase quantity</span>
                          </Button>
                        </TooltipTrigger>
                        {quantity >= responseProduct?.data?.stock ? (
                          <TooltipContent>
                            <p>
                              Only {responseProduct?.data?.stock} units left!
                            </p>
                          </TooltipContent>
                        ) : quantity >= 5 ? (
                          <TooltipContent>
                            <p>
                              You can&apos;t add more than 5 units per order
                            </p>
                          </TooltipContent>
                        ) : null}
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {/* Additional space for message to avoid layout shift */}
                <span className='text-red-500 text-sm mt-2 min-h-[1.5rem] block'>
                  {quantity >= responseProduct?.data?.stock
                    ? `Only ${responseProduct?.data?.stock} items are available in stock.`
                    : quantity >= 5
                    ? 'You can only order up to 5 items at a time.'
                    : ''}
                </span>

                <div className='space-y-3 lg:pt-10'>
                  {/* <Button
                    className={`w-full font-semibold py-5 text-white transition-all duration-200 ${
                      responseProduct?.data?.stock >= 1 && !isOutOfStock
                        ? 'bg-accent-blue hover:bg-hover-blue'
                        : 'bg-gray-600 cursor-not-allowed'
                    }`}
                    disabled={isOutOfStock || responseProduct?.data?.stock < 1}
                    onClick={() => requireLogin(user, navigate, location)}>
                    Buy Now
                  </Button> */}

                  <Button
                    variant='secondary'
                    className='w-full bg-accent-blue hover:bg-hover-blue transition-colors text-white py-5'
                    disabled={
                      isOutOfStock ||
                      responseProduct?.data?.stock < 1 ||
                      addItemToCartMeta.isLoading
                    }
                    onClick={handleAddToCart}>
                    <ShoppingCart className='w-4 h-4 mr-2' />
                    {addItemToCartMeta.isLoading
                      ? 'Adding to Cart...'
                      : 'Add To Cart'}
                  </Button>

                  <Button
                    variant='secondary'
                    className='w-full bg-[#2A2A2A] hover:bg-[#353535] text-white py-5 hover:text-accent-blue transition-colors'
                    onClick={handleAddToWishlist}
                    disabled={addToWishlistMeta.isLoading}>
                    <Heart className='w-4 h-4 mr-2' />
                    {addToWishlistMeta.isLoading
                      ? 'Saving to Wishlist...'
                      : 'Add to Wishlist'}
                  </Button>
                </div>

                <div className='space-y-4 pt-4 border-t border-gray-800'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-3'>
                      <div className='flex flex-col'>
                        <span className='text-secondary-text text-sm'>
                          Brand
                        </span>
                        <span className='font-medium text-primary-text truncate'>
                          {responseProduct?.data?.brand?.name || 'N/A'}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-secondary-text text-sm'>
                          Platform
                        </span>
                        <span className='font-medium text-primary-text truncate'>
                          {responseProduct?.data?.platform || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className='space-y-3'>
                      <div className='flex flex-col'>
                        <span className='text-secondary-text text-sm'>
                          Genre
                        </span>
                        <span className='font-medium text-primary-text truncate'>
                          {responseProduct?.data?.genre?.name || 'N/A'}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-secondary-text text-sm'>
                          Release Date
                        </span>
                        <span className='font-medium text-primary-text truncate'>
                          {responseProduct?.data?.createdAt
                            ? new Date(
                                responseProduct.data.createdAt
                              ).toLocaleDateString()
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section - Game Details, Description, System Requirements, Reviews */}
            <div className='mt-12 sm:mt-16 space-y-8 sm:space-y-12'>
              <div className='bg-secondary-bg/20 p-4 sm:p-6 rounded-xl'>
                <h2 className='text-xl sm:text-2xl font-bold mb-4'>
                  Description
                </h2>
                <p className='text-secondary-text leading-relaxed'>
                  {responseProduct?.data?.description ||
                    'No description available'}
                </p>
              </div>

              <div className='bg-secondary-bg/20 p-4 sm:p-6 rounded-xl'>
                <h2 className='text-xl sm:text-2xl font-bold mb-4'>
                  System Requirements
                </h2>
                {responseProduct?.data?.systemRequirements ? (
                  <SystemRequirements
                    requirements={responseProduct?.data?.systemRequirements}
                  />
                ) : (
                  <p className='text-secondary-text'>
                    No system requirements available
                  </p>
                )}
              </div>

              <div className='bg-secondary-bg/20 p-4 sm:p-6 rounded-xl'>
                <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6'>
                  <div className='flex items-center gap-3 flex-wrap'>
                    <h2 className='text-xl sm:text-2xl font-bold'>Reviews</h2>
                    {responseProduct?.data?.averageRating > 0 && (
                      <div className='flex items-center bg-secondary-bg/50 px-3 py-1 rounded-lg'>
                        <StarRating
                          rating={responseProduct?.data?.averageRating}
                        />
                        <span className='ml-2 font-bold text-accent-green'>
                          {responseProduct?.data?.averageRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    className='bg-accent-blue hover:bg-hover-blue text-white w-full sm:w-auto'
                    onClick={() =>
                      showToast.info('Write a review feature coming soon!')
                    }>
                    <PenLine className='w-4 h-4 mr-2' />
                    Write a Review
                  </Button>
                </div>

                {responseReviews?.data?.length > 0 ? (
                  <div className='space-y-6'>
                    <Reviews reviews={paginatedReviews} />

                    {totalReviewPages > 1 && (
                      <div className='flex justify-center mt-8 overflow-x-auto'>
                        <Pagination>
                          <Button
                            variant='outline'
                            className='mr-2'
                            disabled={pageState.reviews === 1}
                            onClick={() =>
                              setPageState((prev) => ({
                                ...prev,
                                reviews: prev.reviews - 1,
                              }))
                            }>
                            Previous
                          </Button>
                          <span className='flex items-center px-4 whitespace-nowrap'>
                            Page {pageState.reviews} of {totalReviewPages}
                          </span>
                          <Button
                            variant='outline'
                            className='ml-2'
                            disabled={pageState.reviews === totalReviewPages}
                            onClick={() =>
                              setPageState((prev) => ({
                                ...prev,
                                reviews: prev.reviews + 1,
                              }))
                            }>
                            Next
                          </Button>
                        </Pagination>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='text-center py-8 text-secondary-text'>
                    No reviews yet. Be the first to review this game!
                  </div>
                )}
              </div>
            </div>

            <div className='mt-12 sm:mt-16 space-y-8'>
              <GameListing
                key={productId}
                title='Related Games'
                games={relatedQuery?.data?.data?.products}
                currentPage={relatedQuery?.data?.data?.currentPage}
                totalPage={relatedQuery?.data?.data?.totalPages}
                onPageChange={(page) =>
                  setPageState((prev) => ({
                    ...prev,
                    relatedGames: page,
                  }))
                }
                isFetching={relatedQuery.isFetching}
                isLoading={relatedQuery.isLoading}
                isError={relatedQuery.isError}
                onRetry={relatedQuery.refetch}
              />
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};
