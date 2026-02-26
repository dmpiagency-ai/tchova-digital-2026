// Payment Types for TchovaDigital - Smart Payment Logic
// This file defines all payment-related types and configurations

export enum PaymentType {
  DEPOSIT = 'deposit',           // 50% start, 50% end (custom projects)
  SINGLE = 'single',             // One-time payment (fixed scope services)
  SUBSCRIPTION = 'subscription', // Monthly plans
  ACCESS = 'access',             // Tool rental/access
  CONSULTATION = 'consultation'  // Consultation-based (importation)
}

export enum PaymentStage {
  INITIATION = 'initiation',     // Start payment (50% for deposit)
  COMPLETION = 'completion',     // Final payment (50% for deposit)
  FULL = 'full',                 // Complete payment (single payment)
  RENEWAL = 'renewal',           // Subscription renewal
  CONTINUATION = 'continuation'   // Ongoing project continuation
}

export interface ServicePaymentConfig {
  serviceId: number;
  serviceName: string;
  category: string;
  
  // How this service is paid for
  paymentType: PaymentType;
  
  // What stages this service has
  stages: PaymentStage[];
  
  // Deposit percentage (for DEPOSIT type)
  depositPercentage?: number;
  
  // Fixed price (for SINGLE type)
  fixedPrice?: number;
  
  // Monthly price (for SUBSCRIPTION type)
  monthlyPrice?: number;
  
  // Access duration (for ACCESS type)
  accessDuration?: string;
  
  // Whether price is shown before proposal
  requiresProposal: boolean;
  
  // CTA text for service details page
  detailsCTA: string;
  
  // CTA text for payment page
  paymentCTA: string;
  
  // Explanation shown before payment
  paymentExplanation: string;
}

export interface PaymentRequest {
  amount: number;
  currency: string;
  method: string;
  userId: string;
  
  // Context about what this payment activates
  serviceId: number;
  serviceName: string;
  paymentType: PaymentType;
  paymentStage: PaymentStage;
  
  // Project context (for deposit-based payments)
  projectId?: string;
  proposalId?: string;
  
  // Description that explains the purpose
  description: string;
  
  // Additional metadata
  metadata?: Record<string, unknown>;
}

export interface PaymentResult {
  transactionId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  method: string;
  timestamp: Date;
  
  // Context
  serviceId: number;
  serviceName: string;
  paymentType: PaymentType;
  paymentStage: PaymentStage;
  
  // Project tracking
  projectId?: string;
  proposalId?: string;
  
  // What happens next
  nextAction?: string;
  nextStage?: PaymentStage;
  
  confirmationCode?: string;
  errorMessage?: string;
}

export interface ProjectStage {
  stage: PaymentStage;
  status: 'pending' | 'active' | 'completed';
  amount?: number;
  paid: boolean;
  timestamp?: Date;
  description: string;
}

export interface Proposal {
  proposalId: string;
  serviceId: number;
  serviceName: string;
  userId: string;
  
  // Proposal details
  totalAmount: number;
  currency: string;
  paymentType: PaymentType;
  stages: ProjectStage[];
  
  // Status
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'in_progress' | 'completed';
  
  // Timestamps
  createdAt: Date;
  expiresAt?: Date;
  acceptedAt?: Date;
  
  // Notes
  notes?: string;
  terms?: string;
}

export interface PaymentContext {
  serviceName: string;
  serviceCategory: string;
  
  // Payment type and stage
  paymentType: PaymentType;
  paymentStage: PaymentStage;
  
  // Amount breakdown
  amount: number;
  depositAmount?: number;
  remainingAmount?: number;
  
  // What happens after payment
  activates: string;
  nextSteps: string[];
  
  // Important messages
  explanation: string;
  warning?: string;
}

export interface CategoryPaymentBehavior {
  category: string;
  defaultPaymentType: PaymentType;
  requiresProposal: boolean;
  showPriceInDetails: boolean;
  detailsPageCTA: string;
  requiresContactFirst: boolean;
}

