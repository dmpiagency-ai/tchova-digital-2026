import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut as firebaseSignOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAdmin } from './AdminContext';
import { auth, db } from '@/config/firebase';
import { env } from '@/config/env';
import { logger } from '@/lib/logger';
import { sanitizeLocalStorageData } from '@/lib/sanitize';
import {
  validateToken,
  storeTokenLocally,
  getStoredToken,
  clearStoredToken,
  ClientProject
} from '@/utils/tokenGenerator';
import {
  getSecureSession,
  clearSecureSession,
  createSecureSession
} from '@/utils/verificationCode';
import {
  isUsingLocalAuth,
  validateLocalLogin,
  registerLocalUser,
  setCurrentUser as setLocalCurrentUser,
  getCurrentUser as getLocalCurrentUser,
  clearCurrentUser as clearLocalCurrentUser,
  initializeLocalUsers
} from '@/services/localAuthService';

// ============================================
// Types
// ============================================

export type UserRole = 'user' | 'admin' | 'client';
export type AuthType = 'firebase' | 'token' | 'local' | 'guest';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  authType: AuthType;
  avatar?: string;
  phone?: string;
  createdAt?: Date;
  lastLogin?: Date;
}

export interface ClientSession {
  projectId: string;
  project: ClientProject;
  token: string;
  expiresAt: Date;
  hasSecureSession: boolean;
}

export interface ServiceData {
  title: string;
  type: string;
  requiresLogin: boolean;
}

interface AuthContextType {
  // State
  user: User | null;
  clientSession: ClientSession | null;
  isAuthenticated: boolean;
  isClient: boolean;
  isAdmin: boolean;
  isLoading: boolean;

  // Admin Auth
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: (reason?: string) => Promise<void>;

  // Client Auth
  validateClientToken: (token: string) => Promise<{ valid: boolean; expired?: boolean; project?: ClientProject; error?: string }>;
  clearClientSession: () => void;

  // Service Access
  handleServiceAccess: (serviceType: string, serviceData?: ServiceData) => void;

  // Session Management
  refreshSession: () => Promise<void>;
  getSessionInfo: () => { type: AuthType; expiresAt?: Date; isValid: boolean };
}

// ============================================
// Constants
// ============================================

const USER_STORAGE_KEY = 'tchova_user';
const CLIENT_SESSION_KEY = 'tchova_client_session';

const defaultUser: User = {
  id: '',
  email: '',
  name: '',
  role: 'user',
  authType: 'guest'
};

