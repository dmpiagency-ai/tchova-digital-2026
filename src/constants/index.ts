/**
 * ============================================
 * CONSTANTES CENTRALIZADAS - TCHOVA DIGITAL
 * ============================================
 * Este arquivo exporta todas as constantes do projeto
 * para facilitar manutenção e atualizações
 */

// ============================================
// INFORMAÇÕES DA EMPRESA
// ============================================

export const COMPANY_INFO = {
  name: 'Tchova Digital',
  slogan: 'O ecossistema completo para o teu negócio crescer',
  description: 'Ecossistema 360 pioneiro em Moçambique: design gráfico, produção audiovisual, marketing digital e serviços GSM mobile tech.',
  email: 'info@tchovadigital.co.mz',
  phone: '+258 87 909 7249',
  whatsapp: '+258879097249',
  address: {
    street: 'HQ Digital & Global Remoto',
    city: 'Operação 100% Distribuída',
    province: 'Suporte Global',
    country: 'Global',
    postalCode: '3600'
  },
  socialMedia: {
    facebook: 'https://facebook.com/tchovadigital',
    instagram: 'https://instagram.com/tchovadigital',
    linkedin: 'https://linkedin.com/company/tchovadigital',
    twitter: 'https://twitter.com/tchovadigital'
  },
  workingHours: {
    weekdays: '08:00 - 18:00',
    saturday: '09:00 - 13:00',
    sunday: 'Fechado'
  }
} as const;

// ============================================
// SERVIÇOS DE PRODUÇÃO AUDIOVISUAL
// ============================================

export const AUDIOVISUAL_PACKAGES = [
  {
    id: 'basico',
    name: 'Básico',
    price: 15000,
    description: 'Ideal para pequenos eventos e conteúdo de redes sociais',
    features: [
      '1 Câmera profissional',
      'Edição básica',
      'Correção de cor',
      'Trilha sonora royalty-free',
      'Entrega em 5 dias úteis',
      '1 revisão incluída'
    ],
    isPopular: false
  },
  {
    id: 'medio',
    name: 'Médio',
    price: 30000,
    description: 'Perfeito para casamentos, aniversários e eventos corporativos',
    features: [
      '2 Câmeras profissionais',
      'Edição avançada',
      'Correção de cor cinematográfica',
      'Trilha sonora personalizada',
      'Entrega em 7 dias úteis',
      '3 revisões incluídas',
      'Drone (opcional)'
    ],
    isPopular: false
  },
  {
    id: 'classico',
    name: 'Clássico',
    price: 50000,
    description: 'Produção completa para eventos especiais e comerciais',
    features: [
      '3 Câmeras 4K',
      'Edição cinematográfica',
      'Color grading profissional',
      'Trilha sonora exclusiva',
      'Entrega em 10 dias úteis',
      'Revisões ilimitadas',
      'Drone incluído',
      'Making of'
    ],
    isPopular: false
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 80000,
    description: 'Produção premium com todos os recursos disponíveis',
    features: [
      '4+ Câmeras 4K/6K',
      'Edição premium',
      'Color grading de cinema',
      'Trilha sonora original',
      'Entrega prioritária',
      'Revisões ilimitadas',
      'Drone + FPV',
      'Making of completo',
      'Fotografia incluída',
      'Live streaming'
    ],
    isPopular: true
  }
] as const;

export const AUDIOVISUAL_EXTRAS = [
  {
    id: 'drone',
    name: 'Filmagem com Drone',
    price: 5000,
    description: 'Cenas aéreas espetaculares'
  },
  {
    id: 'fumaca',
    name: 'Bolas de Fumaça',
    price: 2000,
    description: 'Efeitos visuais dramáticos'
  },
  {
    id: 'fogo',
    name: 'Fogo de Artifício',
    price: 10000,
    description: 'Gravação de shows pirotécnicos'
  }
] as const;

// ============================================
// SERVIÇOS GSM
// ============================================

export const GSM_TOOLS = [
  { id: 'unlock', name: 'Desbloqueio', icon: 'Unlock', price: 500, estimatedTime: '1-24h' },
  { id: 'frp', name: 'FRP Bypass', icon: 'Shield', price: 300, estimatedTime: '30min-2h' },
  { id: 'imei', name: 'Reparação IMEI', icon: 'Smartphone', price: 800, estimatedTime: '1-3h' },
  { id: 'firmware', name: 'Flash Firmware', icon: 'Download', price: 400, estimatedTime: '30min-1h' },
  { id: 'root', name: 'Root/Custom ROM', icon: 'Settings', price: 600, estimatedTime: '1-2h' },
  { id: 'icloud', name: 'iCloud Unlock', icon: 'Cloud', price: 1500, estimatedTime: '24-72h' },
  { id: 'mdm', name: 'MDM Bypass', icon: 'ShieldCheck', price: 1000, estimatedTime: '1-6h' },
  { id: 'carrier', name: 'Carrier Unlock', icon: 'Signal', price: 700, estimatedTime: '24-48h' },
  { id: 'sim', name: 'SIM Unlock', icon: 'SimCard', price: 300, estimatedTime: '1-24h' },
  { id: 'backup', name: 'Backup/Restore', icon: 'Database', price: 200, estimatedTime: '30min-2h' },
  { id: 'repair', name: 'Software Repair', icon: 'Wrench', price: 500, estimatedTime: '1-3h' }
] as const;

