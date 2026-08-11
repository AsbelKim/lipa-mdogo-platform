export interface SalesAgent {
  id: string;
  name: string;
  email: string;
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

// Mock Sales Agents Data
export const SALES_AGENTS: SalesAgent[] = [
  {
    id: 'agent-1',
    name: 'James Kipchoge',
    email: 'james.kipchoge@watucredit.co.ke',
    phone: '+254712345678',
    location: 'Nairobi - CBD',
    region: 'Nairobi',
    joinDate: '2025-06-01',
    status: 'active',
    totalSales: 24,
    totalRevenue: 450000,
  },
  {
    id: 'agent-2',
    name: 'Grace Adhiambo',
    email: 'grace.adhiambo@watucredit.co.ke',
    phone: '+254712345679',
    location: 'Nairobi - Westlands',
    region: 'Nairobi',
    joinDate: '2025-07-15',
    status: 'active',
    totalSales: 18,
    totalRevenue: 320000,
  },
  {
    id: 'agent-3',
    name: 'Peter Mwangi',
    email: 'peter.mwangi@watucredit.co.ke',
    phone: '+254712345680',
    location: 'Mombasa - Kenyatta Avenue',
    region: 'Mombasa',
    joinDate: '2025-05-20',
    status: 'active',
    totalSales: 32,
    totalRevenue: 580000,
  },
  {
    id: 'agent-4',
    name: 'Susan Kariuki',
    email: 'susan.kariuki@watucredit.co.ke',
    phone: '+254712345681',
    location: 'Kisumu - Town Centre',
    region: 'Kisumu',
    joinDate: '2025-08-01',
    status: 'active',
    totalSales: 12,
    totalRevenue: 220000,
  },
  {
    id: 'agent-5',
    name: 'David Otieno',
    email: 'david.otieno@watucredit.co.ke',
    phone: '+254712345682',
    location: 'Nakuru - Central',
    region: 'Nakuru',
    joinDate: '2025-06-10',
    status: 'active',
    totalSales: 21,
    totalRevenue: 390000,
  },
  {
    id: 'agent-6',
    name: 'Monica Njeri',
    email: 'monica.njeri@watucredit.co.ke',
    phone: '+254712345683',
    location: 'Nairobi - South B',
    region: 'Nairobi',
    joinDate: '2025-07-20',
    status: 'active',
    totalSales: 15,
    totalRevenue: 280000,
  },
  {
    id: 'agent-7',
    name: 'Raphael Kipchoge',
    email: 'raphael.kipchoge@watucredit.co.ke',
    phone: '+254712345684',
    location: 'Eldoret - Town',
    region: 'Eldoret',
    joinDate: '2025-08-05',
    status: 'active',
    totalSales: 8,
    totalRevenue: 150000,
  },
  {
    id: 'agent-8',
    name: 'Fatima Hassan',
    email: 'fatima.hassan@watucredit.co.ke',
    phone: '+254712345685',
    location: 'Mombasa - Old Town',
    region: 'Mombasa',
    joinDate: '2025-06-25',
    status: 'active',
    totalSales: 19,
    totalRevenue: 340000,
  },
  {
    id: 'agent-9',
    name: 'Charles Kiplagat',
    email: 'charles.kiplagat@watucredit.co.ke',
    phone: '+254712345686',
    location: 'Kericho - Central',
    region: 'Kericho',
    joinDate: '2025-07-05',
    status: 'active',
    totalSales: 11,
    totalRevenue: 200000,
  },
  {
    id: 'agent-10',
    name: 'Amelia Rotich',
    email: 'amelia.rotich@watucredit.co.ke',
    phone: '+254712345687',
    location: 'Nairobi - Eastlands',
    region: 'Nairobi',
    joinDate: '2025-08-10',
    status: 'active',
    totalSales: 6,
    totalRevenue: 110000,
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
