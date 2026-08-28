// Auth
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'ops';
  company_id: string;
  created_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Device
export interface Device {
  id: string;
  imei: string;
  category: 'phone' | 'solar' | 'radio' | 'tv' | 'other';
  brand: string;
  model: string;
  specs?: Record<string, unknown> | null;
  serial_number: string;
  colour?: string | null;
  unit_cost: number;
  status: 'in_stock' | 'assigned' | 'sold' | 'repossessed' | 'lost';
  current_agent_id?: string | null;
  location?: string;
  created_at: string;
}

export type CreateDeviceInput = Omit<
  Device,
  'id' | 'status' | 'created_at' | 'current_agent_id' | 'location'
>;

// Customer
export interface Customer {
  id: string;
  national_id: string;
  name: string;
  phone: string;
  email?: string;
  location: string;
  status: 'active' | 'inactive' | 'blacklisted';
  company_id: string;
  created_at: string;
}

// Sale/Financing Agreement
export interface Sale {
  id: string;
  customer_id: string;
  device_id: string;
  amount: number;
  currency: 'KES' | 'USD';
  duration_months: number;
  monthly_payment: number;
  status: 'draft' | 'active' | 'completed' | 'defaulted';
  created_by: string;
  created_at: string;
}

// Payment
export interface Payment {
  id: string;
  sale_id: string;
  amount: number;
  currency: 'KES' | 'USD';
  payment_method: 'cash' | 'mpesa' | 'bank_transfer';
  reference: string;
  status: 'pending' | 'verified' | 'failed';
  created_by: string;
  created_at: string;
}

// Lead (Pre-sale)
export interface Lead {
  id: string;
  name: string;
  phone: string;
  location: string;
  device_interest?: string;
  status: 'new' | 'contacted' | 'interested' | 'converted' | 'rejected';
  created_by: string;
  company_id: string;
  created_at: string;
}

// API Errors
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}
