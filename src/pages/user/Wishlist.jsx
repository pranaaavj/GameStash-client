import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useMoveToCartMutation,
} from '@/redux/api/user/wishlistApi';

import { handleApiError, showToast } from '@/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingCart,
  Trash2,
  AlertCircle,
  Loader2,
  Tag,
} from 'lucide-react';
import { Button } from '@/shadcn/components/ui/button';
import { Badge } from '@/shadcn/components/ui/badge';
import { ScrollArea } from '@/shadcn/components/ui/scroll-area';
import { useUsers } from '@/hooks';
import { ConfirmationModal, PageTransition } from '@/components/common';
import { WishlistError, WishlistLoading } from '@/components/error';

export const Wishlist = () => {
  const user = useUsers();
  const navigate = useNavigate();

  const {
    data: wishlistData,
    isLoading,
    isError,
    refetch,
  } = useGetWishlistQuery(undefined, {
    skip: !user?.userInfo?.id,
  });

  const [removeFromWishlist] = useRemoveFromWishlistMutation();
  const [moveToCart] = useMoveToCartMutation();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [processingItems, setProcessingItems] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  useEffect(() => {
    if (wishlistData?.data) {
      setWishlistItems(wishlistData.data.products);
    }
  }, [wishlistData]);

  const handleRemoveFromWishlist = async (productId) => {
    setProcessingItems((prev) => ({ ...prev, [productId]: 'removing' }));

    try {
      const response = await removeFromWishlist(productId).unwrap();
      if (response?.success) {
        showToast.success('Item removed from wishlist');
        setWishlistItems((prev) =>
          prev.filter((item) => item._id !== productId)
        );
      }
    } catch (error) {
      handleApiError(error, 'Failed to remove item from wishlist');
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: undefined }));
    }
  };

  const handleMoveToCart = async (productId) => {
    setProcessingItems((prev) => ({ ...prev, [productId]: 'moving' }));

    try {
      const response = await moveToCart(productId).unwrap();
      if (response?.success) {
        showToast.success('Item moved to cart');
        setWishlistItems((prev) =>
          prev.filter((item) => item._id !== productId)
        );
      }
    } catch (error) {
      handleApiError(error, 'Failed to move item to cart');
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: undefined }));
    }
  };

  const handleProductClick = (productId) => navigate(`/games/${productId}`);

  const confirmRemoveItem = (productId) => {
    setSelectedItemId(productId);
    setIsModalOpen(true);
  };

  const calculateDiscount = (product) => {
    if (!product || !product.price || !product.discountedPrice) return null;
    if (product.discountedPrice >= product.price) return null;
    const discount =
      ((product.price - product.discountedPrice) / product.price) * 100;
    return `${Math.round(discount)}% OFF`;
  };

  if (isLoading) return <WishlistLoading />;
  if (isError) return <WishlistError refetch={refetch} />;

  return (
    <PageTransition>
      <div className='container mx-auto max-w-6xl py-6'>
        <h1 className='text-3xl md:text-4xl font-bold mb-10 text-primary-text'>
          Your Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <motion.div
            className='flex flex-col items-center justify-center py-16 text-secondary-text'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}>
            <Heart className='h-16 w-16 mb-6 text-accent-red opacity-80' />
            <p className='text-xl mb-6 font-medium'>Your wishlist is empty</p>
            <Button
              variant='outline'
              onClick={() => navigate('/')}
              className='text-white border-none bg-accent-blue hover:bg-hover-blue hover:scale-105 hover:text-white px-6 py-5 font-medium transition-all duration-300'>
              Discover Games
            </Button>
          </motion.div>
        ) : (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-3'>
              <ScrollArea className='no-scrollbar'>
                <AnimatePresence initial={false}>
                  <motion.div className='space-y-4 sm:space-y-5 md:space-y-6'>
                    {wishlistItems.map((item) => (
                      <motion.div
                        key={item._id}
                        className='flex items-start gap-3 sm:gap-4 bg-secondary-bg p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-secondary-bg/80'
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}>
                        <div
                          className='w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg bg-primary-bg/50 p-2 flex-shrink-0 overflow-hidden cursor-pointer'
                          onClick={() => handleProductClick(item._id)}>
                          <img
                            src={item.images?.[0] || '/placeholder.svg'}
                            alt={item.name}
                            className='w-full h-full object-cover rounded-md transition-transform duration-300 hover:scale-105'
                          />
                        </div>

                        <div className='flex flex-1 justify-between sm:gap-4'>
                          <div className='flex flex-col justify-between'>
                            <div>
                              <h3
                                className='text-sm sm:text-base md:text-lg font-semibold text-primary-text cursor-pointer hover:text-accent-blue transition-colors'
                                onClick={() => handleProductClick(item._id)}>
                                {item.name}
                              </h3>
                              <p className='text-xs text-secondary-text mb-1'>
                                {item.platform}{' '}
                                {item.genre?.name && `• ${item.genre.name}`}
                              </p>

                              {item.stock === 0 && (
                                <div className='text-accent-red bg-hover-red/10 p-2 rounded-md mb-1 flex items-center'>
                                  <AlertCircle className='w-4 h-4 mr-2' />
                                  <p className='font-medium text-xs'>
                                    Out of Stock
                                  </p>
                                </div>
                              )}

                              {item.bestOffer && (
                                <div className='flex items-center gap-2 mb-1'>
                                  <Tag className='h-3.5 w-3.5 text-accent-green' />
                                  <span className='text-sm text-accent-green font-medium'>
                                    {item.bestOffer.name}
                                  </span>
                                </div>
                              )}

                              {item.stock > 0 && item.stock < 10 && (
                                <span className='text-[11px] px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded-full'>
                                  Only {item.stock} left in stock
                                </span>
                              )}
                            </div>

                            <div className='flex items-center gap-2 mt-3'>
                              <Button
                                className={`bg-accent-blue hover:bg-hover-blue text-white transition-all duration-200 ${
                                  item.stock === 0
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                                }`}
                                onClick={() => handleMoveToCart(item._id)}
                                disabled={
                                  item.stock === 0 ||
                                  processingItems[item._id] === 'moving'
                                }>
                                {processingItems[item._id] === 'moving' ? (
                                  <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                                ) : (
                                  <ShoppingCart className='h-4 w-4 mr-2' />
                                )}
                                Move to Cart
                              </Button>
                            </div>
                          </div>

                          <div className='flex flex-col items-end justify-between w-24'>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='text-secondary-text hover:text-accent-red hover:bg-accent-red/10 self-end transition-colors'
                              onClick={() => confirmRemoveItem(item._id)}>
                              <Trash2 className='h-5 w-5' />
                            </Button>

                            {item.discountedPrice > 0 &&
                            item.discountedPrice < item.price ? (
                              <div className='flex flex-col items-end'>
                                <div className='py-1'>
                                  {calculateDiscount(item) && (
                                    <Badge className='bg-accent-red text-white cursor-default hover:bg-hover-red text-nowrap'>
                                      {calculateDiscount(item)}
                                    </Badge>
                                  )}
                                </div>
                                <div className='flex flex-col sm:flex-row items-center gap-1'>
                                  <span className='text-xs text-secondary-text line-through'>
                                    ₹{item.price.toFixed(2)}
                                  </span>
                                  <span className='text-sm font-bold text-accent-green'>
                                    ₹{item.discountedPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p className='text-sm font-bold text-primary-text'>
                                ₹{item.price.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </ScrollArea>
            </div>
          </div>
        )}

        <ConfirmationModal
          isOpen={isModalOpen}
          title='Remove from Wishlist'
          description='Are you sure you want to remove this item from your wishlist?'
          onConfirm={() => {
            handleRemoveFromWishlist(selectedItemId);
            setIsModalOpen(false);
          }}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedItemId(null);
          }}
        />
      </div>
    </PageTransition>
  );
};
