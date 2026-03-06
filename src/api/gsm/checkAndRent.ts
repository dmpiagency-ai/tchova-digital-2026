/**
 * ============================================
 * TCHOVA DIGITAL - GSM CHECKTOOL & RENT API
 * ============================================
 * API handlers for checking tool status and renting tools
 * Integrates with 4YouTech Rent Painel inspired functionality
 */

import { GSM_TOOLS, getToolById } from '@/config/gsmToolsConfig';
import type { GSMTool, Currency, UserLevel } from '@/types/gsm';

// ============================================
// TYPES
// ============================================

export interface ChecktoolRequest {
  toolId: string;
  inputData: string; // IMEI or Serial number
  userId: string;
}

export interface ChecktoolResponse {
  success: boolean;
  data?: {
    toolId: string;
    inputData: string;
    status: 'available' | 'unavailable' | 'locked' | 'blacklisted' | 'clean';
    message: string;
    details?: {
      carrier?: string;
      model?: string;
      imeiStatus?: string;
      blacklistStatus?: string;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface RentRequest {
  toolId: string;
  duration: number; // hours
  imei?: string;
  serial?: string;
  userId: string;
}

export interface RentResponse {
  success: boolean;
  data?: {
    rentalId: string;
    toolId: string;
    toolName: string;
    duration: number;
    startTime: string;
    endTime: string;
    credentials?: {
      username: string;
      password: string;
      accessUrl: string;
    };
    price: {
      original: number;
      discount: number;
      final: number;
      currency: Currency;
    };
  };
  error?: {
    code: string;
    message: string;
  };
}

// ============================================
// SIMULATED EXTERNAL API CALLS
// ============================================

/**
 * Simulates calling external 4YouTech API to check IMEI/Serial
 * In production, this would call actual provider APIs
 */
async function checkExternalAPI(toolId: string, inputData: string): Promise<{
  status: 'available' | 'unavailable' | 'locked' | 'blacklisted' | 'clean';
  message: string;
  details?: {
    carrier?: string;
    model?: string;
    imeiStatus?: string;
    blacklistStatus?: string;
  };
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

  // Simulate different responses based on input
  const input = inputData.toUpperCase();
  
  // Check if it's a valid IMEI format (15 digits)
  const isIMEI = /^\d{15}$/.test(inputData);
  const isSerial = input.length >= 8 && input.length <= 20;

  if (!isIMEI && !isSerial) {
    return {
      status: 'unavailable',
      message: 'Formato de IMEI/Serial inválido',
    };
  }

  // Simulate different statuses based on input hash for consistency
  const hash = input.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const statusrand = Math.abs(hash) % 10;

  if (statusrand < 6) {
    // 60% - Clean/Available
    const carriers = ['Vodacom', 'Movitel', 'Mcel', 'Unknown'];
    const models = ['iPhone 13', 'Samsung S21', 'Xiaomi Mi 11', 'Unknown'];
    
    return {
      status: 'clean',
      message: 'Dispositivo está limpo -sem restrições',
      details: {
        carrier: carriers[Math.abs(hash) % carriers.length],
        model: models[Math.abs(hash) % models.length],
        imeiStatus: 'Clean',
        blacklistStatus: 'Clean',
      },
    };
  } else if (statusrand < 8) {
    // 20% - Locked
    return {
      status: 'locked',
      message: 'Dispositivo está bloqueado por carrier',
      details: {
        imeiStatus: 'Locked',
        blacklistStatus: 'Clean',
      },
    };
  } else if (statusrand < 9) {
    // 10% - Blacklisted
    return {
      status: 'blacklisted',
      message: 'Dispositivo está na lista negra (roubo/perda)',
      details: {
        imeiStatus: 'Blacklisted',
        blacklistStatus: 'Blacklisted',
      },
    };
  } else {
    // 10% - Unavailable
    return {
      status: 'unavailable',
      message: 'Não foi possível verificar o dispositivo',
    };
  }
}

/**
 * Simulates renting from external provider
 * In production, this would call actual 4YouTech API
 */
async function rentFromExternalAPI(
  toolId: string,
  duration: number,
  imei?: string,
  serial?: string
): Promise<{
  success: boolean;
  credentials?: {
    username: string;
    password: string;
    accessUrl: string;
  };
  error?: string;
}> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1500));

  const tool = getToolById(toolId);
  if (!tool) {
    return {
      success: false,
      error: 'Ferramenta não encontrada',
    };
  }

  // Check if tool has available slots
  const availableSlots = (tool.slots?.total || 10) - (tool.slots?.occupied || 0);
  if (availableSlots <= 0) {
    return {
      success: false,
      error: 'Slots esgotados para esta ferramenta',
    };
  }

  // Simulate successful rental with credentials
  // In production, these would come from the actual provider
  const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
  
  return {
    success: true,
    credentials: {
      username: `tchova_${randomId}`,
      password: `Tx${Date.now()}!${randomId}`,
      accessUrl: `https://panel.4youtech.com/tool/${toolId}?token=${randomId}`,
    },
  };
}

// ============================================
// API HANDLERS
// ============================================

/**
 * Checktool API Handler
 * Validates IMEI/Serial and returns device status
 */
