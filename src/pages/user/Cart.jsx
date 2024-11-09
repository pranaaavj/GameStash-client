/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveItemFromCartMutation,
} from '@/redux/api/user/userApi';
import { ScrollArea } from '@/shadcn/components/ui/scroll-area';
import { Separator } from '@/shadcn/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/shadcn/components/ui/sheet';
import { Button } from '@/shadcn/components/ui/button';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useUsers } from '@/hooks';

export default function Cart({ isOpen, onClose }) {
  const user = useUsers();
  const {
    data: cartData,
    isLoading,
    isError,
  } = useGetCartQuery(user?.userInfo?.id, { skip: !user?.userInfo?.id });
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeItemFromCart] = useRemoveItemFromCartMutation();

  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (cartData) {
      setCartItems(cartData.data.items);
      setTotal(cartData.data.total);
    }
  }, [cartData]);

  console.log(cartData);

  const handleUpdateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      const updatedCart = await updateCartItem({
        productId,
        quantity,
      }).unwrap();
      setCartItems(updatedCart.data.items);
      setTotal(updatedCart.data.total);
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const updatedCart = await removeItemFromCart(productId).unwrap();
      setCartItems(updatedCart.data.items);
      setTotal(updatedCart.data.total);
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
    }
  };

  if (isLoading) {
    console.log('loading.. cart..');
  }

  if (isError) {
    console.log();
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={onClose}
      aria-describedby={'Cart'}
      className='text-primary-text'>
      <SheetContent className='w-full sm:max-w-lg bg-secondary-bg border-l border-none'>
        <SheetHeader className='space-y-2.5 pb-6 border-none  '>
          <div className='flex items-center justify-between'>
            <SheetTitle className='text-2xl font-bold text-primary-text'>
              My Cart
            </SheetTitle>
          </div>
        </SheetHeader>

        <ScrollArea className='flex-1 -mx-6 px-6'>
          {cartItems.length > 0 ? (
            <div className='space-y-6'>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className='flex gap-4'>
                  <div className='h-24 w-24 rounded-lg bg-primary-bg/50 p-2'>
                    <img
                      src={item.product.images[0] || '/placeholder.svg'}
                      alt={item.product.name}
                      className='h-full w-full object-cover rounded-md'
                    />
                  </div>
                  <div className='flex flex-1 flex-col justify-between'>
                    <div>
                      <h3 className='font-medium text-primary-text'>
                        {item.product.name}
                      </h3>
                      <p className='text-sm text-secondary-text'>
                        {item.product.platform}
                      </p>
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-8 w-8 rounded-lg bg-primary-bg/50 border-none'
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product._id,
                              item.quantity - 1
                            )
                          }>
                          <Minus className='h-4 w-4' />
                        </Button>
                        <span className='w-8 text-center'>{item.quantity}</span>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-8 w-8 rounded-lg bg-primary-bg/50 border-none'
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product._id,
                              item.quantity + 1
                            )
                          }>
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                      <p className='font-medium text-primary-text'>
                        ${(item.product.price * item.quantity).toFixed(2)} USD
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-red-500 hover:bg-red-500/20'
                    onClick={() => handleRemoveItem(item.product._id)}>
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-[50vh] text-secondary-text'>
              <ShoppingCart className='h-12 w-12 mb-4' />
              <p>Your cart is empty</p>
            </div>
          )}
        </ScrollArea>

        {cartItems.length > 0 && (
          <div className='space-y-4 pt-6'>
            <Separator className='bg-primary-bg/20' />
            <div className='space-y-1.5'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-secondary-text'>Taxes</span>
                <span className='text-primary-text'>$0.00 USD</span>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-secondary-text'>Shipping</span>
                <span className='text-secondary-text'>
                  Calculated at checkout
                </span>
              </div>
              <div className='flex items-center justify-between pt-2'>
                <span className='text-base font-medium text-primary-text'>
                  Total
                </span>
                <span className='text-lg font-bold text-primary-text'>
                  ${total.toFixed(2)} USD
                </span>
              </div>
            </div>
            <Button
              className='w-full bg-accent-blue hover:bg-hover-blue text-white py-6 rounded-lg text-lg font-medium'
              onClick={() => console.log('Proceeding to checkout')}>
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
