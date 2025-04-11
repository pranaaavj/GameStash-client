import { useEffect, useState } from 'react';

import { Button } from '@/shadcn/components/ui/button';
import { Label } from '@/shadcn/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/shadcn/components/ui/radio-group';
import { Alert, AlertDescription } from '@/shadcn/components/ui/alert';
import { Input } from '@/shadcn/components/ui/input';
import {
  Wallet,
  Smartphone,
  AlertCircle,
  Info,
  Plus,
  X,
  ArrowDownLeft,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shadcn/components/ui/tooltip';

import { useUsers } from '@/hooks';
import { useGetCartQuery } from '@/redux/api/user/cartApi';
import {
  useGetWalletQuery,
  useAddMoneyToWalletMutation,
  useVerifyAddMoneyMutation,
} from '@/redux/api/user/walletApi';

import { showToast } from '@/utils/showToast';
import { handleApiError } from '@/utils/handleApiError';

export const Payment = ({ onPaymentSelect }) => {
  const user = useUsers();

  const [selectedMethod, setSelectedMethod] = useState('');
  const [isCodDisabled, setIsCodDisabled] = useState(false);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [walletData, setWalletData] = useState(null);

  const { data: responseCart } = useGetCartQuery(user?.userInfo?.id, {
    skip: !user?.userInfo?.id,
  });

  const { data: responseWallet } = useGetWalletQuery();
  const [addMoneyToWallet, { isLoading: isAdding }] =
    useAddMoneyToWalletMutation();
  const [verifyAddMoney] = useVerifyAddMoneyMutation();

  useEffect(() => {
    if (responseCart?.data?.total >= 2000) {
      setIsCodDisabled(true);
    }
  }, [responseCart]);

  useEffect(() => {
    if (responseWallet?.success) {
      setWalletData(responseWallet.data);
    }
  }, [responseWallet]);

  const handlePaymentSelection = (value) => {
    setSelectedMethod(value);
    onPaymentSelect(value);
  };

  const handleAddMoney = async () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      showToast.error('Enter a valid amount');
      return;
    }

    try {
      const response = await addMoneyToWallet(amount).unwrap();

      if (response?.success) {
        const options = {
          key: import.meta.env.VITE_RZP_KEY_ID,
          amount: response.data.amount,
          currency: response.data.currency,
          name: 'GameStash Wallet',
          description: 'Add Money',
          order_id: response.data.razorpayOrderId,
          handler: async function (razorpayResponse) {
            try {
              const paymentData = {
                razorpayOrderId: razorpayResponse?.razorpay_order_id,
                paymentId: razorpayResponse?.razorpay_payment_id,
                signature: razorpayResponse?.razorpay_signature,
              };

              const paymentResponse = await verifyAddMoney(
                paymentData
              ).unwrap();
              if (paymentResponse?.success) {
                showToast.success('Money added successfully');
                setAmount('');
                setShowAddMoney(false);
              }
            } catch (err) {
              handleApiError(err);
            }
          },
          theme: { color: '#3399cc' },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      handleApiError(err);
    }
  };

  // Check if wallet has sufficient balance for cart total
  const isWalletSufficient = walletData?.balance >= responseCart?.data?.total;

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
            className='text-accent-red p-0'
            onClick={() => setShowAddMoney(!showAddMoney)}>
            {showAddMoney ? (
              <span className='flex items-center'>
                <X className='w-4 h-4 mr-1' /> Cancel
              </span>
            ) : (
              <span className='flex items-center'>
                <Plus className='w-4 h-4 mr-1' /> Add Money
              </span>
            )}
          </Button>
        </div>
        <p className='text-secondary-text text-sm'>
          {walletData?.currency || '₹'}{' '}
          {walletData?.balance?.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) || '0.00'}{' '}
          Available
        </p>

        {/* Add Money Section */}
        {showAddMoney && (
          <div className='mt-4 p-3 bg-primary-bg/50 border-0 rounded-lg'>
            <div className='space-y-3'>
              <div className='flex items-center'>
                <span className='bg-secondary-bg border-0 border-input px-3 py-2 text-sm rounded-l-md'>
                  ₹
                </span>
                <Input
                  type='number'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder='Enter amount'
                  onWheel={(e) => e.target.blur()}
                  className='bg-secondary-bg rounded-none text-sm border border-transparent focus:border-[#f2f2f2] focus:outline-none focus:ring-0 hover:border-[#c0c0c0] px-3 py-2 text-white'
                />
              </div>
              <Button
                onClick={handleAddMoney}
                disabled={isAdding}
                className='w-full bg-accent-blue text-white hover:bg-accent-blue/90'>
                {isAdding ? 'Processing...' : 'Add Money'}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Payment Methods */}
      <RadioGroup
        value={selectedMethod}
        onValueChange={handlePaymentSelection}>
        {/* Wallet Payment */}
        <div className='relative'>
          <RadioGroupItem
            value='Wallet'
            id='Wallet'
            className='peer sr-only'
            disabled={!isWalletSufficient}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Label
                htmlFor='Wallet'
                className={`flex items-center justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border border-transparent ${
                  !isWalletSufficient
                    ? 'opacity-50 cursor-not-allowed'
                    : 'peer-data-[state=checked]:border-accent-red'
                }`}>
                <div className='flex items-center space-x-3'>
                  <ArrowDownLeft className='w-5 h-5' />
                  <div>
                    <p className='font-medium'>Pay with Wallet</p>
                    <p className='text-sm text-secondary-text'>
                      Use your wallet balance: {walletData?.currency || '₹'}{' '}
                      {walletData?.balance?.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) || '0.00'}
                    </p>
                  </div>
                </div>
                {!isWalletSufficient && (
                  <Info className='w-5 h-5 text-gray-400' />
                )}
              </Label>
            </TooltipTrigger>

            {!isWalletSufficient && (
              <TooltipContent className='bg-accent-red/70 text-white p-2 text-sm rounded-md'>
                Insufficient wallet balance for this order. Add more money or
                choose another payment method.
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Razorpay */}
        <div className='relative'>
          <RadioGroupItem
            value='Razorpay'
            id='Razorpay'
            className='peer sr-only'
          />
          <Label
            htmlFor='Razorpay'
            className='flex items-center justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border border-transparent peer-data-[state=checked]:border-accent-red'>
            <div className='flex items-center space-x-3'>
              <Smartphone className='w-5 h-5' />
              <div>
                <p className='font-medium'>Razorpay</p>
                <p className='text-sm text-secondary-text'>
                  Pay using Razorpay
                </p>
              </div>
            </div>
          </Label>
        </div>

        {/* Cash on Delivery */}
        <div className='relative'>
          <RadioGroupItem
            value='Cash on Delivery'
            id='COD'
            className='peer sr-only'
            disabled={isCodDisabled}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Label
                htmlFor='COD'
                className={`flex items-center border-transparent justify-between p-4 bg-secondary-bg/50 rounded-lg cursor-pointer border ${
                  isCodDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'peer-data-[state=checked]:border-accent-red'
                }`}>
                <div className='flex items-center space-x-3'>
                  <Wallet className='w-5 h-5' />
                  <div>
                    <p className='font-medium'>Cash/Card on Delivery</p>
                    <p className='text-sm text-secondary-text'>
                      Pay when you receive your order
                    </p>
                  </div>
                </div>

                {isCodDisabled && <Info className='w-5 h-5 text-gray-400' />}
              </Label>
            </TooltipTrigger>

            {isCodDisabled && (
              <TooltipContent className='bg-accent-red/70 text-white p-2 text-sm rounded-md'>
                Cash on delivery is not available for orders above Rs 2000.
              </TooltipContent>
            )}
          </Tooltip>
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
};