// Service payment configurations
export const SERVICE_PAYMENT_CONFIGS: Record<number, ServicePaymentConfig> = {
  // Identidade Visual - Deposit based
  1: {
    serviceId: 1,
    serviceName: 'Identidade Visual Completa',
    category: 'Design Gráfico',
    paymentType: PaymentType.DEPOSIT,
    stages: [PaymentStage.INITIATION, PaymentStage.COMPLETION],
    depositPercentage: 50,
    requiresProposal: true,
    detailsCTA: 'Falar com a Tchova',
    paymentCTA: 'Efetuar pagamento de início',
    paymentExplanation: 'Este pagamento ativa o início do seu projeto de identidade visual conforme acordado com a TchovaDigital.'
  },
  
  // Desenvolvimento Web - Deposit based
  2: {
    serviceId: 2,
    serviceName: 'Criamos Sites que Vendem por Você 24h',
    category: 'Desenvolvimento Web',
    paymentType: PaymentType.DEPOSIT,
    stages: [PaymentStage.INITIATION, PaymentStage.COMPLETION],
    depositPercentage: 50,
    requiresProposal: true,
    detailsCTA: 'Falar com a Tchova',
    paymentCTA: 'Confirmar início do projeto',
    paymentExplanation: 'Este pagamento ativa o início do desenvolvimento do seu site conforme acordado com a TchovaDigital.'
  },
  
  // Marketing Digital - Subscription
  3: {
    serviceId: 3,
    serviceName: 'Marketing Digital Completo',
    category: 'Marketing Digital',
    paymentType: PaymentType.SUBSCRIPTION,
    stages: [PaymentStage.RENEWAL],
    monthlyPrice: 4500,
    requiresProposal: true,
    detailsCTA: 'Falar com a Tchova',
    paymentCTA: 'Ativar plano mensal',
    paymentExplanation: 'Este pagamento ativa o período mensal do serviço de marketing digital conforme acordado.'
  },
  
  // Produção Audiovisual - Single payment (packages)
  4: {
    serviceId: 4,
    serviceName: 'Produção Audiovisual',
    category: 'Produção Audiovisual',
    paymentType: PaymentType.SINGLE,
    stages: [PaymentStage.FULL],
    fixedPrice: 15000,
    requiresProposal: false,
    detailsCTA: 'Ver pacotes disponíveis',
    paymentCTA: 'Confirmar execução',
    paymentExplanation: 'Este pagamento confirma a execução do serviço de produção audiovisual para o seu evento.'
  },
  
  // Importação - Consultation based
  5: {
    serviceId: 5,
    serviceName: 'IMPORTAÇÃO ASSISTIDA TCHOVADIGITAL',
    category: 'Importação',
    paymentType: PaymentType.CONSULTATION,
    stages: [],
    requiresProposal: true,
    detailsCTA: 'Solicitar consulta gratuita',
    paymentCTA: 'Confirmar início da importação',
    paymentExplanation: 'Este pagamento ativa o início do processo de importação assistida conforme acordado.'
  },
  
  // GSM - Access rental
  6: {
    serviceId: 6,
    serviceName: 'Ferramentas GSM Profissionais',
    category: 'Assistência GSM',
    paymentType: PaymentType.ACCESS,
    stages: [PaymentStage.RENEWAL],
    monthlyPrice: 1500,
    accessDuration: 'mensal',
    requiresProposal: false,
    detailsCTA: 'Acessar painel GSM',
    paymentCTA: 'Ativar acesso',
    paymentExplanation: 'Este pagamento ativa o acesso ao painel de ferramentas GSM pelo período selecionado.'
  },
  
  // Social Media Design - Subscription
  7: {
    serviceId: 7,
    serviceName: 'Social Media Design',
    category: 'Design Gráfico',
    paymentType: PaymentType.SUBSCRIPTION,
    stages: [PaymentStage.RENEWAL],
    monthlyPrice: 2500,
    requiresProposal: true,
    detailsCTA: 'Falar com a Tchova',
    paymentCTA: 'Ativar plano mensal',
    paymentExplanation: 'Este pagamento ativa o período mensal do serviço de design para redes sociais.'
  },
  
  // Materiais Publicitários - Single payment
  8: {
    serviceId: 8,
    serviceName: 'Materiais Publicitários',
    category: 'Design Gráfico',
    paymentType: PaymentType.SINGLE,
    stages: [PaymentStage.FULL],
    fixedPrice: 1800,
    requiresProposal: false,
    detailsCTA: 'Falar com a Tchova',
    paymentCTA: 'Confirmar execução',
    paymentExplanation: 'Este pagamento confirma a execução do serviço de criação de materiais publicitários.'
  },
  
  // Pacote Design Completo - Subscription
  9: {
    serviceId: 9,
    serviceName: 'Pacote Design Completo',
    category: 'Design Gráfico',
    paymentType: PaymentType.SUBSCRIPTION,
    stages: [PaymentStage.RENEWAL],
    monthlyPrice: 3500,
    requiresProposal: true,
    detailsCTA: 'Falar com a Tchova',
    paymentCTA: 'Ativar plano mensal',
    paymentExplanation: 'Este pagamento ativa o período mensal do pacote completo de design.'
  }
};

