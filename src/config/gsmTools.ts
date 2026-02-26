// ============================================
// TCHOVA RENT PAINEL - CONFIGURAÇÃO
// Sistema de aluguel de ferramentas GSM
// ============================================

export interface GSMTool {
  id: string;
  name: string;
  description: string;
  category: 'instant' | 'teamviewer' | 'server' | 'box';
  price: number; // Preço por hora em MZN
  minDuration: number; // Duração mínima em horas
  maxDuration: number; // Duração máxima em horas
  features: string[];
  icon: string;
  color: string;
  popular?: boolean;
  available: boolean;
  credentials?: {
    username?: string;
    password?: string;
    url?: string;
  };
}

export interface GSMToolRental {
  id: string;
  toolId: string;
  userId: string;
  userName: string;
  userEmail: string;
  duration: number; // em horas
  price: number;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  credentials: {
    username: string;
    password: string;
    url: string;
  };
  createdAt: Date;
  expiresAt: Date;
  startedAt?: Date;
}

export interface GSMToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

// Categorias de ferramentas GSM
export const GSM_TOOL_CATEGORIES: GSMToolCategory[] = [
  {
    id: 'all',
    name: 'Todas',
    description: 'Todas as ferramentas disponíveis',
    icon: 'Grid'
  },
  {
    id: 'instant',
    name: 'Instantâneas',
    description: 'Ativação instantânea após pagamento',
    icon: 'Zap'
  },
  {
    id: 'teamviewer',
    name: 'TeamViewer',
    description: 'Acesso remoto via TeamViewer',
    icon: 'Monitor'
  },
  {
    id: 'server',
    name: 'Servers',
    description: 'Acesso a servidores de desbloqueio',
    icon: 'Server'
  },
  {
    id: 'box',
    name: 'Boxes',
    description: 'Boxes e dongles de desbloqueio',
    icon: 'Box'
  }
];

