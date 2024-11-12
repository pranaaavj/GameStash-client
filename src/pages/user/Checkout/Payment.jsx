/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  AlertCircle,
  Plus,
} from 'lucide-react';

export default function PaymentSection({ onComplete }) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [savedCards, setSavedCards] = useState([
    { id: 1, last4: '4242', type: 'visa', name: 'John Doe', isDefault: true },
    {
      id: 2,
      last4: '5555',
      type: 'mastercard',
      name: 'John Doe',
      isDefault: false,
    },
  ]);
  console.log(setSavedCards);
  const [showNewCard, setShowNewCard] = useState(false);
  const [newCardDetails, setNewCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
    saveCard: true,
  });

  const handlePaymentSelection = (value) => {
    setSelectedMethod(value);
    // Only mark as complete if a valid payment method is selected
    if (value && (value === 'cod' || value.startsWith('saved_'))) {
      onComplete(true);
    }
  };

  const handleNewCardSubmit = (e) => {
    e.preventDefault();
    // Add validation and card processing logic here
    console.log('New card details:', newCardDetails);
    setShowNewCard(false);
    onComplete(true);
  };

  const banks = [
    { id: 'hdfc', name: 'HDFC Bank' },
    { id: 'sbi', name: 'State Bank of India' },
    { id: 'icici', name: 'ICICI Bank' },
    { id: 'axis', name: 'Axis Bank' },
  ];

  return (
    <div className='space-y-6'>
      {/* Wallet Balance Section */}
      <div className='bg-secondary-bg/50 p-4 rounded-lg'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center space-x-2'>
            <Wallet className='w-5 h-5 text-accent-red' />
            <h3 className='font-medium'>Available Balance</h3>
          </div>
          <Button
            variant='link'
            className='text-accent-red p-0'>
            Add Money
          </Button>
        </div>
        <p className='text-secondary-text text-sm'>₹0.00 Available</p>
      </div>

      {/* Payment Methods */}
      <RadioGroup
        value={selectedMethod}
        onValueChange={handlePaymentSelection}>
        {/* Saved Cards */}
        {savedCards.map((card) => (
          <div
            key={card.id}
            className='relative'>
            <RadioGroupItem
              value={`saved_${card.id}`}
              id={`saved_${card.id}`}
              className='peer sr-only'
            />
            <Label
              htmlFor={`saved_${card.id}`}
              className='flex items-center justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border border-transparent peer-data-[state=checked]:border-accent-red'>
              <div className='flex items-center space-x-3'>
                <CreditCard className='w-5 h-5' />
                <div>
                  <p className='font-medium'>•••• {card.last4}</p>
                  <p className='text-sm text-secondary-text'>{card.name}</p>
                </div>
              </div>
              {card.isDefault && (
                <span className='text-xs bg-accent-red/10 text-accent-red px-2 py-1 rounded'>
                  Default
                </span>
              )}
            </Label>
          </div>
        ))}

        {/* Add New Card */}
        {!showNewCard ? (
          <Button
            variant='outline'
            className='w-full justify-start space-x-2'
            onClick={() => setShowNewCard(true)}>
            <Plus className='w-4 h-4' />
            <span>Add New Card</span>
          </Button>
        ) : (
          <form
            onSubmit={handleNewCardSubmit}
            className='space-y-4 p-4 bg-secondary-bg/50 rounded-lg'>
            <div className='space-y-2'>
              <Label htmlFor='cardNumber'>Card Number</Label>
              <Input
                id='cardNumber'
                placeholder='1234 5678 9012 3456'
                className='bg-primary-bg/50'
                value={newCardDetails.number}
                onChange={(e) =>
                  setNewCardDetails({
                    ...newCardDetails,
                    number: e.target.value,
                  })
                }
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='cardName'>Name on Card</Label>
              <Input
                id='cardName'
                placeholder='John Doe'
                className='bg-primary-bg/50'
                value={newCardDetails.name}
                onChange={(e) =>
                  setNewCardDetails({ ...newCardDetails, name: e.target.value })
                }
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='expiry'>Expiry Date</Label>
                <Input
                  id='expiry'
                  placeholder='MM/YY'
                  className='bg-primary-bg/50'
                  value={newCardDetails.expiry}
                  onChange={(e) =>
                    setNewCardDetails({
                      ...newCardDetails,
                      expiry: e.target.value,
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='cvv'>CVV</Label>
                <Input
                  id='cvv'
                  type='password'
                  maxLength={3}
                  className='bg-primary-bg/50'
                  value={newCardDetails.cvv}
                  onChange={(e) =>
                    setNewCardDetails({
                      ...newCardDetails,
                      cvv: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className='flex justify-end space-x-2'>
              <Button
                type='button'
                variant='ghost'
                onClick={() => setShowNewCard(false)}>
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-accent-red hover:bg-accent-red/90'>
                Save Card
              </Button>
            </div>
          </form>
        )}

        {/* Net Banking */}
        <div className='relative'>
          <RadioGroupItem
            value='netbanking'
            id='netbanking'
            className='peer sr-only'
          />
          <Label
            htmlFor='netbanking'
            className='flex items-center justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border border-transparent peer-data-[state=checked]:border-accent-red'>
            <div className='flex items-center space-x-3'>
              <Building2 className='w-5 h-5' />
              <div>
                <p className='font-medium'>Net Banking</p>
                <Select>
                  <SelectTrigger className='w-[180px] bg-transparent border-none shadow-none focus:ring-0'>
                    <SelectValue placeholder='Choose Bank' />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem
                        key={bank.id}
                        value={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Label>
        </div>

        {/* UPI */}
        <div className='relative'>
          <RadioGroupItem
            value='upi'
            id='upi'
            className='peer sr-only'
          />
          <Label
            htmlFor='upi'
            className='flex items-center justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border border-transparent peer-data-[state=checked]:border-accent-red'>
            <div className='flex items-center space-x-3'>
              <Smartphone className='w-5 h-5' />
              <div>
                <p className='font-medium'>UPI Payment</p>
                <p className='text-sm text-secondary-text'>
                  Pay using any UPI app
                </p>
              </div>
            </div>
          </Label>
        </div>

        {/* Cash on Delivery */}
        <div className='relative'>
          <RadioGroupItem
            value='cod'
            id='cod'
            className='peer sr-only'
          />
          <Label
            htmlFor='cod'
            className='flex items-center justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border border-transparent peer-data-[state=checked]:border-accent-red'>
            <div className='flex items-center space-x-3'>
              <Wallet className='w-5 h-5' />
              <div>
                <p className='font-medium'>Cash/Card on Delivery</p>
                <p className='text-sm text-secondary-text'>
                  Pay when you receive your order
                </p>
              </div>
            </div>
          </Label>
        </div>
      </RadioGroup>

      {/* Payment Security Notice */}
      <Alert className='bg-secondary-bg/50 border-accent-red/20'>
        <AlertCircle className='h-4 w-4 text-accent-red' />
        <AlertDescription className='text-sm text-secondary-text'>
          Your payment information is encrypted and secure. We never store your
          full card details.
        </AlertDescription>
      </Alert>
    </div>
  );
}
