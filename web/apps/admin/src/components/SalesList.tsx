'use client';

import { useQuery, formatCurrency } from '@lipa/core';
import { saleApi } from '@lipa/core';

export default function SalesList() {
  const { data, loading, error } = useQuery(() =>
    saleApi.list(1, 20).then(r => r.data)
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Sales & Financing</h1>
        <button className="px-4 py-2 bg-primary hover:bg-emerald-700 text-white rounded-lg transition">
          + Create Sale
        </button>
      </div>

      {loading && <p className="text-gray-600">Loading sales...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Monthly</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Duration</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.data.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(sale.amount, sale.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatCurrency(sale.monthly_payment, sale.currency)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sale.duration_months}M</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        sale.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : sale.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm">
                    <button className="text-primary hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
