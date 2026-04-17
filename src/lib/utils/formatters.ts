// ============================================
// EduCore PH - Formatters
// ============================================

import { CURRENCY } from '@/lib/constants';

/**
 * Format currency value
 */
export const formatCurrency = (value: number, showSymbol = true): string => {
  const formatted = new Intl.NumberFormat(CURRENCY.LOCALE, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  
  return showSymbol ? `${CURRENCY.SYMBOL}${formatted}` : formatted;
};

/**
 * Format number with commas
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat(CURRENCY.LOCALE).format(value);
};

/**
 * Format percentage
 */
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format date
 */
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  
  return d.toLocaleDateString(CURRENCY.LOCALE, defaultOptions);
};

/**
 * Format date with time
 */
export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString(CURRENCY.LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as +63 XXX XXX XXXX
  if (cleaned.length === 12 && cleaned.startsWith('63')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }
  
  // Format as 0XXX XXX XXXX
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

/**
 * Format student ID
 */
export const formatStudentId = (id: string): string => {
  return id;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Truncate text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Format full name
 */
export const formatFullName = (firstName: string, lastName: string, middleName?: string): string => {
  if (middleName) {
    return `${firstName} ${middleName.charAt(0)}. ${lastName}`;
  }
  return `${firstName} ${lastName}`;
};

/**
 * Format initials
 */
export const formatInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

/**
 * Format academic year
 */
export const formatAcademicYear = (yearStart: number, yearEnd: number): string => {
  return `${yearStart}-${yearEnd}`;
};

/**
 * Format grade
 */
export const formatGrade = (grade: number): string => {
  return grade.toFixed(2);
};

/**
 * Get grade remark
 */
export const getGradeRemark = (grade: number): string => {
  if (grade >= 90) return 'Excellent';
  if (grade >= 85) return 'Very Good';
  if (grade >= 80) return 'Good';
  if (grade >= 75) return 'Passed';
  return 'Failed';
};

/**
 * Format payment reference
 */
export const formatPaymentReference = (reference: string): string => {
  return reference.toUpperCase();
};

/**
 * Format OR Number
 */
export const formatORNumber = (orNumber: string): string => {
  return orNumber.toUpperCase();
};
