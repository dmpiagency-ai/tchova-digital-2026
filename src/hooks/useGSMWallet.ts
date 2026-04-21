// ============================================
// useGSMWallet - Custom Hook
// Gestão de carteira GSM com estados completos
// ============================================

import { useState, useEffect, useCallback } from 'react';
import { GSMWallet, Currency } from '@/types/gsm';
import { gsmApiService, WalletTopupRequest, LoadingState } from '@/services/gsm/gsmApiService';
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// TYPES
// ============================================

export interface UseGSMWalletReturn {
  wallet: GSMWallet | null;
  status: LoadingState;
  error: string | null;
  isLoading: boolean;
  
  // Computados
  balanceFormatted: (currency: Currency) => string;
  hasBalance: (amount: number, currency: Currency) => boolean;
  
  // Actions
  refresh: () => void;
  topup: (request: Omit<WalletTopupRequest, 'userId'>) => Promise<{ success: boolean; transactionId?: string; error?: string }>;
  isTopupLoading: boolean;
}

// ============================================
// FORMATTERS
// ============================================

const formatBalance = (amount: number, currency: Currency): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(amount);
  }
  return new Intl.NumberFormat('pt-MZ', { style: 'currency', currency: 'MZN', maximumFractionDigits: 0 })
    .format(amount)
    .replace('MZN', 'MTn');
};

// ============================================
// HOOK
// ============================================

export const useGSMWallet = (): UseGSMWalletReturn => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [wallet, setWallet] = useState<GSMWallet | null>(null);
  const [status, setStatus] = useState<LoadingState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isTopupLoading, setIsTopupLoading] = useState(false);

  const fetchWallet = useCallback(async () => {
    if (!userId || userId === 'guest') return;
    setStatus('loading');
    setError(null);
    try {
      const data = await gsmApiService.getWallet(userId);
      setWallet(data);
      setStatus('success');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao carregar carteira';
      setError(msg);
      setStatus('error');
    }
  }, [userId]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  const topup = useCallback(
    async (req: Omit<WalletTopupRequest, 'userId'>) => {
      setIsTopupLoading(true);
      try {
        const result = await gsmApiService.topupWallet({ ...req, userId });
        // Refresh wallet after topup
        await fetchWallet();
        return { success: true, transactionId: result.transactionId };
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro ao carregar carteira';
        return { success: false, error: msg };
      } finally {
        setIsTopupLoading(false);
      }
    },
    [userId, fetchWallet]
  );

  const balanceFormatted = useCallback(
    (currency: Currency): string => {
      if (!wallet) return currency === 'USD' ? '$0.00' : 'MTn 0';
      const amount = currency === 'USD' ? wallet.balance.usd : wallet.balance.mtn;
      return formatBalance(amount, currency);
    },
    [wallet]
  );

  const hasBalance = useCallback(
    (amount: number, currency: Currency): boolean => {
      if (!wallet) return false;
      const balance = currency === 'USD' ? wallet.balance.usd : wallet.balance.mtn;
      return balance >= amount;
    },
    [wallet]
  );

  return {
    wallet,
    status,
    error,
    isLoading: status === 'loading',
    balanceFormatted,
    hasBalance,
    refresh: fetchWallet,
    topup,
    isTopupLoading,
  };
};

export default useGSMWallet;
