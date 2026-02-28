// ============================================
// GSM TOOLS CONFIGURATION
// Catálogo de ferramentas GSM com preços em níveis
// ============================================

import { GSMTool, ToolCategory } from '@/types/gsm';

// ============================================
// TOOL CATEGORIES
// ============================================

export interface ToolCategoryInfo {
  id: ToolCategory | 'all';
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const TOOL_CATEGORIES: ToolCategoryInfo[] = [
  {
    id: 'all',
    name: 'Todas',
    description: 'Todas as ferramentas disponíveis',
    icon: 'Grid',
    color: 'from-gray-500 to-gray-600'
  },
  {
    id: 'instant',
    name: 'Instantâneas',
    description: 'Ativação instantânea após pagamento',
    icon: 'Zap',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'server',
    name: 'Servidores',
    description: 'Acesso a servidores de desbloqueio',
    icon: 'Server',
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'box',
    name: 'Boxes',
    description: 'Boxes e dongles de desbloqueio',
    icon: 'Box',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'teamviewer',
    name: 'TeamViewer',
    description: 'Acesso remoto via TeamViewer',
    icon: 'Monitor',
    color: 'from-green-500 to-teal-500'
  }
];

// ============================================
// TOOLS CATALOG
// ============================================

export const GSM_TOOLS: GSMTool[] = [
  // ============================================
  // INSTANT TOOLS
  // ============================================
  {
    id: 'mdm-fix-tool',
    key: 'MDM',
    name: 'MDM FIX TOOL',
    description: 'Ferramenta especializada para remoção de MDM (Mobile Device Management) em dispositivos Apple e Android. Ideal para técnicos que trabalham com dispositivos corporativos.',
    shortDescription: 'KG, IT ADMIN AND MDM HOT TOOL',
    category: 'instant',
    pricing: {
      cliente: { usd: 2.41, mtn: 154.24 },
      vip: { usd: 2.05, mtn: 131.10 },
      revenda: { usd: 1.69, mtn: 107.97 }
    },
    duration: {
      min: 1,
      max: 24,
      options: [1, 2, 4, 6, 8, 12, 24]
    },
    features: [
      'MDM Bypass iOS/Android',
      'KG (Knox Guard) Removal',
      'IT Admin Removal',
      'Ativação Instantânea',
      'Suporte 24/7',
      'Alta Taxa de Sucesso'
    ],
    icon: 'Shield',
    color: '#FF6B00',
    gradient: 'from-orange-500 to-red-500',
    popular: true,
    available: true,
    slots: {
      total: 10,
      occupied: 2
    },
    server: {
      url: 'https://mdm.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['MDM', 'iOS', 'Android', 'Knox', 'Instant'],
    rating: 4.9,
    reviewCount: 156,
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1772201650/Gemini_Generated_Image_uw5vn1uw5vn1uw5v_civaxn.png'
  },
  {
    id: 'frp-bypass-pro',
    key: 'FRP',
    name: 'FRP Bypass Pro',
    description: 'Solução profissional para remoção de FRP (Factory Reset Protection) em dispositivos Samsung, LG, Motorola e outras marcas.',
    shortDescription: 'FRP Removal Samsung/LG/Moto/Outros',
    category: 'instant',
    pricing: {
      cliente: { usd: 1.50, mtn: 96.00 },
      vip: { usd: 1.28, mtn: 81.60 },
      revenda: { usd: 1.05, mtn: 67.20 }
    },
    duration: {
      min: 1,
      max: 12,
      options: [1, 2, 4, 6, 8, 12]
    },
    features: [
      'FRP Reset Samsung',
      'FRP Reset LG',
      'FRP Reset Motorola',
      'Suporte Multi-Marca',
      'Credenciais Instantâneas'
    ],
    icon: 'Lock',
    color: '#3B82F6',
    gradient: 'from-blue-500 to-indigo-500',
    popular: true,
    available: true,
    slots: {
      total: 15,
      occupied: 5
    },
    server: {
      url: 'https://frp.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['FRP', 'Samsung', 'LG', 'Motorola', 'Instant'],
    rating: 4.8,
    reviewCount: 234
  },
  {
    id: 'imei-repair-tool',
    key: 'IMEI',
    name: 'IMEI Repair Tool',
    description: 'Ferramenta avançada para reparação de IMEI em dispositivos Android. Suporte para múltiplas marcas com alta taxa de sucesso.',
    shortDescription: 'Reparação de IMEI Android',
    category: 'instant',
    pricing: {
      cliente: { usd: 3.00, mtn: 192.00 },
      vip: { usd: 2.55, mtn: 163.20 },
      revenda: { usd: 2.10, mtn: 134.40 }
    },
    duration: {
      min: 1,
      max: 8,
      options: [1, 2, 4, 6, 8]
    },
    features: [
      'IMEI Repair Samsung',
      'IMEI Repair Xiaomi',
      'IMEI Repair Oppo/Vivo',
      'Backup NV Data',
      'Restore Original IMEI'
    ],
    icon: 'Smartphone',
    color: '#10B981',
    gradient: 'from-green-500 to-emerald-500',
    popular: false,
    available: true,
    slots: {
      total: 8,
      occupied: 1
    },
    server: {
      url: 'https://imei.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['IMEI', 'Repair', 'Android', 'Samsung', 'Xiaomi'],
    rating: 4.7,
    reviewCount: 89
  },

  // ============================================
  // SERVER TOOLS
  // ============================================
  {
    id: 'chimera-tool',
    key: 'CHIMERA',
    name: 'Chimera Tool',
    description: 'Ferramenta profissional completa para Samsung, HTC, BlackBerry e LG. Suporte total para FRP, Unlock, IMEI Repair e muito mais.',
    shortDescription: 'Samsung/HTC/LG/BlackBerry Pro Tool',
    category: 'server',
    pricing: {
      cliente: { usd: 4.00, mtn: 256.00 },
      vip: { usd: 3.40, mtn: 217.60 },
      revenda: { usd: 2.80, mtn: 179.20 }
    },
    duration: {
      min: 1,
      max: 24,
      options: [1, 2, 4, 6, 8, 12, 24]
    },
    features: [
      'FRP Reset Samsung/HTC/LG',
      'Desbloqueio de Rede',
      'IMEI Repair Avançado',
      'Flash e Firmware',
      'Suporte Multi-Marca',
      'Atualizações Constantes'
    ],
    icon: 'Box',
    color: '#8B5CF6',
    gradient: 'from-purple-500 to-violet-500',
    popular: true,
    available: true,
    slots: {
      total: 20,
      occupied: 8
    },
    server: {
      url: 'https://chimera.tchova.co.mz',
      port: 8080,
      protocol: 'https'
    },
    tags: ['Chimera', 'Samsung', 'HTC', 'LG', 'FRP', 'Unlock'],
    rating: 4.9,
    reviewCount: 412
  },
  {
    id: 'unlocktool-server',
    key: 'UNLOCKTOOL',
    name: 'UnlockTool',
    description: 'Servidor de desbloqueio rápido para Samsung, LG, Motorola e outras marcas. Excelente para FRP e Unlock de rede.',
    shortDescription: 'Servidor Unlock Rápido Multi-Marca',
    category: 'server',
    pricing: {
      cliente: { usd: 2.50, mtn: 160.00 },
      vip: { usd: 2.13, mtn: 136.00 },
      revenda: { usd: 1.75, mtn: 112.00 }
    },
    duration: {
      min: 1,
      max: 12,
      options: [1, 2, 4, 6, 8, 12]
    },
    features: [
      'FRP Reset Rápido',
      'Unlock de Rede',
      'Suporte Samsung/LG/Moto',
      'Credenciais Instantâneas',
      'Alta Taxa de Sucesso'
    ],
    icon: 'Key',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    popular: true,
    available: true,
    slots: {
      total: 25,
      occupied: 12
    },
    server: {
      url: 'https://unlock.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['Unlock', 'FRP', 'Samsung', 'LG', 'Motorola'],
    rating: 4.8,
    reviewCount: 567
  },
  {
    id: 'hydra-tool',
    key: 'HYDRA',
    name: 'Hydra Tool',
    description: 'Servidor especializado em dispositivos chineses e coreanos. Excelente suporte para Oppo, Vivo, Xiaomi, Realme.',
    shortDescription: 'Especialista em Dispositivos Chineses',
    category: 'server',
    pricing: {
      cliente: { usd: 2.00, mtn: 128.00 },
      vip: { usd: 1.70, mtn: 108.80 },
      revenda: { usd: 1.40, mtn: 89.60 }
    },
    duration: {
      min: 1,
      max: 12,
      options: [1, 2, 4, 6, 8, 12]
    },
    features: [
      'FRP Reset Oppo/Vivo/Xiaomi',
      'Unlock de Rede',
      'Suporte Dispositivos Chineses',
      'Credenciais Rápidas',
      'Atualizações Frequentes'
    ],
    icon: 'RefreshCw',
    color: '#06B6D4',
    gradient: 'from-cyan-500 to-blue-500',
    popular: false,
    available: true,
    slots: {
      total: 15,
      occupied: 3
    },
    server: {
      url: 'https://hydra.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['Hydra', 'Oppo', 'Vivo', 'Xiaomi', 'FRP'],
    rating: 4.6,
    reviewCount: 178
  },
  {
    id: 'tcm-tool',
    key: 'TCM',
    name: 'TCM Tool',
    description: 'Ferramenta especializada em FRP e Unlock para dispositivos móveis com suporte técnico dedicado.',
    shortDescription: 'FRP e Unlock com Suporte Dedicado',
    category: 'server',
    pricing: {
      cliente: { usd: 3.00, mtn: 192.00 },
      vip: { usd: 2.55, mtn: 163.20 },
      revenda: { usd: 2.10, mtn: 134.40 }
    },
    duration: {
      min: 1,
      max: 8,
      options: [1, 2, 4, 6, 8]
    },
    features: [
      'FRP Reset Profissional',
      'Unlock de Rede',
      'Suporte Técnico Dedicado',
      'Atualizações Constantes',
      'Multi-Marca'
    ],
    icon: 'Activity',
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    popular: false,
    available: true,
    slots: {
      total: 10,
      occupied: 2
    },
    server: {
      url: 'https://tcm.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['TCM', 'FRP', 'Unlock', 'Suporte'],
    rating: 4.5,
    reviewCount: 98
  },

  // ============================================
  // BOX TOOLS
  // ============================================
  {
    id: 'eft-pro-box',
    key: 'EFT',
    name: 'EFT Pro',
    description: 'Box profissional com suporte a múltiplas marcas. Ideal para técnicos que trabalham com diversos dispositivos.',
    shortDescription: 'Box Multi-Marca Profissional',
    category: 'box',
    pricing: {
      cliente: { usd: 5.00, mtn: 320.00 },
      vip: { usd: 4.25, mtn: 272.00 },
      revenda: { usd: 3.50, mtn: 224.00 }
    },
    duration: {
      min: 2,
      max: 24,
      options: [2, 4, 6, 8, 12, 24]
    },
    features: [
      'Suporte Multi-Marca',
      'FRP Reset Universal',
      'IMEI Repair Avançado',
      'Flash e Firmware',
      'Suporte Técnico 24/7',
      'Atualizações Diárias'
    ],
    icon: 'Zap',
    color: '#EF4444',
    gradient: 'from-red-500 to-orange-500',
    popular: true,
    available: true,
    slots: {
      total: 12,
      occupied: 4
    },
    server: {
      url: 'https://eft.tchova.co.mz',
      port: 9000,
      protocol: 'https'
    },
    tags: ['EFT', 'Box', 'Multi-Marca', 'FRP', 'IMEI'],
    rating: 4.9,
    reviewCount: 345
  },
  {
    id: 'octoplus-box',
    key: 'OCTOPLUS',
    name: 'Octoplus Box',
    description: 'Box profissional para Samsung e LG com suporte completo a FRP, Unlock e IMEI Repair.',
    shortDescription: 'Samsung/LG Especializado',
    category: 'box',
    pricing: {
      cliente: { usd: 4.00, mtn: 256.00 },
      vip: { usd: 3.40, mtn: 217.60 },
      revenda: { usd: 2.80, mtn: 179.20 }
    },
    duration: {
      min: 2,
      max: 24,
      options: [2, 4, 6, 8, 12, 24]
    },
    features: [
      'Samsung/LG Especializado',
      'FRP Reset Avançado',
      'IMEI Repair',
      'Flash e Firmware',
      'Suporte Técnico'
    ],
    icon: 'Box',
    color: '#6366F1',
    gradient: 'from-indigo-500 to-purple-500',
    popular: false,
    available: true,
    slots: {
      total: 8,
      occupied: 2
    },
    server: {
      url: 'https://octoplus.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['Octoplus', 'Samsung', 'LG', 'Box', 'FRP'],
    rating: 4.7,
    reviewCount: 189
  },
  {
    id: 'z3x-box',
    key: 'Z3X',
    name: 'Z3X Box',
    description: 'Box completa para Samsung, LG e outros. Uma das mais populares entre técnicos GSM.',
    shortDescription: 'Samsung/LG Popular',
    category: 'box',
    pricing: {
      cliente: { usd: 3.50, mtn: 224.00 },
      vip: { usd: 2.98, mtn: 190.40 },
      revenda: { usd: 2.45, mtn: 156.80 }
    },
    duration: {
      min: 2,
      max: 24,
      options: [2, 4, 6, 8, 12, 24]
    },
    features: [
      'Samsung/LG Popular',
      'FRP Reset Fácil',
      'Unlock de Rede',
      'Suporte Ativo',
      'Comunidade Grande'
    ],
    icon: 'Box',
    color: '#F97316',
    gradient: 'from-orange-500 to-amber-500',
    popular: false,
    available: true,
    slots: {
      total: 10,
      occupied: 3
    },
    server: {
      url: 'https://z3x.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['Z3X', 'Samsung', 'LG', 'Box', 'Popular'],
    rating: 4.6,
    reviewCount: 267
  },

  // ============================================
  // TEAMVIEWER TOOLS
  // ============================================
  {
    id: 'teamviewer-gsm',
    key: 'TVGSM',
    name: 'TeamViewer GSM',
    description: 'Acesso remoto via TeamViewer com todas as ferramentas GSM instaladas. Ideal para serviços específicos com suporte ao vivo.',
    shortDescription: 'Acesso Remoto com Ferramentas',
    category: 'teamviewer',
    pricing: {
      cliente: { usd: 6.00, mtn: 384.00 },
      vip: { usd: 5.10, mtn: 326.40 },
      revenda: { usd: 4.20, mtn: 268.80 }
    },
    duration: {
      min: 1,
      max: 4,
      options: [1, 2, 3, 4]
    },
    features: [
      'Acesso Remoto Completo',
      'Todas as Ferramentas Instaladas',
      'Suporte Técnico ao Vivo',
      'Ideal para Serviços Únicos',
      'Sessão Guiada'
    ],
    icon: 'Monitor',
    color: '#0EA5E9',
    gradient: 'from-sky-500 to-blue-500',
    popular: true,
    available: true,
    slots: {
      total: 5,
      occupied: 1
    },
    server: {
      url: 'teamviewer://tchova.co.mz',
      protocol: 'rdp'
    },
    tags: ['TeamViewer', 'Remoto', 'Suporte', 'GSM'],
    rating: 4.9,
    reviewCount: 123
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Encontra ferramenta por ID
 */
export const getToolById = (id: string): GSMTool | undefined => {
  return GSM_TOOLS.find(tool => tool.id === id);
};

/**
 * Encontra ferramenta por chave (URL-friendly)
 */
export const getToolByKey = (key: string): GSMTool | undefined => {
  return GSM_TOOLS.find(tool => tool.key.toUpperCase() === key.toUpperCase());
};

/**
 * Filtra ferramentas por categoria
 */
export const getToolsByCategory = (category: ToolCategory | 'all'): GSMTool[] => {
  if (category === 'all') return GSM_TOOLS;
  return GSM_TOOLS.filter(tool => tool.category === category);
};

/**
 * Busca ferramentas por texto
 */
export const searchTools = (query: string): GSMTool[] => {
  const lowerQuery = query.toLowerCase();
  return GSM_TOOLS.filter(tool =>
    tool.name.toLowerCase().includes(lowerQuery) ||
    tool.description.toLowerCase().includes(lowerQuery) ||
    tool.shortDescription.toLowerCase().includes(lowerQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    tool.features.some(feature => feature.toLowerCase().includes(lowerQuery))
  );
};

/**
 * Obtém ferramentas populares
 */
export const getPopularTools = (): GSMTool[] => {
  return GSM_TOOLS.filter(tool => tool.popular);
};

/**
 * Obtém ferramentas disponíveis
 */
export const getAvailableTools = (): GSMTool[] => {
  return GSM_TOOLS.filter(tool => tool.available);
};

/**
 * Verifica disponibilidade de slots
 */
export const hasAvailableSlots = (tool: GSMTool): boolean => {
  return tool.available && tool.slots.occupied < tool.slots.total;
};

/**
 * Obtém número de slots disponíveis
 */
export const getAvailableSlots = (tool: GSMTool): number => {
  return Math.max(0, tool.slots.total - tool.slots.occupied);
};
