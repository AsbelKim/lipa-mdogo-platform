// Sample data for testing - loads if localStorage is empty

export const SAMPLE_CUSTOMERS = [
  // Agent 1 - Michael Kipchoge
  {
    id: 'cust-1',
    agentId: 'agent-1',
    name: 'John Mwangi',
    phone: '+254712345600',
    email: 'john.mwangi@gmail.com',
    nationalId: '123456789',
    location: 'Kericho CBD',
    nextOfKin: 'Mary Mwangi - 0712345601',
    status: 'active',
    createdDate: '2026-08-10T09:30:00',
    receiptRequestId: 'req-1',
  },
  {
    id: 'cust-2',
    agentId: 'agent-1',
    name: 'Jane Smith',
    phone: '+254712345601',
    email: 'jane.smith@gmail.com',
    nationalId: '987654321',
    location: 'Kericho Town',
    nextOfKin: 'David Smith - 0712345602',
    status: 'active',
    createdDate: '2026-08-11T10:15:00',
    receiptRequestId: 'req-2',
  },
  {
    id: 'cust-3',
    agentId: 'agent-1',
    name: 'Peter Kipchoge',
    phone: '+254712345602',
    email: 'peter.kipchoge@gmail.com',
    nationalId: '456789123',
    location: 'Kericho',
    nextOfKin: 'Catherine Kipchoge - 0712345603',
    status: 'active',
    createdDate: '2026-08-12T14:20:00',
    receiptRequestId: 'req-3',
  },
  {
    id: 'cust-4',
    agentId: 'agent-1',
    name: 'Sarah Kiplagat',
    phone: '+254712345603',
    email: 'sarah.kiplagat@gmail.com',
    nationalId: '234567890',
    location: 'Kisii',
    nextOfKin: 'Moses Kiplagat - 0712345604',
    status: 'active',
    createdDate: '2026-08-13T11:45:00',
  },

  // Agent 2 - Rose Tata
  {
    id: 'cust-5',
    agentId: 'agent-2',
    name: 'Grace Mwangi',
    phone: '+254712345604',
    email: 'grace.mwangi@gmail.com',
    nationalId: '567890123',
    location: 'Kisii Town',
    nextOfKin: 'Samuel Mwangi - 0712345605',
    status: 'active',
    createdDate: '2026-08-10T08:00:00',
    receiptRequestId: 'req-4',
  },
  {
    id: 'cust-6',
    agentId: 'agent-2',
    name: 'Samuel Kiplagat',
    phone: '+254712345605',
    email: 'samuel.kiplagat@gmail.com',
    nationalId: '890123456',
    location: 'Kisii',
    nextOfKin: 'Rose Kiplagat - 0712345606',
    status: 'active',
    createdDate: '2026-08-11T09:30:00',
    receiptRequestId: 'req-5',
  },

  // Agent 3 - James Omondi
  {
    id: 'cust-7',
    agentId: 'agent-3',
    name: 'David Omondi',
    phone: '+254712345606',
    email: 'david.omondi@gmail.com',
    nationalId: '678901234',
    location: 'Nakuru CBD',
    nextOfKin: 'Rebecca Omondi - 0712345607',
    status: 'active',
    createdDate: '2026-08-09T10:00:00',
    receiptRequestId: 'req-6',
  },
];

