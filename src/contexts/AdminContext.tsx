import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export interface UserSession {
  id: string;
  email: string;
  name: string;
  loginTime: Date;
  lastActivity: Date;
  ip?: string;
  userAgent?: string;
  isActive: boolean;
}

interface AdminContextType {
  sessions: UserSession[];
  activeUsers: number;
  totalLogins: number;
  addSession: (user: { email: string; name: string }) => void;
  removeSession: (userId: string) => void;
  updateActivity: (userId: string) => void;
  clearAllSessions: () => void;
  isAdmin: boolean;
  loginAsAdmin: (email: string) => Promise<boolean>;
  logoutAdmin: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // Carregar sessões do localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('gsm-sessions');
    if (savedSessions) {
      try {
        const parsedSessions = JSON.parse(savedSessions).map((session: UserSession & { loginTime: string; lastActivity: string }) => ({
          ...session,
          loginTime: new Date(session.loginTime),
          lastActivity: new Date(session.lastActivity)
        }));
        setSessions(parsedSessions);
      } catch (error) {
        // Error loading sessions (removed console.error for production)
        // Error details: ${error}
      }
    }

    // Verificar se admin está logado
    const adminLogged = localStorage.getItem('admin-logged');
    setIsAdmin(adminLogged === 'true');
  }, []);

  // Salvar sessões no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('gsm-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (user: { email: string; name: string }) => {
    const newSession: UserSession = {
      id: Date.now().toString(),
      email: user.email,
      name: user.name,
      loginTime: new Date(),
      lastActivity: new Date(),
      isActive: true
    };

    setSessions(prev => {
      // Remover sessão anterior do mesmo usuário se existir
      const filtered = prev.filter(s => s.email !== user.email);
      return [...filtered, newSession];
    });
  };

  const removeSession = (userId: string) => {
    setSessions(prev => prev.filter(s => s.id !== userId));

    // Se estamos removendo a sessão atual do usuário logado, fazer logout
    const sessionToRemove = sessions.find(s => s.id === userId);
    if (sessionToRemove) {
      // Disparar evento personalizado para notificar logout
      window.dispatchEvent(new CustomEvent('gsm-session-removed', {
        detail: { email: sessionToRemove.email }
      }));
    }
  };

  const updateActivity = (userId: string) => {
    setSessions(prev => prev.map(s =>
      s.id === userId ? { ...s, lastActivity: new Date() } : s
    ));
  };

  const clearAllSessions = () => {
    setSessions([]);

    // Disparar evento para desconectar todos os usuários
    window.dispatchEvent(new CustomEvent('gsm-all-sessions-cleared'));
  };

  // Lista de emails de admin permitidos - configurar no .env.local
  const ADMIN_EMAILS: string[] = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((e: string) => e.trim())
    .filter((e: string) => Boolean(e));
  
  const loginAsAdmin = async (email: string): Promise<boolean> => {
    // Agora usa Firebase Auth - verificação por email do usuário logado
    const currentUser = auth.currentUser;
    
    if (currentUser && ADMIN_EMAILS.includes(currentUser.email || '')) {
      setIsAdmin(true);
      localStorage.setItem('admin-logged', 'true');
      return true;
    }
    return false;
  };

  // Verificar automaticamente se o usuário é admin quando o auth muda
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user && ADMIN_EMAILS.includes(user.email || '')) {
        setIsAdmin(true);
        localStorage.setItem('admin-logged', 'true');
      } else if (user === null) {
        // Usuário fez logout
        setIsAdmin(false);
        localStorage.removeItem('admin-logged');
      }
    });
    
    return () => unsubscribe();
  }, []);

  const logoutAdmin = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin-logged');
  };

  const activeUsers = sessions.filter(s => s.isActive).length;
  const totalLogins = sessions.length;

  const value: AdminContextType = {
    sessions,
    activeUsers,
    totalLogins,
    addSession,
    removeSession,
    updateActivity,
    clearAllSessions,
    isAdmin,
    loginAsAdmin,
    logoutAdmin
  };
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};