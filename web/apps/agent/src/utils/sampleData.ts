import { generateSampleSales } from '../types/sales';

export function initializeAgentSampleData() {
  // Check if already initialized
  if (localStorage.getItem('sample_data_initialized')) {
    return;
  }

  // Generate and store sample sales
  const sales = generateSampleSales();
  localStorage.setItem('sample_sales', JSON.stringify(sales));
  localStorage.setItem('sample_data_initialized', 'true');

  console.log(`✓ Initialized ${sales.length} sample sales for agents`);
}

export function getAgentSales(agentId: string) {
  const sales = localStorage.getItem('sample_sales');
  if (!sales) return [];
  
  try {
    const allSales = JSON.parse(sales);
    return allSales.filter((sale: any) => sale.agentId === agentId);
  } catch {
    return [];
  }
}
