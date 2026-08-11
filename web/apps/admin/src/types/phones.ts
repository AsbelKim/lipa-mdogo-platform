export interface Phone {
  id: string;
  model: string;
  specs: string;
  downPayment: number;
  dailyInstallment: number;
  estimatedTotalMin: number;
  estimatedTotalMax: number;
  stockQuantity: number;
  status: 'active' | 'discontinued' | 'low-stock';
  category: 'budget' | 'mid-range' | 'premium';
  createdAt: string;
}

export const PHONE_CATALOG: Phone[] = [
  {
    id: '1',
    model: 'Samsung Galaxy A05',
    specs: '64GB / 4GB',
    downPayment: 3500,
    dailyInstallment: 80,
    estimatedTotalMin: 13000,
    estimatedTotalMax: 15000,
    stockQuantity: 45,
    status: 'active',
    category: 'budget',
    createdAt: '2026-01-01',
  },
  {
    id: '2',
    model: 'Samsung Galaxy A06',
    specs: '128GB / 4GB',
    downPayment: 4200,
    dailyInstallment: 90,
    estimatedTotalMin: 16000,
    estimatedTotalMax: 18000,
    stockQuantity: 38,
    status: 'active',
    category: 'budget',
    createdAt: '2026-01-01',
  },
  {
    id: '3',
    model: 'Samsung Galaxy A07',
    specs: '128GB / 4GB',
    downPayment: 4500,
    dailyInstallment: 100,
    estimatedTotalMin: 18000,
    estimatedTotalMax: 20000,
    stockQuantity: 52,
    status: 'active',
    category: 'budget',
    createdAt: '2026-01-01',
  },
  {
    id: '4',
    model: 'Samsung Galaxy A16',
    specs: '128GB / 8GB',
    downPayment: 6500,
    dailyInstallment: 130,
    estimatedTotalMin: 22000,
    estimatedTotalMax: 25000,
    stockQuantity: 28,
    status: 'active',
    category: 'mid-range',
    createdAt: '2026-01-01',
  },
  {
    id: '5',
    model: 'Samsung Galaxy A26 5G',
    specs: '128GB / 6GB',
    downPayment: 13000,
    dailyInstallment: 212,
    estimatedTotalMin: 35000,
    estimatedTotalMax: 40000,
    stockQuantity: 18,
    status: 'active',
    category: 'mid-range',
    createdAt: '2026-01-01',
  },
  {
    id: '6',
    model: 'Samsung Galaxy A26 5G',
    specs: '256GB / 8GB',
    downPayment: 15000,
    dailyInstallment: 212,
    estimatedTotalMin: 39500,
    estimatedTotalMax: 44500,
    stockQuantity: 12,
    status: 'low-stock',
    category: 'mid-range',
    createdAt: '2026-01-01',
  },
  {
    id: '7',
    model: 'Samsung Galaxy A36 5G',
    specs: '128GB / 8GB',
    downPayment: 16000,
    dailyInstallment: 230,
    estimatedTotalMin: 45000,
    estimatedTotalMax: 51000,
    stockQuantity: 8,
    status: 'low-stock',
    category: 'premium',
    createdAt: '2026-01-01',
  },
  {
    id: '8',
    model: 'Samsung Galaxy A56 5G',
    specs: '256GB / 8GB',
    downPayment: 18500,
    dailyInstallment: 250,
    estimatedTotalMin: 55000,
    estimatedTotalMax: 62000,
    stockQuantity: 5,
    status: 'low-stock',
    category: 'premium',
    createdAt: '2026-01-01',
  },
];
