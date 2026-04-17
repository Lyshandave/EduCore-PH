// ============================================
// EduCore PH - Validators
// ============================================

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Philippine phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  // Accepts formats: 09XXXXXXXXX, +639XXXXXXXXX, 639XXXXXXXXX
  const phoneRegex = /^(09\d{9}|\+639\d{9}|639\d{9})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate password strength
 */
export const isValidPassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Validate student ID format
 */
export const isValidStudentId = (studentId: string): boolean => {
  // Format: YYYY-XXXX (e.g., 2024-0001)
  const studentIdRegex = /^\d{4}-\d{4}$/;
  return studentIdRegex.test(studentId);
};

/**
 * Validate name (no numbers or special characters)
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  return nameRegex.test(name) && name.length >= 2;
};

/**
 * Validate date of birth (must be at least 5 years old)
 */
export const isValidDateOfBirth = (dateOfBirth: string | Date): boolean => {
  const dob = typeof dateOfBirth === 'string' ? new Date(dateOfBirth) : dateOfBirth;
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  
  if (age < 5) return false;
  if (age === 5) {
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0) return false;
    if (monthDiff === 0 && today.getDate() < dob.getDate()) return false;
  }
  
  return true;
};

/**
 * Validate file type
 */
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

/**
 * Validate file size
 */
export const isValidFileSize = (file: File, maxSize: number): boolean => {
  return file.size <= maxSize;
};

/**
 * Validate URL
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate required field
 */
export const isRequired = (value: string | number | null | undefined): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  return true;
};

/**
 * Validate minimum length
 */
export const minLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

/**
 * Validate maximum length
 */
export const maxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

/**
 * Validate numeric value
 */
export const isNumeric = (value: string): boolean => {
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

/**
 * Validate positive number
 */
export const isPositiveNumber = (value: number): boolean => {
  return value > 0;
};

/**
 * Validate non-negative number
 */
export const isNonNegativeNumber = (value: number): boolean => {
  return value >= 0;
};

/**
 * Validate grade (0-100)
 */
export const isValidGrade = (grade: number): boolean => {
  return grade >= 0 && grade <= 100;
};

/**
 * Validate payment amount
 */
export const isValidPaymentAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 1000000;
};

/**
 * Validate reference number
 */
export const isValidReferenceNumber = (reference: string): boolean => {
  return reference.length >= 5 && reference.length <= 50;
};

/**
 * Validate ZIP code (Philippines)
 */
export const isValidZipCode = (zipCode: string): boolean => {
  const zipRegex = /^\d{4}$/;
  return zipRegex.test(zipCode);
};

/**
 * Validate TIN (Tax Identification Number)
 */
export const isValidTIN = (tin: string): boolean => {
  const tinRegex = /^\d{3}-\d{3}-\d{3}-\d{3}$/;
  return tinRegex.test(tin);
};

/**
 * Validate form data
 */
export interface ValidationError {
  field: string;
  message: string;
}

export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, (value: any) => boolean | string>
): { valid: boolean; errors: ValidationError[] } => {
  const errors: ValidationError[] = [];
  
  for (const [field, validator] of Object.entries(rules)) {
    const result = validator(data[field]);
    if (result !== true) {
      errors.push({
        field,
        message: typeof result === 'string' ? result : `${field} is invalid`,
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};
