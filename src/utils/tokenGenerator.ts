/**
 * Secure Token Generator for Client Panel Access
 * 
 * Generates cryptographically secure, non-sequential tokens
 * for client project access without authentication.
 */

/**
 * Generate a secure random token
 * @param length - Token length (default: 16 characters, minimum: 12)
 * @returns Secure random token string
 */
export const generateSecureToken = (length: number = 16): string => {
  const minLength = 12;
  const actualLength = Math.max(length, minLength);
  
  // Characters to use: uppercase, lowercase, numbers (excluding ambiguous chars)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  
  let token = '';
  const array = new Uint8Array(actualLength);
  
  // Use crypto.getRandomValues for cryptographically secure randomness
  crypto.getRandomValues(array);
  
  for (let i = 0; i < actualLength; i++) {
    token += chars[array[i] % chars.length];
  }
  
  return token;
};

/**
 * Generate a token with expiration date
 * @param expirationDays - Days until token expires (default: 90)
 * @returns Object with token and expiration date
 */
export const generateTokenWithExpiration = (expirationDays: number = 90): {
  token: string;
  expiresAt: Date;
} => {
  const token = generateSecureToken(16);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expirationDays);
  
  return {
    token,
    expiresAt
  };
};

/**
 * Validate if a token format is correct
 * @param token - Token to validate
 * @returns Boolean indicating if token format is valid
 */
export const isValidTokenFormat = (token: string): boolean => {
  // Token should be 12-24 characters, alphanumeric
  const tokenRegex = /^[A-Za-z0-9]{12,24}$/;
  return tokenRegex.test(token);
};

/**
 * Check if a token is expired
 * @param expiresAt - Expiration date string or Date object
 * @returns Boolean indicating if token is expired
 */
export const isTokenExpired = (expiresAt: string | Date): boolean => {
  const expiration = typeof expiresAt === 'string' ? new Date(expiresAt) : expiresAt;
  return expiration < new Date();
};

/**
 * Generate a unique project access URL
 * @param token - Secure token
 * @param baseUrl - Base URL of the application
 * @returns Full URL for client panel access
 */
export const generateProjectAccessUrl = (token: string, baseUrl: string = 'https://tchova.co'): string => {
  return `${baseUrl}/painel/${token}`;
};

/**
 * Store token in localStorage for auto-reentry
 * @param token - Token to store
 * @param projectId - Associated project ID
 */
export const storeTokenLocally = (token: string, projectId: string): void => {
  try {
    const tokenData = {
      token,
      projectId,
      storedAt: new Date().toISOString()
    };
    localStorage.setItem('tchova_client_token', JSON.stringify(tokenData));
  } catch (error) {
    console.error('Error storing token locally:', error);
  }
};

/**
 * Retrieve stored token from localStorage
 * @returns Stored token data or null
 */
export const getStoredToken = (): { token: string; projectId: string; storedAt: string } | null => {
  try {
    const stored = localStorage.getItem('tchova_client_token');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error retrieving stored token:', error);
  }
  return null;
};

/**
 * Clear stored token from localStorage
 */
export const clearStoredToken = (): void => {
  try {
    localStorage.removeItem('tchova_client_token');
  } catch (error) {
    console.error('Error clearing stored token:', error);
  }
};

/**
 * Mock client project data for development
 * In production, this would come from a database
 */
export interface ClientProject {
  id: string;
  token: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: string;
  paymentStatus: 'entry-50' | 'full' | 'final';
  paymentAmount: number;
  projectStatus: 'initiated' | 'in_development' | 'in_review' | 'completed';
  createdAt: Date;
  expiresAt: Date;
  notes?: string;
}

/**
 * Mock database of client projects
 * In production, this would be a real database
 */
export const MOCK_CLIENT_PROJECTS: ClientProject[] = [
  {
    id: 'PRJ-001',
    token: '84HF92KLS9XJ',
    clientName: 'João Silva',
    clientEmail: 'joao@email.com',
    clientPhone: '+25884123456',
    serviceId: '1',
    serviceTitle: 'Design de Logótipo Profissional',
    serviceCategory: 'Design Gráfico',
    paymentStatus: 'entry-50',
    paymentAmount: 5000,
    projectStatus: 'in_development',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 dias atrás
    expiresAt: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000), // 75 dias no futuro
    notes: 'Cliente prefere cores vibrantes'
  },
  {
    id: 'PRJ-002',
    token: 'MN7PQR4TUVWX',
    clientName: 'Maria Santos',
    clientEmail: 'maria@empresa.com',
    clientPhone: '+25884987654',
    serviceId: '2',
    serviceTitle: 'Site Institucional',
    serviceCategory: 'Desenvolvimento Web',
    paymentStatus: 'full',
    paymentAmount: 25000,
    projectStatus: 'in_review',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 dias atrás
    expiresAt: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000), // 70 dias no futuro
    notes: 'Site para restaurante'
  },
  {
    id: 'PRJ-003',
    token: 'ABC123DEF456',
    clientName: 'Pedro Machava',
    clientEmail: 'pedro@gmail.com',
    clientPhone: '+25884111222',
    serviceId: '3',
    serviceTitle: 'Produção Audiovisual - Pacote VIP',
    serviceCategory: 'Produção Audiovisual',
    paymentStatus: 'final',
    paymentAmount: 35000,
    projectStatus: 'completed',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 dias atrás
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 dias no futuro
    notes: 'Casamento dia 15 de Fevereiro'
  }
];

/**
 * Find project by token (mock implementation)
 * In production, this would query a database
 * @param token - Token to search for
 * @returns Client project or null
 */
export const findProjectByToken = (token: string): ClientProject | null => {
  const project = MOCK_CLIENT_PROJECTS.find(p => p.token === token);
  return project || null;
};

/**
 * Validate token and return project if valid
 * @param token - Token to validate
 * @returns Object with validation result and project if valid
 */
export const validateToken = (token: string): {
  valid: boolean;
  expired: boolean;
  project: ClientProject | null;
  error?: string;
} => {
  // Check token format
  if (!isValidTokenFormat(token)) {
    return {
      valid: false,
      expired: false,
      project: null,
      error: 'Formato de token inválido'
    };
  }
  
  // Find project
  const project = findProjectByToken(token);
  
  if (!project) {
    return {
      valid: false,
      expired: false,
      project: null,
      error: 'Token não encontrado'
    };
  }
  
  // Check expiration
  if (isTokenExpired(project.expiresAt)) {
    return {
      valid: false,
      expired: true,
      project: null,
      error: 'Token expirado'
    };
  }
  
  return {
    valid: true,
    expired: false,
    project
  };
};
