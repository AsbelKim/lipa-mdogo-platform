'use client';

import { useQuery } from '@lipa/core';
import { deviceApi } from '@lipa/core';

export default function AgentHome() {
  const { data, loading } = useQuery(() =>
    deviceApi.list(1, 10).then(r => r.data)
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{loading ? '...' : data?.data.length || 0}</p>
          <p className="text-xs text-gray-600">Devices</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600">0</p>
          <p className="text-xs text-gray-600">Sales</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">0</p>
          <p className="text-xs text-gray-600">Leads</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
        <div className="space-y-2">
          <button className="w-full bg-primary hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition">
            ➕ Add Lead
          </button>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition">
            🎁 Create Sale
          </button>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition">
            💳 Log Payment
          </button>
        </div>
      </div>

      {/* Available Devices */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Assigned Devices</h2>
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : data && data.data.length > 0 ? (
          <div className="space-y-2">
            {data.data.slice(0, 5).map((device) => (
              <div key={device.id} className="bg-white p-3 rounded-lg shadow">
                <p className="font-semibold text-gray-900">{device.model}</p>
                <p className="text-sm text-gray-600">IMEI: {device.imei}</p>
                <span className="inline-block mt-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  {device.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-4 shadow text-center text-gray-600">
            No devices assigned yet
          </div>
        )}
      </div>
    </div>
  );
}
