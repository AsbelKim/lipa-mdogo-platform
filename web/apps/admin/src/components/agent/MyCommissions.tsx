'use client';

import { useEffect, useState } from 'react';
import { showToast } from '../Toast';

interface CommissionRecord {
  receiptId: string;
  customerName: string;
  amount: number;
  commission: number; // 12% of amount
  commissionRate: number;
  date: string;
  status: 'pending' | 'approved' | 'paid';
}

const COMMISSION_RATE = 0.12; // 12%

export default function MyCommissions() {
  const [commissions, setCommissions] = useState<CommissionRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [totals, setTotals] = useState({
    totalSales: 0,
    totalCommission: 0,
    pendingCommission: 0,
    approvedCommission: 0,
    paidCommission: 0,
  });

  useEffect(() => {
    loadCommissions();
  }, []);

  const loadCommissions = () => {
    const agentName = localStorage.getItem('agent_name');
    const requests = localStorage.getItem('receiptRequests');

    if (requests && agentName) {
      try {
        const allRequests = JSON.parse(requests);
        const agentRequests = allRequests.filter(
          (r: any) => r.agentName === agentName && r.status === 'ready' && r.receiptId
        );

        const commissionRecords: CommissionRecord[] = agentRequests.map((req: any) => {
          const commission = req.amount * COMMISSION_RATE;
          return {
            receiptId: req.receiptId,
            customerName: req.customerName,
            amount: req.amount,
            commission: Math.round(commission),
            commissionRate: COMMISSION_RATE * 100,
            date: req.approvedDate || req.createdDate,
            status: 'approved', // Receipts that are ready are approved
          };
        });

        setCommissions(commissionRecords);

        // Calculate totals
        const totalSales = commissionRecords.reduce((sum, c) => sum + c.amount, 0);
        const totalCommission = commissionRecords.reduce((sum, c) => sum + c.commission, 0);
        const pendingCommission = commissionRecords
          .filter((c) => c.status === 'pending')
          .reduce((sum, c) => sum + c.commission, 0);
        const approvedCommission = commissionRecords
          .filter((c) => c.status === 'approved')
          .reduce((sum, c) => sum + c.commission, 0);
        const paidCommission = commissionRecords
          .filter((c) => c.status === 'paid')
          .reduce((sum, c) => sum + c.commission, 0);

        setTotals({
          totalSales,
          totalCommission,
          pendingCommission,
          approvedCommission,
          paidCommission,
        });
      } catch (e) {
        console.error('Failed to load commissions:', e);
      }
    }
    setIsLoaded(true);
  };

  const downloadReceiptPDF = async (commission: CommissionRecord) => {
    try {
      const { generateReceiptPDF } = await import('../../utils/pdfReceiptGenerator');

      generateReceiptPDF({
        receiptId: commission.receiptId,
        customerName: commission.customerName,
        customerPhone: '', // Get from requests
        amount: commission.amount,
        description: `Sale Transaction - ${commission.receiptId}`,
        agentName: localStorage.getItem('agent_name') || '',
        approvalDate: commission.date,
      });

      showToast(`Receipt ${commission.receiptId} downloaded as PDF`, 'success');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      showToast('Failed to generate receipt PDF', 'error');
    }
  };

  if (!isLoaded) {
    return <div className="text-center py-8">Loading commissions...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">💵 My Commissions</h1>
        <p className="text-gray-600 mt-1">Track your 12% commissions on all approved sales</p>
      </div>

      {/* Commission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total Sales */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">KES {totals.totalSales.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">from all sales</p>
        </div>

        {/* Total Commission */}
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Total Commission</p>
          <p className="text-2xl font-bold text-green-600 mt-2">KES {totals.totalCommission.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">12% earnings</p>
        </div>

        {/* Pending */}
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">KES {totals.pendingCommission.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">awaiting approval</p>
        </div>

        {/* Approved */}
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            KES {totals.approvedCommission.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">ready to pay</p>
        </div>

        {/* Paid */}
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <p className="text-sm text-gray-600">Paid Out</p>
          <p className="text-2xl font-bold text-emerald-600 mt-2">KES {totals.paidCommission.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">completed</p>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📊 Commission Breakdown</h2>

        {commissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No approved commissions yet. Submit receipts to start earning!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Receipt ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Sale Amount</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Commission (12%)</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((record, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm text-gray-700">{record.receiptId}</td>
                    <td className="py-3 px-4 text-gray-700">{record.customerName}</td>
                    <td className="py-3 px-4 text-right text-gray-900 font-semibold">
                      KES {record.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-green-600 font-bold text-lg">
                        KES {record.commission.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {record.status === 'pending' && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                          ⏳ Pending
                        </span>
                      )}
                      {record.status === 'approved' && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                          ✅ Approved
                        </span>
                      )}
                      {record.status === 'paid' && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          💰 Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
        <p className="text-sm text-green-800">
          <strong>💡 How it works:</strong> You earn <strong>12% commission</strong> on every approved sale. When you submit a receipt request and admin generates the receipt, your commission is automatically calculated. Submit more receipts to earn more!
        </p>
      </div>

      {/* Commission Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Commission Examples</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Sale of KES 10,000</span>
            <span className="font-bold text-green-600">KES 1,200 commission (12%)</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Sale of KES 18,500</span>
            <span className="font-bold text-green-600">KES 2,220 commission (12%)</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">Sale of KES 25,000</span>
            <span className="font-bold text-green-600">KES 3,000 commission (12%)</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Sale of KES 50,000</span>
            <span className="font-bold text-green-600">KES 6,000 commission (12%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
