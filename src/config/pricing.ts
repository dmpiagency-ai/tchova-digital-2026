// Single source of truth for all pricing and service data
import { Zap, Rocket, Building, Store } from 'lucide-react';

export interface Service {
   id: number;
   title: string;
   category: string;
   description: string;
   shortDescription: string;
   price: number;
   priceNote: string;
   features: string[];
   benefits: string[];
   deliveryTime: string;
   revisions: string;
   tags: string[];
   image: string;
   isPopular?: boolean;
   isIndividuallyAvailable?: boolean;
   isAI?: boolean;
   isStandaloneService?: boolean;
}

export interface Plan {
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  borderColor: string;
  priceColor: string;
  buttonColor: string;
  buttonText: string;
  buttonAction: string;
  icon: React.ComponentType<any>;
  badge?: string;
  savings?: string;
  deliveryTime: string;
  focus: 'online' | 'presence' | 'business';
}

// Serviços que NÃO entram em planos (standalone)
export const STANDALONE_SERVICES: Service[] = [
  {
    id: 4,
    title: 'Produção Audiovisual',
    category: 'Produção Audiovisual',
    description: 'Cobertura profissional de eventos com filmagem em alta definição, fotografia e edição.',
    shortDescription: 'Cobertura completa de eventos com produção profissional.',
    price: 15000,
    priceNote: 'Pacote completo - consulte opções',
    features: [
      'Filmagem profissional em 4K',
      'Seção fotográfica completa',
      'Edição de vídeo com motion graphics',
      'Música e efeitos sonoros',
      'Galeria online privada',
      'Entrega em até 15 dias',
      'Equipe profissional'
    ],
    benefits: [
      'Memórias profissionais do evento',
      'Qualidade cinematográfica',
      'Cobertura completa',
      'Material para marketing futuro'
    ],
    deliveryTime: '10-15 dias úteis após o evento',
    revisions: '1 revisão completa incluída',
    tags: ['Eventos', 'Filmagem', 'Fotografia', 'Edição'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755464/1762703721009_w7posw.png',
    isIndividuallyAvailable: true,
    isStandaloneService: true
  },
  {
    id: 5,
    title: 'Importação Assistida',
    category: 'Importação',
    description: 'Serviço de importação internacional com acompanhamento completo.',
    shortDescription: 'Importação com acompanhamento completo.',
    price: 0,
    priceNote: 'Serviço por consulta - sem custos iniciais',
    features: [
      'Consulta inicial gratuita',
      'Análise do produto e fornecedor',
      'Orçamento transparente em metical',
      'Acompanhamento do processo',
      'Atualizações regulares',
      'Entrega garantida'
    ],
    benefits: [
      'Consulta sem compromisso',
      'Análise completa',
      'Orçamento transparente',
      'Acompanhamento exclusivo',
      'Segurança total'
    ],
    deliveryTime: '7-14 dias úteis',
    revisions: 'Suporte contínuo incluído',
    tags: ['Importação', 'China', 'Compras Internacionais', 'Seguro'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png',
    isIndividuallyAvailable: true,
    isStandaloneService: true
  },
  {
    id: 6,
    title: 'Ferramentas GSM',
    category: 'Assistência GSM',
    description: 'Acesso ao painel de ferramentas GSM para desbloqueio, reparação e manutenção.',
    shortDescription: 'Ferramentas GSM para técnicos profissionais.',
    price: 1500,
    priceNote: 'Acesso mensal - primeiro mês grátis',
    features: [
      'Ferramentas GSM completas',
      'Desbloqueio remoto',
      'Reparação IMEI',
      'Flashing e firmware',
      'Diagnóstico avançado',
      'Suporte técnico',
      'Atualizações constantes'
    ],
    benefits: [
      'Ferramentas profissionais',
      'Suporte especializado',
      'Atualizações automáticas',
      'Acesso remoto seguro'
    ],
    deliveryTime: 'Acesso imediato',
    revisions: 'Suporte técnico contínuo',
    tags: ['GSM', 'Ferramentas', 'Desbloqueio', 'Reparação'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755441/Gemini_Generated_Image_66r0q266r0q266r0_kbpqc8.png',
    isIndividuallyAvailable: true,
    isStandaloneService: true
  }
];

// Serviços que PODEM ser incluídos nos planos
export const PLAN_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Identidade Visual Completa',
    category: 'Design Gráfico',
    description: 'Sistema completo de identidade visual profissional.',
    shortDescription: 'Sistema completo de identidade visual profissional.',
    price: 4500,
    priceNote: 'Inclui 3 revisões e arquivos em todos os formatos',
    features: [
      'Logo profissional (3 conceitos)',
      'Manual da marca completo',
      'Paleta de cores otimizada',
      'Tipografia selecionada',
      'Aplicações básicas',
      'Arquivos em alta resolução',
      'Direitos de uso comercial'
    ],
    benefits: [
      'Marca profissional e diferenciada',
      'Consistência visual',
      'Reconhecimento no mercado'
    ],
    deliveryTime: '10-15 dias úteis',
    revisions: '3 revisões completas inclusas',
    tags: ['Branding', 'Logo', 'Identidade Visual'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true,
    isPopular: true,
    isAI: false
  },
  {
    id: 2,
    title: 'Sites Profissionais',
    category: 'Desenvolvimento Web',
    description: 'Sites modernos, rápidos e profissionais.',
    shortDescription: 'Sites profissionais que funcionam bem e convertem.',
    price: 6000,
    priceNote: 'Inclui hospedagem por 1 ano e domínio',
    features: [
      'Site profissional responsivo',
      'Alta velocidade de carregamento',
      'Otimizado para Google (SEO)',
      'Integração com WhatsApp',
      'Painel fácil de gerir',
      'Segurança e estabilidade'
    ],
    benefits: [
      'Presença digital 24/7',
      'Experiência perfeita no celular',
      'Clientes chegam direto no WhatsApp'
    ],
    deliveryTime: '15-20 dias úteis',
    revisions: '2 revisões completas inclusas',
    tags: ['Website', 'Responsivo', 'SEO', 'Mobile-First'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png',
    isIndividuallyAvailable: true,
    isPopular: true,
    isAI: false
  },
  {
    id: 3,
    title: 'Marketing Digital',
    category: 'Marketing Digital',
    description: 'Gestão completa de redes sociais e anúncios.',
    shortDescription: 'Gestão de redes sociais e anúncios para seu negócio.',
    price: 4500,
    priceNote: 'Pacote mensal - mínimo 3 meses',
    features: [
      'Gestão completa das redes sociais',
      'Criação e publicação de posts',
      'Gestão de anúncios Facebook/Instagram',
      'Otimização das campanhas',
      'Relatórios semanais',
      'Estratégia de crescimento'
    ],
    benefits: [
      'Mais visibilidade online',
      'Mais mensagens e contactos',
      'Resultados mensuráveis'
    ],
    deliveryTime: '7 dias úteis para início',
    revisions: 'Otimização contínua incluída',
    tags: ['Marketing Digital', 'Redes Sociais', 'Tráfego Pago', 'ROI'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762747013/1762701812733_p93nsd.png',
    isIndividuallyAvailable: true,
    isPopular: true,
    isAI: false
  }
];

// Todos os serviços individuais
export const INDIVIDUAL_SERVICES: Service[] = [...PLAN_SERVICES, ...STANDALONE_SERVICES];

// ============================================
// PLANOS DIGITAIS - TCHOVA DIGITAL
// Foco: baixo custo • entrega rápida • alto volume • resultado real
// ============================================

export const SERVICE_PLANS: Plan[] = [
  {
    name: 'START ONLINE',
    price: 3500,
    period: 'MZN',
    description: 'Para pequenos negócios, empreendedores iniciantes e serviços locais. Tudo para começar online.',
    features: [
      'Logotipo OU redesign da marca',
      'Perfil visual para redes sociais',
      'Cover Facebook',
      'Cover WhatsApp Business',
      '2 catálogos digitais',
      'Papel de parede (mobile ou desktop)',
      '2 cartazes promocionais',
      'Posts para stories',
      'Link Bio (cartão de visita digital)'
    ],
    highlighted: false,
    borderColor: 'border-green-500 dark:border-green-400',
    priceColor: 'text-green-600 dark:text-green-400',
    buttonColor: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400',
    buttonText: 'Falar com a Tchova',
    buttonAction: 'start-online',
    icon: Zap,
    badge: 'Para Começar',
    savings: 'Entrega em 2-3 dias úteis',
    deliveryTime: '2 a 3 dias úteis',
    focus: 'online'
  },
  {
    name: 'PRESENÇA DIGITAL',
    price: 7500,
    period: 'MZN',
    description: 'Para negócios que querem gerar contactos e vendas via WhatsApp. Presença completa.',
    features: [
      'Identidade visual básica',
      'Landing page (leva ao WhatsApp)',
      'Layout mobile-first',
      '10 posts (feed + stories)',
      'Criativos para anúncios',
      'Configuração inicial de Meta Ads',
      'Estratégia com apoio de IA'
    ],
    highlighted: true,
    borderColor: 'border-yellow-500 dark:border-yellow-400',
    priceColor: 'text-yellow-600 dark:text-yellow-400',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400',
    buttonText: 'Falar com a Tchova',
    buttonAction: 'presenca-digital',
    icon: Rocket,
    badge: 'Mais Procurado',
    savings: 'Entrega em 5-7 dias úteis',
    deliveryTime: '5 a 7 dias úteis',
    focus: 'presence'
  },
  {
    name: 'NEGÓCIO DIGITAL',
    price: 15000,
    period: 'MZN',
    description: 'Para empresas que querem vender online e escalar. Solução completa de e-commerce.',
    features: [
      'Tudo do Plano Presença Digital',
      'Website profissional completo',
      'Site de vendas com carrinho',
      'Integração M-Pesa, e-Mola, Cartão, PayPal',
      'Integração básica de IA',
      'Gestão inicial de tráfego pago',
      'Anúncios ativos em até 8 dias'
    ],
    highlighted: false,
    borderColor: 'border-blue-500 dark:border-blue-400',
    priceColor: 'text-blue-600 dark:text-blue-400',
    buttonColor: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400',
    buttonText: 'Falar com a Tchova',
    buttonAction: 'negocio-digital',
    icon: Store,
    badge: 'Para Vender',
    savings: 'Entrega em 7-12 dias úteis',
    deliveryTime: '7 a 12 dias úteis',
    focus: 'business'
  }
];

// Service Categories - APENAS para serviços, NÃO para planos
export const SERVICE_CATEGORIES = [
  'Todos',
  'Design Gráfico',
  'Desenvolvimento Web',
  'Marketing Digital',
  'Produção Audiovisual',
  'Importação',
  'Assistência GSM'
];

// WhatsApp message templates
export const WHATSAPP_MESSAGES = {
  service: {
    'Identidade Visual Completa': 'Olá! Gostaria de orçamento para identidade visual completa.',
    'Sites Profissionais': 'Olá! Interessado em site profissional para meu negócio.',
    'Marketing Digital': 'Olá! Interessado em marketing digital para meu negócio.',
    'Produção Audiovisual': 'Olá! Gostaria de orçamento para produção audiovisual.',
    'Importação Assistida': 'Olá! Gostaria de saber mais sobre importação assistida.',
    'Ferramentas GSM': 'Olá! Interessado em ferramentas GSM.'
  },
  plan: {
    'START ONLINE': 'Olá! Vi o plano START ONLINE (3.500 MZN) e quero colocar meu negócio online. Podem ajudar?',
    'PRESENÇA DIGITAL': 'Olá! Vi o plano PRESENÇA DIGITAL (7.500 MZN) e quero gerar mais contactos. Podem ajudar?',
    'NEGÓCIO DIGITAL': 'Olá! Vi o plano NEGÓCIO DIGITAL (15.000 MZN) e quero vender online. Podem ajudar?'
  }
};

// Helper functions
export const getServiceById = (id: number): Service | undefined => {
  return INDIVIDUAL_SERVICES.find(service => service.id === id);
};

export const getPlanByName = (name: string): Plan | undefined => {
  return SERVICE_PLANS.find(plan => plan.name === name);
};

export const getServicesByCategory = (category: string): Service[] => {
  if (category === 'Todos') return INDIVIDUAL_SERVICES;
  return INDIVIDUAL_SERVICES.filter(service => service.category === category);
};

export const getWhatsAppMessage = (type: 'service' | 'plan', title: string): string => {
  const messages = WHATSAPP_MESSAGES[type];
  return messages[title as keyof typeof messages] || `Olá! Gostaria de saber mais sobre ${title}.`;
};

export const isStandaloneService = (serviceId: number): boolean => {
  const service = INDIVIDUAL_SERVICES.find(s => s.id === serviceId);
  return service?.isStandaloneService ?? false;
};
