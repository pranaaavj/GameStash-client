import { useState } from 'react';
import { useGetSalesReportQuery } from '@/redux/api/admin/salesApi';
import { subDays, subMonths, subYears } from 'date-fns';
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Pie,
  PieChart,
  CartesianGrid,
  Cell,
} from 'recharts';
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from '@/shadcn/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/components/ui/tabs';
import { DatePicker } from '@/components/common';
import { ChartContainer, ChartTooltip } from '@/shadcn/components/ui/chart';
import { DollarSign, ShoppingCart, Users, Percent } from 'lucide-react';

// Custom color palette
const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  background: '#f8fafc',
  cardBg: '#ffffff',
  text: '#1e293b',
  lightText: '#64748b',
  chartColors: [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#f43f5e',
    '#f59e0b',
    '#10b981',
    '#14b8a6',
    '#3b82f6',
  ],
};

export function Dashboard() {
  const [period, setPeriod] = useState('year');
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

  const formatChartData = (data, labelKey, valueKey) => {
    return (
      data?.map((item, index) => ({
        name: item[labelKey],
        value: item[valueKey],
        color: COLORS.chartColors[index % COLORS.chartColors.length],
      })) || []
    );
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: reportData?.data?.totalRevenue || 0,
      prefix: '₹',
      icon: DollarSign,
      color: COLORS.primary,
      percentChange: 12.5,
    },
    {
      title: 'Total Orders',
      value: reportData?.data?.ordersCount || 0,
      icon: ShoppingCart,
      color: COLORS.success,
      percentChange: 8.2,
    },
    {
      title: 'Total Customers',
      value: reportData?.data?.customers || 0,
      icon: Users,
      color: COLORS.info,
      percentChange: 5.3,
    },
    {
      title: 'Total Discounts',
      value: reportData?.data?.revenueData?.[0]?.totalDiscount || 0,
      prefix: '₹',
      icon: Percent,
      color: COLORS.warning,
      percentChange: -2.4,
    },
  ];

  return (
    <div className='p-6 space-y-6 bg-secondary-bg min-h-screen'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold text-white'>Sales Dashboard</h1>
          <p className='text-slate-500 mt-1'>
            Monitor your sales performance and analytics
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
          <Tabs
            value={period}
            onValueChange={handlePeriodChange}
            className='w-full sm:w-auto'>
            <TabsList className='bg-white border border-slate-200 p-1'>
              <TabsTrigger
                value='day'
                className='text-xs sm:text-sm'>
                Day
              </TabsTrigger>
              <TabsTrigger
                value='week'
                className='text-xs sm:text-sm'>
                Week
              </TabsTrigger>
              <TabsTrigger
                value='month'
                className='text-xs sm:text-sm'>
                Month
              </TabsTrigger>
              <TabsTrigger
                value='year'
                className='text-xs sm:text-sm'>
                Year
              </TabsTrigger>
              <TabsTrigger
                value='custom'
                className='text-xs sm:text-sm'>
                Custom
              </TabsTrigger>
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

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {statCards.map((stat, index) => (
          <Card
            key={index}
            className='bg-primary-bg/60 text-white border-none transition-shadow'>
            <CardHeader className='pb-2'>
              <div className='flex justify-between items-start'>
                <div className='space-y-1'>
                  <CardDescription className='text-slate-500'>
                    {stat.title}
                  </CardDescription>
                  <CardTitle className='text-2xl font-bold'>
                    {stat.prefix}
                    {stat.value.toLocaleString()}
                  </CardTitle>
                </div>
                <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                  <stat.icon className={`h-5 w-5 text-${stat.color}`} />
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className='bg-primary-bg/60 text-white border-none shadow-sm'>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
          <CardDescription>
            Breakdown of revenue by product category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className='h-[300px]'>
            <BarChart
              data={formatChartData(
                reportData?.data?.revenueData,
                '_id',
                'totalRevenue'
              )}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                stroke='#e2e8f0'
              />
              <XAxis
                dataKey='name'
                stroke='#94a3b8'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke='#94a3b8'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value / 1000}k`}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className='bg-white p-2 border border-slate-200 shadow-md rounded-md'>
                        <p className='text-sm font-medium'>
                          {payload[0].payload.name}
                        </p>
                        <p className='text-sm text-slate-500'>
                          Revenue: ₹{payload[0].value.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey='value'
                radius={[4, 4, 0, 0]}>
                {formatChartData(
                  reportData?.data?.revenueData,
                  '_id',
                  'totalRevenue'
                ).map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 '>
        <Card className='bg-primary-bg/80 text-white border-none shadow-sm'>
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
            <CardDescription>Top products by units sold</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className='h-[160px]'>
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
                  paddingAngle={2}
                  dataKey='value'
                  label={false}
                  labelLine={false}>
                  {formatChartData(
                    reportData?.data?.bestSellingProducts,
                    'name',
                    'totalSold'
                  ).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
            <div className='flex flex-wrap justify-center gap-3 mt-4 text-xs text-slate-600'>
              {formatChartData(
                reportData?.data?.bestSellingProducts,
                'name',
                'totalSold'
              ).map((entry, index) => (
                <div
                  key={`legend-prod-${index}`}
                  className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className='truncate max-w-[100px]'>
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='bg-primary-bg/80 text-white border-none shadow-sm'>
          <CardHeader>
            <CardTitle>Best Selling Brands</CardTitle>
            <CardDescription>Top brands by units sold</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className='h-[160px]'>
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
                  paddingAngle={2}
                  dataKey='value'
                  label={false}
                  labelLine={false}>
                  {formatChartData(
                    reportData?.data?.bestSellingBrands,
                    'name',
                    'totalSold'
                  ).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
            <div className='flex flex-wrap justify-center gap-3 mt-4 text-xs text-slate-600'>
              {formatChartData(
                reportData?.data?.bestSellingBrands,
                'name',
                'totalSold'
              ).map((entry, index) => (
                <div
                  key={`legend-brand-${index}`}
                  className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className='truncate max-w-[100px]'>
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='bg-primary-bg/80 text-white border-none shadow-sm'>
          <CardHeader>
            <CardTitle>Best Selling Genres</CardTitle>
            <CardDescription>Top genres by units sold</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className='h-[160px]'>
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
                  paddingAngle={2}
                  dataKey='value'
                  label={false}
                  labelLine={false}>
                  {formatChartData(
                    reportData?.data?.bestSellingGenres,
                    'name',
                    'totalSold'
                  ).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ChartContainer>
            <div className='flex flex-wrap justify-center gap-3 mt-4 text-xs text-slate-600'>
              {formatChartData(
                reportData?.data?.bestSellingGenres,
                'name',
                'totalSold'
              ).map((entry, index) => (
                <div
                  key={`legend-genre-${index}`}
                  className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className='truncate max-w-[100px]'>
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
