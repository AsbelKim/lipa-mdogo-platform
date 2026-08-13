// DAKIRO GENERAL ELECTRONICS - Dealer Configuration
export const DEALER_CONFIG = {
  id: 'DAKIRO-001',
  name: 'DAKIRO GENERAL ELECTRONICS',
  logo: '📱',
  phone: '0720 049 708',
  email: 'info@dakiroelectronics.co.ke',
  poBox: 'P.O BOX 46',
  location: 'KERICHO',
  address: 'Opposite Kapsoit Guest House - Kapsoit Town',
  dealersIn: [
    "TV's",
    'DVD',
    'Phone',
    'Phone Accessories',
    'Players',
    'Batteries',
    'Solar Panels',
    'Wiring Materials',
    'D Lights',
    'Cameras',
  ],
  region: 'Kericho',
  registeredDate: '2025-06-01',
  status: 'active',
  contactPerson: 'Management',
  primaryColor: '#16A39E', // Watu primary color
  secondaryColor: '#FF6B35', // Watu secondary color
};

export const DEALER_BRANDING = {
  headerTitle: `${DEALER_CONFIG.logo} ${DEALER_CONFIG.name}`,
  headerSubtitle: `${DEALER_CONFIG.address}`,
  contactInfo: `${DEALER_CONFIG.poBox}, ${DEALER_CONFIG.location} | Tel: ${DEALER_CONFIG.phone}`,
};
