/**
 * ============================================
 * FUNÇÕES UTILITÁRIAS - TCHOVA DIGITAL
 * ============================================
 * Funções auxiliares reutilizáveis em todo o projeto
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// UTILITÁRIOS DE CSS
// ============================================

/**
 * Combina classes CSS com suporte a Tailwind
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================
// UTILITÁRIOS DE FORMATAÇÃO
// ============================================

/**
 * Formata preço em Metical moçambicano
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-MZ', {
    style: 'currency',
    currency: 'MZN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * Formata preço com símbolo personalizado
 */
export function formatPriceCustom(price: number, symbol: string = 'MT'): string {
  return `${price.toLocaleString('pt-MZ')} ${symbol}`;
}

/**
 * Formata número de telefone moçambicano
 */
export function formatPhone(phone: string): string {
  // Remove caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '');
  
  // Adiciona código do país se não tiver
  const withCountryCode = cleaned.startsWith('258') ? cleaned : `258${cleaned}`;
  
  // Formata como +258 84 123 4567
  return `+${withCountryCode.slice(0, 3)} ${withCountryCode.slice(3, 5)} ${withCountryCode.slice(5, 8)} ${withCountryCode.slice(8)}`;
}

/**
 * Formata data para exibição
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-MZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  });
}

/**
 * Formata data e hora para exibição
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('pt-MZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Formata data relativa (há X dias, etc.)
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Agora mesmo';
  if (diffInSeconds < 3600) return `Há ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `Há ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 604800) return `Há ${Math.floor(diffInSeconds / 86400)} dias`;
  if (diffInSeconds < 2592000) return `Há ${Math.floor(diffInSeconds / 604800)} semanas`;
  
  return formatDate(d);
}

// ============================================
// UTILITÁRIOS DE VALIDAÇÃO
// ============================================

/**
 * Valida email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida telefone moçambicano
 */
export function isValidMozambiquePhone(phone: string): boolean {
  // Aceita formatos: 84XXXXXXX, +25884XXXXXXX, 25884XXXXXXX
  const cleaned = phone.replace(/\D/g, '');
  const phoneRegex = /^(258)?[8][2-7][0-9]{7}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Valida força da senha
 */
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  const score = [hasMinLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
    .filter(Boolean).length;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

// ============================================
// UTILITÁRIOS DE STRING
// ============================================

/**
 * Gera slug a partir de texto
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')     // Substitui caracteres especiais por hífen
    .replace(/(^-|-$)/g, '');        // Remove hífens do início e fim
}

/**
 * Trunca texto com ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * Capitaliza primeira letra
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Capitaliza todas as palavras
 */
export function capitalizeWords(text: string): string {
  return text.split(' ').map(capitalize).join(' ');
}

/**
 * Remove acentos de texto
 */
export function removeAccents(text: string): string {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// ============================================
// UTILITÁRIOS DE ARRAY
// ============================================

/**
 * Remove duplicados de array
 */
export function uniqueArray<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Agrupa array por propriedade
 */
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Ordena array por propriedade
 */
export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Divide array em chunks
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// ============================================
// UTILITÁRIOS DE OBJETO
// ============================================

/**
 * Deep clone de objeto
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Verifica se objeto está vazio
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Remove propriedades undefined/null de objeto
 */
export function omitNullish<T extends object>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key as keyof T] = value as T[keyof T];
    }
    return acc;
  }, {} as Partial<T>);
}

// ============================================
// UTILITÁRIOS DE URL
// ============================================

/**
 * Obtém parâmetros de query string
 */
export function getQueryParams(url?: string): Record<string, string> {
  const searchParams = new URLSearchParams(
    url ? new URL(url).search : window.location.search
  );
  
  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    params[key] = value;
  });
  
  return params;
}

/**
 * Constrói query string a partir de objeto
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
}

/**
 * Verifica se URL é válida
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// UTILITÁRIOS DE WHATSAPP
// ============================================

/**
 * Gera link de WhatsApp
 */
export function getWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`;
}

/**
 * Gera mensagem de orçamento para WhatsApp
 */
export function generateQuoteMessage(service: string, details?: string): string {
  let message = `Olá! Gostaria de solicitar um orçamento para ${service}.`;
  if (details) {
    message += `\n\nDetalhes:\n${details}`;
  }
  return message;
}

// ============================================
// UTILITÁRIOS DE STORAGE
// ============================================

/**
 * Salva no localStorage com tratamento de erro
 */
export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Obtém do localStorage com tratamento de erro
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
}

/**
 * Remove do localStorage
 */
export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
}

// ============================================
// UTILITÁRIOS DE SCROLL
// ============================================

/**
 * Scroll suave para elemento
 */
export function scrollToElement(elementId: string, offset: number = 0): void {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/**
 * Scroll para o topo da página
 */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================
// UTILITÁRIOS DE CÁLCULO
// ============================================

/**
 * Calcula porcentagem
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Calcula desconto
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Formata bytes para tamanho legível
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ============================================
// UTILITÁRIOS DE DEBOUNCE E THROTTLE
// ============================================

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============================================
// UTILITÁRIOS DE COPY
// ============================================

/**
 * Copia texto para clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

// ============================================
// UTILITÁRIOS DE RANDOM
// ============================================

/**
 * Gera ID único
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Gera número aleatório em range
 */
export function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Embaralha array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  // CSS
  cn,
  
  // Formatação
  formatPrice,
  formatPriceCustom,
  formatPhone,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  
  // Validação
  isValidEmail,
  isValidMozambiquePhone,
  getPasswordStrength,
  
  // String
  slugify,
  truncate,
  capitalize,
  capitalizeWords,
  removeAccents,
  
  // Array
  uniqueArray,
  groupBy,
  sortBy,
  chunk,
  
  // Objeto
  deepClone,
  isEmpty,
  omitNullish,
  
  // URL
  getQueryParams,
  buildQueryString,
  isValidUrl,
  
  // WhatsApp
  getWhatsAppLink,
  generateQuoteMessage,
  
  // Storage
  saveToStorage,
  getFromStorage,
  removeFromStorage,
  
  // Scroll
  scrollToElement,
  scrollToTop,
  
  // Cálculo
  calculatePercentage,
  calculateDiscount,
  formatFileSize,
  
  // Debounce/Throttle
  debounce,
  throttle,
  
  // Copy
  copyToClipboard,
  
  // Random
  generateId,
  randomInRange,
  shuffleArray
};
