import { useState } from 'react';
import { Input } from '@/shadcn/components/ui/input';
import { Button } from '@/shadcn/components/ui/button';
import { AdminPagination } from '@/components/admin';
import {
  Search,
  Plus,
  CircleX,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
} from 'lucide-react';
import { Alert, EmptyState } from '@/components/common';
import { Badge } from '@/shadcn/components/ui/badge';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import { toast } from 'sonner';
import {
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery,
} from '@/redux/api/user/walletApi';
import { AddMoneyForm } from './AddMoneyForm';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
} from '@/shadcn/components/ui/card';

export const WalletView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false);

  // Fetching wallet balance
  const {
    data: walletData,
    isError: isBalanceError,
    error: balanceError,
  } = useGetWalletBalanceQuery();

  // Fetching wallet transactions
  const {
    data: transactionsData,
    isError: isTransactionsError,
    error: transactionsError,
  } = useGetWalletTransactionsQuery({ page: currentPage, limit: 10 });

  const tableHeaders = [
    'Transaction ID',
    'Type',
    'Amount',
    'Description',
    'Date',
    'Status',
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredTransactions = transactionsData?.data?.transactions?.filter(
    (transaction) =>
      transaction._id.includes(searchTerm) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAddMoneyForm = () => {
    setShowAddMoneyForm(!showAddMoneyForm);
  };

  const handleAddMoneySuccess = () => {
    setShowAddMoneyForm(false);
    toast.success('Money added to wallet successfully', {
      duration: 1500,
    });
  };

  return (
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='mb-6 text-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-primary-text mb-4'>
          My Wallet
        </h1>
      </div>

      {/* Wallet Balance Card */}
      <Card className='w-full mb-6 bg-secondary-bg shadow-md border border-accent-blue/20'>
        <CardHeader className='bg-primary-bg/10 pb-2'>
          <CardTitle className='text-xl font-bold text-primary-text flex items-center'>
            <Wallet className='mr-2 h-5 w-5' /> Wallet Balance
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-4'>
          <div className='flex justify-between items-center'>
            <div className='text-3xl font-bold text-primary-text'>
              ₹{walletData?.data?.balance || 0}
            </div>
            <Button
              onClick={toggleAddMoneyForm}
              className='bg-accent-blue text-primary-text hover:bg-accent-blue/90 transition-colors duration-200'>
              <Plus className='mr-2 h-4 w-4' /> Add Money
            </Button>
          </div>

          {showAddMoneyForm && (
            <div className='mt-4'>
              <AddMoneyForm
                onSuccess={handleAddMoneySuccess}
                onCancel={toggleAddMoneyForm}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className='flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0'>
        {/* Search Input */}
        <div className='relative w-full sm:w-64'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-text h-4 w-4' />
          <Input
            type='text'
            value={searchTerm}
            onChange={handleSearch}
            placeholder='Search transactions...'
            className='pl-10 pr-4 py-2 rounded-full bg-secondary-bg text-primary-text border-accent-blue focus:border-accent-blue focus:ring focus:ring-accent-blue focus:ring-opacity-50 w-full'
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className='w-full overflow-x-auto flex-grow no-scrollbar'>
        {filteredTransactions?.length ? (
          <Table className='w-full table-fixed border-collapse min-w-full'>
            <TableHeader>
              <TableRow className='bg-secondary-bg/10 border-b-2 border-accent-blue'>
                {tableHeaders.map((header, index) => (
                  <TableHead
                    key={index}
                    className='px-2 md:px-4 py-3 text-xs md:text-sm text-center font-semibold text-primary-text uppercase tracking-wider'>
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction._id}
                  className='transition-colors duration-200 even:bg-primary-bg/5 hover:bg-primary-bg/20'>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {transaction._id}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    <div className='flex items-center justify-center'>
                      {transaction.type === 'credit' ? (
                        <ArrowDownCircle className='mr-1 h-4 w-4 text-green-500' />
                      ) : (
                        <ArrowUpCircle className='mr-1 h-4 w-4 text-red-500' />
                      )}
                      {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                    </div>
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    <span
                      className={
                        transaction.type === 'credit'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }>
                      {transaction.type === 'credit' ? '+' : '-'}₹
                      {transaction.amount}
                    </span>
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {transaction.description}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {format(
                      new Date(transaction.createdAt),
                      'dd/MM/yyyy hh:mm a'
                    )}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    <Badge
                      variant={
                        transaction.status === 'completed'
                          ? 'success'
                          : transaction.status === 'pending'
                          ? 'warning'
                          : 'destructive'
                      }>
                      {transaction.status.charAt(0).toUpperCase() +
                        transaction.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='w-full flex items-center justify-center'>
            <EmptyState
              icon={Wallet}
              title='No transactions available'
              description='You have not made any transactions yet. Add money to your wallet to get started.'
            />
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className='sticky bottom-0 mt-4'>
        {transactionsData?.data?.totalPages > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={transactionsData?.data?.totalPages || 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Error message */}
      {(isBalanceError || isTransactionsError) && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={
            balanceError?.data?.message ||
            transactionsError?.data?.message ||
            'Something went wrong! Please try again.'
          }
        />
      )}
    </div>
  );
};
