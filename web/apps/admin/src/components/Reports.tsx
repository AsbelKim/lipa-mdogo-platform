'use client';

import { useState } from 'react';
import {
  generateSalesReportPDF,
  generateCustomersReportPDF,
  generateAgentPerformancePDF,
  generateSalesExcel,
  generateCustomersExcel,
  generateAgentsExcel,
  generateInventoryExcel,
} from '../utils/exportHelpers';

interface Report {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export default function Reports() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');

  const reports: Report[] = [
    {
      id: 'sales',
      title: 'Sales Report',
      description: 'Complete sales transactions, revenue, and payment tracking',
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'customers',
      title: 'Customers Report',
      description: 'Customer list, contact info, next of kin, and purchase history',
      icon: '👥',
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'agents',
      title: 'Sales Agents Report',
      description: 'Agent performance, locations, sales metrics, and conversion rates',
      icon: '👨‍💼',
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'inventory',
      title: 'Phone Inventory Report',
      description: 'All phones in stock with IMEI, serial numbers, and conditions',
      icon: '📱',
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'payments',
      title: 'Payment Tracking Report',
      description: 'Payment history, methods, and outstanding balances',
      icon: '💳',
      color: 'from-pink-500 to-pink-600',
    },
    {
      id: 'analytics',
      title: 'Analytics Summary',
      description: 'Revenue trends, performance metrics, and KPIs',
      icon: '📈',
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  // Mock data for reports
  const mockSalesData = [
    { date: '2026-08-10', customer: 'John Kipchoge', phone: 'Samsung A05', agent: 'Michael', price: 18500, paid: 4500 },
    { date: '2026-08-09', customer: 'Jane Smith', phone: 'Samsung A06', agent: 'Rose', price: 22000, paid: 2400 },
    { date: '2026-08-08', customer: 'Peter Otieno', phone: 'Samsung A16', agent: 'James', price: 28000, paid: 3450 },
    { date: '2026-08-07', customer: 'Alice Njeri', phone: 'Samsung A05', agent: 'Fatima', price: 18500, paid: 3000 },
    { date: '2026-08-06', customer: 'Bob Kipchoge', phone: 'Samsung A26', agent: 'David', price: 32000, paid: 4800 },
  ];

  const mockCustomersData = [
    {
      fullName: 'John Mwangi Kipchoge',
      nationalId: '12345678',
      phone: '+254712345678',
      email: 'john.kipchoge@email.com',
      location: 'Nairobi',
      purchases: 3,
      totalSpent: 65500,
      nokName: 'Mary Wanjiru Kipchoge',
      nokPhone: '+254722111111',
    },
    {
      fullName: 'Jane Adhiambo Smith',
      nationalId: '87654321',
      phone: '+254712345679',
      email: 'jane.smith@email.com',
      location: 'Mombasa',
      purchases: 2,
      totalSpent: 50000,
      nokName: 'David Smith Adhiambo',
      nokPhone: '+254722222222',
    },
    {
      fullName: 'Peter Johnson Otieno',
      nationalId: '11223344',
      phone: '+254712345680',
      email: 'peter.otieno@email.com',
      location: 'Kisumu',
      purchases: 1,
      totalSpent: 28000,
      nokName: 'Sarah Otieno Johnson',
      nokPhone: '+254722333333',
    },
  ];

  const mockAgentsData = [
    {
      name: 'Michael Kipchoge',
      email: 'michael@watucredit.co.ke',
      phone: '+254787654321',
      location: 'Nairobi - CBD',
      region: 'Nairobi',
      unitsSold: 28,
      revenue: 245000,
      conversionRate: 68.5,
    },
    {
      name: 'Rose Tata',
      email: 'rose@watucredit.co.ke',
      phone: '+254787654322',
      location: 'Nairobi - Westlands',
      region: 'Nairobi',
      unitsSold: 24,
      revenue: 198000,
      conversionRate: 64.3,
    },
    {
      name: 'James Mwangi',
      email: 'james@watucredit.co.ke',
      phone: '+254787654323',
      location: 'Mombasa - Kenyatta Avenue',
      region: 'Mombasa',
      unitsSold: 32,
      revenue: 267000,
      conversionRate: 71.2,
    },
  ];

  const mockInventoryData = [
    {
      model: 'Samsung Galaxy A05',
      imei: '123456789012345',
      serialNumber: 'SN001',
      status: 'in-stock',
      condition: 'new',
      dateAdded: '2026-08-01',
    },
    {
      model: 'Samsung Galaxy A05',
      imei: '123456789012346',
      serialNumber: 'SN002',
      status: 'sold',
      condition: 'new',
      dateAdded: '2026-08-01',
    },
    {
      model: 'Samsung Galaxy A06',
      imei: '234567890123456',
      serialNumber: 'SN003',
      status: 'in-stock',
      condition: 'refurbished',
      dateAdded: '2026-08-02',
    },
  ];

  const handleDownloadReport = async (reportId: string) => {
    setIsLoading(true);

    try {
      const timestamp = new Date().toISOString().slice(0, 10);

      if (reportId === 'sales') {
        if (selectedFormat === 'pdf') {
          generateSalesReportPDF(mockSalesData, `Sales_Report_${timestamp}`);
        } else if (selectedFormat === 'excel') {
          generateSalesExcel(mockSalesData, `Sales_Report_${timestamp}`);
        }
      } else if (reportId === 'customers') {
        if (selectedFormat === 'pdf') {
          generateCustomersReportPDF(
            mockCustomersData.map((c) => ({
              name: c.fullName,
              phone: c.phone,
              email: c.email,
              location: c.location,
              purchases: c.purchases,
              spent: c.totalSpent,
              nok: c.nokName,
            })),
            `Customers_Report_${timestamp}`
          );
        } else if (selectedFormat === 'excel') {
          generateCustomersExcel(mockCustomersData, `Customers_Report_${timestamp}`);
        }
      } else if (reportId === 'agents') {
        if (selectedFormat === 'pdf') {
          generateAgentPerformancePDF(
            mockAgentsData.map((a) => ({
              name: a.name,
              location: a.location,
              sold: a.unitsSold,
              revenue: a.revenue,
              conversionRate: a.conversionRate,
            })),
            `Agents_Report_${timestamp}`
          );
        } else if (selectedFormat === 'excel') {
          generateAgentsExcel(mockAgentsData, `Agents_Report_${timestamp}`);
        }
      } else if (reportId === 'inventory') {
        if (selectedFormat === 'excel') {
          generateInventoryExcel(mockInventoryData, `Inventory_Report_${timestamp}`);
        } else if (selectedFormat === 'pdf') {
          alert('PDF export for inventory report coming soon');
        }
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📄 Reports & Exports</h1>
        <p className="text-gray-600 mt-1">Generate and download business reports in multiple formats</p>
      </div>

      {/* Format Selector */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Export Format</h2>
        <div className="flex gap-3 flex-wrap">
          {(['pdf', 'excel'] as const).map((format) => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                selectedFormat === format
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {format === 'pdf' && '📄 PDF'}
              {format === 'excel' && '📊 Excel'}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-600 mt-3">
          {selectedFormat === 'pdf' && 'Professional PDF format - Perfect for sharing and printing'}
          {selectedFormat === 'excel' && 'Excel format - Easy to analyze and manipulate data'}
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
            {/* Header with icon and color */}
            <div className={`bg-gradient-to-r ${report.color} p-6 text-white`}>
              <div className="text-4xl mb-2">{report.icon}</div>
              <h3 className="text-xl font-bold">{report.title}</h3>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-sm">{report.description}</p>

              <div className="bg-gray-50 rounded p-3">
                <p className="text-xs text-gray-600">
                  {report.id === 'sales' && '✓ Transaction details\n✓ Revenue breakdown\n✓ Payment status\n✓ Outstanding amounts'}
                  {report.id === 'customers' && '✓ Contact information\n✓ Next of kin details\n✓ Purchase history\n✓ Total spent'}
                  {report.id === 'agents' && '✓ Performance metrics\n✓ Units sold\n✓ Revenue generated\n✓ Conversion rates'}
                  {report.id === 'inventory' && '✓ IMEI tracking\n✓ Serial numbers\n✓ Stock status\n✓ Condition info'}
                  {report.id === 'payments' && '✓ Payment history\n✓ Methods used\n✓ Dates and amounts\n✓ Status tracking'}
                  {report.id === 'analytics' && '✓ Revenue trends\n✓ Performance KPIs\n✓ Growth metrics\n✓ Comparisons'}
                </p>
              </div>

              <button
                onClick={() => handleDownloadReport(report.id)}
                disabled={isLoading}
                className={`w-full py-2 rounded-lg font-medium transition ${
                  isLoading
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r ' +
                      report.color +
                      ' text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {isLoading ? '⏳ Generating...' : '⬇️ Download ' + selectedFormat.toUpperCase()}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">💡 Report Information</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ All reports include current date and summary statistics</li>
          <li>✓ Data is generated fresh each time for accuracy</li>
          <li>✓ PDF reports are formatted for printing</li>
          <li>✓ Excel reports can be further analyzed and customized</li>
          <li>✓ Word documents are editable and can be customized</li>
        </ul>
      </div>
    </div>
  );
}
