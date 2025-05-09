import {
  usePlaceOrderMutation,
  useVerifyRazorpayMutation,
  useMarkPaymentAsFailedMutation,
} from '@/redux/api/user/ordersApi';
import { useGetCartQuery } from '@/redux/api/user/cartApi';

import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Gift, Package, ChevronDown } from 'lucide-react';

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/shadcn/components/ui/tooltip';
import { Button } from '@/shadcn/components/ui/button';
import { Loading } from '@/components/error';
import { useUsers } from '@/hooks';
import { PageTransition } from '@/components/common';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ReviewOrder } from './ReviewOrder';
import { motion, AnimatePresence } from 'framer-motion';
import { handleApiError, showToast } from '@/utils';
import { Coupons } from './Coupons';
import { Payment } from './Payment';
import { Address } from '@/components/user/Address';

export const CheckoutPage = () => {
  const user = useUsers();
  const navigate = useNavigate();

  const { data: responseCart } = useGetCartQuery(user?.userInfo?.id, {
    skip: !user?.userInfo?.id,
  });
  const [placeOrder, placeOrderMeta] = usePlaceOrderMutation();
  const [verifyRazorpay, verifyRazorpayMeta] = useVerifyRazorpayMutation();
  const [markPaymentAsFailed, markPaymentAsFailedMeta] =
    useMarkPaymentAsFailedMutation();

  const [discount, setDiscount] = useState(0);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (responseCart) {
      setCartItems(responseCart.data.items);
      if (responseCart?.data?.items?.length === 0) {
        navigate('/games');
        showToast.error(
          `Your cart is empty, Please add something and proceed to checkout.`
        );
      }
      setDiscount(responseCart?.data?.discount);
    }
  }, [responseCart, navigate]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const isProcessing =
    placeOrderMeta.isLoading ||
    verifyRazorpayMeta.isLoading ||
    markPaymentAsFailedMeta.isLoading;

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  const [activeSection, setActiveSection] = useState('address');
  const [completedSections, setCompletedSections] = useState({
    address: false,
    payment: false,
    coupons: false,
    review: false,
  });

  const [showTooltip, setShowTooltip] = useState({
    address: false,
    payment: false,
    coupons: false,
    review: false,
  });

  const handleAddressSelect = useCallback((address) => {
    setSelectedAddress(address);
    setCompletedSections((prev) => ({ ...prev, address: true }));
    setActiveSection('payment');
  }, []);

  const handlePaymentSelect = useCallback((payment) => {
    setSelectedPayment(payment);
    setCompletedSections((prev) => ({ ...prev, payment: true }));
    setActiveSection('coupons');
  }, []);

  const handleCouponSelect = useCallback(
    (coupon) => {
      let discountAmount = 0;
      if (coupon) {
        if (coupon.discountType === 'percentage') {
          discountAmount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscountAmount) {
            discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
          }
        } else {
          discountAmount = coupon.discountValue;
        }
      }

      setSelectedCoupon(coupon);
      setDiscount((prev) => prev + discountAmount);
      setCompletedSections((prev) => ({ ...prev, coupons: true }));
      setActiveSection('review');
    },
    [subtotal]
  );

  const handleDeliverySelect = useCallback((delivery) => {
    setSelectedDelivery(delivery);
    setCompletedSections((prev) => ({ ...prev, review: true }));
  }, []);

  const handlePlaceOrder = async () => {
    const incompleteSections = Object.keys(completedSections).filter(
      (key) => !completedSections[key]
    );

    if (incompleteSections.length > 0) {
      setShowTooltip((prev) =>
        incompleteSections.reduce(
          (acc, section) => ({ ...acc, [section]: true }),
          { ...prev }
        )
      );

      setTimeout(
        () =>
          setShowTooltip({
            address: false,
            payment: false,
            coupons: false,
            review: false,
          }),
        3000
      );

      return;
    }

    const orderItems = cartItems.map((item) => {
      return {
        product: item?.product._id,
        quantity: item?.quantity,
        price: item?.product?.price,
        totalPrice: item?.product?.price * item?.quantity,
      };
    });

    const orderData = {
      orderItems,
      shippingAddress: selectedAddress.id,
      paymentMethod: selectedPayment,
      couponCode: selectedCoupon?.code || null,
      // deliveryMethod: selectedDelivery,
    };

    try {
      const response = await placeOrder(orderData).unwrap();

      console.log(response);

      if (selectedPayment === 'Razorpay') {
        const options = {
          key: import.meta.env.VITE_RZP_KEY_ID,
          amount: response.data.amount,
          currency: response.data.currency,
          name: 'GameStash',
          description: 'GameStash Payment',
          order_id: response?.data?.razorpayOrderId,
          handler: async function (razorpayResponse) {
            const paymentData = {
              orderId: response?.data?.orderId,
              razorpayOrderId: razorpayResponse?.razorpay_order_id,
              paymentId: razorpayResponse?.razorpay_payment_id,
              signature: razorpayResponse?.razorpay_signature,
              ...orderData,
            };

            try {
              const paymentResponse = await verifyRazorpay(
                paymentData
              ).unwrap();

              if (paymentResponse?.success) {
                navigate('/order-confirmation', {
                  state: {
                    orderId: response.data.orderId,
                    paymentStatus: 'success',
                  },
                });
              }
            } catch (error) {
              handleApiError(error);
            }
          },
          theme: { color: '#3399cc' },
          prefill: {
            name: user?.userInfo?.name,
            email: user?.userInfo?.email,
            contact: user?.userInfo?.phoneNumber || '+919876543210',
          },
          retry: {
            enabled: false,
          },
          modal: {
            ondismiss: async function () {
              try {
                await markPaymentAsFailed(response?.data?.orderId).unwrap();
                navigate('/order-confirmation', {
                  state: {
                    orderId: response.data.orderId,
                    paymentStatus: 'failed',
                  },
                });
              } catch (error) {
                handleApiError(error);
              }
            },
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on('payment.failed', async function () {
          try {
            await markPaymentAsFailed(response?.data?.orderId);

            navigate('/order-confirmation', {
              state: {
                orderId: response?.data?.orderId,
                paymentStatus: 'failed',
              },
            });
          } catch (error) {
            handleApiError(error);
          }
        });
      } else if (response?.success) {
        navigate('/order-confirmation', {
          state: { orderId: response.data._id, paymentStatus: 'success' },
        });
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const isSectionDisabled = (sectionId) => {
    switch (sectionId) {
      case 'payment':
        return !completedSections.address;
      case 'coupons':
        return !completedSections.payment;
      case 'review':
        return !completedSections.coupons;
      default:
        return false;
    }
  };

  const renderSectionTitle = (section) => {
    let selectedValue;
    switch (section.id) {
      case 'address':
        selectedValue = selectedAddress
          ? `${selectedAddress?.addressName} `
          : '';
        break;
      case 'payment':
        selectedValue = selectedPayment ? `${selectedPayment} ` : '';
        break;
      case 'coupons':
        selectedValue = selectedCoupon ? `${selectedCoupon.code} ` : '';
        break;
      case 'review':
        selectedValue = selectedDelivery ? `${selectedDelivery.label} ` : '';
        break;
      default:
        selectedValue = '';
    }
    return (
      <>
        {section.title}
        {selectedValue && (
          <span className='ml-2 text-sm text-secondary-text'>
            {selectedValue}
            <span
              className='ml-2 text-accent-red text-sm'
              onClick={() => setActiveSection(section.id)}>
              Change
            </span>
          </span>
        )}
      </>
    );
  };

  const sections = [
    { id: 'address', title: 'Delivery Address', icon: MapPin },
    { id: 'payment', title: 'Payment Method', icon: CreditCard },
    { id: 'coupons', title: 'Coupons', icon: Gift },
    { id: 'review', title: 'Review & Delivery', icon: Package },
  ];

  const shipping = 0.0;

  if (isProcessing) {
    return <Loading />;
  }

  return (
    <PageTransition>
      <TooltipProvider>
        <div className='min-h-screen bg-primary-bg text-primary-text p-4 md:p-6'>
          <div className='max-w-7xl mx-auto'>
            <h1 className='text-3xl font-bold mb-8'>Checkout</h1>

            <div className='grid lg:grid-cols-[1fr,400px] gap-6'>
              <div className='space-y-4'>
                {sections.map((section, index) => (
                  <div
                    key={section.id}
                    className='bg-secondary-bg rounded-lg overflow-hidden'>
                    <Tooltip open={showTooltip[section.id]}>
                      <TooltipTrigger>
                        <span
                          onClick={() => {
                            if (!isSectionDisabled(section.id))
                              setActiveSection(section.id);
                          }}
                          // type='button'
                          className={`w-full p-4 flex items-center justify-between transition-colors ${
                            isSectionDisabled(section.id)
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:bg-primary-bg/50'
                          }`}>
                          <div className='flex items-center space-x-4'>
                            <div className='w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center'>
                              <span className='text-accent-red font-bold'>
                                {index + 1}
                              </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <section.icon className='w-5 h-5' />
                              <span className='font-semibold'>
                                {renderSectionTitle(section)}
                              </span>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <TooltipContent
                                side='right'
                                className='text-xs bg-accent-red text-white p-2 z-20 rounded-md shadow-lg'>
                                <span className='font-semibold'>Required</span>
                              </TooltipContent>
                              <ChevronDown
                                className={`w-5 h-5 transition-transform ${
                                  activeSection === section.id
                                    ? 'rotate-180'
                                    : ''
                                }`}
                              />
                            </div>
                          </div>
                        </span>
                      </TooltipTrigger>
                    </Tooltip>

                    <AnimatePresence>
                      {activeSection === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}>
                          <div className='p-4 border-t border-primary-bg/20'>
                            {section.id === 'address' && (
                              <Address onAddressSelect={handleAddressSelect} />
                            )}
                            {section.id === 'payment' && (
                              <Payment onPaymentSelect={handlePaymentSelect} />
                            )}
                            {section.id === 'coupons' && (
                              <Coupons onCouponSelect={handleCouponSelect} />
                            )}
                            {section.id === 'review' && (
                              <ReviewOrder
                                onDeliverySelect={handleDeliverySelect}
                                cartItems={cartItems || []}
                              />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              <div className='lg:sticky lg:top-20 h-fit text-primary-text'>
                <Card className='bg-secondary-bg border-none text-primary-text'>
                  <CardContent className='p-6 space-y-6'>
                    <div className='flex items-center justify-between'>
                      <h2 className='text-xl font-bold'>Order Summary</h2>
                      <span className='text-sm text-secondary-text'>
                        {cartItems.length} items
                      </span>
                    </div>

                    <div className='space-y-4'>
                      {cartItems.map((item) => (
                        <div
                          key={item.product?._id}
                          className='flex space-x-4'>
                          <div className='w-20 h-20 rounded-lg bg-primary-bg/50 p-2'>
                            <img
                              src={item.product?.images?.[0]}
                              alt={item.product?.name}
                              className='w-full h-full object-cover rounded-md'
                            />
                          </div>
                          <div className='flex-1'>
                            <h3 className='font-medium'>
                              {item.product?.name}
                            </h3>
                            <p className='text-sm text-secondary-text'>
                              Quantity: {item.quantity}
                            </p>
                            <p className='font-medium mt-1'>
                              ₹{item.product?.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className='space-y-3 pt-4 border-t border-primary-bg/20'>
                      <div className='flex justify-between text-sm'>
                        <span className='text-secondary-text'>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>

                      <div className='flex justify-between text-sm'>
                        <span className='text-secondary-text'>Shipping</span>
                        <span>₹{shipping}</span>
                      </div>

                      {discount > 0 && (
                        <div className='flex justify-between text-sm text-accent-red'>
                          <span>
                            Discount
                            {selectedCoupon?.code &&
                              ` (${selectedCoupon.code})`}
                          </span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}

                      <div className='flex justify-between items-center pt-3 border-t border-primary-bg/20'>
                        <span className='text-lg font-bold'>Total</span>
                        <span className='text-xl font-bold'>
                          ₹{(subtotal + shipping - discount).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <Button
                      className='w-full bg-accent-red hover:bg-accent-red/90 text-white py-6'
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}>
                      {isProcessing ? 'Placing Order...' : 'Place Order'}
                    </Button>

                    <p className='text-xs text-secondary-text text-center'>
                      By placing your order, you agree to our Terms of Service
                      and Privacy Policy
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </PageTransition>
  );
};
