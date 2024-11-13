/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shadcn/components/ui/radio-group';
import { Alert, AlertDescription } from '@/shadcn/components/ui/alert';
import { Gift, Tag, Percent, AlertCircle, Check } from 'lucide-react';

export default function OffersSection({ onOfferSelect }) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'game10') {
      setAppliedPromo({ code: 'GAME10', discount: '10%' });
      onOfferSelect('GAME10'); // Notify the parent component
    } else {
      setAppliedPromo(null);
    }
  };

  const handleOfferSelection = (offer) => {
    setSelectedOffer(offer);
    setAppliedPromo(null); // Clear promo code when an offer is selected
    onOfferSelect(offer.title); // Notify the parent component
  };

  const offers = [
    {
      id: 1,
      title: '15% off on your first purchase',
      description: 'New customers get 15% off their first order',
      discount: '15%',
    },
    {
      id: 2,
      title: 'Free shipping on orders over $50',
      description: 'Get free standard shipping on all orders over $50',
      discount: 'Free Shipping',
    },
    {
      id: 3,
      title: 'Buy 2 Get 1 Free on all accessories',
      description:
        'Add 3 accessories to your cart and get the cheapest one free',
      discount: 'Buy 2 Get 1 Free',
    },
  ];

  return (
    <div className='space-y-6'>
      {/* Promo Code Section */}
      <div className='bg-secondary-bg/50 p-4 rounded-lg space-y-4'>
        <div className='flex items-center space-x-2'>
          <Tag className='w-5 h-5 text-accent-red' />
          <h3 className='font-medium'>Promo Code</h3>
        </div>
        <div className='flex space-x-2'>
          <Input
            placeholder='Enter promo code'
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className='bg-primary-bg/50 border-none'
          />
          <Button
            onClick={handleApplyPromo}
            className='bg-accent-red hover:bg-accent-red/90 text-white'>
            Apply
          </Button>
        </div>
        {appliedPromo && (
          <Alert className='bg-accent-red/10 border-accent-red/20'>
            <Check className='h-4 w-4 text-accent-red' />
            <AlertDescription className='text-sm text-accent-red'>
              Promo code {appliedPromo.code} applied! You get{' '}
              {appliedPromo.discount} off.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Available Offers Section */}
      <div className='space-y-4'>
        <div className='flex items-center space-x-2'>
          <Percent className='w-5 h-5 text-accent-red' />
          <h3 className='font-medium'>Available Offers</h3>
        </div>
        <RadioGroup
          value={selectedOffer?.id}
          onValueChange={(id) => {
            const offer = offers.find((o) => o.id === parseInt(id, 10));
            handleOfferSelection(offer);
          }}>
          {offers.map((offer) => (
            <div
              key={offer.id}
              className='relative'>
              <RadioGroupItem
                value={offer.id.toString()}
                id={`offer-${offer.id}`}
                className='peer sr-only'
              />
              <Label
                htmlFor={`offer-${offer.id}`}
                className='flex items-center justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border border-transparent peer-data-[state=checked]:border-accent-red'>
                <div className='flex-1'>
                  <p className='font-medium'>{offer.title}</p>
                  <p className='text-sm text-secondary-text'>
                    {offer.description}
                  </p>
                </div>
                <span className='text-accent-red font-semibold ml-4'>
                  {offer.discount}
                </span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Offer Terms */}
      <Alert className='bg-secondary-bg/50 border-accent-red/20'>
        <AlertCircle className='h-4 w-4 text-accent-red' />
        <AlertDescription className='text-sm text-secondary-text'>
          Offers cannot be combined. The best available offer will be applied at
          checkout.
        </AlertDescription>
      </Alert>

      {/* Gift Card Section */}
      <div className='bg-secondary-bg/50 p-4 rounded-lg space-y-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Gift className='w-5 h-5 text-accent-red' />
            <h3 className='font-medium'>Gift Card</h3>
          </div>
          <Button
            variant='link'
            className='text-accent-red p-0'>
            Redeem a Gift Card
          </Button>
        </div>
        <p className='text-sm text-secondary-text'>
          Have a gift card? You can redeem it at the payment step.
        </p>
      </div>
    </div>
  );
}
