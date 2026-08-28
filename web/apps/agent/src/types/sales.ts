export interface Sale {
  id: string;
  agentId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  deviceModel: string;
  amount: number;
  duration: number;
  monthlyPayment: number;
  commission: number;
  status: 'active' | 'completed' | 'defaulted';
  createdDate: string;
  dueDate: string;
}

// Generate random sales for sampling
export function generateSampleSales(): Sale[] {
  const devices = [
    'Samsung Galaxy A56 5G',
    'iPhone 15 Pro',
    'Xiaomi Redmi Note 13',
    'Tecno Camon 20',
    'Nokia XR20',
    'OnePlus 12',
    'Motorola Edge 50',
  ];

  const customers = [
    { name: 'John Doe', phone: '+254712345678' },
    { name: 'Jane Smith', phone: '+254723456789' },
    { name: 'David Kipchoge', phone: '+254734567890' },
    { name: 'Mary Mwangi', phone: '+254745678901' },
    { name: 'Peter Gitau', phone: '+254756789012' },
    { name: 'Grace Omondi', phone: '+254767890123' },
    { name: 'Samuel Hassan', phone: '+254778901234' },
    { name: 'Lucy Kipchoge', phone: '+254789012345' },
    { name: 'Michael Kiprop', phone: '+254701234567' },
    { name: 'Patricia Ochieng', phone: '+254712345670' },
  ];

  const agentIds = ['agent-1', 'agent-2', 'agent-3', 'agent-4', 'agent-5'];
  const sales: Sale[] = [];

  agentIds.forEach((agentId) => {
    // Random sales count per agent (2-10)
    const salesCount = Math.floor(Math.random() * 9) + 2;

    for (let i = 0; i < salesCount; i++) {
      const device = devices[Math.floor(Math.random() * devices.length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const amount = [15000, 25000, 35000, 45000, 55000][Math.floor(Math.random() * 5)];
      const duration = [6, 12, 18, 24][Math.floor(Math.random() * 4)];
      const monthlyPayment = Math.round(amount / duration);
      const commission = Math.round(monthlyPayment * 0.12);

      sales.push({
        id: `sale-${agentId}-${i}-${Date.now()}`,
        agentId,
        customerId: `cust-${Math.random().toString(36).substr(2, 9)}`,
        customerName: customer.name,
        customerPhone: customer.phone,
        deviceModel: device,
        amount,
        duration,
        monthlyPayment,
        commission,
        status: ['active', 'completed'][Math.floor(Math.random() * 2)] as 'active' | 'completed',
        createdDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
  });

  return sales;
}
