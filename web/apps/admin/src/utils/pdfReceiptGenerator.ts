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
  try {
    const doc = new jsPDF() as any;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Add watermark first
    addWatermark(doc, pageWidth, pageHeight);

    // Add approval stamp
    addApprovalStamp(doc, new Date(data.approvalDate), pageWidth);

    // Header
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('CASH SALE', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    doc.setFontSize(12);
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

    // Table
    doc.setFont(undefined, 'bold');
    doc.setFontSize(9);
    const tableX = 15;
    const lineHeight = 5;

    // Table header
    doc.rect(tableX, yPosition - 4, 180, 4);
    doc.text('Qty', tableX + 2, yPosition);
    doc.text('Particulars', tableX + 15, yPosition);
    doc.text('Kshs.', tableX + 130, yPosition);
    doc.text('Cts', tableX + 165, yPosition);
    yPosition += 5;

    // Table content
    doc.setFont(undefined, 'normal');
    doc.text('1', tableX + 2, yPosition);
    const desc = data.description.substring(0, 45);
    doc.text(desc, tableX + 15, yPosition);
    doc.text(String(data.amount), tableX + 130, yPosition);
    yPosition += 5;

    // Total
    doc.setFont(undefined, 'bold');
    doc.rect(tableX, yPosition - 4, 180, 4);
    doc.text('TOTAL', tableX + 130, yPosition);
    doc.text(String(data.amount), tableX + 130, yPosition);
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

    yPosition += 10;

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
    doc.setDrawColor(0, 0, 0);
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
      '• Device becomes customer property upon down payment',
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
    doc.setFontSize(7);
    doc.setFont(undefined, 'italic');
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 8, { align: 'center' });

    // Save PDF
    doc.save(`Receipt_${data.receiptId}_${data.customerName.replace(/\s/g, '_')}.pdf`);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw new Error('Failed to generate PDF receipt');
  }
};

const addWatermark = (doc: any, pageWidth: number, pageHeight: number) => {
  try {
    doc.setTextColor(220, 220, 220); // Light gray
    doc.setFont(undefined, 'bold');
    doc.setFontSize(50);

    // Save current state
    const currentState = doc.getState();

    // Add watermark text centered
    doc.text('DAKIRO', pageWidth / 2, pageHeight / 2 - 5, { align: 'center' });
    doc.setFontSize(40);
    doc.text('GENERAL ELECTRONICS', pageWidth / 2, pageHeight / 2 + 5, { align: 'center' });

    // Reset color
    doc.setTextColor(0, 0, 0);
  } catch (error) {
    console.warn('Watermark add failed:', error);
  }
};

const addApprovalStamp = (doc: any, approvalDate: Date, pageWidth: number) => {
  try {
    // Approval stamp box
    doc.setDrawColor(76, 175, 80); // Green
    doc.setFillColor(255, 255, 255); // White fill
    doc.setLineWidth(2);
    const stampX = pageWidth - 55;
    const stampY = 10;
    const stampWidth = 45;
    const stampHeight = 16;

    doc.rect(stampX, stampY, stampWidth, stampHeight, 'S'); // S = stroke only

    // Stamp text
    doc.setTextColor(76, 175, 80);
    doc.setFont(undefined, 'bold');
    doc.setFontSize(9);
    doc.text('✓ APPROVED', stampX + stampWidth / 2, stampY + 6, { align: 'center' });

    doc.setFontSize(6);
    doc.setTextColor(0, 0, 0);
    doc.text(`${approvalDate.toLocaleDateString()}`, stampX + stampWidth / 2, stampY + 12, { align: 'center' });
  } catch (error) {
    console.warn('Approval stamp add failed:', error);
  }
};
