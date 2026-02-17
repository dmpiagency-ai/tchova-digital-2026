// 🔌 PLUG-IN SYSTEM: WhatsApp API Configuration
// Real WhatsApp Business API integration

export interface WhatsAppConfig {
  apiUrl: string;
  apiKey: string;
  phoneNumberId: string;
  accessToken: string;
  businessAccountId: string;
}

export interface WhatsAppMessage {
  to: string;
  message: string;
  type?: 'text' | 'template';
  template?: {
    name: string;
    language: string;
    components?: any[];
  };
}

// WhatsApp Business API Configuration
export const whatsappAPIConfig: WhatsAppConfig = {
  apiUrl: import.meta.env.VITE_WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
  apiKey: import.meta.env.VITE_WHATSAPP_API_KEY || '',
  phoneNumberId: import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID || '',
  accessToken: import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN || '',
  businessAccountId: import.meta.env.VITE_WHATSAPP_BUSINESS_ACCOUNT_ID || ''
};

// Fallback configuration for development
export const fallbackConfig = {
  useAPI: import.meta.env.VITE_USE_WHATSAPP_API === 'true',
  fallbackUrl: `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '+258879097249'}`
};

// WhatsApp API Service Class
export class WhatsAppService {
  private config: WhatsAppConfig;

  constructor(config: WhatsAppConfig) {
    this.config = config;
  }

  // Send text message via WhatsApp API
  async sendMessage(message: WhatsAppMessage): Promise<any> {
    try {
      const url = `${this.config.apiUrl}/${this.config.phoneNumberId}/messages`;

      const payload = {
        messaging_product: 'whatsapp',
        to: message.to,
        type: message.type || 'text',
        text: message.type === 'text' ? { body: message.message } : undefined,
        template: message.template
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('WhatsApp API sendMessage error:', error);
      throw error;
    }
  }

  // Send template message
  async sendTemplateMessage(to: string, templateName: string, language: string = 'pt_BR'): Promise<any> {
    return this.sendMessage({
      to,
      message: '',
      type: 'template',
      template: {
        name: templateName,
        language: language
      }
    });
  }

  // Check if API is configured
  isConfigured(): boolean {
    return !!(
      this.config.accessToken &&
      this.config.phoneNumberId &&
      this.config.apiUrl
    );
  }
}

// Create WhatsApp service instance
export const whatsappService = new WhatsAppService(whatsappAPIConfig);

// Utility function to send WhatsApp message with fallback
export async function sendWhatsAppMessage(
  phoneNumber: string,
  message: string,
  useAPI: boolean = fallbackConfig.useAPI
): Promise<{ success: boolean; method: 'api' | 'fallback'; data?: any; error?: string }> {
  try {
    // Clean phone number (remove + and spaces)
    const cleanNumber = phoneNumber.replace(/[+\s]/g, '');

    if (useAPI && whatsappService.isConfigured()) {
      // Use WhatsApp Business API
      const result = await whatsappService.sendMessage({
        to: cleanNumber,
        message: message,
        type: 'text'
      });

      return {
        success: true,
        method: 'api',
        data: result
      };
    } else {
      // Fallback to wa.me URL
      const whatsappUrl = `${fallbackConfig.fallbackUrl}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');

      return {
        success: true,
        method: 'fallback'
      };
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);

    // Fallback on API failure
    const whatsappUrl = `${fallbackConfig.fallbackUrl}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    return {
      success: false,
      method: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Template messages for different services
export const whatsappTemplates = {
  service_inquiry: {
    name: 'service_inquiry',
    language: 'pt_BR',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{service_name}}' },
          { type: 'text', text: '{{customer_name}}' }
        ]
      }
    ]
  },

  payment_confirmation: {
    name: 'payment_success',
    language: 'pt_BR',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{amount}}' },
          { type: 'text', text: '{{service}}' }
        ]
      }
    ]
  },

  gsm_access: {
    name: 'gsm_welcome',
    language: 'pt_BR',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{{user_name}}' }
        ]
      }
    ]
  }
};

// Export default configuration
export default {
  whatsappService,
  sendWhatsAppMessage,
  whatsappTemplates,
  isAPIConfigured: whatsappService.isConfigured()
};