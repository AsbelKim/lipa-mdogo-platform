'use client';

import { useState, useEffect } from 'react';
import { SAMPLE_ADMINS, AdminRole, ADMIN_ROLES, AdminUser } from '../types/admins';
import Modal from './Modal';
import { showToast } from './Toast';

export default function AdminManagement() {
  const [admins, setAdmins] = useState(SAMPLE_ADMINS);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin' as AdminRole,
    department: '',
  });

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

  const handleAddAdmin = () => {
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      department: formData.department,
      status: 'active',
      createdDate: new Date().toISOString(),
      permissions: ADMIN_ROLES[formData.role].permissions,
    };

    setAdmins([...admins, newAdmin]);
    setFormData({ name: '', email: '', password: '', role: 'admin', department: '' });
    setShowAddModal(false);
    showToast(`✓ Admin "${formData.name}" added successfully!`, 'success');
  };

  const handleEditAdmin = () => {
    if (!selectedAdmin || !formData.name || !formData.email) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const updated = admins.map(a =>
      a.id === selectedAdmin.id
        ? {
            ...a,
            name: formData.name,
            email: formData.email,
            password: formData.password || a.password,
            role: formData.role,
            department: formData.department,
            permissions: ADMIN_ROLES[formData.role].permissions,
          }
        : a
    );

    setAdmins(updated);
    setShowEditModal(false);
    setSelectedAdmin(null);
    setFormData({ name: '', email: '', password: '', role: 'admin', department: '' });
    showToast(`✓ Admin updated successfully!`, 'success');
  };

  const handleDeactivateAdmin = (admin: AdminUser) => {
    if (admin.id === currentAdmin?.id) {
      showToast('Cannot deactivate your own account!', 'error');
      return;
    }

    const updated = admins.map(a =>
      a.id === admin.id ? { ...a, status: 'inactive' as const } : a
    );
    setAdmins(updated);
    showToast(`✓ Admin "${admin.name}" deactivated!`, 'warning');
  };

  const handleReactivateAdmin = (admin: AdminUser) => {
    const updated = admins.map(a =>
      a.id === admin.id ? { ...a, status: 'active' as const } : a
    );
    setAdmins(updated);
    showToast(`✓ Admin "${admin.name}" reactivated!`, 'success');
  };

  const handleDeleteAdmin = (admin: AdminUser) => {
    if (admin.id === currentAdmin?.id) {
      showToast('Cannot delete your own account!', 'error');
      return;
    }

    const updated = admins.filter(a => a.id !== admin.id);
    setAdmins(updated);
    showToast(`✓ Admin "${admin.name}" deleted!`, 'error');
  };

  const openEditModal = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '',
      role: admin.role,
      department: admin.department || '',
    });
    setShowEditModal(true);
  };

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
          <p className="text-gray-600 mt-1">Add, edit, or remove admin accounts</p>
        </div>
        <button
          onClick={() => {
            setFormData({ name: '', email: '', password: '', role: 'admin', department: '' });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-primary hover:bg-emerald-700 text-white rounded-lg transition font-medium"
        >
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
      <div className="bg-white rounded-lg shadow overflow-x-auto">
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
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">👤 You</span>
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
                  <button
                    onClick={() => openEditModal(admin)}
                    disabled={currentAdmin?.id === admin.id}
                    className="text-blue-600 hover:text-blue-900 font-medium disabled:text-gray-400"
                  >
                    ✏️ Edit
                  </button>
                  {admin.status === 'active' ? (
                    <button
                      onClick={() => handleDeactivateAdmin(admin)}
                      disabled={currentAdmin?.id === admin.id}
                      className="text-amber-600 hover:text-amber-900 font-medium disabled:text-gray-400"
                    >
                      🔒 Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReactivateAdmin(admin)}
                      className="text-green-600 hover:text-green-900 font-medium"
                    >
                      ✓ Reactivate
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAdmin(admin)}
                    disabled={currentAdmin?.id === admin.id}
                    className="text-red-600 hover:text-red-900 font-medium disabled:text-gray-400"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Admin Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Admin"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter secure password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="admin">📊 Admin (Standard)</option>
                <option value="restricted-admin">🔒 Restricted Admin</option>
                <option value="super-admin">👑 Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Department (Optional)</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Sales, Operations"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleAddAdmin}
                className="flex-1 px-4 py-3 bg-primary hover:bg-emerald-700 text-white rounded-lg transition font-bold"
              >
                ✓ Add Admin
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Admin Modal */}
      {showEditModal && selectedAdmin && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title={`Edit Admin: ${selectedAdmin.name}`}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Password (Leave blank to keep current)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="New password (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as AdminRole })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="admin">📊 Admin (Standard)</option>
                <option value="restricted-admin">🔒 Restricted Admin</option>
                <option value="super-admin">👑 Super Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Department (Optional)</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleEditAdmin}
                className="flex-1 px-4 py-3 bg-primary hover:bg-emerald-700 text-white rounded-lg transition font-bold"
              >
                ✓ Update Admin
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-lg transition font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

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
