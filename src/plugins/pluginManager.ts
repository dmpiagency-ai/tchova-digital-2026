// Sistema de Plugins Modulares para TchovaDigital
// Permite extensões sem modificar o código core

import React from 'react';

// Type definitions for plugin system
export interface PluginUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: unknown;
}

export interface PluginPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  userId: string;
  [key: string]: unknown;
}

export interface PluginConfigUpdate {
  [key: string]: unknown;
}

export interface PluginConfig {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  config: Record<string, unknown>;
}

export interface PluginHooks {
  onUserLogin?: (user: PluginUser) => void;
  onUserLogout?: (user: PluginUser) => void;
  onServiceAccess?: (serviceType: string, user: PluginUser) => boolean;
  onPaymentProcessed?: (payment: PluginPayment) => void;
  onDashboardRender?: (user: PluginUser) => React.ReactNode;
  onConfigUpdate?: (config: PluginConfigUpdate) => void;
}

export interface Plugin {
  config: PluginConfig;
  hooks: PluginHooks;
  initialize?: () => Promise<void>;
  destroy?: () => Promise<void>;
}

// Type for hook function
type HookFunction = (...args: unknown[]) => unknown | Promise<unknown>;

// Type for stored hooks
interface StoredHook {
  [key: string]: HookFunction;
}

// Type for plugin state items stored in localStorage
interface PluginStateItem {
  id: string;
  config: Partial<PluginConfig>;
}

class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private hooks: Map<string, StoredHook[]> = new Map();

  // Registrar um plugin
  register(plugin: Plugin): boolean {
    if (this.plugins.has(plugin.config.id)) {
      console.warn(`Plugin ${plugin.config.id} já está registrado`);
      return false;
    }

    this.plugins.set(plugin.config.id, plugin);

    // Registrar hooks do plugin
    Object.entries(plugin.hooks).forEach(([hookName, hookFn]) => {
      if (!this.hooks.has(hookName)) {
        this.hooks.set(hookName, []);
      }
      this.hooks.get(hookName)!.push({ [hookName]: hookFn as HookFunction });
    });

    console.log(`Plugin ${plugin.config.name} registrado com sucesso`);
    return true;
  }

  // Desregistrar um plugin
  unregister(pluginId: string): boolean {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    // Executar cleanup se existir
    if (plugin.destroy) {
      plugin.destroy();
    }

    this.plugins.delete(pluginId);

    // Remover hooks do plugin
    this.hooks.forEach((hookList, hookName) => {
      this.hooks.set(hookName, hookList.filter(hooks =>
        !Object.values(hooks).includes(plugin.hooks[hookName as keyof PluginHooks] as HookFunction)
      ));
    });

    console.log(`Plugin ${pluginId} removido`);
    return true;
  }

  // Executar hook
  async executeHook<T = unknown>(hookName: string, ...args: unknown[]): Promise<T[]> {
    const hookList = this.hooks.get(hookName) || [];
    const results: T[] = [];

    for (const hooks of hookList) {
      const hookFn = hooks[hookName];
      if (hookFn) {
        try {
          const result = await hookFn(...args) as T;
          if (result !== undefined) {
            results.push(result);
          }
        } catch (error) {
          console.error(`Erro no hook ${hookName}:`, error);
        }
      }
    }

    return results;
  }

  // Obter plugin por ID
  getPlugin(pluginId: string): Plugin | undefined {
    return this.plugins.get(pluginId);
  }

  // Listar todos os plugins
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  // Listar plugins ativos
  getActivePlugins(): Plugin[] {
    return Array.from(this.plugins.values()).filter(p => p.config.enabled);
  }

  // Atualizar configuração de plugin
  updatePluginConfig(pluginId: string, config: Partial<PluginConfig>): boolean {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return false;

    plugin.config = { ...plugin.config, ...config };

    // Executar hook de configuração
    if (plugin.hooks.onConfigUpdate) {
      plugin.hooks.onConfigUpdate(config);
    }

    return true;
  }

  // Carregar plugins de configuração externa
  async loadPluginsFromConfig(configUrl: string): Promise<void> {
    try {
      const response = await fetch(configUrl);
      const config = await response.json();

      for (const pluginConfig of config.plugins || []) {
        // Carregar dinamicamente o plugin
        const pluginModule = await import(/* @vite-ignore */ pluginConfig.moduleUrl);
        const plugin = pluginModule.default as Plugin;

        // Aplicar configuração
        plugin.config = { ...plugin.config, ...pluginConfig };

        // Inicializar se habilitado
        if (plugin.config.enabled && plugin.initialize) {
          await plugin.initialize();
        }

        this.register(plugin);
      }
    } catch (error) {
      console.error('Erro ao carregar plugins externos:', error);
    }
  }

  // Salvar estado dos plugins
  savePluginState(): void {
    const state = Array.from(this.plugins.entries()).map(([id, plugin]) => ({
      id,
      config: plugin.config
    }));

    localStorage.setItem('tchova-plugins', JSON.stringify(state));
  }

  // Carregar estado dos plugins
  loadPluginState(): void {
    const state = localStorage.getItem('tchova-plugins');
    if (state) {
      try {
        const parsedState: PluginStateItem[] = JSON.parse(state);
        parsedState.forEach((item) => {
          const plugin = this.plugins.get(item.id);
          if (plugin) {
            plugin.config = { ...plugin.config, ...item.config };
          }
        });
      } catch (error) {
        console.error('Erro ao carregar estado dos plugins:', error);
      }
    }
  }
}

// Instância singleton
export const pluginManager = new PluginManager();

// Funções utilitárias para plugins
export const createPlugin = (
  config: PluginConfig,
  hooks: PluginHooks,
  initialize?: () => Promise<void>,
  destroy?: () => Promise<void>
): Plugin => ({
  config,
  hooks,
  initialize,
  destroy
});

// Hook React para usar plugins
export const usePlugin = (pluginId: string) => {
  return pluginManager.getPlugin(pluginId);
};

// Função para registrar plugin GSM (exemplo)
export const registerGSMPlugin = () => {
  const gsmPlugin: Plugin = createPlugin(
    {
      id: 'gsm-service',
      name: 'GSM Service Plugin',
      version: '1.0.0',
      description: 'Plugin para serviços GSM',
      author: 'TchovaDigital',
      enabled: true,
      config: {}
    },
    {
      onUserLogin: (user) => {
        console.log(`GSM Plugin: Usuário ${user.name} fez login`);
      },
      onServiceAccess: (serviceType, user) => {
        if (serviceType === 'gsm') {
          console.log(`GSM Plugin: Acesso ao serviço GSM por ${user.name}`);
          return true;
        }
        return false;
      }
    },
    async () => {
      console.log('GSM Plugin inicializado');
    },
    async () => {
      console.log('GSM Plugin destruído');
    }
  );

  pluginManager.register(gsmPlugin);
};

export default PluginManager;