'use client';

import { useEffect, useState } from 'react';
import { WalletIcon, TrendingIcon, Icon } from './Icons';

interface CommissionDashboardProps {
  agentId: string;
}

interface CommissionStats {
  totalSales: number;
  totalCommission: number;
  activeSales: number;
  monthlyTarget: number;
  targetProgress: number;
}

const COMMISSION_RATE = 0.12; // 12%
const MONTHLY_TARGET = 500000; // KES

export default function CommissionDashboard({ agentId }: CommissionDashboardProps) {
  const [stats, setStats] = useState<CommissionStats>({
    totalSales: 0,
    totalCommission: 0,
    activeSales: 0,
    monthlyTarget: MONTHLY_TARGET,
    targetProgress: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        setLoading(true);

        // Fetch agent's sales
        const salesResponse = await fetch(`/api/agents/${agentId}/sales`);
        if (salesResponse.ok) {
          const salesData = await salesResponse.json();
          const sales = salesData.data || [];

          // Calculate commission metrics
          const totalSales = sales.reduce((sum: number, sale: any) => sum + (sale.amount || 0), 0);
          const totalCommission = totalSales * COMMISSION_RATE;
          const activeSales = sales.filter((s: any) => s.status === 'active').length;
          const targetProgress = (totalSales / MONTHLY_TARGET) * 100;

          setStats({
            totalSales,
            totalCommission: Math.round(totalCommission),
            activeSales,
            monthlyTarget: MONTHLY_TARGET,
            targetProgress: Math.min(targetProgress, 100),
          });
        }
      } catch (err) {
        console.error('Failed to fetch commission data:', err);
        setError('Failed to load commission data');
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchCommissionData();
    }
  }, [agentId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-4 shadow text-center text-gray-600">
        Loading earnings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Commission Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Total Commission Card */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium">Total Earnings</p>
              <p className="text-2xl font-bold text-green-700 mt-1">
                KES {stats.totalCommission.toLocaleString()}
              </p>
              <p className="text-xs text-green-600 mt-2">12% of all sales</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        {/* Active Sales Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium">Active Deals</p>
              <p className="text-2xl font-bold text-blue-700 mt-1">{stats.activeSales}</p>
              <p className="text-xs text-blue-600 mt-2">Sales in progress</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </div>
      </div>

      {/* Sales Total Card */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-600 font-medium">Total Sales Volume</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              KES {stats.totalSales.toLocaleString()}
            </p>
          </div>
          <Icon icon={TrendingIcon} size="lg" className="text-primary" />
        </div>
      </div>

      {/* Monthly Target Progress */}
      <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">Monthly Target Progress</p>
          <span className="text-xs font-semibold text-primary">
            {Math.round(stats.targetProgress)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-500"
            style={{ width: `${stats.targetProgress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-600">
          <span>
            KES {stats.totalSales.toLocaleString()} / KES {stats.monthlyTarget.toLocaleString()}
          </span>
          {stats.targetProgress >= 100 && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
              ✓ Target Reached!
            </span>
          )}
        </div>
      </div>

      {/* Earning Breakdown */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
        <p className="text-sm font-medium text-gray-700 mb-3">Earning Breakdown</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Commission Rate:</span>
            <span className="font-semibold text-gray-900">12%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Average per Sale:</span>
            <span className="font-semibold text-gray-900">
              {stats.activeSales > 0
                ? `KES ${Math.round(stats.totalCommission / stats.activeSales).toLocaleString()}`
                : 'No sales yet'}
            </span>
          </div>
          <div className="border-t border-amber-300 pt-2 mt-2 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">Potential Next Sale:</span>
            <span className="font-bold text-amber-700">KES 6,000</span>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <p className="text-xs font-semibold text-blue-700 mb-2">💡 Earning Tips:</p>
        <ul className="text-xs text-blue-600 space-y-1">
          <li>• Larger sale amounts = bigger commissions</li>
          <li>• Longer financing terms = steadier income</li>
          <li>• Hit monthly target to unlock bonuses</li>
        </ul>
      </div>
    </div>
  );
}