// Category payment behaviors
export const CATEGORY_PAYMENT_BEHAVIORS: CategoryPaymentBehavior[] = [
  {
    category: 'Design Gráfico',
    defaultPaymentType: PaymentType.DEPOSIT,
    requiresProposal: true,
    showPriceInDetails: false,
    detailsPageCTA: 'Falar com a Tchova',
    requiresContactFirst: true
  },
  {
    category: 'Desenvolvimento Web',
    defaultPaymentType: PaymentType.DEPOSIT,
    requiresProposal: true,
    showPriceInDetails: false,
    detailsPageCTA: 'Falar com a Tchova',
    requiresContactFirst: true
  },
  {
    category: 'Marketing Digital',
    defaultPaymentType: PaymentType.SUBSCRIPTION,
    requiresProposal: true,
    showPriceInDetails: false,
    detailsPageCTA: 'Falar com a Tchova',
    requiresContactFirst: true
  },
  {
    category: 'Produção Audiovisual',
    defaultPaymentType: PaymentType.SINGLE,
    requiresProposal: false,
    showPriceInDetails: true,
    detailsPageCTA: 'Ver pacotes',
    requiresContactFirst: false
  },
  {
    category: 'Importação',
    defaultPaymentType: PaymentType.CONSULTATION,
    requiresProposal: true,
    showPriceInDetails: false,
    detailsPageCTA: 'Solicitar consulta',
    requiresContactFirst: true
  },
  {
    category: 'Assistência GSM',
    defaultPaymentType: PaymentType.ACCESS,
    requiresProposal: false,
    showPriceInDetails: true,
    detailsPageCTA: 'Acessar ferramentas',
    requiresContactFirst: false
  }
];

// Helper functions
export function getServicePaymentConfig(serviceId: number): ServicePaymentConfig | undefined {
  return SERVICE_PAYMENT_CONFIGS[serviceId];
}

export function getCategoryPaymentBehavior(category: string): CategoryPaymentBehavior | undefined {
  return CATEGORY_PAYMENT_BEHAVIORS.find(b => b.category === category);
}

export function getPaymentContext(serviceId: number, stage: PaymentStage, amount: number): PaymentContext | undefined {
  const config = getServicePaymentConfig(serviceId);
  if (!config) return undefined;
  
  const depositAmount = config.paymentType === PaymentType.DEPOSIT && config.depositPercentage
    ? (amount * config.depositPercentage) / 100
    : undefined;
  
  const remainingAmount = depositAmount ? amount - depositAmount : undefined;
  
  let activates: string;
  let nextSteps: string[];
  
  switch (stage) {
    case PaymentStage.INITIATION:
      activates = 'Início do projeto';
      nextSteps = [
        'Projeto entra em produção',
        'Equipe começa a trabalhar',
        'Você receberá atualizações regulares'
      ];
      break;
    case PaymentStage.COMPLETION:
      activates = 'Finalização do projeto';
      nextSteps = [
        'Entrega final do projeto',
        'Projeto encerrado após confirmação',
        'Suporte pós-entrega ativado'
      ];
      break;
    case PaymentStage.FULL:
      activates = 'Execução do serviço';
      nextSteps = [
        'Serviço iniciado imediatamente',
        'Entrega conforme prazo acordado',
        'Suporte durante todo o processo'
      ];
      break;
    case PaymentStage.RENEWAL:
      activates = 'Renovação do acesso';
      nextSteps = [
        'Acesso renovado pelo período',
        'Serviço continua ativo',
        'Sem interrupções'
      ];
      break;
    default:
      activates = 'Continuação do projeto';
      nextSteps = ['Projeto continua em andamento'];
  }
  
  return {
    serviceName: config.serviceName,
    serviceCategory: config.category,
    paymentType: config.paymentType,
    paymentStage: stage,
    amount,
    depositAmount,
    remainingAmount,
    activates,
    nextSteps,
    explanation: config.paymentExplanation
  };
}

