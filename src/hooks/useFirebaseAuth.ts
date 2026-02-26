// 🔌 PLUG-IN SYSTEM: Firebase Authentication Hook
// Easily connect/disconnect Firebase Auth without breaking code

import { useState, useEffect } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { isFeatureEnabled } from '@/config/features';
import { auth, db } from '@/config/firebase';

// 🔌 PLUG-IN: Authentication Hook Interface
interface UseFirebaseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Authentication Methods
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: { displayName?: string; photoURL?: string }) => Promise<void>;
}

// 🔌 PLUG-IN: User Profile Interface
interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin: Date;
  leadStatus?: 'cold' | 'warm' | 'hot';
  serviceInterest?: string[];
}

// 🔌 PLUG-IN: Authentication Hook Implementation
export const useFirebaseAuth = (): UseFirebaseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔌 PLUG-IN: Check if auth is enabled
  const authEnabled = isFeatureEnabled('auth');

  // 🔌 PLUG-IN: Auth State Listener
  useEffect(() => {
    if (!authEnabled) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser);

          // 🔌 PLUG-IN: Sync user profile to Firestore
          await syncUserProfile(firebaseUser);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth state change error:', err);
        setError('Erro ao verificar autenticação');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [authEnabled]);

  // 🔌 PLUG-IN: Sync User Profile to Firestore
  const syncUserProfile = async (firebaseUser: User) => {
    if (!isFeatureEnabled('firestore')) return;

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // Create new user profile
        const userProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: 'user',
          createdAt: new Date(),
          lastLogin: new Date(),
          leadStatus: 'cold'
        };

        await setDoc(userRef, userProfile);
      } else {
        // Update last login
        await setDoc(userRef, {
          lastLogin: new Date()
        }, { merge: true });
      }
    } catch (err) {
      console.error('Error syncing user profile:', err);
    }
  };

  // 🔌 PLUG-IN: Sign In with Email/Password
  const signIn = async (email: string, password: string) => {
    if (!authEnabled) {
      throw new Error('Autenticação não está habilitada');
    }

    try {
      setError(null);
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: unknown) {
      const errorCode = err instanceof Error && 'code' in err ? (err as { code: string }).code : 'unknown';
      const errorMessage = getAuthErrorMessage(errorCode);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🔌 PLUG-IN: Sign Up with Email/Password
  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!authEnabled) {
      throw new Error('Autenticação não está habilitada');
    }

    try {
      setError(null);
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
    } catch (err: unknown) {
      const errorCode = err instanceof Error && 'code' in err ? (err as { code: string }).code : 'unknown';
      const errorMessage = getAuthErrorMessage(errorCode);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🔌 PLUG-IN: Sign In with Google
  const signInWithGoogle = async () => {
    if (!authEnabled) {
      throw new Error('Autenticação não está habilitada');
    }

    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const errorCode = err instanceof Error && 'code' in err ? (err as { code: string }).code : 'unknown';
      const errorMessage = getAuthErrorMessage(errorCode);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 🔌 PLUG-IN: Logout
  const logout = async () => {
    if (!authEnabled) return;

    try {
      setError(null);
      await signOut(auth);
    } catch (err: unknown) {
      setError('Erro ao fazer logout');
      throw new Error('Erro ao fazer logout');
    }
  };

  // 🔌 PLUG-IN: Reset Password
  const resetPassword = async (email: string) => {
    if (!authEnabled) {
      throw new Error('Autenticação não está habilitada');
    }

    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: unknown) {
      const errorCode = err instanceof Error && 'code' in err ? (err as { code: string }).code : 'unknown';
      const errorMessage = getAuthErrorMessage(errorCode);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // 🔌 PLUG-IN: Update User Profile
  const updateUserProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    if (!authEnabled || !user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      setError(null);
      await updateProfile(user, updates);

      // Update in Firestore too
      if (isFeatureEnabled('firestore')) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, updates, { merge: true });
      }
    } catch (err: unknown) {
      setError('Erro ao atualizar perfil');
      throw new Error('Erro ao atualizar perfil');
    }
  };

  // 🔌 PLUG-IN: Error Message Helper
  const getAuthErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/email-already-in-use':
        return 'Este email já está em uso';
      case 'auth/weak-password':
        return 'Senha muito fraca';
      case 'auth/invalid-email':
        return 'Email inválido';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde';
      default:
        return 'Erro de autenticação. Tente novamente';
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,

    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };
};

// 🔌 PLUG-IN: Unified Auth Hook - Always call both hooks internally to satisfy React rules
// This hook decides at runtime which implementation to use based on feature flag
export const useAuth = (): UseFirebaseAuthReturn => {
  const authEnabled = isFeatureEnabled('auth');
  
  // Always call both hooks to satisfy React Hooks rules
  const firebaseAuth = useFirebaseAuth();
  const mockAuth = useMockAuth();
  
  // Return the appropriate implementation based on feature flag
  return authEnabled ? firebaseAuth : mockAuth;
};

// 🔌 PLUG-IN: Fallback Hook for when auth is disabled
// This hook is always called to satisfy React Hooks rules, but only used when auth is disabled
export const useMockAuth = (): UseFirebaseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock authentication for development/demo
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email && password) {
      // Create mock user
      const mockUser = {
        uid: 'mock-user-' + Date.now(),
        email,
        displayName: email.split('@')[0],
        photoURL: null,
        emailVerified: true
      } as User;

      setUser(mockUser);
    } else {
      setError('Credenciais inválidas');
      throw new Error('Credenciais inválidas');
    }

    setLoading(false);
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    return signIn(email, password);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser = {
      uid: 'mock-google-user-' + Date.now(),
      email: 'user@gmail.com',
      displayName: 'Usuário Google',
      photoURL: 'https://via.placeholder.com/40',
      emailVerified: true
    } as User;

    setUser(mockUser);
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    console.log('Mock: Password reset for', email);
  };

  const updateUserProfile = async (updates: { displayName?: string; photoURL?: string }) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };
};