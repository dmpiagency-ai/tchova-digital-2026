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
// TOOLS CATALOG - 6 Ferramentas Principais
// ============================================

export const GSM_TOOLS: GSMTool[] = [
  // ============================================
  // MDM FIX TOOL
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
  
  // ============================================
  // CHIMERA TOOL
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
  
  // ============================================
  // CHEETAH TOOL
  // ============================================
  {
    id: 'cheetah-tool',
    key: 'CHEETAH',
    name: 'Cheetah Tool',
    description: 'Ferramenta de alta performance para dispositivos Android com suporte a múltiplas marcas. Ideal para técnicos que precisam de velocidade e eficiência.',
    shortDescription: 'Android Multi-Brand Tool',
    category: 'server',
    pricing: {
      cliente: { usd: 3.50, mtn: 224.00 },
      vip: { usd: 2.98, mtn: 190.40 },
      revenda: { usd: 2.45, mtn: 156.80 }
    },
    duration: {
      min: 1,
      max: 12,
      options: [1, 2, 4, 6, 8, 12]
    },
    features: [
      'FRP Reset Universal',
      'Desbloqueio de Rede',
      'IMEI Repair',
      'Flash Firmware',
      'Suporte Rapido',
      'Atualizações Frequentes'
    ],
    icon: 'Zap',
    color: '#10B981',
    gradient: 'from-green-500 to-emerald-500',
    popular: true,
    available: true,
    slots: {
      total: 15,
      occupied: 5
    },
    server: {
      url: 'https://cheetah.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['Cheetah', 'Android', 'FRP', 'Unlock', 'IMEI'],
    rating: 4.8,
    reviewCount: 328
  },
  
  // ============================================
  // AMT TOOL
  // ============================================
  {
    id: 'amt-tool',
    key: 'AMT',
    name: 'AMT Tool',
    description: 'Android Multi Tool com suporte a diversas marcas e modelos. Ferramenta versátil para técnicos que trabalham com dispositivos Android.',
    shortDescription: 'Android Multi Tool',
    category: 'instant',
    pricing: {
      cliente: { usd: 2.00, mtn: 128.00 },
      vip: { usd: 1.70, mtn: 108.80 },
      revenda: { usd: 1.40, mtn: 89.60 }
    },
    duration: {
      min: 1,
      max: 8,
      options: [1, 2, 4, 6, 8]
    },
    features: [
      'FRP Reset Android',
      'Desbloqueio de Tela',
      'IMEI Repair',
      'Backup de Dados',
      'Ativação Instantânea',
      'Suporte 24/7'
    ],
    icon: 'Smartphone',
    color: '#06B6D4',
    gradient: 'from-cyan-500 to-blue-500',
    popular: false,
    available: true,
    slots: {
      total: 12,
      occupied: 3
    },
    server: {
      url: 'https://amt.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['AMT', 'Android', 'FRP', 'Repair', 'Instant'],
    rating: 4.7,
    reviewCount: 189
  },
  
  // ============================================
  // DFT PRO
  // ============================================
  {
    id: 'dft-pro',
    key: 'DFT',
    name: 'DFT Pro',
    description: 'Ferramenta profissional para dispositivos Nokia e Microsoft. Suporte completo para flashing, unlock e reparação de software.',
    shortDescription: 'Nokia/Microsoft Professional',
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
      'Flash Nokia/Microsoft',
      'Unlock de Rede',
      'FRP Reset',
      'Reparo de Software',
      'Suporte Técnico',
      'Atualizações Diárias'
    ],
    icon: 'Activity',
    color: '#EC4899',
    gradient: 'from-pink-500 to-rose-500',
    popular: true,
    available: true,
    slots: {
      total: 10,
      occupied: 4
    },
    server: {
      url: 'https://dft.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['DFT', 'Nokia', 'Microsoft', 'Flash', 'Unlock'],
    rating: 4.6,
    reviewCount: 256
  },
  
  // ============================================
  // TSM TOOL
  // ============================================
  {
    id: 'tsm-tool',
    key: 'TSM',
    name: 'TSM Tool',
    description: 'Ferramenta especializada em dispositivos Xiaomi, Redmi e Poco. Suporte para FRP, unlock e reparação de software.',
    shortDescription: 'Xiaomi/Redmi/Poco Specialist',
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
      'FRP Reset Xiaomi',
      'Unlock Bootloader',
      'Flash Firmware',
      'MI Account Removal',
      'Suporte Xiaomi',
      'Atualizações Constantes'
    ],
    icon: 'RefreshCw',
    color: '#F59E0B',
    gradient: 'from-amber-500 to-orange-500',
    popular: true,
    available: true,
    slots: {
      total: 18,
      occupied: 6
    },
    server: {
      url: 'https://tsm.tchova.co.mz',
      protocol: 'https'
    },
    tags: ['TSM', 'Xiaomi', 'Redmi', 'Poco', 'FRP'],
    rating: 4.8,
    reviewCount: 298
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
