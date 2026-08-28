export type AdminRole = 'super-admin' | 'admin' | 'restricted-admin';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  department?: string;
  status: 'active' | 'inactive';
  createdDate: string;
  lastLogin?: string;
  permissions: {
    manageReceipts: boolean;
    manageAgents: boolean;
    manageInventory: boolean;
    manageAdmins: boolean;
    viewReports: boolean;
    manageCustomers: boolean;
    approveSales: boolean;
  };
}

export const ADMIN_ROLES = {
  'super-admin': {
    label: 'Super Admin',
    description: 'Full access to all features',
    color: 'bg-purple-600',
    permissions: {
      manageReceipts: true,
      manageAgents: true,
      manageInventory: true,
      manageAdmins: true,
      viewReports: true,
      manageCustomers: true,
      approveSales: true,
    },
  },
  'admin': {
    label: 'Admin',
    description: 'Standard admin operations',
    color: 'bg-blue-600',
    permissions: {
      manageReceipts: true,
      manageAgents: true,
      manageInventory: true,
      manageAdmins: false,
      viewReports: true,
      manageCustomers: true,
      approveSales: true,
    },
  },
  'restricted-admin': {
    label: 'Restricted Admin',
    description: 'Limited access to specific features',
    color: 'bg-amber-600',
    permissions: {
      manageReceipts: true,
      manageAgents: false,
      manageInventory: false,
      manageAdmins: false,
      viewReports: true,
      manageCustomers: false,
      approveSales: false,
    },
  },
};

export const SAMPLE_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'James Omondi',
    email: 'james@watucredit.co.ke',
    password: 'password123',
    role: 'super-admin',
    department: 'Operations',
    status: 'active',
    createdDate: new Date('2024-01-15').toISOString(),
    lastLogin: new Date().toISOString(),
    permissions: ADMIN_ROLES['super-admin'].permissions,
  },
  {
    id: 'admin-2',
    name: 'Sarah Kipchoge',
    email: 'sarah@watucredit.co.ke',
    password: 'password123',
    role: 'admin',
    department: 'Sales',
    status: 'active',
    createdDate: new Date('2024-02-01').toISOString(),
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    permissions: ADMIN_ROLES['admin'].permissions,
  },
  {
    id: 'admin-3',
    name: 'Peter Gitau',
    email: 'peter@watucredit.co.ke',
    password: 'password123',
    role: 'restricted-admin',
    department: 'Finance',
    status: 'active',
    createdDate: new Date('2024-03-10').toISOString(),
    lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    permissions: ADMIN_ROLES['restricted-admin'].permissions,
  },
  {
    id: 'admin-4',
    name: 'Grace Mwangi',
    email: 'grace@watucredit.co.ke',
    password: 'password123',
    role: 'admin',
    department: 'Inventory',
    status: 'inactive',
    createdDate: new Date('2024-01-20').toISOString(),
    permissions: ADMIN_ROLES['admin'].permissions,
  },
];
