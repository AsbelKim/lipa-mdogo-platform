// Form Validation Helpers
export const validationRules = {
  // Customer validations
  customerName: (value: string) => {
    if (!value.trim()) return 'Customer name is required';
    if (value.length < 3) return 'Customer name must be at least 3 characters';
    if (value.length > 50) return 'Customer name must not exceed 50 characters';
    return null;
  },

  // Phone validations
  phoneNumber: (value: string) => {
    if (!value.trim()) return 'Phone number is required';
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(value.replace(/[-\s]/g, ''))) return 'Invalid phone number format';
    return null;
  },

  // Email validations
  email: (value: string) => {
    if (!value.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Invalid email format';
    return null;
  },

  // National ID validations
  nationalId: (value: string) => {
    if (!value.trim()) return 'National ID is required';
    if (value.length < 5) return 'Invalid National ID';
    if (value.length > 20) return 'National ID too long';
    return null;
  },

  // IMEI validations
  imei: (value: string) => {
    if (!value.trim()) return 'IMEI is required';
    const imeiOnly = value.replace(/[-\s]/g, '');
    if (imeiOnly.length !== 15) return 'IMEI must be exactly 15 digits';
    if (!/^\d+$/.test(imeiOnly)) return 'IMEI must contain only digits';
    return null;
  },

  // Serial number validations
  serialNumber: (value: string) => {
    if (!value.trim()) return 'Serial number is required';
    if (value.length < 3) return 'Serial number must be at least 3 characters';
    if (value.length > 30) return 'Serial number too long';
    return null;
  },

  // Model validations
  phoneModel: (value: string) => {
    if (!value.trim()) return 'Phone model is required';
    if (value.length < 3) return 'Phone model must be at least 3 characters';
    return null;
  },

  // Amount validations
  amount: (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue) || numValue < 0) return 'Amount must be a valid positive number';
    if (numValue === 0) return 'Amount must be greater than 0';
    if (numValue > 999999999) return 'Amount is too large';
    return null;
  },

  // Password validations
  password: (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    if (value.length > 50) return 'Password too long';
    return null;
  },

  // Location validations
  location: (value: string) => {
    if (!value.trim()) return 'Location is required';
    if (value.length < 2) return 'Location must be at least 2 characters';
    return null;
  },

  // Condition validations
  condition: (value: string) => {
    const validConditions = ['new', 'refurbished', 'used'];
    if (!value) return 'Condition is required';
    if (!validConditions.includes(value.toLowerCase())) {
      return 'Condition must be: new, refurbished, or used';
    }
    return null;
  },

  // Payment method validations
  paymentMethod: (value: string) => {
    const validMethods = ['mpesa', 'bank', 'cash'];
    if (!value) return 'Payment method is required';
    if (!validMethods.includes(value.toLowerCase())) {
      return 'Invalid payment method';
    }
    return null;
  },

  // Installment period validations
  installmentMonths: (value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value) : value;
    if (isNaN(numValue)) return 'Installment period must be a number';
    if (numValue < 1) return 'Installment period must be at least 1 month';
    if (numValue > 60) return 'Installment period cannot exceed 60 months';
    return null;
  },

  // Down payment validation
  downPayment: (downPayment: number, totalPrice: number) => {
    if (downPayment < 0) return 'Down payment cannot be negative';
    if (downPayment >= totalPrice) return 'Down payment must be less than total price';
    if (downPayment === 0) return 'Down payment is required';
    return null;
  },
};

// Validation runner
export function validateField(fieldName: string, value: any): string | null {
  const validator = validationRules[fieldName as keyof typeof validationRules] as any;
  if (!validator) return null;

  if (typeof validator === 'function') {
    return validator(value);
  }
  return null;
}

// Validate multiple fields
export function validateMultiple(
  fields: Record<string, any>,
  fieldsToValidate: string[]
): Record<string, string | null> {
  const errors: Record<string, string | null> = {};

  fieldsToValidate.forEach((fieldName) => {
    errors[fieldName] = validateField(fieldName, fields[fieldName]);
  });

  return errors;
}

// Check if there are any validation errors
export function hasErrors(errors: Record<string, string | null>): boolean {
  return Object.values(errors).some((error) => error !== null);
}

// Format validation error message for display
export function getErrorMessage(fieldName: string, value: any): string {
  return validateField(fieldName, value) || '';
}