// ============================================
// Context
// ============================================

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
  const [clientSession, setClientSession] = useState<ClientSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addSession } = useAdmin();

  // ============================================
  // Initialization
  // ============================================

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize local users for demo
        initializeLocalUsers();

        // Check if using local auth (Firebase not configured)
        if (isUsingLocalAuth()) {
          // First check USER_STORAGE_KEY (primary storage)
          const savedUser = localStorage.getItem(USER_STORAGE_KEY);
          if (savedUser) {
            try {
              const parsedUser = JSON.parse(savedUser);
              if (parsedUser && parsedUser.id) {
                setUser(parsedUser);
                addSession({ email: parsedUser.email, name: parsedUser.name });
                setIsLoading(false);
                return;
              }
            } catch (error) {
              logger.error('Error parsing saved user:', error);
              localStorage.removeItem(USER_STORAGE_KEY);
            }
          }
          
          // Fallback: check local user session from localAuthService
          const localUser = getLocalCurrentUser();
          if (localUser) {
            const newUser: User = {
              id: localUser.id,
              email: localUser.email,
              name: localUser.name,
              role: localUser.role as UserRole,
              authType: 'local',
              phone: localUser.phone,
              avatar: localUser.avatar,
              createdAt: localUser.createdAt ? new Date(localUser.createdAt) : undefined,
              lastLogin: localUser.lastLogin ? new Date(localUser.lastLogin) : undefined,
            };
            setUser(newUser);
            // Also save to USER_STORAGE_KEY for consistency
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
            addSession({ email: newUser.email, name: newUser.name });
          }
          setIsLoading(false);
          return;
        }

        // Check for Firebase auth state
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
          if (firebaseUser) {
            // User is signed in with Firebase
            await handleFirebaseAuth(firebaseUser);
          } else {
            // Check for client token session
            await checkClientSession();
          }
          setIsLoading(false);
        });

        // Also check localStorage for persisted user
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (savedUser && !user) {
          try {
            const sanitizedUser = sanitizeLocalStorageData<User>(savedUser, defaultUser);
            if (sanitizedUser && sanitizedUser.id) {
              setUser(sanitizedUser);
            }
          } catch (error) {
            logger.error('Error loading saved user:', error);
            localStorage.removeItem(USER_STORAGE_KEY);
          }
        }

        // Check for client session
        await checkClientSession();

        setIsLoading(false);
        return () => unsubscribe();
      } catch (error) {
        logger.error('Auth initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // ============================================
  // Firebase Auth Handlers
  // ============================================

  const handleFirebaseAuth = async (firebaseUser: FirebaseUser) => {
    try {
      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: userData.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        role: userData.role || 'user',
        authType: 'firebase',
        avatar: userData.avatar || firebaseUser.photoURL,
        phone: userData.phone || firebaseUser.phoneNumber,
        createdAt: userData.createdAt?.toDate(),
        lastLogin: new Date()
      };

      setUser(newUser);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));

      // Update last login in Firestore
      if (userDoc.exists()) {
        await updateDoc(doc(db, 'users', firebaseUser.uid), {
          lastLogin: serverTimestamp()
        });
      }

      // Register GSM session
      addSession({ email: newUser.email, name: newUser.name });

      logger.info('Firebase auth successful', { userId: newUser.id });
    } catch (error) {
      logger.error('Error handling Firebase auth:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    console.log('[AuthContext] Login attempt for:', email);
    console.log('[AuthContext] isUsingLocalAuth():', isUsingLocalAuth());

    // Check if using local auth (Firebase not configured)
    if (isUsingLocalAuth()) {
      console.log('[AuthContext] Using LOCAL auth');
      const result = validateLocalLogin(email, password);
      console.log('[AuthContext] Local auth result:', result);
      
      if (result.success && result.user) {
        const newUser: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role as UserRole,
          authType: 'local',
          phone: result.user.phone,
          avatar: result.user.avatar,
          createdAt: result.user.createdAt ? new Date(result.user.createdAt) : undefined,
          lastLogin: result.user.lastLogin ? new Date(result.user.lastLogin) : undefined,
        };
        
        setUser(newUser);
        
        // Save to BOTH storage locations for persistence
        setLocalCurrentUser(result.user);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
        
        addSession({ email: newUser.email, name: newUser.name });
        
        logger.info('Local login successful', { email });
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: result.error || 'Erro ao fazer login.' };
    }

    // Firebase login
    console.log('[AuthContext] Using FIREBASE auth');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleFirebaseAuth(userCredential.user);

      logger.info('Login successful', { email });
      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      logger.error('Login failed:', error);

      let errorMessage = 'Erro ao fazer login. Tente novamente.';

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Senha incorreta.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Email inválido.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erro de conexão. Verifique sua internet.';
          break;
      }

      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async (reason?: string) => {
    try {
      // Firebase Sign Out (if using Firebase)
      if (!isUsingLocalAuth() && auth.currentUser) {
        await firebaseSignOut(auth);
      }

      // Clear local auth
      clearLocalCurrentUser();

      // Clear state
      setUser(null);
      setClientSession(null);

      // Clear storage
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(CLIENT_SESSION_KEY);
      clearStoredToken();
      clearSecureSession();

      // Show notification if there's a reason
      if (reason) {
        window.dispatchEvent(new CustomEvent('show-notification', {
          detail: {
            type: 'warning',
            title: 'Sessão Encerrada',
            message: reason
          }
        }));
      }

      logger.info('Logout successful');
    } catch (error) {
      logger.error('Error during logout:', error);
      // Force logout even on error
      setUser(null);
      setClientSession(null);
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(CLIENT_SESSION_KEY);
      clearLocalCurrentUser();
    }
  };

  // ============================================
  // Client Token Auth Handlers
  // ============================================

  const checkClientSession = async () => {
    try {
      // Check localStorage for stored token
      const storedToken = getStoredToken();
      if (storedToken?.token) {
        const result = validateToken(storedToken.token);
        if (result.valid && result.project) {
          const secureSession = getSecureSession();

          setClientSession({
            projectId: result.project.id,
            project: result.project,
            token: storedToken.token,
            expiresAt: result.project.expiresAt,
            hasSecureSession: !!secureSession && secureSession.projectId === result.project.id
          });
        } else {
          // Token invalid, clear storage
          clearStoredToken();
        }
      }
    } catch (error) {
      logger.error('Error checking client session:', error);
    }
  };

  const validateClientToken = useCallback(async (token: string): Promise<{ valid: boolean; expired?: boolean; project?: ClientProject; error?: string }> => {
    try {
      const result = validateToken(token);

      if (result.valid && result.project) {
        // Store token locally
        storeTokenLocally(token, result.project.id);

        // Create client session
        const secureSession = getSecureSession();

        setClientSession({
          projectId: result.project.id,
          project: result.project,
          token: token,
          expiresAt: result.project.expiresAt,
          hasSecureSession: !!secureSession && secureSession.projectId === result.project.id
        });

        logger.info('Client token validated', { projectId: result.project.id });
        return { valid: true, project: result.project };
      }

      return { valid: false, expired: result.expired, error: result.error };
    } catch (error) {
      logger.error('Error validating client token:', error);
      return { valid: false, error: 'Erro ao validar token' };
    }
  }, []);

  const clearClientSession = useCallback(() => {
    setClientSession(null);
    clearStoredToken();
    clearSecureSession();
    localStorage.removeItem(CLIENT_SESSION_KEY);
  }, []);

  // ============================================
  // Service Access Handler
  // ============================================

  const handleServiceAccess = useCallback((serviceType: string, serviceData?: ServiceData) => {
    const authenticated = !!user;

    if (serviceData?.requiresLogin && !authenticated) {
      // Service requires login - show login modal
      window.dispatchEvent(new CustomEvent('show-login-modal', {
        detail: {
          service: serviceType,
          title: serviceData.title
        }
      }));
    } else if (serviceType === 'technical-tools') {
      // GSM Tools - redirect to GSM panel
      if (authenticated) {
        window.open(env.GSM_SITE_URL, '_blank');
      } else {
        window.dispatchEvent(new CustomEvent('show-login-modal', {
          detail: {
            service: 'technical-tools',
            title: 'ALUGUER DE FERRAMENTAS TÉCNICAS'
          }
        }));
      }
    } else {
      // Other services - WhatsApp
      const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre ${serviceData?.title || serviceType}.`);
      window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
    }
  }, [user]);

  // ============================================
  // Session Management
  // ============================================

  const refreshSession = useCallback(async () => {
    if (user?.authType === 'firebase' && auth.currentUser) {
      // Refresh Firebase token
      await auth.currentUser.getIdToken(true);
    } else if (clientSession) {
      // Re-validate client token
      await validateClientToken(clientSession.token);
    }
  }, [user, clientSession, validateClientToken]);

  const getSessionInfo = useCallback((): { type: AuthType; expiresAt?: Date; isValid: boolean } => {
    if (user?.authType === 'firebase') {
      return {
        type: 'firebase',
        isValid: true
      };
    }

    if (clientSession) {
      const isValid = new Date() < clientSession.expiresAt;
      return {
        type: 'token',
        expiresAt: clientSession.expiresAt,
        isValid
      };
    }

    return {
      type: 'guest',
      isValid: true
    };
  }, [user, clientSession]);

  // ============================================
  // GSM Session Events
  // ============================================

  useEffect(() => {
    const handleSessionRemoved = (event: CustomEvent) => {
      const { email } = event.detail;
      if (user && user.email === email) {
        logout('Sua sessão GSM foi encerrada pelo administrador.');
      }
    };

    const handleAllSessionsCleared = () => {
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

  // ============================================
  // Context Value
  // ============================================

  const value: AuthContextType = {
    // State
    user,
    clientSession,
    isAuthenticated: !!user || !!clientSession,
    isClient: !!clientSession,
    isAdmin: user?.role === 'admin',
    isLoading,

    // Admin Auth
    login,
    logout,

    // Client Auth
    validateClientToken,
    clearClientSession,

    // Service Access
    handleServiceAccess,

    // Session Management
    refreshSession,
    getSessionInfo
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ============================================
// Hook for Client Panel
// ============================================

export const useClientAuth = () => {
  const auth = useAuth();

  if (!auth.isClient) {
    return {
      isAuthenticated: false,
      project: null,
      hasSecureSession: false
    };
  }

  return {
    isAuthenticated: true,
    project: auth.clientSession?.project || null,
    hasSecureSession: auth.clientSession?.hasSecureSession || false,
    expiresAt: auth.clientSession?.expiresAt
  };
};

// ============================================
// Hook for Admin Panel
// ============================================

export const useAdminAuth = () => {
  const auth = useAuth();

  return {
    isAuthenticated: auth.isAdmin,
    user: auth.isAdmin ? auth.user : null,
    login: auth.login,
    logout: auth.logout
  };
};
