export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export function validatePhone(phone: string): boolean {
  // Kenyan phone format: +254, 0, or just digits
  const re = /^(\+254|0)?[17]\d{8}$/;
  return re.test(phone.replace(/\s/g, ''));
}

export function validateNationalId(id: string): boolean {
  // Basic Kenyan ID validation (8 digits)
  return /^\d{8}$/.test(id.replace(/\s/g, ''));
}

export function validateIMEI(imei: string): boolean {
  // IMEI is 15 digits
  return /^\d{15}$/.test(imei);
}
