'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
} from 'recharts';

export default function SalesAnalytics() {
  const [dateRange, setDateRange] = useState('month'); // week, month, quarter, year

  // Revenue trend data (last 30 days)
  const revenueTrendData = [
    { date: 'Aug 1', revenue: 45000, target: 50000, units: 12 },
    { date: 'Aug 5', revenue: 52000, target: 50000, units: 14 },
    { date: 'Aug 10', revenue: 48000, target: 50000, units: 13 },
    { date: 'Aug 15', revenue: 61000, target: 50000, units: 16 },
    { date: 'Aug 20', revenue: 55000, target: 50000, units: 15 },
    { date: 'Aug 25', revenue: 72000, target: 50000, units: 19 },
    { date: 'Aug 31', revenue: 68000, target: 50000, units: 18 },
  ];

  // Sales by agent
  const agentSalesData = [
    { name: 'Michael Kipchoge', sales: 28, revenue: 245000 },
    { name: 'Rose Tata', sales: 24, revenue: 198000 },
    { name: 'James Mwangi', sales: 32, revenue: 267000 },
    { name: 'Fatima Hassan', sales: 19, revenue: 156000 },
    { name: 'David Kipchoge', sales: 22, revenue: 189000 },
    { name: 'Susan Njeri', sales: 20, revenue: 178000 },
  ];

  // Sales by phone model
  const modelSalesData = [
    { name: 'A05', value: 42, revenue: 198000 },
    { name: 'A06', value: 38, revenue: 215000 },
    { name: 'A07', value: 35, revenue: 189000 },
    { name: 'A16 5G', value: 28, revenue: 267000 },
    { name: 'A26 5G', value: 22, revenue: 245000 },
    { name: 'A36 5G', value: 18, revenue: 198000 },
    { name: 'A56 5G', value: 12, revenue: 156000 },
  ];

  // Key metrics
  const metrics = [
    { label: 'Total Revenue', value: '1.34M', change: '+12.5%', positive: true },
    { label: 'Total Units Sold', value: 215, change: '+8.2%', positive: true },
    { label: 'Average Deal Value', value: '6,232', change: '+4.1%', positive: true },
    { label: 'Conversion Rate', value: '62.4%', change: '-2.3%', positive: false },
  ];

  // Sales summary table
  const salesSummary = [
    {
      agent: 'James Mwangi',
      sales: 32,
      revenue: 267000,
      avgDeal: 8344,
      conversionRate: 71.2,
    },
    {
      agent: 'Michael Kipchoge',
      sales: 28,
      revenue: 245000,
      avgDeal: 8750,
      conversionRate: 68.5,
    },
    {
      agent: 'Rose Tata',
      sales: 24,
      revenue: 198000,
      avgDeal: 8250,
      conversionRate: 64.3,
    },
    {
      agent: 'David Kipchoge',
      sales: 22,
      revenue: 189000,
      avgDeal: 8591,
      conversionRate: 61.5,
    },
    {
      agent: 'Susan Njeri',
      sales: 20,
      revenue: 178000,
      avgDeal: 8900,
      conversionRate: 58.2,
    },
    {
      agent: 'Fatima Hassan',
      sales: 19,
      revenue: 156000,
      avgDeal: 8211,
      conversionRate: 52.8,
    },
  ];

  const COLORS = ['#16A39E', '#FF6B35', '#FFB84D', '#50C878', '#4A90E2', '#9B59B6'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📊 Sales Analytics</h1>
        <p className="text-gray-600 mt-1">Comprehensive sales data and performance insights</p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-4 flex gap-3">
        <span className="text-sm font-medium text-gray-700 py-2">Time Period:</span>
        {['week', 'month', 'quarter', 'year'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg transition font-medium text-sm ${
              dateRange === range
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            <p className={`text-sm mt-2 ${metric.positive ? 'text-green-600' : 'text-red-600'}`}>
              {metric.positive ? '↑' : '↓'} {metric.change} vs last period
            </p>
          </div>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueTrendData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16A39E" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#16A39E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Legend />
            <Area type="monotone" dataKey="revenue" stroke="#16A39E" fillOpacity={1} fill="url(#colorRevenue)" name="Actual Revenue" />
            <Line type="monotone" dataKey="target" stroke="#FF6B35" strokeDasharray="5 5" name="Target" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Agent */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales by Agent</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#16A39E" name="Units Sold" />
              <Bar dataKey="revenue" fill="#FF6B35" name="Revenue (KES)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Phone Model */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Distribution by Model</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={modelSalesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {modelSalesData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Agent Performance Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Agent</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Units Sold</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Total Revenue</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Avg Deal Value</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {salesSummary.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.agent}</td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {row.sales}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-gray-900">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-600">
                    {formatCurrency(row.avgDeal)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <div className="flex items-center justify-end">
                      <div className="w-12 h-2 bg-gray-200 rounded-full mr-2">
                        <div
                          className="h-2 bg-primary rounded-full"
                          style={{ width: `${row.conversionRate}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-600 font-medium">{row.conversionRate.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
          <h3 className="font-semibold text-gray-900 mb-2">Top Performer</h3>
          <p className="text-2xl font-bold text-primary">James Mwangi</p>
          <p className="text-sm text-gray-600 mt-1">32 units sold • 267,000 KES revenue</p>
        </div>

        <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg p-6 border border-secondary/20">
          <h3 className="font-semibold text-gray-900 mb-2">Best Selling Model</h3>
          <p className="text-2xl font-bold text-secondary">Samsung A05</p>
          <p className="text-sm text-gray-600 mt-1">42 units sold • 198,000 KES revenue</p>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="font-semibold text-gray-900 mb-2">Period Summary</h3>
          <p className="text-2xl font-bold text-green-600">145 Units</p>
          <p className="text-sm text-gray-600 mt-1">1.34M KES total revenue this period</p>
        </div>
      </div>
    </div>
  );
}