export const SAMPLE_RECEIPT_REQUESTS = [
  // Approved/Ready receipts with commissions
  {
    id: 'req-1',
    agentId: 'agent-1',
    agentName: 'Michael Kipchoge',
    customerName: 'John Mwangi',
    customerPhone: '+254712345600',
    amount: 18500,
    description: 'Samsung Galaxy A05',
    screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    status: 'ready',
    receiptId: 'RCP-1692432000001',
    createdDate: '2026-08-10T09:30:00',
    approvedDate: '2026-08-10T10:00:00',
  },
  {
    id: 'req-2',
    agentId: 'agent-1',
    agentName: 'Michael Kipchoge',
    customerName: 'Jane Smith',
    customerPhone: '+254712345601',
    amount: 25000,
    description: 'Samsung Galaxy A16',
    screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    status: 'ready',
    receiptId: 'RCP-1692432000002',
    createdDate: '2026-08-11T10:15:00',
    approvedDate: '2026-08-11T11:00:00',
  },
  {
    id: 'req-3',
    agentId: 'agent-1',
    agentName: 'Michael Kipchoge',
    customerName: 'Peter Kipchoge',
    customerPhone: '+254712345602',
    amount: 28000,
    description: 'Samsung Galaxy A26 5G',
    screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    status: 'ready',
    receiptId: 'RCP-1692432000003',
    createdDate: '2026-08-12T14:20:00',
    approvedDate: '2026-08-12T15:00:00',
  },
  {
    id: 'req-4',
    agentId: 'agent-2',
    agentName: 'Rose Tata',
    customerName: 'Grace Mwangi',
    customerPhone: '+254712345604',
    amount: 20000,
    description: 'Samsung Galaxy A06',
    screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    status: 'ready',
    receiptId: 'RCP-1692432000004',
    createdDate: '2026-08-10T08:00:00',
    approvedDate: '2026-08-10T09:00:00',
  },
  {
    id: 'req-5',
    agentId: 'agent-2',
    agentName: 'Rose Tata',
    customerName: 'Samuel Kiplagat',
    customerPhone: '+254712345605',
    amount: 30000,
    description: 'Samsung Galaxy A36',
    screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    status: 'ready',
    receiptId: 'RCP-1692432000005',
    createdDate: '2026-08-11T09:30:00',
    approvedDate: '2026-08-11T10:30:00',
  },
  {
    id: 'req-6',
    agentId: 'agent-3',
    agentName: 'James Omondi',
    customerName: 'David Omondi',
    customerPhone: '+254712345606',
    amount: 22000,
    description: 'Samsung Galaxy A16',
    screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    status: 'ready',
    receiptId: 'RCP-1692432000006',
    createdDate: '2026-08-09T10:00:00',
    approvedDate: '2026-08-09T11:00:00',
  },

  // Pending receipt requests
  {
    id: 'req-7',
    agentId: 'agent-1',
    agentName: 'Michael Kipchoge',
    customerName: 'Sarah Kiplagat',
    customerPhone: '+254712345603',
    amount: 15000,
    description: 'Samsung Galaxy A05',
    screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    status: 'pending',
    createdDate: '2026-08-13T11:45:00',
  },
  {
    id: 'req-8',
    agentId: 'agent-2',
    agentName: 'Rose Tata',
    customerName: 'Michael Kiplagat',
    customerPhone: '+254712345607',
    amount: 32000,
    description: 'Samsung Galaxy A56 5G',
    screenshot: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    status: 'pending',
    createdDate: '2026-08-13T12:30:00',
  },
];

export const SAMPLE_COMMISSIONS = [
  // Michael Kipchoge - Agent 1 (3 sales @ 12%)
  {
    receiptId: 'RCP-1692432000001',
    customerName: 'John Mwangi',
    amount: 18500,
    commission: 2220, // 18500 * 12%
    commissionRate: 12,
    date: '2026-08-10T10:00:00',
    status: 'approved',
  },
  {
    receiptId: 'RCP-1692432000002',
    customerName: 'Jane Smith',
    amount: 25000,
    commission: 3000, // 25000 * 12%
    commissionRate: 12,
    date: '2026-08-11T11:00:00',
    status: 'approved',
  },
  {
    receiptId: 'RCP-1692432000003',
    customerName: 'Peter Kipchoge',
    amount: 28000,
    commission: 3360, // 28000 * 12%
    commissionRate: 12,
    date: '2026-08-12T15:00:00',
    status: 'approved',
  },

  // Rose Tata - Agent 2 (2 sales @ 12%)
  {
    receiptId: 'RCP-1692432000004',
    customerName: 'Grace Mwangi',
    amount: 20000,
    commission: 2400, // 20000 * 12%
    commissionRate: 12,
    date: '2026-08-10T09:00:00',
    status: 'approved',
  },
  {
    receiptId: 'RCP-1692432000005',
    customerName: 'Samuel Kiplagat',
    amount: 30000,
    commission: 3600, // 30000 * 12%
    commissionRate: 12,
    date: '2026-08-11T10:30:00',
    status: 'approved',
  },

  // James Omondi - Agent 3 (1 sale @ 12%)
  {
    receiptId: 'RCP-1692432000006',
    customerName: 'David Omondi',
    amount: 22000,
    commission: 2640, // 22000 * 12%
    commissionRate: 12,
    date: '2026-08-09T11:00:00',
    status: 'approved',
  },
];

