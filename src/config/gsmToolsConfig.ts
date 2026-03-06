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
    description: 'Ferramenta profissional completa para remoção de MDM, KnoxGuard, FRP e muito mais. Suporte a Android 14/15 e dispositivos Xiaomi.',
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
      'MDM Lock Removal',
      'KG (KnoxGuard) Unlock',
      'FRP Bypass',
      'IT Admin Removal',
      'Mi Account Reset',
      'IMEI Repair (SPD)',
      'Serial Number Repair',
      'ADB/EDL Mode',
      'Samsung Flash',
      'Network Unlock',
      'Ativação Instantânea',
      'Suporte 24/7'
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
    tags: ['MDM', 'iOS', 'Android', 'Knox', 'FRP', 'KG', 'Mi Account', 'IMEI', 'Instant'],
    rating: 4.9,
    reviewCount: 156,
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1772708628/MDM_FIX_yjtfys.png',
    requires_imei: true,
    requires_serial: true,
    checktool_endpoint: '/api/checktool/mdm',
    rent_endpoint: '/api/rent/mdm'
  },
  
  // ============================================
  // CHIMERA TOOL
  // ============================================
  {
    id: 'chimera-tool',
    key: 'CHIMERA',
    name: 'Chimera Tool',
    description: 'Ferramenta profissional all-in-one para desbloqueio, reparação e gestão de dispositivos móveis. Suporta mais de 10.000 modelos de mais de 30 fabricantes.',
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
      'FRP Bypass',
      'Network/SIM Unlock',
      'Carrier Relock',
      'IMEI & MAC Repair',
      'Patch Certificate',
      'Modem Repair',
      'Firmware Updates',
      'CSC Change',
      'Bootloader Management',
      'Exynos Support',
      'Qualcomm EDL Mode',
      '10.000+ Modelos'
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
    tags: ['Chimera', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Motorola', 'FRP', 'Unlock', 'IMEI', 'Network'],
    rating: 4.9,
    reviewCount: 412,
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1772708627/chimera-tool_wqdefp.png',
    requires_imei: true,
    requires_serial: false,
    checktool_endpoint: '/api/checktool/chimera',
    rent_endpoint: '/api/rent/chimera'
  },
  
  // ============================================
  // CHEETAH TOOL
  // ============================================
  {
    id: 'cheetah-tool',
    key: 'CHEETAH',
    name: 'Cheetah Tool Pro',
    description: 'Ferramenta profissional de reparação de telemóveis projetada para simplificar procedimentos técnicos complexos. Workflows automáticos "few-click" que não requerem habilidades profissionais avançadas.',
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
      'FRP Reset',
      'MDM & PayJoy Removal',
      'IMEI Repair',
      'Security Repair (NV RAM)',
      'Network Unlock',
      'KnoxGuard Management',
      'Firmware Flashing',
      '.PAC Support (Unisoc)',
      'Scatter Files (MediaTek)',
      'Bootloader Control',
      'Partition Management',
      'Read Device Info'
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
    tags: ['Cheetah', 'Android', 'FRP', 'Unlock', 'IMEI', 'MDM', 'PayJoy', 'KnoxGuard', 'MediaTek', 'Unisoc'],
    rating: 4.8,
    reviewCount: 328,
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1772299925/cheetah_tool_pro_module_bkjshe.png',
    requires_imei: false,
    requires_serial: true,
    checktool_endpoint: '/api/checktool/cheetah',
    rent_endpoint: '/api/rent/cheetah'
  },
  
  // ============================================
  // AMT TOOL
  // ============================================
  {
    id: 'amt-tool',
    key: 'AMT',
    name: 'AMT Tool',
    description: 'Advanced all-in-one software solution for flashing, unlocking, and repairing Android smartphones. Designed for security bypasses and firmware maintenance for Samsung, Xiaomi, Vivo, Oppo, and Realme.',
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
      'FRP Bypass',
      'Screen Lock Removal',
      'Mi Account Removal',
      'EDL Authentication',
      'MDM Bypass',
      'KG (KnoxGuard) Bypass',
      'Flash Firmware',
      'Auth Support (MTK/QCOM)',
      'Oppo/Realme Decryption',
      'Fastboot & ADB',
      'Device Info Recovery',
      'IMEI Repair'
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
    tags: ['AMT', 'Android', 'Samsung', 'Xiaomi', 'Vivo', 'Oppo', 'Realme', 'FRP', 'Unlock', 'IMEI', 'Flash'],
    rating: 4.7,
    reviewCount: 189,
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1772708628/amt-tool_f8mrcm.png',
    requires_imei: true,
    requires_serial: false,
    checktool_endpoint: '/api/checktool/amt',
    rent_endpoint: '/api/rent/amt'
  },
  
  // ============================================
  // DFT PRO
  // ============================================
  {
    id: 'dft-pro',
    key: 'DFT',
    name: 'DFT Pro',
    description: 'Specialized Android service software for mobile technicians to perform advanced unlocking, flashing, and technical repairs. Supports Qualcomm, MediaTek (MTK), and Unisoc chipsets with modern Android security patches.',
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
      'FRP Bypass',
      'Android 16 Support',
      'Bootloader Unlock/Relock',
      'MI Account Removal',
      'Network Unlock',
      'MDM Unlock',
      'IMEI Repair',
      'Baseband Repair',
      'Fastboot Flash',
      'Partition Management',
      'EFS Backup/Restore',
      'APK Manager & Security Scan'
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
    tags: ['DFT', 'Nokia', 'Microsoft', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Vivo', 'Realme', 'Infinix', 'Tecno', 'Qualcomm', 'MediaTek', 'Unisoc', 'Flash', 'Unlock', 'FRP', 'IMEI'],
    rating: 4.6,
    reviewCount: 256,
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1772199789/dftprologo3d_itlfmw.png',
    requires_imei: false,
    requires_serial: true,
    checktool_endpoint: '/api/checktool/dft',
    rent_endpoint: '/api/rent/dft'
  },
  
  // ============================================
  // TSM TOOL
  // ============================================
  {
    id: 'tsm-tool',
    key: 'TSM',
    name: 'TSM Tool',
    description: 'Turbo Service Mobile - Specialized all-in-one software utility for mobile repair technicians. Used for bypassing security locks and repairing Android devices from Samsung, Xiaomi, Motorola, and Oppo.',
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
      'Samsung KG Removal',
      'MDM Removal',
      'KG Active/Broken/Error',
      'FRP Bypass',
      'Mi Account Removal (EDL)',
      'Bootloader Unlock/Relock',
      'Read/Write Firmware',
      'Repair Boot (Samsung MTK)',
      'Partition Management',
      'EFS/Security Operations',
      'OTA Control',
      'Factory Reset Control',
      'Direct App Launching',
      '4G/VoLTE Settings',
      'Security Config Repair'
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
    tags: ['TSM', 'Turbo Service Mobile', 'Samsung', 'Xiaomi', 'Motorola', 'Oppo', 'KnoxGuard', 'KG', 'FRP', 'MDM', 'Unlock', 'Flash'],
    rating: 4.8,
    reviewCount: 298,
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1772710108/tsm-tool_drflnf.png',
    requires_imei: true,
    requires_serial: false,
    checktool_endpoint: '/api/checktool/tsm',
    rent_endpoint: '/api/rent/tsm'
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
