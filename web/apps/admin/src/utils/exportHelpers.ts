import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

// PDF Export Functions with simple table rendering
export const generateSalesReportPDF = (
  salesData: Array<{
    date: string;
    customer: string;
    phone: string;
    agent: string;
    price: number;
    paid: number;
  }>,
  fileName: string
) => {
  const doc = new jsPDF();
  const margin = 10;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(14);
  doc.text('Sales Report', margin, margin + 5);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-KE')}`, margin, margin + 15);

  // Summary
  const totalSales = salesData.length;
  const totalAmount = salesData.reduce((sum, s) => sum + s.price, 0);
  const totalPaid = salesData.reduce((sum, s) => sum + s.paid, 0);

  doc.text(`Total Sales: ${totalSales}`, margin, margin + 25);
  doc.text(`Total Amount: KES ${totalAmount.toLocaleString('en-KE')}`, margin, margin + 32);
  doc.text(`Total Paid: KES ${totalPaid.toLocaleString('en-KE')}`, margin, margin + 39);
  doc.text(`Outstanding: KES ${(totalAmount - totalPaid).toLocaleString('en-KE')}`, margin, margin + 46);

  // Simple table
  drawTable(doc, ['Date', 'Customer', 'Phone', 'Agent', 'Price', 'Paid'],
    salesData.map((s) => [s.date, s.customer, s.phone, s.agent, `${s.price}`, `${s.paid}`]),
    margin, margin + 55);

  doc.save(`${fileName}.pdf`);
};

export const generateCustomersReportPDF = (
  customers: Array<{
    name: string;
    phone: string;
    email: string;
    location: string;
    purchases: number;
    spent: number;
    nok: string;
  }>,
  fileName: string
) => {
  const doc = new jsPDF();
  const margin = 10;

  doc.setFontSize(14);
  doc.text('Customers Report', margin, margin + 5);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-KE')}`, margin, margin + 15);

  doc.text(`Total Customers: ${customers.length}`, margin, margin + 25);
  doc.text(`Total Revenue: KES ${customers.reduce((sum, c) => sum + c.spent, 0).toLocaleString('en-KE')}`, margin, margin + 32);

  drawTable(doc, ['Name', 'Phone', 'Location', 'Purchases', 'Spent', 'NOK'],
    customers.map((c) => [c.name, c.phone, c.location, `${c.purchases}`, `${c.spent}`, c.nok]),
    margin, margin + 40);

  doc.save(`${fileName}.pdf`);
};

export const generateAgentPerformancePDF = (
  agents: Array<{
    name: string;
    location: string;
    sold: number;
    revenue: number;
    conversionRate: number;
  }>,
  fileName: string
) => {
  const doc = new jsPDF();
  const margin = 10;

  doc.setFontSize(14);
  doc.text('Agent Performance Report', margin, margin + 5);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-KE')}`, margin, margin + 15);

  doc.text(`Total Agents: ${agents.length}`, margin, margin + 25);
  doc.text(`Total Units Sold: ${agents.reduce((sum, a) => sum + a.sold, 0)}`, margin, margin + 32);
  doc.text(`Total Revenue: KES ${agents.reduce((sum, a) => sum + a.revenue, 0).toLocaleString('en-KE')}`, margin, margin + 39);

  drawTable(doc, ['Agent', 'Location', 'Units', 'Revenue', 'Conv. Rate'],
    agents.map((a) => [a.name, a.location, `${a.sold}`, `${a.revenue}`, `${a.conversionRate.toFixed(1)}%`]),
    margin, margin + 50);

  doc.save(`${fileName}.pdf`);
};

function drawTable(
  doc: jsPDF,
  headers: string[],
  rows: string[][],
  startX: number,
  startY: number
) {
  const colWidth = 25;
  const rowHeight = 7;
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFillColor(22, 163, 158);

  // Draw headers
  headers.forEach((header, idx) => {
    doc.rect(startX + idx * colWidth, startY, colWidth, rowHeight, 'F');
    doc.text(header, startX + idx * colWidth + 2, startY + 5);
  });

  let yPos = startY + rowHeight;
  doc.setTextColor(0, 0, 0);

  // Draw rows
  rows.forEach((row) => {
    if (yPos > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }

    row.forEach((cell, idx) => {
      doc.rect(startX + idx * colWidth, yPos, colWidth, rowHeight);
      doc.text(cell, startX + idx * colWidth + 2, yPos + 5);
    });

    yPos += rowHeight;
  });
}

// Excel Export Functions
export const generateSalesExcel = (
  salesData: Array<{
    date: string;
    customer: string;
    phone: string;
    agent: string;
    price: number;
    paid: number;
  }>,
  fileName: string
) => {
  const ws = XLSX.utils.json_to_sheet(salesData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sales');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const generateCustomersExcel = (
  customers: Array<{
    fullName: string;
    nationalId: string;
    phone: string;
    email: string;
    location: string;
    purchases: number;
    totalSpent: number;
    nokName: string;
    nokPhone: string;
  }>,
  fileName: string
) => {
  const ws = XLSX.utils.json_to_sheet(customers);
  ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 12 }, { wch: 20 }, { wch: 15 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Customers');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const generateAgentsExcel = (
  agents: Array<{
    name: string;
    email: string;
    phone: string;
    location: string;
    region: string;
    unitsSold: number;
    revenue: number;
    conversionRate: number;
  }>,
  fileName: string
) => {
  const ws = XLSX.utils.json_to_sheet(agents);
  ws['!cols'] = [{ wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 15 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Agents');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

export const generateInventoryExcel = (
  phones: Array<{
    model: string;
    imei: string;
    serialNumber: string;
    status: string;
    condition: string;
    dateAdded: string;
  }>,
  fileName: string
) => {
  const ws = XLSX.utils.json_to_sheet(phones);
  ws['!cols'] = [{ wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 15 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
  XLSX.writeFile(wb, `${fileName}.xlsx`);
};

