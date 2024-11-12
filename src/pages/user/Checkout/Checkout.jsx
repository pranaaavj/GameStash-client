'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/shadcn/components/ui/button';
import { Card, CardContent } from '@/shadcn/components/ui/card';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shadcn/components/ui/radio-group';
import {
  MapPin,
  CreditCard,
  Gift,
  Package,
  ChevronDown,
  Clock,
} from 'lucide-react';

// Assuming AddressManagement is your existing component
import { Address } from '../Profile/Address';

export function CheckoutPage() {
  const [activeSection, setActiveSection] = useState('address');
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [promoCode, setPromoCode] = useState('');
  const [selectedDelivery, setSelectedDelivery] = useState('standard');

  const cartItems = [
    {
      id: 1,
      name: 'Gaming Headset Pro',
      price: 129.99,
      image: '/placeholder.svg',
      quantity: 1,
    },
  ];

  const deliveryOptions = [
    { id: 'express', label: 'Express Delivery', price: 9.99, date: 'Tomorrow' },
    {
      id: 'standard',
      label: 'Standard Delivery',
      price: 4.99,
      date: 'In 3-5 days',
    },
    { id: 'free', label: 'Free Delivery', price: 0, date: 'In 5-7 days' },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping =
    deliveryOptions.find((opt) => opt.id === selectedDelivery)?.price || 0;
  const discount = 15.0;
  const total = subtotal + shipping - discount;

  const sections = [
    { id: 'address', title: 'Delivery Address', icon: MapPin },
    { id: 'payment', title: 'Payment Method', icon: CreditCard },
    { id: 'offers', title: 'Offers & Promotions', icon: Gift },
    { id: 'review', title: 'Review & Delivery', icon: Package },
  ];

  return (
    <div className='min-h-screen bg-primary-bg text-primary-text p-4 md:p-6'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-3xl font-bold mb-8'>Checkout</h1>

        <div className='grid lg:grid-cols-[1fr,400px] gap-6'>
          {/* Left Column - Checkout Sections */}
          <div className='space-y-4'>
            {sections.map((section, index) => (
              <div
                key={section.id}
                className='bg-secondary-bg rounded-lg overflow-hidden'>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className='w-full p-4 flex items-center justify-between hover:bg-primary-bg/50 transition-colors'>
                  <div className='flex items-center space-x-4'>
                    <div className='w-8 h-8 rounded-full bg-primary-bg flex items-center justify-center'>
                      <span className='text-accent-red font-bold'>
                        {index + 1}
                      </span>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <section.icon className='w-5 h-5' />
                      <span className='font-semibold'>{section.title}</span>
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      activeSection === section.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {activeSection === section.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}>
                      <div className='p-4 border-t border-primary-bg/20'>
                        {section.id === 'address' && <Address />}

                        {section.id === 'payment' && (
                          <div className='space-y-4'>
                            <RadioGroup
                              value={selectedPayment}
                              onValueChange={setSelectedPayment}>
                              <div className='flex items-center space-x-2 p-3 rounded-lg bg-primary-bg/50'>
                                <RadioGroupItem
                                  value='cod'
                                  id='cod'
                                />
                                <Label htmlFor='cod'>
                                  Cash/Card on Delivery
                                </Label>
                              </div>
                              <div className='flex items-center space-x-2 p-3 rounded-lg bg-primary-bg/50'>
                                <RadioGroupItem
                                  value='card'
                                  id='card'
                                />
                                <Label htmlFor='card'>Credit/Debit Card</Label>
                              </div>
                              <div className='flex items-center space-x-2 p-3 rounded-lg bg-primary-bg/50'>
                                <RadioGroupItem
                                  value='upi'
                                  id='upi'
                                />
                                <Label htmlFor='upi'>UPI Payment</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        )}

                        {section.id === 'offers' && (
                          <div className='space-y-4'>
                            <div className='flex space-x-2'>
                              <Input
                                placeholder='Enter promo code'
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                className='bg-primary-bg/50 border-none'
                              />
                              <Button variant='outline'>Apply</Button>
                            </div>
                            <div className='p-3 rounded-lg bg-accent-red/10 text-accent-red flex items-center space-x-2'>
                              <Gift className='w-5 h-5' />
                              <span>15% off on your first order!</span>
                            </div>
                          </div>
                        )}

                        {section.id === 'review' && (
                          <div className='space-y-4'>
                            <RadioGroup
                              value={selectedDelivery}
                              onValueChange={setSelectedDelivery}>
                              {deliveryOptions.map((option) => (
                                <div
                                  key={option.id}
                                  className='flex items-center space-x-2 p-3 rounded-lg bg-primary-bg/50'>
                                  <RadioGroupItem
                                    value={option.id}
                                    id={option.id}
                                  />
                                  <Label
                                    htmlFor={option.id}
                                    className='flex-1'>
                                    <div className='flex items-center justify-between'>
                                      <div>
                                        <div className='font-medium'>
                                          {option.label}
                                        </div>
                                        <div className='text-sm text-secondary-text flex items-center'>
                                          <Clock className='w-4 h-4 mr-1' />
                                          {option.date}
                                        </div>
                                      </div>
                                      <div className='font-medium'>
                                        {option.price === 0
                                          ? 'FREE'
                                          : `$${option.price.toFixed(2)}`}
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Column - Order Summary */}
          <div className='lg:sticky lg:top-6 h-fit'>
            <Card className='bg-secondary-bg border-none'>
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
                      key={item.id}
                      className='flex space-x-4'>
                      <div className='w-20 h-20 rounded-lg bg-primary-bg/50 p-2'>
                        <img
                          src={item.image}
                          alt={item.name}
                          className='w-full h-full object-cover rounded-md'
                        />
                      </div>
                      <div className='flex-1'>
                        <h3 className='font-medium'>{item.name}</h3>
                        <p className='text-sm text-secondary-text'>
                          Quantity: {item.quantity}
                        </p>
                        <p className='font-medium mt-1'>
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className='space-y-3 pt-4 border-t border-primary-bg/20'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-secondary-text'>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-secondary-text'>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm text-accent-red'>
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between items-center pt-3 border-t border-primary-bg/20'>
                    <span className='text-lg font-bold'>Total</span>
                    <span className='text-xl font-bold'>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  className='w-full bg-accent-red hover:bg-accent-red/90 text-white py-6'
                  onClick={() => console.log('Place order')}>
                  Place Order
                </Button>

                <p className='text-xs text-secondary-text text-center'>
                  By placing your order, you agree to our Terms of Service and
                  Privacy Policy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
