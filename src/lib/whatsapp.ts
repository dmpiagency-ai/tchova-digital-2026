// 🔌 PLUG-IN SYSTEM: WhatsApp Integration Utilities
// Context-aware WhatsApp messaging for better conversion

import { env } from '@/config/env';
import { sendWhatsAppMessage } from '@/config/whatsapp';

// Google Analytics gtag function type
type GtagFunction = (
  command: 'event' | 'config' | 'set',
  eventNameOrTarget: string,
  params?: Record<string, unknown>
) => void;

interface WindowWithGtag extends Window {
  gtag?: GtagFunction;
}

// 🔌 PLUG-IN: WhatsApp message templates by context
export const WHATSAPP_MESSAGES = {
  // Hero section - General inquiry
  hero: 'Olá! Vi seu site e quero transformar meu negócio em digital. Podemos conversar sobre como a TchovaDigital pode ajudar?',

  // Services - Specific by category
  services: {
    'Design Gráfico': 'Olá! Estou interessado em serviços de design gráfico. Vi seus trabalhos e gostaria de saber mais sobre identidade visual para meu negócio.',
    'Desenvolvimento Web': 'Olá! Preciso de um website profissional. Podemos conversar sobre desenvolvimento web e as opções disponíveis?',
    'Marketing Digital': 'Olá! Quero melhorar minha presença online. Podemos conversar sobre estratégias de marketing digital?',
    'Produção Audiovisual': 'Olá! Estou interessado em produção de vídeos. Podemos conversar sobre motion graphics e vídeos institucionais?',
    'Importação': 'Olá! Tenho interesse em serviços de importação. Podemos conversar sobre fornecedores e logística?',
    'Assistência GSM': 'Olá! Preciso de assistência técnica GSM. Podemos conversar sobre reparos e suporte?'
  },

  // Pricing - Specific plans
  pricing: {
    'KIT VENDER RÁPIDO': 'Olá! Estou interessado no Kit Vender Rápido. Podemos conversar sobre os detalhes e como começar?',
    'DESCOLAR DIGITAL': 'Olá! O pacote Descolar Digital parece perfeito para mim. Podemos conversar sobre implementação?',
    'ACELERAÇÃO MENSAL': 'Olá! Quero saber mais sobre o plano de Aceleração Mensal. Podemos agendar uma conversa?',
    'ECOSSISTEMA MASTER': 'Olá! Estou interessado na solução completa Ecossistema Master. Podemos conversar sobre consultoria?'
  },

  // Contact forms
  contact: {
    general: 'Olá! Entre em contato através do site. Gostaria de saber mais sobre seus serviços.',
    consultation: 'Olá! Solicito uma consulta gratuita através do formulário do site.',
    quote: 'Olá! Solicito um orçamento através do formulário do site.'
  },

  // Emergency/support
  support: 'Olá! Preciso de suporte urgente. Podemos conversar agora?'
} as const;

// 🔌 PLUG-IN: Generate contextual WhatsApp URL
export const generateWhatsAppUrl = (context: keyof typeof WHATSAPP_MESSAGES, subContext?: string): string => {
  let message = '';

  if (context === 'services' && subContext) {
    message = WHATSAPP_MESSAGES.services[subContext as keyof typeof WHATSAPP_MESSAGES.services] || WHATSAPP_MESSAGES.hero;
  } else if (context === 'pricing' && subContext) {
    message = WHATSAPP_MESSAGES.pricing[subContext as keyof typeof WHATSAPP_MESSAGES.pricing] || WHATSAPP_MESSAGES.hero;
  } else if (context === 'contact' && subContext) {
    message = WHATSAPP_MESSAGES.contact[subContext as keyof typeof WHATSAPP_MESSAGES.contact] || WHATSAPP_MESSAGES.contact.general;
  } else {
    // Handle string contexts (hero, support)
    const contextValue = WHATSAPP_MESSAGES[context];
    message = typeof contextValue === 'string' ? contextValue : WHATSAPP_MESSAGES.hero;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodedMessage}`;
};

// 🔌 PLUG-IN: Open WhatsApp with contextual message (with API support)
export const openWhatsApp = async (context: keyof typeof WHATSAPP_MESSAGES, subContext?: string): Promise<void> => {
  let message = '';

  if (context === 'services' && subContext) {
    message = WHATSAPP_MESSAGES.services[subContext as keyof typeof WHATSAPP_MESSAGES.services] || WHATSAPP_MESSAGES.hero;
  } else if (context === 'pricing' && subContext) {
    message = WHATSAPP_MESSAGES.pricing[subContext as keyof typeof WHATSAPP_MESSAGES.pricing] || WHATSAPP_MESSAGES.hero;
  } else if (context === 'contact' && subContext) {
    message = WHATSAPP_MESSAGES.contact[subContext as keyof typeof WHATSAPP_MESSAGES.contact] || WHATSAPP_MESSAGES.contact.general;
  } else {
    // Handle string contexts (hero, support)
    const contextValue = WHATSAPP_MESSAGES[context];
    message = typeof contextValue === 'string' ? contextValue : WHATSAPP_MESSAGES.hero;
  }

  try {
    // Try to use WhatsApp API first (if configured)
    const result = await sendWhatsAppMessage(env.WHATSAPP_NUMBER, message);

    if (result.success && result.method === 'api') {
      console.log('✅ WhatsApp message sent via API');
      return;
    }
  } catch (error) {
    console.warn('WhatsApp API failed, using fallback:', error);
  }

  // Fallback to wa.me URL
  const url = generateWhatsAppUrl(context, subContext);
  window.open(url, '_blank');
};

// 🔌 PLUG-IN: Track WhatsApp interactions (for future analytics)
export const trackWhatsAppInteraction = (context: string, subContext?: string): void => {
  // This will be connected to analytics later
  console.log('WhatsApp interaction:', { context, subContext });

  // Future: Send to analytics service
  if (typeof window !== 'undefined') {
    const windowWithGtag = window as WindowWithGtag;
    if (windowWithGtag.gtag) {
      windowWithGtag.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: context,
        custom_parameter: subContext || 'general'
      });
    }
  }
};

// 🔌 PLUG-IN: Combined function for components
export const handleWhatsAppClick = async (context: keyof typeof WHATSAPP_MESSAGES, subContext?: string): Promise<void> => {
  trackWhatsAppInteraction(context, subContext);
  await openWhatsApp(context, subContext);
};

// 🔌 PLUG-IN: Service-specific message generator
export const getServiceMessage = (serviceName: string): string => {
  const serviceMap: Record<string, string> = {
    'Design & Identidade Visual': 'Design Gráfico',
    'Web & Mobile': 'Desenvolvimento Web',
    'Marketing Digital': 'Marketing Digital',
    'Audiovisual': 'Produção Audiovisual',
    'Importação': 'Importação',
    'Assistência Técnica GSM': 'Assistência GSM'
  };

  const category = serviceMap[serviceName];
  return WHATSAPP_MESSAGES.services[category as keyof typeof WHATSAPP_MESSAGES.services] || WHATSAPP_MESSAGES.hero;
};

// 🔌 PLUG-IN: Pricing-specific message generator
export const getPricingMessage = (planName: string): string => {
  return WHATSAPP_MESSAGES.pricing[planName as keyof typeof WHATSAPP_MESSAGES.pricing] || WHATSAPP_MESSAGES.hero;
};