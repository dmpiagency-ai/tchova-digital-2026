/**
 * ============================================
 * TCHOVA DIGITAL - AI AGENT MODULE
 * ============================================
 * Cérebro inteligente do site
 * Integração com múltiplos provedores de IA (OpenAI, Anthropic, Google)
 */

import { APIResponse, AIModel, AIProvider, AIRequest, AIResponse, AIAgentConfig } from './types';

// ============================================
// CONFIGURATION
// ============================================

interface AIProviderConfig {
  name: string;
  apiKey: string;
  baseUrl: string;
  models: AIModel[];
  defaultModel: AIModel;
}

const getProviderConfigs = (): Record<AIProvider, AIProviderConfig> => ({
  openai: {
    name: 'OpenAI',
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultModel: 'gpt-3.5-turbo'
  },
  anthropic: {
    name: 'Anthropic',
    apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
    baseUrl: 'https://api.anthropic.com/v1',
    models: ['claude-3-opus', 'claude-3-sonnet', 'claude-3-haiku'],
    defaultModel: 'claude-3-haiku'
  },
  google: {
    name: 'Google AI',
    apiKey: import.meta.env.VITE_GOOGLE_AI_KEY || '',
    baseUrl: 'https://generativelanguage.googleapis.com/v1',
    models: ['gemini-pro', 'gemini-ultra'],
    defaultModel: 'gemini-pro'
  },
  local: {
    name: 'Local AI',
    apiKey: '',
    baseUrl: 'http://localhost:11434',
    models: ['llama2', 'mistral', 'codellama'],
    defaultModel: 'llama2'
  }
});

// ============================================
// AI PROVIDER IMPLEMENTATIONS
// ============================================

/**
 * OpenAI Provider
 */
class OpenAIProvider {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const model = request.model || this.config.defaultModel;
    
