/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Button } from '@/shadcn/components/ui/button';
import { InputField } from '@/components/common';
import { useAddMoneyToWalletMutation } from '@/redux/api/user/walletApi';
import { CircleX } from 'lucide-react';
import { Alert } from '@/components/common';

export const AddMoneyForm = ({ onSuccess, onCancel }) => {
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');

  const [addMoneyToWallet, { isLoading, isError, error }] =
    useAddMoneyToWalletMutation();

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    setAmountError('');
  };

  const validateAmount = () => {
    if (!amount) {
      setAmountError('Amount is required');
      return false;
    }

    const numAmount = Number.parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setAmountError('Please enter a valid amount greater than 0');
      return false;
    }

    if (numAmount > 10000) {
      setAmountError('Maximum amount allowed is ₹10,000');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAmount()) {
      return;
    }

    try {
      const response = await addMoneyToWallet({
        amount: Number.parseFloat(amount),
      }).unwrap();

      if (response.success) {
        onSuccess();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='border border-accent-blue/20 rounded-md p-4 bg-primary-bg/5'>
      <h3 className='text-lg font-semibold mb-4 text-primary-text'>
        Add Money to Wallet
      </h3>

      <form
        onSubmit={handleSubmit}
        className='space-y-4'>
        <InputField
          type='number'
          value={amount}
          onChange={handleAmountChange}
          label='Amount (₹)'
          name='amount'
          placeHolder='Enter amount'
          isInvalid={!!amountError}
          errorMessage={amountError}
          helperText='Enter amount between ₹1 and ₹10,000'
        />

        <div className='flex justify-end space-x-2'>
          <Button
            type='button'
            onClick={onCancel}
            variant='outline'
            className='border-accent-blue text-primary-text hover:bg-accent-blue/10'>
            Cancel
          </Button>
          <Button
            type='submit'
            disabled={isLoading}
            className='bg-accent-blue text-primary-text hover:bg-accent-blue/90'>
            {isLoading ? 'Processing...' : 'Add Money'}
          </Button>
        </div>
      </form>

      {isError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          className='mt-4'
          description={
            error?.data?.message || 'Something went wrong! Please try again.'
          }
        />
      )}
    </div>
  );
};
