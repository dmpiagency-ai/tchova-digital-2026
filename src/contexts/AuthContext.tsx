import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAdmin } from './AdminContext';
import { env } from '@/config/env';
import { logger } from '@/lib/logger';
import { sanitizeLocalStorageData } from '@/lib/sanitize';

interface User {
  id: string;
  email: string;
  name: string;
}

interface ServiceData {
  title: string;
  type: string;
  requiresLogin: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  handleServiceAccess?: (serviceType: string, serviceData?: ServiceData) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addSession } = useAdmin();

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const sanitizedUser = sanitizeLocalStorageData<User>(savedUser, null);
        if (sanitizedUser) {
          setUser(sanitizedUser);
        }
      } catch (error) {
        logger.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Ouvir eventos de administração GSM
  useEffect(() => {
    const handleSessionRemoved = (event: CustomEvent) => {
      const { email } = event.detail;
      if (user && user.email === email) {
        // Se a sessão removida é do usuário atual, fazer logout
        logout('Sua sessão GSM foi encerrada pelo administrador.');
      }
    };

    const handleAllSessionsCleared = () => {
      // Deslogar todos os usuários quando todas as sessões forem limpas
      if (user) {
        logout('Todas as sessões GSM foram encerradas pelo administrador.');
      }
    };

    window.addEventListener('gsm-session-removed', handleSessionRemoved as EventListener);
    window.addEventListener('gsm-all-sessions-cleared', handleAllSessionsCleared as EventListener);

    return () => {
      window.removeEventListener('gsm-session-removed', handleSessionRemoved as EventListener);
      window.removeEventListener('gsm-all-sessions-cleared', handleAllSessionsCleared as EventListener);
    };
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    // Simulação de login - em produção, isso seria uma chamada para API
    if (email && password.length >= 6) {
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0]
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Registrar sessão GSM no painel admin
      addSession({ email, name: newUser.name });

      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const logout = (reason?: string) => {
    try {
      setUser(null);
      localStorage.removeItem('user');

      // Mostrar notificação se houver motivo
      if (reason) {
        // Criar evento personalizado para mostrar notificação
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: {
            type: 'warning',
            title: 'Sessão Encerrada',
            message: reason
          }
        }));
      }
    } catch (error) {
      logger.error('Erro durante logout:', error);
      // Mesmo com erro, garantir que o usuário seja deslogado
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  const handleServiceAccess = (serviceType: string, serviceData?: ServiceData) => {
    const authenticated = !!user;
    if (serviceData?.requiresLogin && !authenticated) {
      // Serviço requer login - mostrar modal de login
      window.dispatchEvent(new CustomEvent('show-login-modal', {
        detail: {
          service: serviceType,
          title: serviceData.title
        }
      }));
    } else if (serviceType === 'technical-tools') {
      // ALUGUER DE FERRAMENTAS TÉCNICAS - redirecionar para painel GSM
      if (authenticated) {
        window.open(env.GSM_SITE_URL, '_blank');
      } else {
        // Mostrar modal de login
        window.dispatchEvent(new CustomEvent('show-login-modal', {
          detail: {
            service: 'technical-tools',
            title: 'ALUGUER DE FERRAMENTAS TÉCNICAS'
          }
        }));
      }
    } else {
      // Outros serviços - WhatsApp
      const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre ${serviceData?.title || serviceType}.`);
      window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
    handleServiceAccess
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};