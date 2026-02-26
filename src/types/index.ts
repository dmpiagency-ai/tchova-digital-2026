/**
 * ============================================
 * TIPOS CENTRALIZADOS - TCHOVA DIGITAL
 * ============================================
 * Este arquivo exporta todos os tipos do projeto
 * para facilitar importações e manter consistência
 */

// ============================================
// TIPOS DE SERVIÇOS
// ============================================

export type ServiceCategory = 
  | 'audiovisual' 
  | 'gsm' 
  | 'importacao' 
  | 'marketing' 
  | 'design' 
  | 'desenvolvimento';

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  category: ServiceCategory;
  image: string;
  icon?: string;
  price?: number;
  originalPrice?: number;
  features: string[];
  benefits: ServiceBenefit[];
  packages?: ServicePackage[];
  extras?: ServiceExtra[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceBenefit {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  recommended?: boolean;
}

export interface ServiceExtra {
  id: string;
  name: string;
  price: number;
  description: string;
}

// ============================================
// TIPOS DE GSM
// ============================================

export interface GSMTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  price: number;
  estimatedTime: string;
  requiresIMEI?: boolean;
  requiresModel?: boolean;
}

export interface GSMService {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
}

export interface GSMBrand {
  id: string;
  name: string;
  logo: string;
  models: string[];
}

// ============================================
// TIPOS DE CHECKOUT E PAGAMENTO
// ============================================

export type PaymentMethod = 
  | 'credit_card' 
  | 'paypal' 
  | 'mpesa' 
  | 'emola' 
  | 'bank_transfer';

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  notes?: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentDetails {
  method: PaymentMethod;
  amount: number;
  currency: string;
  reference?: string;
  status: PaymentStatus;
}

export type PaymentStatus = 
  | 'pending' 
  | 'processing' 
  | 'completed' 
  | 'failed' 
  | 'refunded';

// ============================================
// TIPOS DE UTILIZADOR
// ============================================

export type UserRole = 'admin' | 'client' | 'guest';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// TIPOS DE FORMULÁRIO
// ============================================

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[];
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: string | number | RegExp;
  message: string;
}

// ============================================
// TIPOS DE UI/COMPONENTES
// ============================================

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'destructive';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ToastConfig {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export interface ModalConfig {
  isOpen: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

// ============================================
// TIPOS DE API
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ============================================
// TIPOS DE WHATSAPP
// ============================================

export interface WhatsAppConfig {
  phoneNumber: string;
  defaultMessage?: string;
  businessName: string;
}

export interface WhatsAppMessage {
  to: string;
  body: string;
  mediaUrl?: string;
}

// ============================================
// TIPOS DE ANALYTICS
// ============================================

export interface AnalyticsEvent {
  name: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: Date;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  timestamp: Date;
}

// ============================================
// TIPOS DE MOÇAMBIQUE (Localização)
// ============================================

export interface Province {
  id: string;
  name: string;
  code: string;
  cities: City[];
}

export interface City {
  id: string;
  name: string;
  provinceId: string;
}

export const MOZAMBIQUE_PROVINCES: Province[] = [
  { id: '1', name: 'Maputo Cidade', code: 'MPM', cities: [{ id: '1', name: 'Maputo', provinceId: '1' }] },
  { id: '2', name: 'Maputo Província', code: 'MP', cities: [{ id: '2', name: 'Matola', provinceId: '2' }] },
  { id: '3', name: 'Gaza', code: 'GZ', cities: [{ id: '3', name: 'Xai-Xai', provinceId: '3' }] },
  { id: '4', name: 'Inhambane', code: 'IN', cities: [{ id: '4', name: 'Inhambane', provinceId: '4' }] },
  { id: '5', name: 'Sofala', code: 'SF', cities: [{ id: '5', name: 'Beira', provinceId: '5' }] },
  { id: '6', name: 'Manica', code: 'MN', cities: [{ id: '6', name: 'Chimoio', provinceId: '6' }] },
  { id: '7', name: 'Tete', code: 'TT', cities: [{ id: '7', name: 'Tete', provinceId: '7' }] },
  { id: '8', name: 'Zambézia', code: 'ZB', cities: [{ id: '8', name: 'Quelimane', provinceId: '8' }] },
  { id: '9', name: 'Nampula', code: 'NP', cities: [{ id: '9', name: 'Nampula', provinceId: '9' }] },
  { id: '10', name: 'Cabo Delgado', code: 'CD', cities: [{ id: '10', name: 'Pemba', provinceId: '10' }] },
  { id: '11', name: 'Niassa', code: 'NS', cities: [{ id: '11', name: 'Lichinga', provinceId: '11' }] },
];

// ============================================
// EXPORTAÇÕES DE TIPOS EXISTENTES
// ============================================

export * from './user';
export * from './payment';