    if (!this.config.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            ...(request.systemPrompt ? [{ role: 'system', content: request.systemPrompt }] : []),
            { role: 'user', content: request.prompt }
          ],
          max_tokens: request.maxTokens || 1000,
          temperature: request.temperature ?? 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        content: data.choices[0].message.content,
        model,
        provider: 'openai',
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0
        },
        finishReason: data.choices[0].finish_reason || 'stop'
      };
    } catch (error) {
      throw new Error(`OpenAI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Anthropic Provider
 */
class AnthropicProvider {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const model = request.model || this.config.defaultModel;

    if (!this.config.apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: request.maxTokens || 1000,
          system: request.systemPrompt,
          messages: [
            { role: 'user', content: request.prompt }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        content: data.content[0].text,
        model,
        provider: 'anthropic',
        usage: {
          promptTokens: data.usage?.input_tokens || 0,
          completionTokens: data.usage?.output_tokens || 0,
          totalTokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
        },
        finishReason: data.stop_reason === 'end_turn' ? 'stop' : data.stop_reason
      };
    } catch (error) {
      throw new Error(`Anthropic generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Google AI Provider
 */
class GoogleAIProvider {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const model = request.model || this.config.defaultModel;

    if (!this.config.apiKey) {
      throw new Error('Google AI API key not configured');
    }

    try {
      const response = await fetch(
        `${this.config.baseUrl}/models/${model}:generateContent?key=${this.config.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: request.prompt }]
              }
            ],
            generationConfig: {
              maxOutputTokens: request.maxTokens || 1000,
              temperature: request.temperature ?? 0.7
            },
            ...(request.systemPrompt ? {
              systemInstruction: {
                parts: [{ text: request.systemPrompt }]
              }
            } : {})
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Google AI API error: ${response.status}`);
      }

      const data = await response.json();

      return {
        content: data.candidates[0].content.parts[0].text,
        model,
        provider: 'google',
        usage: {
          promptTokens: data.usageMetadata?.promptTokenCount || 0,
          completionTokens: data.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: data.usageMetadata?.totalTokenCount || 0
        },
        finishReason: data.candidates[0].finishReason?.toLowerCase() || 'stop'
      };
    } catch (error) {
      throw new Error(`Google AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Local AI Provider (Ollama)
 */
class LocalAIProvider {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const model = request.model || this.config.defaultModel;

    try {
      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          prompt: request.prompt,
          stream: false,
          options: {
            num_predict: request.maxTokens || 1000,
            temperature: request.temperature ?? 0.7
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Local AI error: ${response.status}`);
      }

      const data = await response.json();

      return {
        content: data.response,
        model,
        provider: 'local',
        usage: {
          promptTokens: data.prompt_eval_count || 0,
          completionTokens: data.eval_count || 0,
          totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0)
        },
        finishReason: 'stop'
      };
    } catch (error) {
      throw new Error(`Local AI generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// ============================================
// AI AGENT SERVICE
// ============================================

class AIAgentService {
  private provider: AIProvider;
  private config: AIAgentConfig;
  private providerInstance: OpenAIProvider | AnthropicProvider | GoogleAIProvider | LocalAIProvider | null = null;
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  private systemPrompt: string;

  constructor() {
    // Default configuration
    this.provider = this.detectProvider();
    this.config = this.getDefaultConfig();
    this.systemPrompt = this.getDefaultSystemPrompt();
    this.initializeProvider();
  }

  private detectProvider(): AIProvider {
    const configs = getProviderConfigs();
    
    // Check for available API keys
    if (configs.openai.apiKey) return 'openai';
    if (configs.anthropic.apiKey) return 'anthropic';
    if (configs.google.apiKey) return 'google';
    
    // Default to OpenAI (will use demo mode if no key)
    return 'openai';
  }

  private getDefaultConfig(): AIAgentConfig {
    const configs = getProviderConfigs();
    const providerConfig = configs[this.provider];

    return {
      provider: this.provider,
      apiKey: providerConfig.apiKey,
      model: providerConfig.defaultModel,
      maxTokens: 1000,
      temperature: 0.7,
      systemPrompt: this.systemPrompt
    };
  }

  private getDefaultSystemPrompt(): string {
    return `Você é o assistente virtual da TchovaDigital, uma agência digital líder em Moçambique.

SOBRE A TCHOVADIGITAL:
- Agência digital completa: design, desenvolvimento web, marketing digital, GSM
- Localizada em Moçambique, atendemos todo o país
- Especialistas em soluções digitais para empresas moçambicanas

SERVIÇOS:
1. Design Gráfico: logos, banners, cartazes, posts para redes sociais
2. Desenvolvimento Web: sites, lojas online, aplicações web
3. Marketing Digital: gestão de redes sociais, publicidade online, SEO
4. Serviços GSM: desbloqueio, reparação, software

TOM DE VOZ:
- Profissional mas amigável
- Use expressões locais quando apropriado
- Seja conciso e direto
- Sempre ofereça ajuda adicional

CONTATO:
- WhatsApp: +258 87 909 7249
- Email: contato@tchovadigital.com

Regras:
- Responda sempre em português
- Se não souber algo, ofereça conectar com um humano
- Colete informações do cliente quando relevante (nome, contacto, serviço de interesse)
- Direcione para WhatsApp para conversas mais detalhadas`;
  }

  private initializeProvider() {
    const configs = getProviderConfigs();
    const providerConfig = configs[this.provider];

    switch (this.provider) {
      case 'openai':
        this.providerInstance = new OpenAIProvider(providerConfig);
        break;
      case 'anthropic':
        this.providerInstance = new AnthropicProvider(providerConfig);
        break;
      case 'google':
        this.providerInstance = new GoogleAIProvider(providerConfig);
        break;
      case 'local':
        this.providerInstance = new LocalAIProvider(providerConfig);
        break;
    }
  }

  // ============================================
  // PUBLIC API
  // ============================================

  /**
   * Check if AI is configured
   */
  isConfigured(): boolean {
    const configs = getProviderConfigs();
    return !!configs[this.provider].apiKey;
  }

  /**
   * Get current provider
   */
  getProvider(): AIProvider {
    return this.provider;
  }

  /**
   * Set provider
   */
  setProvider(provider: AIProvider) {
    this.provider = provider;
    this.config = this.getDefaultConfig();
    this.initializeProvider();
  }

  /**
   * Set system prompt
   */
  setSystemPrompt(prompt: string) {
    this.systemPrompt = prompt;
    this.config.systemPrompt = prompt;
  }

  /**
   * Generate a response
   */
  async generate(prompt: string, options?: Partial<AIRequest>): Promise<APIResponse<AIResponse>> {
    // Demo mode if not configured
    if (!this.isConfigured()) {
      return this.generateDemoResponse(prompt);
    }

    if (!this.providerInstance) {
      return {
        success: false,
        error: { code: 'PROVIDER_NOT_INITIALIZED', message: 'AI provider not initialized' },
        timestamp: new Date().toISOString()
      };
    }

    try {
      const request: AIRequest = {
        prompt,
        model: options?.model || this.config.model,
        maxTokens: options?.maxTokens || this.config.maxTokens,
        temperature: options?.temperature ?? this.config.temperature,
        systemPrompt: this.systemPrompt,
        ...options
      };

      const response = await this.providerInstance.generate(request);

      // Add to conversation history
      this.conversationHistory.push(
        { role: 'user', content: prompt },
        { role: 'assistant', content: response.content }
      );

      // Keep last 20 messages
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return {
        success: true,
        data: response,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'GENERATION_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate demo response when AI is not configured
   */
  private generateDemoResponse(prompt: string): APIResponse<AIResponse> {
    const lowerPrompt = prompt.toLowerCase();
    let content = '';

    if (lowerPrompt.includes('preço') || lowerPrompt.includes('custo') || lowerPrompt.includes('valor')) {
      content = `Olá! Os nossos preços variam conforme o serviço:

🎨 **Design Gráfico**: A partir de 1.500 MZN
🌐 **Websites**: A partir de 15.000 MZN
📱 **Marketing Digital**: Planos desde 5.000 MZN/mês
🔧 **Serviços GSM**: A partir de 500 MZN

Para um orçamento personalizado, fale connosco pelo WhatsApp: +258 87 909 7249`;
    } else if (lowerPrompt.includes('serviço') || lowerPrompt.includes('o que faz')) {
      content = `A TchovaDigital oferece serviços digitais completos:

🎨 **Design Gráfico**
- Logos, banners, cartazes
- Posts para redes sociais
- Identidade visual

🌐 **Desenvolvimento Web**
- Sites institucionais
- Lojas online (E-commerce)
- Landing pages

📱 **Marketing Digital**
- Gestão de redes sociais
- Publicidade online (Facebook, Google)
- SEO e otimização

🔧 **Serviços GSM**
- Desbloqueio de telemóveis
- Reparação de software
- Serviços técnicos

Como posso ajudar especificamente?`;
    } else if (lowerPrompt.includes('contacto') || lowerPrompt.includes('whatsapp') || lowerPrompt.includes('falar')) {
      content = `Pode entrar em contacto connosco:

📱 **WhatsApp**: +258 87 909 7249
📧 **Email**: contato@tchovadigital.com
🌐 **Website**: www.tchovadigital.com

Estamos disponíveis de segunda a sexta, das 8h às 18h.

Prefere que eu ligue para si? Deixe o seu número!`;
    } else {
      content = `Olá! Sou o assistente virtual da TchovaDigital. 

Posso ajudá-lo com:
- Informações sobre os nossos serviços
- Orçamentos e preços
- Dúvidas gerais

Para uma atenção personalizada, contacte-nos pelo WhatsApp: +258 87 909 7249

Como posso ajudá-lo hoje?`;
    }

    return {
      success: true,
      data: {
        content,
        model: 'demo',
        provider: 'local',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        },
        finishReason: 'stop'
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Clear conversation history
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory() {
    return [...this.conversationHistory];
  }

  /**
   * Generate content for specific use cases
   */
  async generateContent(type: 'logo' | 'post' | 'banner' | 'website', params: Record<string, string>): Promise<APIResponse<AIResponse>> {
    const prompts = {
      logo: `Crie uma descrição detalhada para um logo da empresa "${params.name || 'Empresa'}". 
              Estilo: ${params.style || 'moderno'}
              Cores: ${params.colors || 'vibrantes'}
              Elementos: ${params.elements || 'minimalista'}`,
      
      post: `Crie um post para Instagram sobre "${params.topic || 'produto'}".
              Tom: ${params.tone || 'profissional mas amigável'}
              Inclua: ${params.include || 'call to action'}
              Público: Moçambique`,
      
      banner: `Descreva um banner promocional para "${params.product || 'serviço'}".
               Promoção: ${params.promo || 'oferta especial'}
               Tamanho: ${params.size || '1200x628'}
               Estilo: ${params.style || 'moderno e atrativo'}`,
      
      website: `Sugira estrutura e conteúdo para um website de "${params.business || 'empresa'}".
                Páginas: ${params.pages || 'home, sobre, serviços, contacto'}
                Estilo: ${params.style || 'moderno e profissional'}
                Público-alvo: Moçambique`
    };

    return this.generate(prompts[type]);
  }
}

// ============================================
// SINGLETON EXPORT
// ============================================

export const aiAgent = new AIAgentService();
export { AIAgentService };
export default aiAgent;