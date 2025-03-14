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
} from 'lucide-react';
import { useUsers } from '@/hooks';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebounceCallback';
import { Badge } from '@/shadcn/components/ui/badge';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Alert, AlertDescription } from '@/shadcn/components/ui/alert';
import { ConfirmationModal } from '@/components/common';

export default function Cart() {
  const user = useUsers();
  const navigate = useNavigate();

  const {
    data: responseCart,
    isError: isCartError,
    refetch,
  } = useGetCartQuery(user?.userInfo?.id, {
    skip: !user?.userInfo?.id,
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
  });

  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeItemFromCart] = useRemoveItemFromCartMutation();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (responseCart) {
      setCartItems(responseCart.data.items);
      setSubtotal(responseCart.data.total);

      let subtotalAmount = 0;
      let discountAmount = 0;

      responseCart.data.items.forEach((item) => {
        const originalPrice = item.product.price * item.quantity;
        subtotalAmount += originalPrice;

        if (item.product.discountedPrice > 0) {
          const itemDiscount =
            originalPrice - item.product.discountedPrice * item.quantity;
          discountAmount += itemDiscount;
        }
      });

      setSubtotal(subtotalAmount);
      setDiscount(discountAmount);
      setTotal(subtotalAmount - discountAmount);
    }
  }, [responseCart]);

  const refetchCart = async () => {
    try {
      const { data: newCart } = await refetch();

      if (newCart?.data?.items) {
        setCartItems([...newCart.data.items]);
        setTotal(newCart.data.total);
      }
    } catch (error) {
      console.error('Failed to refetch cart:', error);
    }
  };

  const debouncedUpdateQuantity = useDebouncedCallback(
    async (productId, quantity) => {
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        const response = await updateCartItem(
          { productId, quantity },
          { signal: abortControllerRef.current.signal }
        ).unwrap();

        if (response?.success) {
          toast.success(response?.message, { duration: 1500 });
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Failed to update cart item:', error);
        }
        toast.error('Something went wrong, please try again later.');
        await refetchCart();
      }
    },
    900
  );

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity > 5) {
      toast.error('Maximum quantity reached.');
      return;
    }
    if (quantity < 1) return;

    const item = cartItems.find((item) => item.product._id === productId);
    if (item && item.product.stock < quantity) {
      toast.error('Insufficient stock.');
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
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

    setCartItems((prevItems) =>
      prevItems.filter((item) => item.product._id !== itemToRemove)
    );

    try {
      const response = await removeItemFromCart(itemToRemove).unwrap();

      if (response.success) {
        toast.success(response.message, {
          duration: 1500,
        });
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }

    setShowRemoveDialog(false);
    setItemToRemove(null);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    // const outOfStockItems = cartItems.filter(
    //   (item) => item.product.stock < item.quantity
    // );

    const { data: updatedCart } = await refetch();
    const updatedCartItems = updatedCart?.data?.items || [];

    const outOfStockItems = updatedCartItems.filter(
      (item) => item.product.stock < item.quantity
    );
    if (outOfStockItems.length > 0) {
      toast.error(
        'Some items in your cart are out of stock. Please remove them before proceeding.'
      );
      return;
    }

    navigate('/checkout', { state: { isCheckoutAllowed: true } });
  };

  const calculateDiscount = (product) => {
    if (
      !product.bestOffer ||
      !product.discountedPrice ||
      product.discountedPrice >= product.price
    ) {
      return null;
    }

    const difference = product.price - product.discountedPrice;
    const percentOff = Math.round((difference / product.price) * 100);

    if (product.bestOffer.discountType === 'percentage') {
      return `-${percentOff}% OFF`;
    } else {
      return `-₹${difference.toFixed(0)} OFF`;
    }
  };

  const hasOutOfStockItems = cartItems.some((item) => item.product.stock === 0);
  const hasLowStockItems = cartItems.some(
    (item) => item.product.stock < item.quantity
  );

  if (isCartError) {
    console.log('Cart error occurred');
  }

  return (
    <div className='container mx-auto px-4 py-4 max-w-6xl no-scrollbar'>
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
                <ScrollArea className='h-[calc(100vh-250px)] pr-4 no-scrollbar'>
                  <AnimatePresence initial={false}>
                    <motion.div className='space-y-6 no-scrollbar'>
                      {cartItems.map((item) => (
                        <motion.div
                          key={item._id}
                          className='flex gap-6 bg-secondary-bg p-5 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:bg-secondary-bg/80'
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}>
                          <div className='h-28 w-28 md:h-32 md:w-32 rounded-lg bg-primary-bg/50 p-2 flex-shrink-0 overflow-hidden'>
                            <img
                              src={
                                item.product?.images?.[0] || '/placeholder.svg'
                              }
                              alt={item.product?.name}
                              className='h-full w-full object-cover rounded-md transition-transform duration-300 hover:scale-105'
                            />
                          </div>
                          <div className='flex flex-1 flex-col justify-between'>
                            <div>
                              <div className='flex items-start justify-between'>
                                <h3 className='text-lg md:text-xl font-semibold text-primary-text mb-1'>
                                  {item.product?.name}
                                </h3>
                              </div>

                              <p className='text-sm text-secondary-text mb-2'>
                                {item.product?.platform}
                              </p>

                              {item.product.stock === 0 && (
                                <div className='text-accent-red bg-hover-red/10 p-2 rounded-md mb-2 flex items-center'>
                                  <AlertCircle className='w-4 h-4 mr-2' />
                                  <p className='font-medium text-sm'>
                                    Out of Stock
                                  </p>
                                </div>
                              )}

                              {item.product.bestOffer &&
                                item.product.discountedPrice > 0 && (
                                  <div className='flex items-center gap-2 mb-2'>
                                    {/* <Tag className='h-3.5 w-3.5 text-accent-green' /> */}
                                    {/* <span className='text-sm text-accent-green font-medium'>
                                      {item.product.bestOffer.name}
                                    </span> */}
                                  </div>
                                )}

                              {item.product.stock > 0 &&
                                item.product.stock < 10 && (
                                  <span className='text-xs px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded-full'>
                                    Only {item.product.stock} left in stock
                                  </span>
                                )}
                            </div>

                            <div className='flex items-center justify-between mt-2'>
                              <div className='flex items-center gap-2 md:gap-3'>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-8 w-8 rounded-full border hover:bg-accent-blue/10 hover:border-accent-blue transition-colors'
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
                                  <Minus className='h-3 w-3 md:h-4 md:w-4' />
                                </Button>
                                <span className='w-8 text-center text-primary-text text-lg font-medium'>
                                  {item.quantity}
                                </span>
                                <Button
                                  variant='outline'
                                  size='icon'
                                  className='h-8 w-8 rounded-full border hover:bg-accent-blue/10 hover:border-accent-blue transition-colors'
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
                                  <Plus className='h-3 w-3 md:h-4 md:w-4' />
                                </Button>
                              </div>

                              <div className='text-right'>
                                {item.product.discountedPrice > 0 ? (
                                  <div className='flex flex-col items-end'>
                                    <div className='py-2'>
                                      {calculateDiscount(item.product) && (
                                        <Badge className='bg-accent-red text-white cursor-default hover:bg-hover-red'>
                                          {calculateDiscount(item.product)}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                      <span className='text-sm text-secondary-text line-through'>
                                        ₹
                                        {(
                                          item.product.price * item.quantity
                                        ).toFixed(2)}
                                      </span>
                                      <span className='text-xl font-bold text-accent-green'>
                                        ₹
                                        {(
                                          item.product.discountedPrice *
                                          item.quantity
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <p className='text-xl font-bold text-primary-text'>
                                    ₹
                                    {(
                                      item.product.price * item.quantity
                                    ).toFixed(2)}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-secondary-text hover:text-accent-red hover:bg-accent-red/10 self-start transition-colors'
                            onClick={() => confirmRemoveItem(item.product._id)}>
                            <Trash2 className='h-5 w-5' />
                          </Button>
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
                  <CardContent className='p-6 space-y-6'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-xl font-bold'>Order Summary</h2>
                      <span className='text-sm text-secondary-text'>
                        {cartItems.length} items
                      </span>
                    </div>

                    <div className='space-y-3 pt-4 border-t border-primary-bg/20'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-secondary-text'>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>

                      {discount > 0 && (
                        <div className='flex justify-between text-sm text-accent-red'>
                          <span>Discount</span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className='flex justify-between text-sm'>
                        <span className='text-secondary-text'>Shipping</span>
                        <span>Calculated at checkout</span>
                      </div>

                      <div className='flex justify-between items-center pt-3 border-t border-primary-bg/20'>
                        <span className='text-lg font-bold'>Total</span>
                        <span className='text-xl font-bold'>
                          ₹{total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className='w-full bg-accent-blue hover:bg-hover-blue text-white py-6'
                      onClick={handleCheckout}
                      disabled={
                        cartItems.length === 0 ||
                        cartItems.some((item) => item.product.stock === 0) ||
                        cartItems.some(
                          (item) => item.product.stock < item.quantity
                        )
                      }>
                      {cartItems.some((item) => item.product.stock === 0)
                        ? 'Remove Out of Stock Items'
                        : 'Proceed to Checkout'}
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
                  className='text-accent-blue border-accent-blue hover:bg-accent-blue hover:text-white px-6 py-5 font-medium transition-all duration-300'>
                  Start Shopping
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div
          className='flex flex-col items-center justify-center h-[calc(100vh-200px)] text-primary-text rounded-xl shadow-sm p-8 bg-secondary-bg/50'
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
            className='px-8 py-4 bg-accent-blue text-white rounded-lg font-medium text-lg hover:bg-hover-blue transition duration-300 shadow-sm hover:shadow-md'
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}>
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
