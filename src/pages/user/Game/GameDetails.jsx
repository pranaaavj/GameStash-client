/* eslint-disable react/prop-types */
import {
  useGetProductQuery,
  useGetReviewByProductQuery,
  useGetProductsByGenreQuery,
} from '@/redux/api/user/productApi';
import { Button } from '@/shadcn/components/ui/button';
import { Reviews } from '../../../components/user/Reviews';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { RelatedGamesFallback } from '@/components/error/RelatedFallback';
import { ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { GameListing } from '..';
import { SystemRequirements, StarRating } from '@/components/user';
import {
  useAddItemToCartMutation,
  useGetCartQuery,
} from '@/redux/api/user/cartApi';
import { toast } from 'sonner';
import { useUsers } from '@/hooks';
import { requireLogin } from '@/utils';
import { ImageGallery } from '@/components/common/ImageGallery';

export function GameDetails() {
  const user = useUsers();
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: cartData } = useGetCartQuery(user?.userInfo?.id, {
    skip: !user?.userInfo?.id,
  });

  const [quantity, setQuantity] = useState(1);
  const [isOutOfStock, setIsOutOfStock] = useState(false);
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

  useEffect(() => {
    setQuantity(1);
  }, [productId]);

  useEffect(() => {
    if (cartData?.data?.items) {
      const item = cartData.data.items.find(
        (item) => item.product._id === productId
      );
      const stockLeft = responseProducts?.data?.stock - (item?.quantity || 0);
      setIsOutOfStock(stockLeft <= 0);
    }
  }, [cartData, responseProducts]);

  const {
    data: responseReviews,
    isProductsError: isReviewError,
    productsError: reviewError,
  } = useGetReviewByProductQuery(productId);

  const [addItemToCart, { isError: isAddCartError, error: addCartError }] =
    useAddItemToCartMutation();

  const filteredRelatedProducts =
    isRelatedProductSuccess &&
    responseRelated?.data?.products?.filter(
      (product) => product._id !== productId
    );

  const handleAddToCart = async () => {
    if (!requireLogin(user, navigate, location)) return;

    const item = cartData?.data?.items.find(
      (item) => item.product._id === productId
    );

    if (item?.quantity + quantity > 5) {
      toast.error('Maximum quantity added.');
      return;
    }

    if (responseProducts?.data?.stock <= item?.quantity) {
      setIsOutOfStock(true);
      return;
    }

    try {
      const response = await addItemToCart({ productId, quantity }).unwrap();
      if (response.success) {
        toast.success('Added to cart successfully !');

        const updatedStock = responseProducts?.data?.stock - quantity;

        if (updatedStock <= 0) {
          setIsOutOfStock(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isReviewError) {
    console.log(reviewError);
  }

  if (isProductsError) {
    console.log(productsError);
  }

  if (isAddCartError) {
    console.log(addCartError);
  }

  return (
    isProductsSuccess && (
      <div className='min-h-screen bg-primary-bg text-primary-text font-sans px-4 sm:px-8 lg:px-16 select-none'>
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
              <ImageGallery
                images={responseProducts?.data?.images || []}
                alt={responseProducts?.data?.images}
              />
              {/* <Carousel className='w-full mx-10'>
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
              </Carousel> */}
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
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}>
                    <Minus className='h-4 w-4' />
                  </Button>
                  {/* Fixed width for quantity display */}
                  <span className='mx-4 text-lg w-[2ch] text-center'>
                    {quantity}
                  </span>
                  <Button
                    variant='outline'
                    className='bg-[#2A2A2A] hover:bg-[#353535] text-white border-none'
                    size='icon'
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={
                      quantity >= responseProducts?.data?.stock || quantity >= 5
                    }>
                    <Plus className='h-4 w-4 ' />
                  </Button>
                </div>
              </div>

              {/* Additional space for message to avoid layout shift */}
              <span className='text-red-500 text-sm mt-2 min-h-[1.5rem] block'>
                {quantity >= responseProducts?.data?.stock
                  ? `Only ${responseProducts?.data?.stock} items are available in stock.`
                  : quantity >= 5
                  ? 'You can only order up to 5 items at a time.'
                  : ''}
              </span>

              <div className='space-y-3'>
                <Button
                  className='w-full bg-[#0074E4] hover:bg-[#0063C1] text-white font-semibold py-3'
                  disabled={isOutOfStock || responseProducts?.data?.stock < 1}>
                  {responseProducts?.data?.stock >= 1 && !isOutOfStock
                    ? 'Buy Now'
                    : 'No Stocks Left'}
                </Button>

                <Button
                  variant='secondary'
                  className='w-full bg-[#2A2A2A] hover:bg-[#353535] text-white'
                  disabled={isOutOfStock || responseProducts?.data?.stock < 1}
                  onClick={handleAddToCart}>
                  <ShoppingCart className='w-4 h-4 mr-2' />
                  {responseProducts?.data?.stock >= 1 && !isOutOfStock
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
