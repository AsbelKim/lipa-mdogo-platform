export interface SalesAgent {
  id: string;
  name: string;
  email: string;
  password?: string; // Mock login only
  phone: string;
  location: string;
  region: string;
  joinDate: string;
  status: 'active' | 'inactive';
  totalSales: number;
  totalRevenue: number;
}

export interface PhoneAllocation {
  id: string;
  agentId: string;
  phoneModelId: string;
  quantity: number;
  allocatedDate: string;
  status: 'allocated' | 'partial' | 'completed';
}

export interface AgentInventoryItem {
  id: string;
  allocationId: string;
  agentId: string;
  phoneModelId: string;
  phoneModel: string;
  phoneSpecs: string;
  imei?: string;
  status: 'in-stock' | 'sold' | 'damaged' | 'lost';
  allocatedDate: string;
  soldDate?: string;
  saleId?: string;
}

export interface AgentInventorySummary {
  agentId: string;
  agentName: string;
  totalAllocated: number;
  totalSold: number;
  totalUnsold: number;
  totalRevenue: number;
  conversionRate: number;
}

// Mock Sales Agents Data with Login Credentials
export const SALES_AGENTS: SalesAgent[] = [
  {
    id: 'agent-1',
    name: 'Michael Kipchoge',
    email: 'michael.kipchoge@dakiro.ke',
    password: 'Agent@123',
    phone: '+254787654321',
    location: 'Kericho Town',
    region: 'Rift Valley',
    joinDate: '2025-06-01',
    status: 'active',
    totalSales: 24,
    totalRevenue: 450000,
  },
  {
    id: 'agent-2',
    name: 'Rose Tata',
    email: 'rose.tata@dakiro.ke',
    password: 'Agent@123',
    phone: '+254787654322',
    location: 'Kisii Town',
    region: 'Nyanza',
    joinDate: '2025-07-15',
    status: 'active',
    totalSales: 18,
    totalRevenue: 320000,
  },
  {
    id: 'agent-3',
    name: 'James Omondi',
    email: 'james.omondi@dakiro.ke',
    password: 'Agent@123',
    phone: '+254787654323',
    location: 'Nakuru Town',
    region: 'Rift Valley',
    joinDate: '2025-05-20',
    status: 'active',
    totalSales: 32,
    totalRevenue: 580000,
  },
  {
    id: 'agent-4',
    name: 'Grace Mwangi',
    email: 'grace.mwangi@dakiro.ke',
    password: 'Agent@123',
    phone: '+254787654324',
    location: 'Nairobi',
    region: 'Central',
    joinDate: '2025-08-01',
    status: 'active',
    totalSales: 12,
    totalRevenue: 220000,
  },
  {
    id: 'agent-5',
    name: 'Samuel Kiplagat',
    email: 'samuel.kiplagat@dakiro.ke',
    password: 'Agent@123',
    phone: '+254787654325',
    location: 'Eldoret Town',
    region: 'Rift Valley',
    joinDate: '2025-06-10',
    status: 'active',
    totalSales: 21,
    totalRevenue: 390000,
  },
];

// Mock Agent Inventory Data
export const AGENT_INVENTORY: AgentInventoryItem[] = [
  // Agent 1 - James Kipchoge
  {
    id: 'inv-1',
    allocationId: 'alloc-1',
    agentId: 'agent-1',
    phoneModelId: '1',
    phoneModel: 'Samsung Galaxy A05',
    phoneSpecs: '64GB / 4GB',
    imei: '123456789012345',
    status: 'sold',
    allocatedDate: '2026-01-05',
    soldDate: '2026-01-12',
    saleId: 'sale-1',
  },
  {
    id: 'inv-2',
    allocationId: 'alloc-1',
    agentId: 'agent-1',
    phoneModelId: '1',
    phoneModel: 'Samsung Galaxy A05',
    phoneSpecs: '64GB / 4GB',
    imei: '123456789012346',
    status: 'sold',
    allocatedDate: '2026-01-05',
    soldDate: '2026-01-15',
    saleId: 'sale-2',
  },
  {
    id: 'inv-3',
    allocationId: 'alloc-1',
    agentId: 'agent-1',
    phoneModelId: '2',
    phoneModel: 'Samsung Galaxy A06',
    phoneSpecs: '128GB / 4GB',
    imei: '123456789012347',
    status: 'in-stock',
    allocatedDate: '2026-01-05',
  },
  {
    id: 'inv-4',
    allocationId: 'alloc-1',
    agentId: 'agent-1',
    phoneModelId: '3',
    phoneModel: 'Samsung Galaxy A07',
    phoneSpecs: '128GB / 4GB',
    imei: '123456789012348',
    status: 'in-stock',
    allocatedDate: '2026-01-05',
  },
  {
    id: 'inv-5',
    allocationId: 'alloc-1',
    agentId: 'agent-1',
    phoneModelId: '4',
    phoneModel: 'Samsung Galaxy A16',
    phoneSpecs: '128GB / 8GB',
    imei: '123456789012349',
    status: 'sold',
    allocatedDate: '2026-01-05',
    soldDate: '2026-01-18',
    saleId: 'sale-3',
  },

  // Agent 2 - Grace Adhiambo
  {
    id: 'inv-6',
    allocationId: 'alloc-2',
    agentId: 'agent-2',
    phoneModelId: '2',
    phoneModel: 'Samsung Galaxy A06',
    phoneSpecs: '128GB / 4GB',
    imei: '223456789012345',
    status: 'sold',
    allocatedDate: '2026-01-08',
    soldDate: '2026-01-14',
    saleId: 'sale-4',
  },
  {
    id: 'inv-7',
    allocationId: 'alloc-2',
    agentId: 'agent-2',
    phoneModelId: '3',
    phoneModel: 'Samsung Galaxy A07',
    phoneSpecs: '128GB / 4GB',
    imei: '223456789012346',
    status: 'sold',
    allocatedDate: '2026-01-08',
    soldDate: '2026-01-16',
    saleId: 'sale-5',
  },
  {
    id: 'inv-8',
    allocationId: 'alloc-2',
    agentId: 'agent-2',
    phoneModelId: '4',
    phoneModel: 'Samsung Galaxy A16',
    phoneSpecs: '128GB / 8GB',
    imei: '223456789012347',
    status: 'in-stock',
    allocatedDate: '2026-01-08',
  },
  {
    id: 'inv-9',
    allocationId: 'alloc-2',
    agentId: 'agent-2',
    phoneModelId: '5',
    phoneModel: 'Samsung Galaxy A26 5G',
    phoneSpecs: '128GB / 6GB',
    imei: '223456789012348',
    status: 'in-stock',
    allocatedDate: '2026-01-08',
  },
  {
    id: 'inv-10',
    allocationId: 'alloc-2',
    agentId: 'agent-2',
    phoneModelId: '1',
    phoneModel: 'Samsung Galaxy A05',
    phoneSpecs: '64GB / 4GB',
    imei: '223456789012349',
    status: 'in-stock',
    allocatedDate: '2026-01-08',
  },
];
