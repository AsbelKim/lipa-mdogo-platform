'use client';

import { useState, useEffect } from 'react';

export default function MyStock() {
  const [stock, setStock] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const agentId = localStorage.getItem('agent_id');
    const allocations = localStorage.getItem('agentAllocations');

    if (allocations && agentId) {
      try {
        const allAllocations = JSON.parse(allocations);
        const agentStock = allAllocations.filter((a: any) => a.agentId === agentId);
        setStock(agentStock);
      } catch (e) {
        console.error('Failed to load stock:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <div className="text-center py-8">Loading stock...</div>;
  }

  const inStock = stock.filter((s) => s.status === 'in-stock');
  const sold = stock.filter((s) => s.status === 'sold');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">📱 My Stock</h1>
        <p className="text-gray-600 mt-1">View phones allocated to you and their status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Total Allocated</p>
          <p className="text-3xl font-bold text-blue-600">{stock.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Available</p>
          <p className="text-3xl font-bold text-green-600">{inStock.length}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">Sold</p>
          <p className="text-3xl font-bold text-purple-600">{sold.length}</p>
        </div>
      </div>

      {/* Available Stock */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">✅ Available (Ready to Sell)</h2>
        {inStock.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-gray-500">No phones available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {inStock.map((phone) => (
              <div key={phone.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{phone.model}</p>
                    <p className="text-sm text-gray-600">IMEI: {phone.imei}</p>
                    <p className="text-sm text-gray-600">Serial: {phone.serialNumber}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-600 text-white text-sm rounded-full font-medium">In Stock</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sold Phones */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-3">✓ Sold</h2>
        {sold.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-gray-500">No phones sold yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sold.map((phone) => (
              <div key={phone.id} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{phone.model}</p>
                    <p className="text-sm text-gray-600">IMEI: {phone.imei}</p>
                  </div>
                  <span className="px-3 py-1 bg-purple-600 text-white text-sm rounded-full font-medium">Sold</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
