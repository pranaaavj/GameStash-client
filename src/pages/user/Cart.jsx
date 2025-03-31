import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveItemFromCartMutation,
} from '@/redux/api/user/cartApi';
import { ScrollArea } from '@/shadcn/components/ui/scroll-area';
import { Button } from '@/shadcn/components/ui/button';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Lock,
  AlertTriangle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useUsers } from '@/hooks';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { Badge } from '@/shadcn/components/ui/badge';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Alert, AlertDescription } from '@/shadcn/components/ui/alert';
import { ConfirmationModal } from '@/components/common';

const CartLoading = lazy(() => import('@/components/error/CartLoading'));
const CartError = lazy(() => import('@/components/error/CartError'));

export default function Cart() {
  const user = useUsers();
  const navigate = useNavigate();

  const {
    data: responseCart,
    isError: isCartError,
    isLoading: isCartLoading,
    refetch,
  } = useGetCartQuery(user?.userInfo?.id, {
    skip: !user?.userInfo?.id,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeItemFromCart, removeItemFromCartMeta] =
    useRemoveItemFromCartMutation();

  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [isVerifyingCheckout, setIsVerifyingCheckout] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (responseCart?.data?.items) {
      setCartItems(responseCart.data.items);
      const total = responseCart.data.items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0
      );
      setSubtotal(total);
    }
  }, [responseCart]);

  const refetchCart = async () => {
    try {
      const { data: newCart } = await refetch();
      if (newCart?.data?.items) setCartItems([...newCart.data.items]);
    } catch (error) {
      console.error('Failed to refetch cart:', error);
    }
  };

  const debouncedUpdateQuantity = useDebouncedCallback(
    async (productId, quantity) => {
      try {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        const response = await updateCartItem(
          { productId, quantity },
          { signal: abortControllerRef.current.signal }
        ).unwrap();

        if (response?.success)
          toast.success(response?.message, { duration: 1500 });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to update cart item:', error);
          toast.error('Something went wrong, please try again later.');
        }
        await refetchCart();
      }
    },
    900
  );

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity > 5 || quantity < 1)
      return toast.error('Quantity limit reached.');
    const item = cartItems.find((item) => item.product._id === productId);
    if (item?.product.stock < quantity)
      return toast.error('Insufficient stock.');

    setCartItems((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );

    debouncedUpdateQuantity(productId, quantity);
  };

  const confirmRemoveItem = (productId) => {
    setItemToRemove(productId);
    setShowRemoveDialog(true);
  };

  const handleRemoveItem = async () => {
    if (!itemToRemove) return;
    setCartItems((prev) =>
      prev.filter((item) => item.product._id !== itemToRemove)
    );
    try {
      const response = await removeItemFromCart(itemToRemove).unwrap();
      if (response.success) toast.success(response.message, { duration: 1500 });
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
    setShowRemoveDialog(false);
    setItemToRemove(null);
  };

  const handleCheckout = async () => {
    if (!cartItems.length) return toast.error('Your cart is empty!');

    setIsVerifyingCheckout(true);
    try {
      const { data: updatedCart } = await refetch();
      const updatedCartItems = updatedCart?.data?.items || [];

      const outOfStock = updatedCartItems.some(
        (item) => item.product.stock < item.quantity
      );

      if (outOfStock) {
        toast.error('Some items are out of stock. Please remove them.');
        return;
      }

      navigate('/checkout', { state: { isCheckoutAllowed: true } });
    } catch (error) {
      toast.error(
        error?.data?.message ||
          'Something went wrong while verifying your cart.'
      );
    } finally {
      setIsVerifyingCheckout(false);
    }
  };

  const calculateDiscount = (product) => {
    if (
      !product.bestOffer ||
      !product.discountedPrice ||
      product.discountedPrice >= product.price
    )
      return null;

    const diff = product.price - product.discountedPrice;
    const percent = Math.round((diff / product.price) * 100);
    return product.bestOffer.discountType === 'percentage'
      ? `-${percent}% OFF`
      : `-₹${diff.toFixed(0)} OFF`;
  };

  const hasOutOfStockItems = cartItems.some((item) => item.product.stock === 0);
  const hasLowStockItems = cartItems.some(
    (item) => item.product.stock < item.quantity
  );

  if (isCartError)
    return (
      <Suspense fallback={null}>
        <CartError />
      </Suspense>
    );

  if (isCartLoading)
    return (
      <Suspense fallback={null}>
        <CartLoading />
      </Suspense>
    );

  return (
    <div className='container mx-auto py-4 max-w-6xl no-scrollbar'>
      <h1 className='text-3xl md:text-4xl font-bold mb-10 text-primary-text'>
        Your Cart
      </h1>
      {user?.userInfo ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {cartItems?.length > 0 ? (
            <>
              <div className='lg:col-span-2 no-scrollbar'>
                <div>
                  {hasOutOfStockItems && (
                    <Alert className='mb-6 max-w-[720px] border-transparent bg-hover-red/10 text-accent-red'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertDescription>
                        Some items in your cart are out of stock. Please remove
                        them before proceeding to checkout.
                      </AlertDescription>
                    </Alert>
                  )}

                  {hasLowStockItems && !hasOutOfStockItems && (
                    <Alert className='mb-6 border-amber-500 bg-amber-500/10 text-amber-500'>
                      <AlertTriangle className='h-4 w-4' />
                      <AlertDescription>
                        Some items in your cart have limited stock. Please check
                        quantities before checkout.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <ScrollArea className=' pr-2 sm:pr-4 no-scrollbar'>
                  <AnimatePresence initial={false}>
                    <motion.div className='space-y-4 sm:space-y-5 md:space-y-6'>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item._id}
                          className='flex items-start gap-3 sm:gap-4 bg-secondary-bg p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-secondary-bg/80'
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}>
                          {/* Left Image */}
                          <div className='w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg bg-primary-bg/50 p-2 flex-shrink-0 overflow-hidden'>
                            <img
                              src={
                                item.product?.images?.[0] || '/placeholder.svg'
                              }
                              alt={item.product?.name}
                              className='w-full h-full object-cover rounded-md transition-transform duration-300 hover:scale-105'
                            />
                          </div>

                          {/* Right content */}
                          <div className='flex flex-1 justify-between sm:gap-4'>
                            <div className='flex flex-col justify-between'>
                              <div>
                                <h3 className='text-sm sm:text-base md:text-lg font-semibold text-primary-text'>
                                  {item.product?.name}
                                </h3>
                                <p className='text-xs text-secondary-text mb-1'>
                                  {item.product?.platform}
                                </p>

                                {item.product.stock === 0 && (
                                  <div className='text-accent-red bg-hover-red/10 p-2 rounded-md mb-1 flex items-center'>
                                    <AlertCircle className='w-4 h-4 mr-2' />
                                    <p className='font-medium text-xs'>
                                      Out of Stock
                                    </p>
                                  </div>
                                )}

                                {item.product.stock > 0 &&
                                  item.product.stock < 10 && (
                                    <span className='text-[11px] px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded-full'>
                                      Only {item.product.stock} left in stock
                                    </span>
                                  )}
                              </div>

                              <div className='flex items-center gap-2 mt-3'>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-7 w-7 rounded-full border hover:bg-accent-blue hover:border-accent-blue'
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.product._id,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={
                                    item.quantity <= 1 ||
                                    item.product.stock === 0
                                  }>
                                  <Minus className='h-3 w-3' />
                                </Button>
                                <span className='w-6 text-center text-sm text-primary-text font-medium'>
                                  {item.quantity}
                                </span>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-7 w-7 rounded-full border hover:bg-accent-blue hover:border-accent-blue'
                                  onClick={() =>
                                    handleUpdateQuantity(
                                      item.product._id,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={
                                    item.quantity >= 5 ||
                                    item.quantity >= item.product.stock ||
                                    item.product.stock === 0
                                  }>
                                  <Plus className='h-3 w-3' />
                                </Button>
                              </div>
                            </div>

                            <div className='flex flex-col items-end justify-between w-24'>
                              <Button
                                variant='ghost'
                                size='icon'
                                className='text-secondary-text hover:text-accent-red hover:bg-accent-red/10 self-end transition-colors'
                                onClick={() =>
                                  confirmRemoveItem(item.product._id)
                                }
                                disabled={removeItemFromCartMeta.isLoading}>
                                <Trash2 className='h-5 w-5' />
                              </Button>

                              {item.product.discountedPrice > 0 ? (
                                <div className='flex flex-col items-end'>
                                  <div className='py-1'>
                                    {calculateDiscount(item.product) && (
                                      <Badge className='bg-accent-red text-white cursor-default hover:bg-hover-red text-nowrap'>
                                        {calculateDiscount(item.product)}
                                      </Badge>
                                    )}
                                  </div>
                                  <div className='flex flex-col sm:flex-row items-center gap-1'>
                                    <span className='text-xs text-secondary-text line-through'>
                                      ₹
                                      {(
                                        item.product.price * item.quantity
                                      ).toFixed(2)}
                                    </span>
                                    <span className='text-sm font-bold text-accent-green'>
                                      ₹
                                      {(
                                        item.product.discountedPrice *
                                        item.quantity
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <p className='text-sm font-bold text-primary-text'>
                                  ₹
                                  {(item.product.price * item.quantity).toFixed(
                                    2
                                  )}
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

              <motion.div
                className='lg:col-span-1'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <Card className='bg-secondary-bg border-none text-primary-text sticky top-6'>
                  <CardContent className='p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-base sm:text-lg md:text-xl font-bold'>
                        Order Summary
                      </h2>
                      <span className='text-xs sm:text-sm text-secondary-text'>
                        {cartItems.length} items
                      </span>
                    </div>

                    <div className='space-y-2 sm:space-y-3 pt-4 border-t border-primary-bg/20'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-secondary-text'>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>

                      {responseCart?.data?.discount > 0 && (
                        <div className='flex justify-between text-sm text-accent-red'>
                          <span>Discount</span>
                          <span>
                            -₹{responseCart?.data?.discount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className='flex justify-between text-sm'>
                        <span className='text-secondary-text'>Shipping</span>
                        <span>Calculated at checkout</span>
                      </div>

                      <div className='flex justify-between items-center pt-3 border-t border-primary-bg/20'>
                        <span className='text-base sm:text-lg font-bold'>
                          Total
                        </span>
                        <span className='text-lg sm:text-xl font-bold'>
                          ₹{responseCart?.data?.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className='w-full bg-accent-blue hover:bg-hover-blue text-white py-4 sm:py-5'
                      onClick={handleCheckout}
                      disabled={
                        cartItems.length === 0 ||
                        cartItems.some((item) => item.product.stock === 0) ||
                        cartItems.some(
                          (item) => item.product.stock < item.quantity
                        ) ||
                        isVerifyingCheckout // this is the loading state you'll manage in handleCheckout
                      }>
                      {isVerifyingCheckout ? (
                        <span className='flex items-center justify-center gap-2'>
                          <Loader2 className='w-4 h-4 animate-spin' />
                          Verifying...
                        </span>
                      ) : cartItems.some((item) => item.product.stock === 0) ? (
                        'Remove Out of Stock Items'
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </Button>

                    <p className='text-xs text-secondary-text text-center'>
                      By proceeding to checkout, you agree to our Terms of
                      Service and Privacy Policy
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </>
          ) : (
            <div className='lg:col-span-3 flex justify-center'>
              <motion.div
                className='flex flex-col items-center justify-center h-[50vh] text-secondary-text max-w-md w-full'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}>
                <ShoppingCart className='h-16 w-16 mb-6 text-accent-blue opacity-80' />
                <p className='text-xl mb-6 font-medium'>Your cart is empty</p>
                <Button
                  variant='outline'
                  onClick={() => navigate('/')}
                  className='text-white border-none bg-accent-blue hover:bg-hover-blue hover:scale-105 hover:text-white px-6 py-5 font-medium transition-all duration-300'>
                  Start Shopping
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className='flex flex-col items-center justify-center h-[calc(100vh-300px)] text-primary-text rounded-xl shadow-sm p-8'
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
              className='absolute inset-0 bg-accent-blue rounded-full opacity-20'
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
            <Lock className='w-full h-full text-accent-blue' />
          </motion.div>
          <motion.h2
            className='text-2xl md:text-3xl font-bold mb-4 text-center'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            Your Cart is Locked
          </motion.h2>
          <motion.p
            className='text-secondary-text mb-8 text-center text-base md:text-lg max-w-md'
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}>
            Log in to view your cart and start shopping
          </motion.p>
          <motion.button
            className='px-4 py-2 bg-accent-blue text-white rounded-lg font-medium text-lg hover:bg-hover-blue transition duration-300 shadow-sm hover:shadow-md'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/auth/login')}>
            Log In
          </motion.button>
        </motion.div>
      )}

      {/* Remove Item Confirmation Dialog */}
      {/* <Dialog
        open={showRemoveDialog}
        onOpenChange={setShowRemoveDialog}>
        <DialogContent className='bg-secondary-bg text-primary-text border-primary-bg/20'>
          <DialogHeader>
            <DialogTitle>Remove Item</DialogTitle>
            <DialogDescription className='text-secondary-text'>
              Are you sure you want to remove this item from your cart?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex gap-2 sm:justify-end'>
            <Button
              variant='outline'
              onClick={() => setShowRemoveDialog(false)}
              className='border-primary-bg/20 hover:bg-primary-bg/10'>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={handleRemoveItem}
              className='bg-accent-red hover:bg-accent-red/90'>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <ConfirmationModal
        description='Are you sure you want to remove this item from your cart?'
        isOpen={showRemoveDialog}
        onClose={() => setShowRemoveDialog(false)}
        onConfirm={handleRemoveItem}
        title='Remove Item'
      />
    </div>
  );
}
