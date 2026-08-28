export interface Agent {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  location: string;
  region: string;
  status: 'active' | 'inactive';
  joinDate: string;
  commission: number;
}

export const SAMPLE_AGENTS: Agent[] = [
  {
    id: 'agent-1',
    name: 'Kelvin Kimutai',
    email: 'kelvin@watucredit.co.ke',
    password: 'password123',
    phone: '+254712345678',
    location: 'Nairobi',
    region: 'Central',
    status: 'active',
    joinDate: new Date('2024-01-15').toISOString(),
    commission: 0,
  },
  {
    id: 'agent-2',
    name: 'Rose Tata',
    email: 'rose@watucredit.co.ke',
    password: 'password123',
    phone: '+254723456789',
    location: 'Mombasa',
    region: 'Coast',
    status: 'active',
    joinDate: new Date('2024-02-01').toISOString(),
    commission: 0,
  },
  {
    id: 'agent-3',
    name: 'James Mwangi',
    email: 'james@watucredit.co.ke',
    password: 'password123',
    phone: '+254734567890',
    location: 'Kisumu',
    region: 'Western',
    status: 'active',
    joinDate: new Date('2024-01-20').toISOString(),
    commission: 0,
  },
  {
    id: 'agent-4',
    name: 'Fatima Hassan',
    email: 'fatima@watucredit.co.ke',
    password: 'password123',
    phone: '+254745678901',
    location: 'Nakuru',
    region: 'Rift Valley',
    status: 'active',
    joinDate: new Date('2024-03-10').toISOString(),
    commission: 0,
  },
  {
    id: 'agent-5',
    name: 'Michael Kipchoge',
    email: 'michael@watucredit.co.ke',
    password: 'password123',
    phone: '+254756789012',
    location: 'Eldoret',
    region: 'Rift Valley',
    status: 'active',
    joinDate: new Date('2024-01-05').toISOString(),
    commission: 0,
  },
];
