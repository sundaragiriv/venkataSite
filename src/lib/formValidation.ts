/**
 * Form validation utilities
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

export function validateMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

export interface ContactFormData {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  requestType: string;
}

export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: ValidationError[] = [];

  if (!validateRequired(data.name)) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (!validateMinLength(data.name, 2)) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }

  if (!validateRequired(data.email)) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  if (!validateRequired(data.subject)) {
    errors.push({ field: 'subject', message: 'Subject is required' });
  } else if (!validateMinLength(data.subject, 5)) {
    errors.push({ field: 'subject', message: 'Subject must be at least 5 characters' });
  }

  if (!validateRequired(data.message)) {
    errors.push({ field: 'message', message: 'Message is required' });
  } else if (!validateMinLength(data.message, 10)) {
    errors.push({ field: 'message', message: 'Message must be at least 10 characters' });
  } else if (!validateMaxLength(data.message, 2000)) {
    errors.push({ field: 'message', message: 'Message must be less than 2000 characters' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}