export async function handleChecktool(request: ChecktoolRequest): Promise<ChecktoolResponse> {
  const { toolId, inputData, userId } = request;

  // Validate input
  if (!toolId || !inputData) {
    return {
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Tool ID e dados de entrada são obrigatórios',
      },
    };
  }

  // Validate user
  if (!userId || userId === 'anonymous') {
    return {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Utilizador não autenticado',
      },
    };
  }

  // Get tool info
  const tool = getToolById(toolId);
  if (!tool) {
    return {
      success: false,
      error: {
        code: 'TOOL_NOT_FOUND',
        message: 'Ferramenta não encontrada',
      },
    };
  }

  // Validate input format based on tool requirements
  if (tool.requires_imei && !/^\d{15}$/.test(inputData)) {
    return {
      success: false,
      error: {
        code: 'INVALID_IMEI',
        message: 'IMEI deve ter 15 dígitos',
      },
    };
  }

  if (tool.requires_serial && inputData.length < 8) {
    return {
      success: false,
      error: {
        code: 'INVALID_SERIAL',
        message: 'Serial deve ter pelo menos 8 caracteres',
      },
    };
  }

  try {
    // Call external API (simulated)
    const result = await checkExternalAPI(toolId, inputData);

    return {
      success: true,
      data: {
        toolId,
        inputData,
        status: result.status,
        message: result.message,
        details: result.details,
      },
    };
  } catch (error) {
    console.error('Checktool error:', error);
    return {
      success: false,
      error: {
        code: 'EXTERNAL_ERROR',
        message: 'Erro ao verificar dispositivo. Tente novamente.',
      },
    };
  }
}

/**
 * Rent Tool API Handler
 * Creates rental and returns access credentials
 */
export async function handleRent(request: RentRequest): Promise<RentResponse> {
  const { toolId, duration, imei, serial, userId } = request;

  // Validate input
  if (!toolId || !duration) {
    return {
      success: false,
      error: {
        code: 'INVALID_REQUEST',
        message: 'Tool ID e duração são obrigatórios',
      },
    };
  }

  // Validate user
  if (!userId || userId === 'anonymous') {
    return {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Utilizador não autenticado',
      },
    };
  }

  // Get tool info
  const tool = getToolById(toolId);
  if (!tool) {
    return {
      success: false,
      error: {
        code: 'TOOL_NOT_FOUND',
        message: 'Ferramenta não encontrada',
      },
    };
  }

  // Validate duration
  if (duration < tool.duration.min || duration > tool.duration.max) {
    return {
      success: false,
      error: {
        code: 'INVALID_DURATION',
        message: `Duração deve estar entre ${tool.duration.min} e ${tool.duration.max} horas`,
      },
    };
  }

  // Validate IMEI/Serial if required
  if (tool.requires_imei && !imei) {
    return {
      success: false,
      error: {
        code: 'IMEI_REQUIRED',
        message: 'IMEI é obrigatório para esta ferramenta',
      },
    };
  }

  if (tool.requires_serial && !serial) {
    return {
      success: false,
      error: {
        code: 'SERIAL_REQUIRED',
        message: 'Serial é obrigatório para esta ferramenta',
      },
    };
  }

  try {
    // Call external API (simulated)
    const result = await rentFromExternalAPI(toolId, duration, imei, serial);

    if (!result.success) {
      return {
        success: false,
        error: {
          code: 'RENTAL_FAILED',
          message: result.error || 'Erro ao processar aluguel',
        },
      };
    }

    // Calculate pricing
    // In production, this would come from backend with user level discounts
    const basePrice = tool.pricing.cliente.mtn; // Base price in MTN
    const hourlyRate = basePrice; // Price per hour
    const originalPrice = hourlyRate * duration;
    
    // Apply discount based on duration
    let discount = 0;
    if (duration >= 24) {
      discount = 20;
    } else if (duration >= 12) {
      discount = 15;
    } else if (duration >= 8) {
      discount = 10;
    } else if (duration >= 4) {
      discount = 5;
    }
    
    const finalPrice = originalPrice * (1 - discount / 100);

    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 60 * 60 * 1000);

    return {
      success: true,
      data: {
        rentalId: `RNT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        toolId,
        toolName: tool.name,
        duration,
        startTime: now.toISOString(),
        endTime: endTime.toISOString(),
        credentials: result.credentials,
        price: {
          original: originalPrice,
          discount,
          final: finalPrice,
          currency: 'MTN' as Currency,
        },
      },
    };
  } catch (error) {
    console.error('Rent error:', error);
    return {
      success: false,
      error: {
        code: 'EXTERNAL_ERROR',
        message: 'Erro ao processar aluguel. Tente novamente.',
      },
    };
  }
}

// ============================================
// FRONTEND API FUNCTIONS
// ============================================

/**
 * Checktool - Frontend function to call the API
 */
export async function checkTool(
  toolId: string,
  inputData: string,
  userId: string
): Promise<ChecktoolResponse> {
  // In a real app, this would be a fetch call to your backend
  // For now, we'll call the handler directly
  return handleChecktool({ toolId, inputData, userId });
}

/**
 * Rent Tool - Frontend function to call the API
 */
export async function rentTool(
  toolId: string,
  duration: number,
  userId: string,
  imei?: string,
  serial?: string
): Promise<RentResponse> {
  // In a real app, this would be a fetch call to your backend
  // For now, we'll call the handler directly
  return handleRent({ toolId, duration, imei, serial, userId });
}

export default {
  checkTool,
  rentTool,
};
