import { useState } from 'react';
import { useGetSalesReportQuery } from '@/redux/api/admin/salesApi';
import { subDays, subMonths, subYears } from 'date-fns';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Pie,
  Tooltip,
  Legend,
  PieChart,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shadcn/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';
import { DatePicker } from '@/components/common';

export const Dashboard = () => {
  const [period, setPeriod] = useState('week');
  const [dateRange, setDateRange] = useState({
    startDate: '2025-03-01T00:00:00.000Z',
    endDate: '2025-03-31T23:59:59.999Z',
  });

  const handleDateChange = ({ target: { name, value } }) => {
    setDateRange((prevDate) => ({ ...prevDate, [name]: value }));
    if (period !== 'custom') setPeriod('custom');
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

  const { data: reportData } = useGetSalesReportQuery({
    period,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  console.log(dateRange);

  const formatChartData = (data, labelKey, valueKey) => {
    return (
      data?.map((item) => ({
        name: item[labelKey],
        value: item[valueKey],
      })) || []
    );
  };

  return (
    <div className='p-6 space-y-6 bg-secondary-bg text-primary-text'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Sales Dashboard</h1>
        <div className='flex flex-col items-end sm:flex-row gap-4 w-full sm:w-auto'>
          <Tabs
            value={period}
            onValueChange={handlePeriodChange}
            className='w-full sm:w-auto'>
            <TabsList className='bg-white/40'>
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

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-primary-text'>
        <Card className='bg-primary-bg/50 border-transparent text-primary-text'>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            ₹{reportData?.data?.totalRevenue?.toLocaleString() || 0}
          </CardContent>
        </Card>
        <Card className='bg-primary-bg/50 border-transparent text-primary-text'>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {reportData?.data?.ordersCount?.toLocaleString() || 0}
          </CardContent>
        </Card>
        <Card className='bg-primary-bg/50 border-transparent text-primary-text'>
          <CardHeader>
            <CardTitle>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {reportData?.data?.customers?.toLocaleString() || 0}
          </CardContent>
        </Card>
        <Card className='bg-primary-bg/50 border-transparent text-primary-text'>
          <CardHeader>
            <CardTitle>Total Discounts</CardTitle>
          </CardHeader>
          <CardContent>
            ₹
            {reportData?.data?.revenueData[0]?.totalDiscount?.toLocaleString() ||
              0}
          </CardContent>
        </Card>
      </div>

      <Card className='bg-primary-bg/50 border-transparent text-primary-text'>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer
            width='100%'
            height={300}>
            <BarChart
              data={formatChartData(
                reportData?.data?.revenueData,
                '_id',
                'totalRevenue'
              )}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey='value'
                fill='#5a9bf5'
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className='flex justify-between gap-4'>
        <Card className='bg-primary-bg/50 border-transparent text-primary-text w-full'>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer
              width='100%'
              height={300}>
              <PieChart>
                <Pie
                  data={formatChartData(
                    reportData?.data?.bestSellingProducts,
                    'name',
                    'totalSold'
                  )}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={80}
                  fill='#00e676'
                  dataKey='value'
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className='bg-primary-bg/50 border-transparent text-primary-text w-full'>
          <CardHeader>
            <CardTitle>Best Selling Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer
              width='100%'
              height={300}>
              <PieChart>
                <Pie
                  data={formatChartData(
                    reportData?.data?.bestSellingBrands,
                    'name',
                    'totalSold'
                  )}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={80}
                  fill='#ff5252'
                  dataKey='value'
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className='bg-primary-bg/50 border-transparent text-primary-text w-full'>
          <CardHeader>
            <CardTitle>Best Selling Genres</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer
              width='100%'
              height={300}>
              <PieChart>
                <Pie
                  data={formatChartData(
                    reportData?.data?.bestSellingGenres,
                    'name',
                    'totalSold'
                  )}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={80}
                  fill='#ff5252'
                  dataKey='value'
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