export const initializeSampleData = () => {
  // Only initialize if data doesn't exist
  if (!localStorage.getItem('agentCustomers')) {
    localStorage.setItem('agentCustomers', JSON.stringify(SAMPLE_CUSTOMERS));
  }

  if (!localStorage.getItem('receiptRequests')) {
    localStorage.setItem('receiptRequests', JSON.stringify(SAMPLE_RECEIPT_REQUESTS));
  }

  // Initialize agentAllocations if empty (for stock tracking)
  if (!localStorage.getItem('agentAllocations')) {
    const sampleAllocations = [
      {
        id: 'alloc-1',
        agentId: 'agent-1',
        model: 'Samsung Galaxy A05',
        imei: '359072080276522',
        serialNumber: 'RF9DL1A20GU',
        condition: 'new',
        status: 'sold',
        dateAllocated: '2026-08-05T09:00:00',
      },
      {
        id: 'alloc-2',
        agentId: 'agent-1',
        model: 'Samsung Galaxy A16',
        imei: '359072080276523',
        serialNumber: 'RF9DL1A20GV',
        condition: 'new',
        status: 'sold',
        dateAllocated: '2026-08-05T09:00:00',
      },
      {
        id: 'alloc-3',
        agentId: 'agent-1',
        model: 'Samsung Galaxy A26 5G',
        imei: '359072080276524',
        serialNumber: 'RF9DL1A20GW',
        condition: 'new',
        status: 'sold',
        dateAllocated: '2026-08-05T09:00:00',
      },
      {
        id: 'alloc-4',
        agentId: 'agent-1',
        model: 'Samsung Galaxy A06',
        imei: '359072080276525',
        serialNumber: 'RF9DL1A20GX',
        condition: 'new',
        status: 'in-stock',
        dateAllocated: '2026-08-05T09:00:00',
      },
      {
        id: 'alloc-5',
        agentId: 'agent-2',
        model: 'Samsung Galaxy A06',
        imei: '359072080276526',
        serialNumber: 'RF9DL1A20GY',
        condition: 'new',
        status: 'sold',
        dateAllocated: '2026-08-05T09:00:00',
      },
      {
        id: 'alloc-6',
        agentId: 'agent-2',
        model: 'Samsung Galaxy A36',
        imei: '359072080276527',
        serialNumber: 'RF9DL1A20GZ',
        condition: 'new',
        status: 'sold',
        dateAllocated: '2026-08-05T09:00:00',
      },
      {
        id: 'alloc-7',
        agentId: 'agent-2',
        model: 'Samsung Galaxy A56 5G',
        imei: '359072080276528',
        serialNumber: 'RF9DL1A20HA',
        condition: 'new',
        status: 'in-stock',
        dateAllocated: '2026-08-05T09:00:00',
      },
      {
        id: 'alloc-8',
        agentId: 'agent-3',
        model: 'Samsung Galaxy A16',
        imei: '359072080276529',
        serialNumber: 'RF9DL1A20HB',
        condition: 'new',
        status: 'sold',
        dateAllocated: '2026-08-05T09:00:00',
      },
      {
        id: 'alloc-9',
        agentId: 'agent-3',
        model: 'Samsung Galaxy A05',
        imei: '359072080276530',
        serialNumber: 'RF9DL1A20HC',
        condition: 'new',
        status: 'in-stock',
        dateAllocated: '2026-08-05T09:00:00',
      },
    ];
    localStorage.setItem('agentAllocations', JSON.stringify(sampleAllocations));
  }
};
