'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
  useMoveToCartMutation,
} from '@/redux/api/user/wishlistApi';
import { toast } from 'sonner';
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
import { ConfirmationModal } from '@/components/common';

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
        toast.success('Item removed from wishlist');
        // Optimistically remove from UI
        setWishlistItems((prev) =>
          prev.filter((item) => item._id !== productId)
        );
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: undefined }));
    }
  };

  const handleMoveToCart = async (productId) => {
    setProcessingItems((prev) => ({ ...prev, [productId]: 'moving' }));

    try {
      const response = await moveToCart(productId).unwrap();

      if (response?.success) {
        toast.success('Item moved to cart');
        // Optimistically remove from UI
        setWishlistItems((prev) =>
          prev.filter((item) => item._id !== productId)
        );
      }
    } catch (error) {
      console.error('Failed to move to cart:', error);
      toast.error(error.message || 'Failed to move item to cart');
    } finally {
      setProcessingItems((prev) => ({ ...prev, [productId]: undefined }));
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/games/${productId}`);
  };

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

  // Loading state
  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-10 max-w-full'>
        <h1 className='text-3xl md:text-4xl font-bold mb-10 text-primary-text'>
          Your Wishlist
        </h1>
        <div className='space-y-6'>
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className='bg-secondary-bg p-5 md:p-6 rounded-xl animate-pulse'>
              <div className='flex gap-6'>
                <div className='h-28 w-28 md:h-32 md:w-32 rounded-lg bg-primary-bg/50'></div>
                <div className='flex-1 space-y-4'>
                  <div className='h-6 bg-primary-bg/50 rounded w-3/4'></div>
                  <div className='h-4 bg-primary-bg/50 rounded w-1/4'></div>
                  <div className='h-4 bg-primary-bg/50 rounded w-1/2'></div>
                  <div className='flex justify-between'>
                    <div className='h-8 bg-primary-bg/50 rounded w-1/3'></div>
                    <div className='h-8 bg-primary-bg/50 rounded w-1/4'></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className='container mx-auto px-4 py-10 max-w-6xl'>
        <h1 className='text-3xl md:text-4xl font-bold mb-10 text-primary-text'>
          Your Wishlist
        </h1>
        <div className='bg-secondary-bg/60 p-6 rounded-xl'>
          <div className='flex items-center gap-3 text-accent-red'>
            <AlertCircle className='h-5 w-5' />
            <p>
              There was an error loading your wishlist. Please try again later.
            </p>
          </div>
          <Button
            className='mt-4 bg-accent-blue hover:bg-hover-blue text-white'
            onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Not logged in state
  if (!user?.userInfo) {
    return (
      <div className='container mx-auto px-4 py-10 max-w-6xl'>
        <h1 className='text-3xl md:text-4xl font-bold mb-10 text-primary-text'>
          Your Wishlist
        </h1>
        <motion.div
          className='flex flex-col items-center justify-center h-[calc(100vh-200px)] text-primary-text rounded-xl p-8 bg-secondary-bg/50'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}>
          <motion.div
            className='relative w-20 h-20 md:w-24 md:h-24 mb-8'
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}>
            <motion.div
              className='absolute inset-0 bg-accent-red rounded-full opacity-20'
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
            <Heart className='w-full h-full text-accent-red' />
          </motion.div>
          <motion.h2
            className='text-2xl md:text-3xl font-bold mb-4 text-center'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            Your Wishlist is Waiting
          </motion.h2>
          <motion.p
            className='text-secondary-text mb-8 text-center text-base md:text-lg max-w-md'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}>
            Log in to save your favorite games and get notified about special
            offers
          </motion.p>
          <motion.button
            className='px-8 py-4 bg-accent-red text-white rounded-lg font-medium text-lg hover:bg-hover-red transition duration-300 shadow-sm hover:shadow-md'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}>
            Log In
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-10 max-w-full'>
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
            className='text-accent-blue border-accent-blue hover:bg-accent-blue hover:text-white px-6 py-5 font-medium transition-all duration-300'>
            Discover Games
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='grid lg:grid-cols-2 gap-8 mx-10'>
          <div className='lg:col-span-2'>
            <ScrollArea className='h-[calc(100vh-250px)] pr-4'>
              <AnimatePresence initial={false}>
                <motion.div className='space-y-6'>
                  {wishlistItems.map((item) => (
                    <motion.div
                      key={item._id}
                      className='flex gap-6 bg-secondary-bg p-5 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-secondary-bg/80'
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}>
                      <div
                        className='h-28 w-28 md:h-32 md:w-32 rounded-lg bg-primary-bg/50 p-2 flex-shrink-0 overflow-hidden cursor-pointer'
                        onClick={() => handleProductClick(item._id)}>
                        <img
                          src={item.images?.[0] || '/placeholder.svg'}
                          alt={item.name}
                          className='h-full w-full object-cover rounded-md transition-transform duration-300 hover:scale-105'
                        />
                      </div>
                      <div className='flex flex-1 flex-col justify-between'>
                        <div>
                          <div className='flex items-start justify-between'>
                            <h3
                              className='text-lg md:text-xl font-semibold text-primary-text mb-1 cursor-pointer hover:text-accent-blue transition-colors'
                              onClick={() => handleProductClick(item._id)}>
                              {item.name}
                            </h3>
                          </div>

                          <p className='text-sm text-secondary-text mb-2'>
                            {item.platform}{' '}
                            {item.genre?.name && `• ${item.genre.name}`}
                          </p>

                          {item.stock === 0 && (
                            <div className='text-accent-red bg-hover-red/10 p-2 rounded-md mb-2 flex items-center'>
                              <AlertCircle className='w-4 h-4 mr-2' />
                              <p className='font-medium text-sm'>
                                Out of Stock
                              </p>
                            </div>
                          )}

                          {item.bestOffer && (
                            <div className='flex items-center gap-2 mb-2'>
                              <Tag className='h-3.5 w-3.5 text-accent-green' />
                              <span className='text-sm text-accent-green font-medium'>
                                {item.bestOffer.name}
                              </span>
                            </div>
                          )}

                          {item.stock > 0 && item.stock < 10 && (
                            <span className='text-xs px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded-full'>
                              Only {item.stock} left in stock
                            </span>
                          )}
                        </div>

                        <div className='flex items-center justify-between mt-2'>
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

                          <div className='text-right'>
                            {item.discountedPrice > 0 &&
                            item.discountedPrice < item.price ? (
                              <div className='flex flex-col items-end'>
                                <div className='py-2'>
                                  {calculateDiscount(item) && (
                                    <Badge className='bg-accent-red text-white cursor-default hover:bg-hover-red'>
                                      {calculateDiscount(item)}
                                    </Badge>
                                  )}
                                </div>
                                <div className='flex items-center gap-2'>
                                  <span className='text-sm text-secondary-text line-through'>
                                    ₹{item.price.toFixed(2)}
                                  </span>
                                  <span className='text-xl font-bold text-accent-green'>
                                    ₹{item.discountedPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p className='text-xl font-bold text-primary-text'>
                                ₹{item.price.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-secondary-text hover:text-accent-red hover:bg-accent-red/10 self-start transition-colors'
                        onClick={() => confirmRemoveItem(item._id)}>
                        <Trash2 className='h-5 w-5' />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </ScrollArea>
          </div>
        </motion.div>
      )}

      {/* Confirmation Modal */}
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
  );
};
