import jsPDF from 'jspdf';

interface ReceiptData {
  receiptId: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  description: string;
  agentName: string;
  approvalDate: string;
  downPayment?: number;
  installmentMonths?: number;
}

export const generateReceiptPDF = (data: ReceiptData) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 10;

  // Add watermark
  addWatermark(doc);

  // Add approval stamp
  addApprovalStamp(doc, new Date(data.approvalDate));

  // Header
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('CASH SALE', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 6;

  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('DAKIRO GENERAL ELECTRONICS', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 5;

  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('P.O BOX 46, KERICHO. Tel: 0720 049 708', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 4;
  doc.text('Opposite Kapsoit Guest House - Kapsoit Town', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 8;

  // Date
  doc.setFontSize(10);
  const dateStr = new Date(data.approvalDate).toLocaleDateString('en-GB');
  doc.text(`Date: ${dateStr}`, 15, yPosition);
  yPosition += 7;

  // Customer name
  doc.setFont(undefined, 'bold');
  doc.text(`M/S ${data.customerName}`, 15, yPosition);
  yPosition += 6;

  // Dealers info
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.text('Dealers in: TV\'s, DVD, Phone, Phone Accessories, Players, Batteries,', 15, yPosition);
  yPosition += 3;
  doc.text('Solar Panels, Wiring Materials, D Lights, Cameras etc.', 15, yPosition);
  yPosition += 7;

  // Table header
  doc.setFont(undefined, 'bold');
  doc.setFontSize(9);
  const tableX = 15;
  const colWidths = { qty: 12, desc: 80, kshs: 35, cts: 20 };

  // Draw table borders
  doc.rect(tableX, yPosition - 5, colWidths.qty + colWidths.desc + colWidths.kshs + colWidths.cts, 4);
  doc.text('Qty', tableX + 2, yPosition);
  doc.text('Particulars', tableX + colWidths.qty + 5, yPosition);
  doc.text('Kshs.', tableX + colWidths.qty + colWidths.desc + 5, yPosition);
  doc.text('Cts', tableX + colWidths.qty + colWidths.desc + colWidths.kshs + 5, yPosition);

  yPosition += 6;

  // Table content
  doc.setFont(undefined, 'normal');
  doc.text('1', tableX + 2, yPosition);

  // Description (wrap if needed)
  const descLines = doc.splitTextToSize(data.description.substring(0, 36), colWidths.desc - 5);
  doc.text(descLines, tableX + colWidths.qty + 5, yPosition);

  doc.text(String(data.amount), tableX + colWidths.qty + colWidths.desc + 5, yPosition, { align: 'right' });
  doc.text('', tableX + colWidths.qty + colWidths.desc + colWidths.kshs + 5, yPosition);

  yPosition += 6;

  // Total line
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL', tableX + colWidths.qty + colWidths.desc + 5, yPosition, { align: 'right' });
  doc.text(String(data.amount), tableX + colWidths.qty + colWidths.desc + colWidths.kshs - 10, yPosition, { align: 'right' });

  yPosition += 8;

  // Payment details
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);

  if (data.downPayment !== undefined && data.installmentMonths !== undefined) {
    const balance = data.amount - data.downPayment;
    const monthlyPayment = Math.round(balance / data.installmentMonths);

    doc.text(`Down Payment: KES ${data.downPayment.toLocaleString()}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Balance: KES ${balance.toLocaleString()}`, 15, yPosition);
    yPosition += 5;
    doc.text(`Installment: ${data.installmentMonths} months @ KES ${monthlyPayment.toLocaleString()}/month`, 15, yPosition);
  } else {
    doc.text(`Total Amount: KES ${data.amount.toLocaleString()}`, 15, yPosition);
  }

  yPosition += 8;

  // Receipt details
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text(`Receipt ID: ${data.receiptId}`, 15, yPosition);
  yPosition += 5;
  doc.text(`Sales Agent: ${data.agentName}`, 15, yPosition);
  yPosition += 5;
  doc.text(`Customer Phone: ${data.customerPhone}`, 15, yPosition);

  yPosition += 8;

  // Footer line
  doc.setDrawColor(0);
  doc.line(15, yPosition, pageWidth - 15, yPosition);
  yPosition += 4;

  // Footer text
  doc.setFont(undefined, 'bold');
  doc.setFontSize(8);
  doc.text('Goods once sold cannot be re-accepted', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 6;

  // Terms
  doc.setFont(undefined, 'normal');
  doc.setFontSize(7);
  const terms = [
    'PAYMENT TERMS:',
    '• Customer committed to monthly installments',
    '• Device becomes customer\'s property upon down payment',
    '• Payments must be made on agreed dates',
    '• Default may result in device recovery',
  ];

  terms.forEach((term) => {
    if (yPosition > pageHeight - 15) {
      doc.addPage();
      yPosition = 10;
    }
    doc.text(term, 15, yPosition);
    yPosition += 4;
  });

  // Generated date
  yPosition += 3;
  doc.setFontSize(7);
  doc.setFont(undefined, 'italic');
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 8, { align: 'center' });

  // Save PDF
  doc.save(`Receipt_${data.receiptId}_${data.customerName.replace(/\s/g, '_')}.pdf`);
};

const addWatermark = (doc: jsPDF) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setTextColor(220, 220, 220); // Light gray
  doc.setFont(undefined, 'bold');
  doc.setFontSize(60);

  // Diagonal watermark
  doc.text('DAKIRO GENERAL ELECTRONICS', pageWidth / 2, pageHeight / 2, {
    align: 'center',
    angle: -45,
    opacity: 0.2,
  });

  doc.setTextColor(0, 0, 0); // Reset to black
};

const addApprovalStamp = (doc: jsPDF, approvalDate: Date) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Approval stamp box
  doc.setDrawColor(76, 175, 80); // Green
  doc.setLineWidth(2);
  doc.rect(pageWidth - 60, 10, 50, 20);

  // Stamp text
  doc.setTextColor(76, 175, 80);
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text('✓ APPROVED', pageWidth - 35, 17, { align: 'center' });

  doc.setFontSize(7);
  doc.setTextColor(0, 0, 0);
  doc.text(`By Admin - ${approvalDate.toLocaleDateString()}`, pageWidth - 35, 24, { align: 'center' });
};
