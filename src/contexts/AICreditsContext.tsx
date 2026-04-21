import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AICreditsContextType {
  credits: number;
  addCredits: (amount: number) => void;
  deductCredits: (amount: number) => boolean;
  isLoading: boolean;
}

const AICreditsContext = createContext<AICreditsContextType | undefined>(undefined);

export function AICreditsProvider({ children }: { children: ReactNode }) {
  const [credits, setCredits] = useState(100);
  const [isLoading] = useState(false);

  const addCredits = useCallback((amount: number) => {
    setCredits(prev => prev + amount);
  }, []);

  const deductCredits = useCallback((amount: number): boolean => {
    if (credits >= amount) {
      setCredits(prev => prev - amount);
      return true;
    }
    return false;
  }, [credits]);

  return (
    <AICreditsContext.Provider value={{ credits, addCredits, deductCredits, isLoading }}>
      {children}
    </AICreditsContext.Provider>
  );
}

export function useAICredits() {
  const context = useContext(AICreditsContext);
  if (context === undefined) {
    throw new Error('useAICredits must be used within an AICreditsProvider');
  }
  return context;
}