// Ferramentas GSM disponíveis para aluguel
export const GSM_TOOLS: GSMTool[] = [
  {
    id: 'chimera',
    name: 'Chimera Tool',
    description: 'Ferramenta profissional para Samsung, HTC, BlackBerry e LG. Suporte completo para FRP, Unlock, IMEI Repair.',
    category: 'instant',
    price: 150, // MZN por hora
    minDuration: 1,
    maxDuration: 24,
    features: [
      'FRP Reset Samsung/HTC/LG',
      'Desbloqueio de rede',
      'IMEI Repair',
      'Flash e firmware',
      'Suporte multi-marca',
      'Ativação instantânea'
    ],
    icon: 'Box',
    color: 'from-primary to-primary-darker',
    popular: true,
    available: true
  },
  {
    id: 'unlocktool',
    name: 'UnlockTool',
    description: 'Servidor de desbloqueio rápido para Samsung, LG, Motorola e outras marcas. Suporte a FRP e Unlock.',
    category: 'server',
    price: 100,
    minDuration: 1,
    maxDuration: 12,
    features: [
      'FRP Reset rápido',
      'Desbloqueio de rede',
      'Suporte Samsung/LG/Moto',
      'Credenciais instantâneas',
      'Alta taxa de sucesso'
    ],
    icon: 'Lock',
    color: 'from-brand-green to-primary',
    available: true
  },
  {
    id: 'tcm',
    name: 'TCM Tool',
    description: 'Ferramenta especializada em FRP e Unlock para dispositivos móveis com suporte técnico dedicado.',
    category: 'server',
    price: 120,
    minDuration: 1,
    maxDuration: 8,
    features: [
      'FRP Reset profissional',
      'Unlock de rede',
      'Suporte técnico dedicado',
      'Atualizações constantes'
    ],
    icon: 'Activity',
    color: 'from-brand-yellow to-accent-light',
    available: true
  },
  {
    id: 'eftpro',
    name: 'EFT Pro',
    description: 'Box profissional com suporte a múltiplas marcas. Ideal para técnicos que trabalham com diversos dispositivos.',
    category: 'box',
    price: 200,
    minDuration: 2,
    maxDuration: 24,
    features: [
      'Suporte multi-marca',
      'FRP Reset universal',
      'IMEI Repair avançado',
      'Flash e firmware',
      'Suporte técnico 24/7'
    ],
    icon: 'Zap',
    color: 'from-brand-bright to-brand-green',
    popular: true,
    available: true
  },
  {
    id: 'hydra',
    name: 'Hydra Tool',
    description: 'Servidor de desbloqueio com suporte a dispositivos chineses e coreanos. Excelente para Oppo, Vivo, Xiaomi.',
    category: 'server',
    price: 80,
    minDuration: 1,
    maxDuration: 12,
    features: [
      'FRP Reset Oppo/Vivo/Xiaomi',
      'Unlock de rede',
      'Suporte dispositivos chineses',
      'Credenciais rápidas'
    ],
    icon: 'RefreshCw',
    color: 'from-primary to-brand-green',
    available: true
  },
  {
    id: 'umtpro',
    name: 'UMT Pro',
    description: 'Box completa para técnicos profissionais. Suporte a Samsung, HTC, LG, Motorola e mais.',
    category: 'box',
    price: 180,
    minDuration: 2,
    maxDuration: 24,
    features: [
      'Suporte multi-marca',
      'FRP Reset universal',
      'IMEI Repair',
      'Flash avançado',
      'Suporte técnico dedicado'
    ],
    icon: 'Smartphone',
    color: 'from-brand-dark to-brand-dark',
    available: true
  },
  {
    id: 'teamviewer-gsm',
    name: 'TeamViewer GSM',
    description: 'Acesso remoto via TeamViewer com ferramentas GSM instaladas. Ideal para serviços específicos.',
    category: 'teamviewer',
    price: 250,
    minDuration: 1,
    maxDuration: 4,
    features: [
      'Acesso remoto completo',
      'Todas as ferramentas instaladas',
      'Suporte técnico ao vivo',
      'Ideal para serviços únicos',
      'Sessão guiada'
    ],
    icon: 'Monitor',
    color: 'from-blue-500 to-blue-600',
    popular: true,
    available: true
  },
  {
    id: 'octoplus',
    name: 'Octoplus Box',
    description: 'Box profissional para Samsung e LG com suporte completo a FRP, Unlock e IMEI Repair.',
    category: 'box',
    price: 160,
    minDuration: 2,
    maxDuration: 24,
    features: [
      'Samsung/LG especializado',
      'FRP Reset avançado',
      'IMEI Repair',
      'Flash e firmware',
      'Suporte técnico'
    ],
    icon: 'Box',
    color: 'from-purple-500 to-purple-600',
    available: true
  },
  {
    id: 'z3x',
    name: 'Z3X Box',
    description: 'Box completa para Samsung, LG e outros. Uma das mais populares entre técnicos GSM.',
    category: 'box',
    price: 140,
    minDuration: 2,
    maxDuration: 24,
    features: [
      'Samsung/LG popular',
      'FRP Reset fácil',
      'Unlock de rede',
      'Suporte ativo',
      'Comunidade grande'
    ],
    icon: 'Box',
    color: 'from-orange-500 to-orange-600',
    available: true
  },
  {
    id: 'miracle',
    name: 'Miracle Box',
    description: 'Box chinesa com excelente custo-benefício. Suporte a múltiplas marcas com ativação rápida.',
    category: 'box',
    price: 100,
    minDuration: 1,
    maxDuration: 12,
    features: [
      'Custo acessível',
      'Multi-marca',
      'FRP Reset',
      'Unlock básico',
      'Ativação rápida'
    ],
    icon: 'Box',
    color: 'from-pink-500 to-pink-600',
    available: true
  }
];

// Preços por duração (descontos progressivos)
export const DURATION_PRICING = {
  1: { multiplier: 1, discount: 0 },      // 1 hora - preço normal
  2: { multiplier: 1.9, discount: 5 },    // 2 horas - 5% desconto
  4: { multiplier: 3.6, discount: 10 },   // 4 horas - 10% desconto
  8: { multiplier: 6.8, discount: 15 },   // 8 horas - 15% desconto
  12: { multiplier: 9.6, discount: 20 },  // 12 horas - 20% desconto
  24: { multiplier: 18, discount: 25 }    // 24 horas - 25% desconto
};

