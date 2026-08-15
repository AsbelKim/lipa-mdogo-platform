'use client';

import { useState, useEffect } from 'react';
import { SAMPLE_ADMINS, AdminRole, ADMIN_ROLES } from '../types/admins';

export default function AdminManagement() {
  const [admins] = useState(SAMPLE_ADMINS);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (adminData) {
      setCurrentAdmin(JSON.parse(adminData));
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: AdminRole) => {
    return ADMIN_ROLES[role]?.color || 'bg-gray-600';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const canManageAdmins = currentAdmin?.permissions?.manageAdmins;

  if (!canManageAdmins) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-semibold">🔒 Access Denied</p>
        <p className="text-sm text-red-600 mt-2">
          Only Super Admins can manage admin accounts
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👥 Admin Management</h1>
          <p className="text-gray-600 mt-1">Manage admin accounts and permissions</p>
        </div>
        <button className="px-4 py-2 bg-primary hover:bg-emerald-700 text-white rounded-lg transition font-medium">
          + Add Admin
        </button>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">Total Admins</p>
          <p className="text-3xl font-bold text-purple-600">{admins.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Active Admins</p>
          <p className="text-3xl font-bold text-green-600">{admins.filter(a => a.status === 'active').length}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Super Admins</p>
          <p className="text-3xl font-bold text-blue-600">{admins.filter(a => a.role === 'super-admin').length}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <p className="text-sm text-gray-600">Restricted Admins</p>
          <p className="text-3xl font-bold text-amber-600">{admins.filter(a => a.role === 'restricted-admin').length}</p>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Login</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900">{admin.name}</div>
                  {currentAdmin?.id === admin.id && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{admin.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getRoleColor(admin.role)}`}>
                    {ADMIN_ROLES[admin.role]?.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{admin.department || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(admin.status)}`}>
                    {admin.status === 'active' ? '✓ Active' : '○ Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {admin.lastLogin ? formatDate(admin.lastLogin) : 'Never'}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button className="text-blue-600 hover:text-blue-900 font-medium">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900 font-medium">
                    Deactivate
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permissions Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">📋 Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(ADMIN_ROLES).map(([roleKey, roleInfo]) => (
            <div key={roleKey} className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className={`font-semibold text-white px-3 py-1 rounded ${roleInfo.color} mb-3 inline-block`}>
                {roleInfo.label}
              </h4>
              <p className="text-sm text-gray-600 mb-3">{roleInfo.description}</p>
              <ul className="space-y-2 text-sm">
                {Object.entries(roleInfo.permissions).map(([perm, allowed]) => (
                  <li key={perm} className={allowed ? 'text-green-600' : 'text-gray-400'}>
                    {allowed ? '✓' : '✕'} {perm.replace(/([A-Z])/g, ' $1').trim()}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
