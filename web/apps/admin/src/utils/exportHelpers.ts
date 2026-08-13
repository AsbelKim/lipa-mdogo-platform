import jsPDF from 'jspdf';
import { Document, Packer, Table, TableRow, TableCell, Paragraph, HeadingLevel } from 'docx';
import * as XLSX from 'xlsx';

// PDF Export Functions
export const generatePDF = (title: string, content: string, fileName: string) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const maxWidth = pageWidth - 2 * margin;

  // Title
  doc.setFontSize(16);
  doc.text(title, margin, margin + 10);

  // Date
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-KE')}`, margin, margin + 20);

  doc.save(`${fileName}.pdf`);
};

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

  // Table
  const headers = ['Date', 'Customer', 'Phone', 'Agent', 'Price (KES)', 'Paid (KES)'];
  const rows = salesData.map((s) => [s.date, s.customer, s.phone, s.agent, s.price.toString(), s.paid.toString()]);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: margin + 55,
    margin,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [22, 163, 158],
      textColor: 255,
      fontStyle: 'bold',
    },
  });

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

  const headers = ['Name', 'Phone', 'Location', 'Purchases', 'Total Spent (KES)', 'Next of Kin'];
  const rows = customers.map((c) => [c.name, c.phone, c.location, c.purchases.toString(), c.spent.toString(), c.nok]);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: margin + 40,
    margin,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [22, 163, 158],
      textColor: 255,
      fontStyle: 'bold',
    },
  });

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

  const headers = ['Agent Name', 'Location', 'Units Sold', 'Revenue (KES)', 'Conversion Rate'];
  const rows = agents.map((a) => [
    a.name,
    a.location,
    a.sold.toString(),
    a.revenue.toString(),
    `${a.conversionRate.toFixed(1)}%`,
  ]);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: margin + 50,
    margin,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [22, 163, 158],
      textColor: 255,
      fontStyle: 'bold',
    },
  });

  doc.save(`${fileName}.pdf`);
};

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

// Word Export Functions
export const generateSalesWord = async (
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
  const rows = salesData.map(
    (s) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(s.date)] }),
          new TableCell({ children: [new Paragraph(s.customer)] }),
          new TableCell({ children: [new Paragraph(s.phone)] }),
          new TableCell({ children: [new Paragraph(s.agent)] }),
          new TableCell({ children: [new Paragraph(`KES ${s.price.toLocaleString('en-KE')}`)] }),
          new TableCell({ children: [new Paragraph(`KES ${s.paid.toLocaleString('en-KE')}`)] }),
        ],
      })
  );

  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Date')] }),
          new TableCell({ children: [new Paragraph('Customer')] }),
          new TableCell({ children: [new Paragraph('Phone')] }),
          new TableCell({ children: [new Paragraph('Agent')] }),
          new TableCell({ children: [new Paragraph('Price')] }),
          new TableCell({ children: [new Paragraph('Paid')] }),
        ],
      }),
      ...rows,
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Sales Report',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph(`Generated: ${new Date().toLocaleDateString('en-KE')}`),
          new Paragraph(''),
          new Paragraph(`Total Sales: ${salesData.length}`),
          new Paragraph(`Total Amount: KES ${salesData.reduce((sum, s) => sum + s.price, 0).toLocaleString('en-KE')}`),
          new Paragraph(''),
          table,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  downloadFile(buffer, `${fileName}.docx`);
};

export const generateCustomersWord = async (
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
  const rows = customers.map(
    (c) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(c.name)] }),
          new TableCell({ children: [new Paragraph(c.phone)] }),
          new TableCell({ children: [new Paragraph(c.location)] }),
          new TableCell({ children: [new Paragraph(c.purchases.toString())] }),
          new TableCell({ children: [new Paragraph(`KES ${c.spent.toLocaleString('en-KE')}`)] }),
          new TableCell({ children: [new Paragraph(c.nok)] }),
        ],
      })
  );

  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph('Name')] }),
          new TableCell({ children: [new Paragraph('Phone')] }),
          new TableCell({ children: [new Paragraph('Location')] }),
          new TableCell({ children: [new Paragraph('Purchases')] }),
          new TableCell({ children: [new Paragraph('Total Spent')] }),
          new TableCell({ children: [new Paragraph('Next of Kin')] }),
        ],
      }),
      ...rows,
    ],
  });

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: 'Customers Report',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph(`Generated: ${new Date().toLocaleDateString('en-KE')}`),
          new Paragraph(''),
          new Paragraph(`Total Customers: ${customers.length}`),
          new Paragraph(`Total Revenue: KES ${customers.reduce((sum, c) => sum + c.spent, 0).toLocaleString('en-KE')}`),
          new Paragraph(''),
          table,
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  downloadFile(buffer, `${fileName}.docx`);
};

// Helper function to download file
const downloadFile = (buffer: Buffer, fileName: string) => {
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

// AutoTable helper function
function autoTable(
  doc: jsPDF,
  config: {
    head: string[][];
    body: string[][];
    startY: number;
    margin: number;
    styles: { fontSize: number; cellPadding: number };
    headStyles: { fillColor: number[]; textColor: number; fontStyle: string };
  }
) {
  const { head, body, startY, margin, styles, headStyles } = config;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - 2 * margin;
  const colWidth = maxWidth / head[0].length;
  let yPosition = startY;

  // Draw header
  doc.setFillColor(...headStyles.fillColor);
  doc.setTextColor(headStyles.textColor);
  doc.setFont('helvetica', headStyles.fontStyle);
  doc.setFontSize(styles.fontSize);

  head[0].forEach((header, idx) => {
    doc.text(header, margin + idx * colWidth + 2, yPosition + styles.cellPadding + 2);
  });

  yPosition += 8;

  // Draw body
  doc.setTextColor(0);
  doc.setFont('helvetica', 'normal');
  body.forEach((row) => {
    if (yPosition > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage();
      yPosition = margin + 10;
    }

    row.forEach((cell, idx) => {
      doc.text(cell, margin + idx * colWidth + 2, yPosition + styles.cellPadding);
    });

    yPosition += 8;
  });
}
