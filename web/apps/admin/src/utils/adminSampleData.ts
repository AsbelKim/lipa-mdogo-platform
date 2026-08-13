// Sample data for admin dashboard

export const SAMPLE_ADMIN_NOTIFICATIONS = [
  {
    id: '1',
    type: 'sale_submitted',
    agentName: 'Michael Kipchoge',
    customerName: 'John Mwangi',
    timestamp: '2026-08-13T14:30:00',
    read: false,
  },
  {
    id: '2',
    type: 'sale_approved',
    agentName: 'Michael Kipchoge',
    customerName: 'Jane Smith',
    phoneModel: 'Samsung Galaxy A16',
    receiptId: 'RCP-1692432000002',
    timestamp: '2026-08-13T13:15:00',
    read: false,
  },
  {
    id: '3',
    type: 'phone_allocated',
    agentName: 'Rose Tata',
    phoneModel: 'Samsung Galaxy A26 5G',
    timestamp: '2026-08-13T12:00:00',
    read: true,
  },
  {
    id: '4',
    type: 'receipt_requested',
    agentName: 'James Omondi',
    customerName: 'David Omondi',
    amount: '22000',
    timestamp: '2026-08-13T10:45:00',
    read: true,
  },
];

export const initializeAdminSampleData = () => {
  if (!localStorage.getItem('adminNotifications')) {
    localStorage.setItem('adminNotifications', JSON.stringify(SAMPLE_ADMIN_NOTIFICATIONS));
  }
};
