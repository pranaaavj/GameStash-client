import { useEffect, useState } from 'react';
import { Input } from '@/shadcn/components/ui/input';
import { AdminPagination } from '@/components/admin';
import { Search, CircleX, DollarSign } from 'lucide-react';
import { Alert, DatePicker, EmptyState } from '@/components/common';
import { Badge } from '@/shadcn/components/ui/badge';
import { format, subDays, subMonths, subYears } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shadcn/components/ui/table';
import {
  useDownloadSalesExcelMutation,
  useDownloadSalesPDFMutation,
  useGetSalesDataQuery,
} from '@/redux/api/admin/salesApi';
import { SalesDetails } from './SalesDetails';
import { Button } from '@/shadcn/components/ui/button';
import { Download, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shadcn/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';

export const Sales = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [period, setPeriod] = useState('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-03-31T23:59:59.999Z',
  });

  const [selectedSale, setSelectedSale] = useState(null);

  const [downloadExcel] = useDownloadSalesExcelMutation();
  const [downloadPDF] = useDownloadSalesPDFMutation();

  useEffect(() => {
    setSelectedSale(null);
  }, []);

  console.log(dateRange);

  // Fetching sales data
  const {
    data: responseSalesData,
    isError,
    error,
    isLoading,
  } = useGetSalesDataQuery({
    page: currentPage,
    limit: 10,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const tableHeaders = [
    'Order ID',
    'Customer',
    'Products',
    'Total Amount',
    'Final Price',
    'Payment Method',
    'Payment Status',
    'Order Date',
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredSales = responseSalesData?.data?.sales?.filter(
    (sale) =>
      sale._id.includes(searchTerm) ||
      sale.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDateChange = ({ target: { name, value } }) => {
    console.log(name, value);
    setDateRange((prevDate) => ({ ...prevDate, [name]: value }));
  };

  const handlePeriodChange = (value) => {
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
        return; // Keep existing dates for custom
    }

    setDateRange({ startDate, endDate: today });
  };

  const handleDownloadReport = async (format) => {
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
      toast.success(`Report downloading as ${format.toUpperCase()}`);
    } catch {
      toast.error('Failed to download report');
    }
  };

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
      <div className='mb-6 text-center'>
        <h1 className='text-2xl md:text-3xl font-bold text-primary-text mb-4'>
          Sales Data
        </h1>
      </div>
      <div className='flex flex-col sm:flex-row justify-between pr-10 items-end mb-4 space-y-4 sm:space-y-0'>
        {/* Search Input */}
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
        <div>
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
                onClick={() => handleDownloadReport('pdf')}>
                Download PDF
              </Button>
              <Button
                variant='ghost'
                onClick={() => handleDownloadReport('excel')}>
                Download Excel
              </Button>
            </PopoverContent>
          </Popover>
        </div>
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

          {period === 'custom' && (
            <div className='flex gap-2 items-center'>
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
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto flex-grow no-scrollbar'>
        {isLoading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-blue'></div>
          </div>
        ) : filteredSales?.length ? (
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
              {filteredSales.map((sale) => (
                <TableRow
                  key={sale._id}
                  className='transition-colors duration-200 even:bg-primary-bg/5 hover:bg-primary-bg/20'
                  onClick={() => setSelectedSale(sale._id)}>
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    {sale._id.substring(sale._id.length - 8)}
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
                  <TableCell className='px-2 md:px-4 py-3 text-center text-xs md:text-sm text-secondary-text border-b border-accent-blue/20 truncate'>
                    <Badge
                      variant={
                        sale.paymentStatus === 'Paid' ? 'success' : 'warning'
                      }>
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

      {/* Pagination */}
      <div className='sticky bottom-0 mt-4'>
        {responseSalesData?.data?.totalPage > 1 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={responseSalesData?.data?.totalPage || 0}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Error message */}
      {isError && (
        <Alert
          Icon={CircleX}
          variant='destructive'
          description={
            error?.data?.message || 'Something went wrong! Please try again.'
          }
        />
      )}
    </div>
  );
};