export const GSM_SERVICES = [
  'Desbloqueio de Rede',
  'Remoção de Conta Google (FRP)',
  'Reparação de IMEI',
  'Atualização de Firmware',
  'Root e Custom Recovery',
  'Remoção de iCloud',
  'Bypass MDM'
] as const;

export const GSM_BRANDS = [
  'Samsung', 'Apple', 'Xiaomi', 'Huawei', 'Oppo', 
  'Vivo', 'Realme', 'Motorola', 'LG', 'Nokia', 'Outros'
] as const;

// ============================================
// SERVIÇOS DE MARKETING DIGITAL
// ============================================

export const MARKETING_SERVICES = [
  {
    id: 'social-media',
    name: 'Gestão de Redes Sociais',
    description: 'Gestão completa das suas redes sociais',
    features: [
      'Criação de conteúdo',
      'Agendamento de posts',
      'Gestão de comunidade',
      'Relatórios mensais'
    ]
  },
  {
    id: 'seo',
    name: 'SEO',
    description: 'Otimização para motores de busca',
    features: [
      'Auditoria SEO',
      'Otimização on-page',
      'Link building',
      'Relatórios de performance'
    ]
  },
  {
    id: 'ads',
    name: 'Publicidade Online',
    description: 'Gestão de campanhas publicitárias',
    features: [
      'Google Ads',
      'Facebook/Instagram Ads',
      'TikTok Ads',
      'LinkedIn Ads'
    ]
  }
] as const;

// ============================================
// MÉTODOS DE PAGAMENTO
// ============================================

export const PAYMENT_METHODS = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    icon: 'Smartphone',
    description: 'Pagamento via M-Pesa',
    isActive: true
  },
  {
    id: 'emola',
    name: 'e-Mola',
    icon: 'Wallet',
    description: 'Pagamento via e-Mola',
    isActive: true
  },
  {
    id: 'bank-transfer',
    name: 'Transferência Bancária',
    icon: 'Building2',
    description: 'Transferência direta para conta bancária',
    isActive: true
  },
  {
    id: 'credit-card',
    name: 'Cartão de Crédito/Débito',
    icon: 'CreditCard',
    description: 'Visa, Mastercard, Maestro',
    isActive: true
  }
] as const;

// ============================================
// CONFIGURAÇÕES DE FORMULÁRIO
// ============================================

export const FORM_CONFIG = {
  // Validação de telefone moçambicano
  phone: {
    pattern: /^(\+258|258)?[8][2-7][0-9]{7}$/,
    minLength: 9,
    maxLength: 12,
    placeholder: '+258 84 123 4567'
  },
  // Validação de email
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    placeholder: 'seuemail@exemplo.com'
  },
  // Validação de nome
  name: {
    minLength: 2,
    maxLength: 100,
    placeholder: 'Seu nome completo'
  }
} as const;

// ============================================
// CONFIGURAÇÕES DE WHATSAPP
// ============================================

export const WHATSAPP_CONFIG = {
  phoneNumber: '+258841234567',
  businessName: 'Tchova Digital',
  defaultMessages: {
    quote: 'Olá! Gostaria de solicitar um orçamento para',
    support: 'Olá! Preciso de suporte com',
    gsm: 'Olá! Preciso do serviço de GSM:',
    general: 'Olá! Vim pelo site e gostaria de mais informações'
  }
} as const;

// ============================================
// CONFIGURAÇÕES DE UI
// ============================================

export const UI_CONFIG = {
  // Animações
  animation: {
    duration: 300,
    easing: 'ease-in-out'
  },
  // Toast notifications
  toast: {
    duration: 5000,
    position: 'top-right' as const
  },
  // Paginação
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100
  },
  // Upload
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'application/msword']
  }
} as const;

// ============================================
// TEXTOS E MENSAGENS
// ============================================

export const MESSAGES = {
  errors: {
    required: 'Este campo é obrigatório',
    invalidEmail: 'Por favor, insira um email válido',
    invalidPhone: 'Por favor, insira um número de telefone válido',
    minLength: (min: number) => `Mínimo de ${min} caracteres`,
    maxLength: (max: number) => `Máximo de ${max} caracteres`,
    generic: 'Ocorreu um erro. Por favor, tente novamente.'
  },
  success: {
    formSubmitted: 'Formulário enviado com sucesso!',
    paymentProcessed: 'Pagamento processado com sucesso!',
    orderConfirmed: 'Pedido confirmado com sucesso!'
  },
  info: {
    loading: 'A carregar...',
    processing: 'A processar...',
    saving: 'A guardar...'
  }
} as const;

// ============================================
// URLS E ROTAS
// ============================================

export const ROUTES = {
  home: '/',
  services: '/servicos',
  serviceDetails: (slug: string) => `/servicos/${slug}`,
  checkout: '/checkout/seguro',
  contact: '/contacto',
  about: '/sobre',
  admin: '/admin',
  login: '/login',
  notFound: '*'
} as const;

export const EXTERNAL_URLS = {
  whatsapp: (phone: string, message: string) => 
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
  facebook: COMPANY_INFO.socialMedia.facebook,
  instagram: COMPANY_INFO.socialMedia.instagram,
  linkedin: COMPANY_INFO.socialMedia.linkedin,
  twitter: COMPANY_INFO.socialMedia.twitter
} as const;