export function getPaymentStageLabel(stage: PaymentStage): string {
  switch (stage) {
    case PaymentStage.INITIATION:
      return 'Pagamento de Início';
    case PaymentStage.COMPLETION:
      return 'Pagamento Final';
    case PaymentStage.FULL:
      return 'Pagamento Único';
    case PaymentStage.RENEWAL:
      return 'Renovação';
    case PaymentStage.CONTINUATION:
      return 'Continuação';
    default:
      return 'Pagamento';
  }
}

export function getPaymentTypeLabel(type: PaymentType): string {
  switch (type) {
    case PaymentType.DEPOSIT:
      return 'Pagamento por Depósito';
    case PaymentType.SINGLE:
      return 'Pagamento Único';
    case PaymentType.SUBSCRIPTION:
      return 'Assinatura Mensal';
    case PaymentType.ACCESS:
      return 'Acesso/Aluguel';
    case PaymentType.CONSULTATION:
      return 'Por Consulta';
    default:
      return 'Pagamento';
  }
}

export interface PaymentUIContext {
  title: string;
  description: string;
  cta: string;
  explanation: string;
}

export function getPaymentUIContext(paymentType: PaymentType, paymentStage: PaymentStage): PaymentUIContext {
  // Generate context based on payment type and stage
  switch (paymentType) {
    case PaymentType.DEPOSIT:
      if (paymentStage === PaymentStage.INITIATION) {
        return {
          title: 'Pagamento de Início',
          description: 'Processamento protegido',
          cta: 'Confirmar início do projeto',
          explanation: 'Este pagamento ativa o início do seu projeto conforme acordado com a TchovaDigital.'
        };
      } else if (paymentStage === PaymentStage.COMPLETION) {
        return {
          title: 'Pagamento Final',
          description: 'Finalização do projeto',
          cta: 'Confirmar entrega final',
          explanation: 'Este pagamento finaliza o projeto após confirmação da entrega.'
        };
      }
      break;
      
    case PaymentType.SINGLE:
      return {
        title: 'Pagamento Único',
        description: 'Execução do serviço',
        cta: 'Confirmar execução',
        explanation: 'Este pagamento confirma a execução do serviço conforme acordado.'
      };
      
    case PaymentType.SUBSCRIPTION:
      return {
        title: 'Ativar Plano',
        description: 'Assinatura mensal',
        cta: 'Ativar plano',
        explanation: 'Este pagamento ativa o período mensal do serviço conforme acordado.'
      };
      
    case PaymentType.ACCESS:
      return {
        title: 'Ativar Acesso',
        description: 'Acesso às ferramentas',
        cta: 'Ativar acesso',
        explanation: 'Este pagamento ativa o acesso às ferramentas pelo período selecionado.'
      };
      
    case PaymentType.CONSULTATION:
      return {
        title: 'Iniciar Consulta',
        description: 'Processo de importação',
        cta: 'Confirmar início',
        explanation: 'Este pagamento ativa o início do processo conforme acordado.'
      };
  }
  
  // Default fallback
  return {
    title: 'Pagamento Seguro',
    description: 'Processamento protegido',
    cta: 'Confirmar Pagamento',
    explanation: 'Este pagamento ativa o serviço conforme acordado.'
  };
}
