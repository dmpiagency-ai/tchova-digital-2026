// Sistema de Configuração Externa
// Permite carregar configurações de APIs externas sem modificar código

export interface ExternalConfig {
  gsm: {
    minimumDeposit: number;
    maximumDeposit: number;
    services: Array<{
      id: string;
      name: string;
      cost: number;
      enabled: boolean;
    }>;
    paymentMethods: Array<{
      id: string;
      name: string;
      enabled: boolean;
    }>;
  };
  features: {
    enableGSMDashboard: boolean;
    enableAnalytics: boolean;
    enableNotifications: boolean;
  };
  api: {
    baseUrl: string;
    endpoints: {
      balance: string;
      transactions: string;
      deposit: string;
      services: string;
    };
  };
  ui: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    currency: string;
  };
}

class ConfigManager {
  private config: ExternalConfig;
  private defaultConfig: ExternalConfig = {
    gsm: {
      minimumDeposit: 50,
      maximumDeposit: 10000,
      services: [
        { id: 'unlock-basic', name: 'Desbloqueio Básico', cost: 200, enabled: true },
        { id: 'firmware-update', name: 'Atualização Firmware', cost: 150, enabled: true },
        { id: 'imei-repair', name: 'Reparação IMEI', cost: 300, enabled: true }
      ],
      paymentMethods: [
        { id: 'mpesa', name: 'M-Pesa', enabled: true },
        { id: 'emola', name: 'E-mola', enabled: true }
      ]
    },
    features: {
      enableGSMDashboard: true,
      enableAnalytics: true,
      enableNotifications: true
    },
    api: {
      baseUrl: 'https://api.tchovadigital.com',
      endpoints: {
        balance: '/gsm/balance',
        transactions: '/gsm/transactions',
        deposit: '/gsm/deposit',
        services: '/gsm/services'
      }
    },
    ui: {
      theme: 'auto',
      language: 'pt-MZ',
      currency: 'MZN'
    }
  };

  constructor() {
    this.config = { ...this.defaultConfig };
    this.loadConfig();
  }

  // Carregar configuração externa
  async loadFromAPI(apiUrl: string): Promise<void> {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const externalConfig = await response.json();
      this.mergeConfig(externalConfig);
      this.saveConfig();

      console.log('Configuração externa carregada com sucesso');
    } catch (error) {
      console.warn('Erro ao carregar configuração externa, usando padrão:', error);
      this.loadConfig(); // Fallback para configuração salva
    }
  }

  // Carregar configuração de arquivo JSON local
  async loadFromFile(filePath: string): Promise<void> {
    try {
      const response = await fetch(filePath);
      const config = await response.json();
      this.mergeConfig(config);
      this.saveConfig();
    } catch (error) {
      console.warn('Erro ao carregar configuração do arquivo:', error);
    }
  }

  // Mesclar configuração externa com padrão
  private mergeConfig(externalConfig: Partial<ExternalConfig>): void {
    this.config = this.deepMerge(this.defaultConfig, externalConfig);
  }

  // Deep merge de objetos
  private deepMerge<T>(target: T, source: Partial<T>): T {
    const result = { ...target } as T;

    Object.keys(source).forEach((key) => {
      const sourceValue = source[key as keyof T];
      const targetValue = result[key as keyof T];

      if (this.isObject(sourceValue) && this.isObject(targetValue)) {
        (result as Record<string, unknown>)[key] = this.deepMerge(
          targetValue,
          sourceValue as Partial<typeof targetValue>
        );
      } else if (sourceValue !== undefined) {
        (result as Record<string, unknown>)[key] = sourceValue;
      }
    });

    return result;
  }

  private isObject(item: unknown): item is Record<string, unknown> {
    return item !== null && typeof item === 'object' && !Array.isArray(item);
  }

  // Salvar configuração no localStorage
  private saveConfig(): void {
    try {
      localStorage.setItem('tchova-config', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Erro ao salvar configuração:', error);
    }
  }

  // Carregar configuração do localStorage
  private loadConfig(): void {
    try {
      const saved = localStorage.getItem('tchova-config');
      if (saved) {
        const parsedConfig = JSON.parse(saved);
        this.config = this.deepMerge(this.defaultConfig, parsedConfig);
      }
    } catch (error) {
      console.warn('Erro ao carregar configuração salva:', error);
    }
  }

  // Obter configuração atual
  getConfig(): ExternalConfig {
    return { ...this.config };
  }

  // Atualizar configuração específica
  updateConfig(updates: Partial<ExternalConfig>): void {
    this.mergeConfig(updates);
    this.saveConfig();
  }

  // Obter valor específico da configuração
  get<T>(path: string): T | undefined {
    const keys = path.split('.');
    let current: unknown = this.config;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = (current as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }

    return current as T;
  }

  // Verificar se uma feature está habilitada
  isFeatureEnabled(feature: keyof ExternalConfig['features']): boolean {
    return this.config.features[feature] ?? false;
  }

  // Resetar para configuração padrão
  resetToDefault(): void {
    this.config = { ...this.defaultConfig };
    this.saveConfig();
  }
}

// Instância singleton
export const configManager = new ConfigManager();

// Funções utilitárias
export const getConfig = () => configManager.getConfig();
export const updateConfig = (updates: Partial<ExternalConfig>) => configManager.updateConfig(updates);
export const isFeatureEnabled = (feature: keyof ExternalConfig['features']) => configManager.isFeatureEnabled(feature);
export const getConfigValue = <T>(path: string) => configManager.get<T>(path);

// Função para inicializar configuração externa
export const initializeExternalConfig = async (configUrl?: string) => {
  if (configUrl) {
    await configManager.loadFromAPI(configUrl);
  } else {
    // Tentar carregar de arquivo local padrão
    await configManager.loadFromFile('/config/external-config.json');
  }
};

export default ConfigManager;