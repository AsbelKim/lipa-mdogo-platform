'use client';

import { useCallback, useState } from 'react';
import { deviceApi, Device } from '@lipa/core';
import { useQuery } from '@lipa/core/hooks';
import AddDeviceModal from './AddDeviceModal';
import { showToast } from './Toast';

export default function DevicesList() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const queryFn = useCallback(() => deviceApi.list(), []);
  const { data, loading, error, refetch } = useQuery(queryFn);
  const devices = data?.data ?? [];

  const handleAdd = async (device: Parameters<typeof deviceApi.create>[0]) => {
    try {
      await deviceApi.create(device);
      setIsAddOpen(false);
      showToast('Device added to inventory', 'success');
      refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Unable to add device', 'error');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Devices</h1>
        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-primary hover:bg-emerald-700 text-white rounded-lg transition">
          + Add Device
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && <p className="p-6 text-gray-500">Loading devices...</p>}
        {error && <p className="p-6 text-red-600">{error}</p>}
        {!loading && !error && <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">IMEI</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Model</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Location</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {devices.map((device: Device) => (
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{device.imei}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{device.model}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      device.status === 'in_stock'
                        ? 'bg-green-100 text-green-800'
                        : device.status === 'assigned'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {device.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{device.location}</td>
                <td className="px-6 py-4 text-right text-sm">
                  <button className="text-primary hover:underline">View</button>
                </td>
              </tr>
            ))}
            {!devices.length && <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-500">No devices found.</td></tr>}
          </tbody>
        </table>
        }
      </div>
      <AddDeviceModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
    </div>
  );
}
