import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Plus, ArrowDownLeft, ArrowUpRight, X } from 'lucide-react';

import { Button } from '@/shadcn/components/ui/button';
import { Input } from '@/shadcn/components/ui/input';

import {
  useGetWalletQuery,
  useAddMoneyToWalletMutation,
  useVerifyAddMoneyMutation,
} from '@/redux/api/user/walletApi';

import { showToast } from '@/utils/showToast';
import { handleApiError } from '@/utils/handleApiError';

export const ModernWallet = () => {
  const { data: responseWallet } = useGetWalletQuery();

  const [addMoneyToWallet, { isLoading: isAdding }] =
    useAddMoneyToWalletMutation();
  const [verifyAddMoney] = useVerifyAddMoneyMutation();

  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState('');
  const [showAddMoney, setShowAddMoney] = useState(false);

  console.log(transactions);

  useEffect(() => {
    if (responseWallet?.success) {
      setWalletData(responseWallet.data);
      setTransactions([...responseWallet.data.transactions].reverse());
    }
  }, [responseWallet]);

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
    } finally {
      setShowAddMoney(false);
    }
  };

  return (
    <div className='w-full mx-auto bg-secondary-bg/20 rounded-xl overflow-hidden shadow-lg'>
      {/* Header */}
      <div className='bg-secondary-bg/20 p-4 text-white flex items-center justify-between'>
        <h1 className='text-xl font-bold flex items-center'>
          <Wallet className='mr-2 h-5 w-5' /> My Wallet
        </h1>
        <Button
          onClick={() => setShowAddMoney(!showAddMoney)}
          variant='ghost'
          size='sm'
          className='text-white hover:bg-white/20'>
          {showAddMoney ? (
            <X className='h-4 w-4' />
          ) : (
            <Plus className='h-4 w-4' />
          )}
        </Button>
      </div>

      {/* Balance Section */}
      <div className='p-6 text-center'>
        <p className='text-secondary-text mb-1'>Available Balance</p>
        <h2 className='text-4xl font-bold text-primary-text'>
          {walletData?.currency}{' '}
          {walletData?.balance.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </h2>
      </div>

      {/* Add Money Section */}
      <AnimatePresence>
        {showAddMoney && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='p-4 bg-primary-bg/50 border-0 rounded-lg mx-4'>
            <h3 className='text-primary-text font-medium mb-3'>Add Money</h3>
            <div className='space-y-4'>
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions Section */}
      <div className='p-6 overflow-y-auto h-96'>
        <h3 className='text-primary-text font-medium mb-4'>
          Transaction History
        </h3>
        {transactions.length === 0 ? (
          <p className='text-secondary-text text-center'>No transactions yet</p>
        ) : (
          <div className='space-y-3'>
            {transactions.map(
              (transaction) =>
                transaction?.status === 'completed' && (
                  <motion.div
                    key={transaction._id}
                    whileHover={{ scale: 1.02 }}
                    className='flex items-center justify-between p-3 bg-primary-bg/5 rounded-lg'>
                    <div className='flex items-center'>
                      <div
                        className={`p-2 rounded-full mr-3 ${
                          transaction.type === 'credit'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-600'
                        }`}>
                        {transaction.type === 'credit' ? (
                          <ArrowDownLeft className='h-4 w-4' />
                        ) : (
                          <ArrowUpRight className='h-4 w-4' />
                        )}
                      </div>
                      <div>
                        <p className='font-medium text-primary-text'>
                          {transaction.description || 'Wallet Transaction'}
                        </p>
                        <p className='text-xs text-secondary-text'>
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p
                        className={`font-medium ${
                          transaction.type === 'credit'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                        {transaction.type === 'credit' ? '+' : '-'}₹
                        {transaction.amount}
                      </p>
                    </div>
                  </motion.div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
