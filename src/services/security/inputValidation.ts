import { z } from 'zod';

// Phone number validation for Kenya
export const kenyaPhoneSchema = z.string()
  .regex(/^(\+254|0)(7|1)\d{8}$/, 'Invalid Kenyan phone number format');

// Email validation
export const emailSchema = z.string().email('Invalid email format');

// Password validation
export const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

// Generic text input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 1000); // Limit length
};

// SQL injection protection for search queries
export const sanitizeSearchQuery = (query: string): string => {
  return query
    .replace(/['"`;\\]/g, '') // Remove SQL metacharacters
    .replace(/\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC)\b/gi, '') // Remove SQL keywords
    .trim()
    .substring(0, 100); // Limit search query length
};

// Validate numeric inputs
export const numericSchema = z.coerce.number().min(0);

// Location validation (basic)
export const locationSchema = z.string()
  .min(2, 'Location must be at least 2 characters')
  .max(100, 'Location must be less than 100 characters')
  .regex(/^[a-zA-Z\s,.-]+$/, 'Location contains invalid characters');

export class InputValidator {
  static validatePhone(phone: string): { valid: boolean; error?: string } {
    try {
      kenyaPhoneSchema.parse(phone);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Invalid phone number format' };
    }
  }

  static validateEmail(email: string): { valid: boolean; error?: string } {
    try {
      emailSchema.parse(email);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: 'Invalid email format' };
    }
  }

  static validatePassword(password: string): { valid: boolean; error?: string } {
    try {
      passwordSchema.parse(password);
      return { valid: true };
    } catch (error) {
      return { 
        valid: false, 
        error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
      };
    }
  }

  static sanitizeUserInput(input: string): string {
    return sanitizeInput(input);
  }

  static sanitizeSearch(query: string): string {
    return sanitizeSearchQuery(query);
  }
}