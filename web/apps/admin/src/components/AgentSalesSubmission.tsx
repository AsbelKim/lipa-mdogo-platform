'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';

interface ApprovedSale {
  id: string;
  agentName: string;
  customerName: string;
  customerPhone: string;
  phoneModel: string;
  imei: string;
  serialNumber: string;
  downPayment: number;
  totalPrice: number;
  installmentMonths: number;
  saleDateApproved: string;
  receiptId: string;
  status: string;
}

export default function AgentSalesSubmission() {
  const [approvedSales, setApprovedSales] = useState<ApprovedSale[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<ApprovedSale | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedSales = localStorage.getItem('soldPhones');
    if (savedSales) {
      try {
        const sales = JSON.parse(savedSales);
        setApprovedSales(sales.slice(-10)); // Show last 10 approved sales
      } catch (e) {
        console.error('Failed to load sales:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  const downloadReceipt = (sale: ApprovedSale) => {
    const receiptContent = `
DAKIRO GENERAL ELECTRONICS
=====================================
OFFICIAL SALES RECEIPT
=====================================

Receipt ID: ${sale.receiptId}
Date Approved: ${new Date(sale.saleDateApproved).toLocaleDateString()}

=====================================
CUSTOMER INFORMATION
=====================================
Name: ${sale.customerName}
Phone: ${sale.customerPhone}

=====================================
PHONE DETAILS
=====================================
Model: ${sale.phoneModel}
IMEI: ${sale.imei}
Serial: ${sale.serialNumber}

=====================================
PAYMENT SUMMARY
=====================================
Total Price: KES ${sale.totalPrice.toLocaleString()}
Down Payment: KES ${sale.downPayment.toLocaleString()}
Balance: KES ${(sale.totalPrice - sale.downPayment).toLocaleString()}
Installment Period: ${sale.installmentMonths} months
Monthly Payment: KES ${Math.round((sale.totalPrice - sale.downPayment) / sale.installmentMonths).toLocaleString()}

=====================================
TERMS & CONDITIONS
=====================================
✓ Customer has committed to payment plan
✓ Phone is now property of customer upon down payment
✓ Monthly payments required on agreed dates
✓ Default may result in legal action

Sales Agent: ${sale.agentName}
Receipt Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}

=====================================
DAKIRO GENERAL ELECTRONICS
P.O BOX 46, KERICHO
Tel: 0720 049 708
Opposite Kapsoit Guest House
=====================================
    `.trim();

    // Create downloadable file
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(receiptContent));
    element.setAttribute('download', `Receipt_${sale.receiptId}_${sale.customerName.replace(/\s/g, '_')}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert(`✅ Receipt downloaded for ${sale.customerName}`);
  };

  const downloadAllReceipts = () => {
    if (approvedSales.length === 0) {
      alert('No receipts to download');
      return;
    }

    let allReceipts = 'DAKIRO GENERAL ELECTRONICS - ALL APPROVED SALES\n';
    allReceipts += '='.repeat(60) + '\n\n';

    approvedSales.forEach((sale, index) => {
      allReceipts += `Receipt #${index + 1}\n`;
      allReceipts += `ID: ${sale.receiptId}\n`;
      allReceipts += `Customer: ${sale.customerName}\n`;
      allReceipts += `Phone: ${sale.phoneModel}\n`;
      allReceipts += `Total: KES ${sale.totalPrice.toLocaleString()}\n`;
      allReceipts += `Date: ${new Date(sale.saleDateApproved).toLocaleDateString()}\n`;
      allReceipts += '-'.repeat(60) + '\n\n';
    });

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(allReceipts));
    element.setAttribute('download', `AllReceipts_${new Date().toISOString().slice(0, 10)}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    alert(`✅ Downloaded ${approvedSales.length} receipts`);
  };

  if (!isLoaded) {
    return <div className="text-center py-8">Loading sales data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📥 My Approved Sales & E-Receipts</h1>
          <p className="text-gray-600 mt-1">Download receipts for approved customer sales</p>
        </div>
        {approvedSales.length > 0 && (
          <button
            onClick={downloadAllReceipts}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition font-medium"
          >
            ⬇️ Download All Receipts
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-gray-600">Total Approved Sales</p>
          <p className="text-3xl font-bold text-green-600">{approvedSales.length}</p>
          <p className="text-xs text-gray-500 mt-1">receipts available</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-3xl font-bold text-blue-600">
            KES {approvedSales.reduce((sum, s) => sum + s.totalPrice, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">from all sales</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <p className="text-sm text-gray-600">Collected Down Payments</p>
          <p className="text-3xl font-bold text-purple-600">
            KES {approvedSales.reduce((sum, s) => sum + s.downPayment, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">cash on hand</p>
        </div>
      </div>

      {/* Approved Sales List */}
      {approvedSales.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <p className="text-gray-500 text-lg">📭 No approved sales yet</p>
          <p className="text-gray-400 text-sm mt-2">Your submitted sales will appear here once admin approves them</p>
        </div>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">Your Approved Sales</h2>
          {approvedSales.map((sale) => (
            <div key={sale.id} className="bg-white rounded-lg border border-green-200 p-4 hover:shadow-md transition">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900">{sale.customerName}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                      ✓ Approved
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Phone: {sale.phoneModel}</p>
                  <p className="text-xs text-gray-500 font-mono mt-1">IMEI: {sale.imei}</p>
                  <p className="text-xs text-gray-500">Receipt ID: {sale.receiptId}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">KES {sale.totalPrice.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(sale.saleDateApproved).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600">
                <div>Down: KES {sale.downPayment.toLocaleString()}</div>
                <div>Balance: KES {(sale.totalPrice - sale.downPayment).toLocaleString()}</div>
                <div>Monthly: KES {Math.round((sale.totalPrice - sale.downPayment) / sale.installmentMonths).toLocaleString()}</div>
              </div>

              <button
                onClick={() => downloadReceipt(sale)}
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm"
              >
                📄 Download E-Receipt
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Receipt Modal */}
      {selectedReceipt && (
        <Modal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          title="E-Receipt Preview"
        >
          <div className="bg-gray-50 p-6 rounded-lg font-mono text-sm space-y-2 max-h-96 overflow-y-auto">
            <div className="font-bold text-center">DAKIRO GENERAL ELECTRONICS</div>
            <div className="text-center">OFFICIAL SALES RECEIPT</div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <p>Receipt ID: {selectedReceipt.receiptId}</p>
              <p>Date: {new Date(selectedReceipt.saleDateApproved).toLocaleDateString()}</p>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <p className="font-bold">CUSTOMER</p>
              <p>Name: {selectedReceipt.customerName}</p>
              <p>Phone: {selectedReceipt.customerPhone}</p>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <p className="font-bold">PHONE</p>
              <p>Model: {selectedReceipt.phoneModel}</p>
              <p>IMEI: {selectedReceipt.imei}</p>
              <p>Serial: {selectedReceipt.serialNumber}</p>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <p className="font-bold">PAYMENT</p>
              <p>Total: KES {selectedReceipt.totalPrice.toLocaleString()}</p>
              <p>Down Payment: KES {selectedReceipt.downPayment.toLocaleString()}</p>
              <p>Balance: KES {(selectedReceipt.totalPrice - selectedReceipt.downPayment).toLocaleString()}</p>
              <p>Installments: {selectedReceipt.installmentMonths} months</p>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2 text-center text-xs">
              <p>P.O BOX 46, KERICHO | Tel: 0720 049 708</p>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => downloadReceipt(selectedReceipt)}
              className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition font-medium"
            >
              ⬇️ Download Receipt
            </button>
            <button
              onClick={() => setSelectedReceipt(null)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