// Calcular preço do aluguel
export const calculateRentalPrice = (
  toolId: string,
  duration: number
): { basePrice: number; discount: number; finalPrice: number } => {
  const tool = GSM_TOOLS.find(t => t.id === toolId);
  if (!tool) {
    return { basePrice: 0, discount: 0, finalPrice: 0 };
  }

  const basePrice = tool.price * duration;
  
  // Encontrar o melhor desconto aplicável
  let discount = 0;
  const durations = Object.keys(DURATION_PRICING).map(Number).sort((a, b) => b - a);
  for (const d of durations) {
    if (duration >= d) {
      discount = DURATION_PRICING[d as keyof typeof DURATION_PRICING].discount;
      break;
    }
  }

  const finalPrice = basePrice * (1 - discount / 100);

  return {
    basePrice,
    discount,
    finalPrice: Math.round(finalPrice)
  };
};

// Gerar credenciais aleatórias
export const generateCredentials = (toolId: string): { username: string; password: string; url: string } => {
  const tool = GSM_TOOLS.find(t => t.id === toolId);
  const randomString = Math.random().toString(36).substring(2, 10);
  const username = `gsm_${toolId}_${randomString}`;
  const password = Math.random().toString(36).substring(2, 12).toUpperCase();
  
  // URLs baseadas na categoria
  const urls: Record<string, string> = {
    instant: 'https://tools.tchova.co.mz/instant',
    server: 'https://server.tchova.co.mz',
    box: 'https://box.tchova.co.mz',
    teamviewer: 'https://teamviewer.tchova.co.mz'
  };

  return {
    username,
    password,
    url: urls[tool?.category || 'instant'] || urls.instant
  };
};

// Verificar se um aluguel está ativo
export const isRentalActive = (rental: GSMToolRental): boolean => {
  if (rental.status !== 'active') return false;
  return new Date() < rental.expiresAt;
};

// Calcular tempo restante
export const getRemainingTime = (rental: GSMToolRental): { hours: number; minutes: number; seconds: number; total: number } => {
  if (!isRentalActive(rental)) {
    return { hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const now = new Date();
  const diff = rental.expiresAt.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { hours, minutes, seconds, total: diff };
};

// Formatar tempo restante
export const formatRemainingTime = (rental: GSMToolRental): string => {
  const { hours, minutes, seconds } = getRemainingTime(rental);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

// API Limits para integração
export const API_LIMITS = {
  requestsPerMinute: 60,
  requestsPerHour: 1000,
  requestsPerDay: 10000
};

// Mensagens de erro
export const GSM_ERROR_MESSAGES = {
  insufficient_balance: 'Saldo insuficiente para alugar esta ferramenta.',
  tool_unavailable: 'Esta ferramenta está temporariamente indisponível.',
  invalid_duration: 'Duração inválida. Escolha entre {min} e {max} horas.',
  rental_not_found: 'Aluguel não encontrado.',
  rental_expired: 'Este aluguel já expirou.',
  rental_active: 'Você já tem um aluguel ativo para esta ferramenta.',
  payment_required: 'Pagamento necessário para ativar o aluguel.',
  session_limit: 'Limite de sessões ativas atingido.',
  api_key_invalid: 'Chave de API inválida.',
  rate_limit_exceeded: 'Limite de requisições excedido. Tente novamente em {time}.'
};

// Mensagens de sucesso
export const GSM_SUCCESS_MESSAGES = {
  rental_created: 'Aluguel criado com sucesso! Credenciais liberadas.',
  rental_extended: 'Aluguel estendido com sucesso!',
  rental_cancelled: 'Aluguel cancelado. Créditos devolvidos.',
  payment_confirmed: 'Pagamento confirmado. Acesso liberado.',
  credentials_sent: 'Credenciais enviadas para seu email.',
  session_started: 'Sessão iniciada com sucesso.'
};