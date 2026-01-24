import { useEffect, useState, useCallback, useMemo } from 'react';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { Search, DollarSign, Download, ChevronDown } from 'lucide-react';

import { Input } from '@/shadcn/components/ui/input';
import { Badge } from '@/shadcn/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import { Button } from '@/shadcn/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shadcn/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';

import { AdminPagination } from '@/components/admin';
import { DatePicker, EmptyState } from '@/components/common';
import { SalesDetails } from './SalesDetails';

import {
  useDownloadSalesExcelMutation,
  useDownloadSalesPDFMutation,
  useGetSalesDataQuery,
} from '@/redux/api/admin/salesApi';

import { handleApiError, showToast } from '@/utils';
import { ContainerLoading } from '@/components/error';

export const Sales = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [period, setPeriod] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-03-31T23:59:59.999Z',
  });
  const [selectedSale, setSelectedSale] = useState(null);

  const [downloadExcel, { isLoading: isDownloadingExcel }] =
    useDownloadSalesExcelMutation();
  const [downloadPDF, { isLoading: isDownloadingPDF }] =
    useDownloadSalesPDFMutation();

  useEffect(() => {
    setSelectedSale(null);
  }, []);

  const { data: responseSalesData, isLoading } = useGetSalesDataQuery({
    page: currentPage,
    limit: 10,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleDateChange = useCallback(({ target: { name, value } }) => {
    setDateRange((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handlePeriodChange = useCallback(
    (value) => {
      setPeriod(value);
      const today = new Date();
      let startDate = dateRange.startDate;

      switch (value) {
        case 'day':
          startDate = subDays(today, 1);
          break;
        case 'week':
          startDate = subDays(today, 7);
          break;
        case 'month':
          startDate = subMonths(today, 1);
          break;
        case 'year':
          startDate = subYears(today, 1);
          break;
        case 'custom':
          return;
      }
      setDateRange({ startDate, endDate: today });
    },
    [dateRange.startDate]
  );

  const handleDownloadReport = useCallback(
    async (format) => {
      try {
        const url =
          format === 'pdf'
            ? await downloadPDF({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
              }).unwrap()
            : await downloadExcel({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
              }).unwrap();

        const a = document.createElement('a');
        a.href = url;
        a.download = `sales-report-${format}.${
          format === 'pdf' ? 'pdf' : 'xlsx'
        }`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);

        showToast.success(`Report downloading as ${format.toUpperCase()}`);
      } catch (error) {
        handleApiError(error, 'Failed to download report');
      }
    },
    [dateRange, downloadExcel, downloadPDF]
  );

  const filteredSales = useMemo(
    () =>
      responseSalesData?.data?.sales?.filter(
        (sale) =>
          sale._id.includes(searchTerm) ||
          sale.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [responseSalesData, searchTerm]
  );

  if (selectedSale) {
    return (
      <SalesDetails
        saleId={selectedSale}
        setSelectedSale={setSelectedSale}
      />
    );
  }

  return (
    <div className='w-full h-full flex flex-col overflow-auto bg-secondary-bg rounded-lg p-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6'>
        <div className='flex items-center gap-2'>
          <DollarSign className='h-5 w-5 text-accent-blue' />
          <h1 className='text-2xl font-medium text-primary-text'>Sales</h1>
        </div>
      </div>

      {/* Controls */}
      <div className='flex flex-col sm:flex-row justify-between pr-10 items-end mb-4 space-y-4 sm:space-y-0'>
        <div className='relative w-full flex sm:w-64'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-text h-4 w-4' />
          <Input
            type='text'
            value={searchTerm}
            onChange={handleSearch}
            placeholder='Search by Order ID or Customer...'
            className='pl-10 pr-4 py-2 rounded-full bg-secondary-bg text-primary-text border-accent-blue focus:border-accent-blue focus:ring focus:ring-accent-blue focus:ring-opacity-50 w-full'
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              className='text-white border-0 bg-[#262626] hover:border hover:bg-[#262626] hover:text-white'>
              <Download className='mr-2 h-4 w-4' /> Export{' '}
              <ChevronDown className='ml-2 h-4 w-4' />
            </Button>
          </PopoverTrigger>
          <PopoverContent className='w-full flex flex-col'>
            <Button
              variant='ghost'
              disabled={isDownloadingPDF}
              onClick={() => handleDownloadReport('pdf')}>
              {isDownloadingPDF ? 'Downloading PDF...' : 'Download PDF'}
            </Button>
            <Button
              variant='ghost'
              disabled={isDownloadingExcel}
              onClick={() => handleDownloadReport('excel')}>
              {isDownloadingExcel ? 'Downloading Excel...' : 'Download Excel'}
            </Button>
          </PopoverContent>
        </Popover>

        <div className='flex items-end justify-center gap-x-4'>
          <Tabs
            value={period}
            onValueChange={handlePeriodChange}
            className='w-full sm:w-auto'>
            <TabsList className='bg-primary-bg'>
              <TabsTrigger value='day'>Day</TabsTrigger>
              <TabsTrigger value='week'>Week</TabsTrigger>
              <TabsTrigger value='month'>Month</TabsTrigger>
              <TabsTrigger value='year'>Year</TabsTrigger>
              <TabsTrigger value='custom'>Custom</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className='flex gap-2 items-center min-h-[44px]'>
            {period === 'custom' ? (
              <>
                <DatePicker
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  label='Start Date'
                  name='startDate'
                  className='w-36'
                />
                <DatePicker
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  label='End Date'
                  name='endDate'
                  className='w-36'
                />
              </>
            ) : (
              <>
                <div className='w-36' />
                <div className='w-36' />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto flex-grow no-scrollbar'>
        {isLoading ? (
          <ContainerLoading />
        ) : filteredSales?.length ? (
          <Table className='w-full table-fixed border-collapse min-w-full'>
            <TableHeader>
              <TableRow className='bg-secondary-bg/10 border-b-2 border-accent-blue'>
                {[
                  'Order ID',
                  'Customer',
                  'Items',
                  'Total Discount',
                  'Final Price',
                  'Payment Method',
                  'Payment Status',
                  'Date',
                ].map((header, index) => (
                  <TableHead
                    key={index}
                    className='px-2 md:px-4 py-3 text-xs md:text-sm text-center font-semibold text-primary-text uppercase tracking-wider'>
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow
                  key={sale._id}
                  className='transition-colors duration-200 even:bg-primary-bg/5 hover:bg-primary-bg/20 cursor-pointer'
                  onClick={() => setSelectedSale(sale._id)}>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {sale._id.slice(-8)}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {sale.user.name}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {sale.orderItems.length}{' '}
                    {sale.orderItems.length > 1 ? 'items' : 'item'}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    ₹{sale.totalDiscount.toFixed(2)}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    ₹{sale.finalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {sale.paymentMethod}
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm border-b border-accent-blue/20'>
                    <Badge
                      className={`w-[110px] h-10 text-xs truncate text-center justify-center items-center flex ${
                        sale.paymentStatus === 'Paid'
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-yellow-500/20 text-yellow-700'
                      }`}>
                      {sale.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {format(new Date(sale.placedAt), 'dd/MM/yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className='w-full flex items-center justify-center'>
            <EmptyState
              icon={DollarSign}
              title='No sales data available'
              description='There are no completed sales to display at the moment.'
            />
          </div>
        )}
      </div>

      <div className='sticky bottom-0 mt-4'>
        {responseSalesData?.data?.totalPage > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={responseSalesData.data.totalPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};
