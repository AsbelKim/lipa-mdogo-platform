'use client';

import { useEffect, useState } from 'react';
import { PlusIcon, ShoppingIcon, CreditCardIcon, Icon } from './Icons';
import AddLeadModal from './AddLeadModal';
import { Device, Sale, Lead } from '@core/types';

interface AgentHomeProps {
  agentId?: string;
}

export default function AgentHome({ agentId }: AgentHomeProps) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [stats, setStats] = useState({ sales: 0, leads: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch assigned devices
        const devicesRes = await fetch('/api/devices?status=assigned');
        if (devicesRes.ok) {
          const devicesData = await devicesRes.json();
          const assignedDevices = devicesData.data.filter(
            (d: Device) => d.assigned_agent_id === agentId
          );
          setDevices(assignedDevices);
        }

        // Fetch agent's sales count
        if (agentId) {
          const salesRes = await fetch(`/api/agents/${agentId}/sales`);
          if (salesRes.ok) {
            const salesData = await salesRes.json();
            setStats((prev) => ({ ...prev, sales: salesData.data?.length || 0 }));
          }

          // Fetch agent's leads count
          const leadsRes = await fetch(`/api/agents/${agentId}/leads`);
          if (leadsRes.ok) {
            const leadsData = await leadsRes.json();
            setStats((prev) => ({ ...prev, leads: leadsData.data?.length || 0 }));
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchData();
    }
  }, [agentId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-4 shadow text-center text-gray-600">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-blue-600">{devices.length}</p>
          <p className="text-xs text-gray-600">Devices</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.sales}</p>
          <p className="text-xs text-gray-600">Sales</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <p className="text-2xl font-bold text-amber-600">{stats.leads}</p>
          <p className="text-xs text-gray-600">Leads</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
        <div className="space-y-2">
          <button
            onClick={() => setShowAddLeadModal(true)}
            className="w-full bg-primary hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Icon icon={PlusIcon} size="md" className="text-white" />
            Add Lead
          </button>
          <button
            onClick={() => alert('Sale creation modal coming soon')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Icon icon={ShoppingIcon} size="md" className="text-white" />
            Create Sale
          </button>
          <button
            onClick={() => alert('Payment logging modal coming soon')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Icon icon={CreditCardIcon} size="md" className="text-white" />
            Log Payment
          </button>
        </div>
      </div>

      {/* Add Lead Modal */}
      {agentId && (
        <AddLeadModal
          isOpen={showAddLeadModal}
          onClose={() => setShowAddLeadModal(false)}
          agentId={agentId}
          onLeadAdded={() => {
            // Refresh leads count
            setStats((prev) => ({ ...prev, leads: prev.leads + 1 }));
          }}
        />
      )}

      {/* Available Devices */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-3">Assigned Devices</h2>
        {devices.length > 0 ? (
          <div className="space-y-2">
            {devices.map((device) => (
              <div key={device.id} className="bg-white p-3 rounded-lg shadow">
                <p className="font-semibold text-gray-900">{device.model}</p>
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
