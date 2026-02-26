/**
 * Security utilities for input sanitization and validation
 * Protects against XSS, injection attacks, and malicious content
 */

/**
 * Sanitizes HTML string to prevent XSS attacks
 * Removes potentially dangerous tags and attributes
 */
export const sanitizeHtml = (html: string): string => {
  const temp = document.createElement('div');
  temp.textContent = html;
  return temp.innerHTML;
};

/**
 * Escapes special characters in string to prevent XSS
 */
export const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

/**
 * Sanitizes user input from localStorage
 * Validates structure and escapes dangerous content
 */
export const sanitizeLocalStorageData = <T>(data: string, defaultValue: T): T => {
  try {
    const parsed = JSON.parse(data);

    // If it's an object, sanitize all string values
    if (typeof parsed === 'object' && parsed !== null) {
      return sanitizeObject(parsed) as T;
    }

    // If it's a string, escape it
    if (typeof parsed === 'string') {
      return escapeHtml(parsed) as unknown as T;
    }

    return parsed as T;
  } catch {
    return defaultValue;
  }
};

/**
 * Recursively sanitizes all string properties in an object
 */
const sanitizeObject = (obj: Record<string, unknown> | unknown): Record<string, unknown> | unknown => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized: Record<string, unknown> = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = (obj as Record<string, unknown>)[key];

      if (typeof value === 'string') {
        sanitized[key] = escapeHtml(value);
      } else if (typeof value === 'object') {
        sanitized[key] = sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
  }

  return sanitized;
};

/**
 * Validates and sanitizes email address
 */
export const sanitizeEmail = (email: string): string => {
  return email
    .trim()
    .toLowerCase()
    .replace(/[^\w\s@.-]/g, ''); // Remove caracteres especiais exceto @.-
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * Returns array of validation errors
 */
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('A senha deve ter no mínimo 8 caracteres');
  }

  if (password.length > 128) {
    errors.push('A senha deve ter no máximo 128 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra maiúscula');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('A senha deve conter pelo menos uma letra minúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('A senha deve conter pelo menos um número');
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('A senha deve conter pelo menos um caractere especial');
  }

  return errors;
};

/**
 * Generates a secure random ID
 * More secure than Date.now()
 */
export const generateSecureId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 15);
  const cryptoRandom = crypto.getRandomValues(new Uint8Array(8))
    .reduce((acc, val) => acc + val.toString(36), '');

  return `${timestamp}-${randomPart}-${cryptoRandom}`;
};

/**
 * Validates phone number format (Mozambique)
 */
export const isValidMozambiquePhone = (phone: string): boolean => {
  // Formato: 258 + 9 dígitos ou +258 + 9 dígitos
  const phoneRegex = /^(\+?258)?[8][2-7]\d{7}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Sanitizes phone number
 */
export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d+]/g, '');
};

/**
 * Rate limiting helper
 * Prevents brute force attacks
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  /**
   * Checks if identifier has exceeded rate limit
   */
  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];

    // Remove expired attempts
    const validAttempts = attempts.filter(time => now - time < this.windowMs);

    this.attempts.set(identifier, validAttempts);

    return validAttempts.length >= this.maxAttempts;
  }

  /**
   * Records an attempt
   */
  recordAttempt(identifier: string): void {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    attempts.push(now);
    this.attempts.set(identifier, attempts);
  }

  /**
   * Resets attempts for identifier
   */
  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}
