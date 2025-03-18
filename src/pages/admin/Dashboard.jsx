import { useState } from 'react';
import { useGetSalesReportQuery } from '@/redux/api/admin/salesApi';
import { format, subDays, subMonths, subYears } from 'date-fns';
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

export const Dashboard = () => {
  const [period, setPeriod] = useState('week');
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const formattedStartDate = format(dateRange.from, 'yyyy-MM-dd');
  const formattedEndDate = format(dateRange.to, 'yyyy-MM-dd');

  const { data: reportData } = useGetSalesReportQuery({
    period,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  });

  const handlePeriodChange = (value) => {
    setPeriod(value);
    const today = new Date();
    let from;
    switch (value) {
      case 'day':
        from = subDays(today, 1);
        break;
      case 'week':
        from = subDays(today, 7);
        break;
      case 'month':
        from = subMonths(today, 1);
        break;
      case 'year':
        from = subYears(today, 1);
        break;
      default:
        return;
    }
    setDateRange({ from, to: today });
  };

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
        <Tabs
          value={period}
          onValueChange={handlePeriodChange}>
          <TabsList className='-primary-bg bg-white/40ext-primary-text'>
            <TabsTrigger value='day'>Day</TabsTrigger>
            <TabsTrigger value='week'>Week</TabsTrigger>
            <TabsTrigger value='month'>Month</TabsTrigger>
            <TabsTrigger value='year'>Year</TabsTrigger>
          </TabsList>
        </Tabs>
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
