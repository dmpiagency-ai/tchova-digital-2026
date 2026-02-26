// ============================================
// GSM RENTAL PAINEL - DASHBOARD
// Design Liquid Glass Moderno
// Wallet, Active Rental, History
// ============================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Wallet,
  Key,
  Timer,
  History,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Clock,
  ArrowRight,
  DollarSign,
  Coins,
  Gift,
  ExternalLink,
  Star,
  X,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  RefreshCw,
  Bell,
  Settings,
  ChevronRight,
  Zap
} from 'lucide-react';

import {
  GSMTool,
  Currency,
  UserLevel,
  GSMRental,
  GSMTransaction,
  GSMWallet,
  EXCHANGE_RATES,
  USER_LEVELS
} from '@/types/gsm';

import {
  convertCurrency,
  formatCurrency,
  calculateRentalPrice,
  getWallet,
  createWallet,
  hasSufficientBalance,
  createRental,
  getUserRentals,
  getActiveRental,
  isRentalActive,
  getRemainingTime,
  getUserTransactions,
  addCredits,
  getPreferredCurrency,
  setPreferredCurrency,
  copyToClipboard,
  formatDuration,
  formatDate
} from '@/services/gsmRentalService';

import { useAuth } from '@/contexts/AuthContext';
import GSMNotifications from '@/components/GSMNotifications';

interface GSMRentalDashboardProps {
  onRentTool?: (tool: GSMTool, duration: number, price: number) => void;
  showBalance?: boolean;
}

const GSMRentalDashboard: React.FC<GSMRentalDashboardProps> = () => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || 'guest';

  // State
  const [currency, setCurrency] = useState<Currency>(getPreferredCurrency());
  const [userLevel, setUserLevel] = useState<UserLevel>('cliente');
  const [wallet, setWallet] = useState<GSMWallet | null>(null);
  const [activeRental, setActiveRental] = useState<GSMRental | null>(null);
  const [rentalHistory, setRentalHistory] = useState<GSMRental[]>([]);
  const [transactions, setTransactions] = useState<GSMTransaction[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0, formatted: '00:00:00' });
  const [activeTab, setActiveTab] = useState('wallet');

  // Initialize wallet
  useEffect(() => {
    let userWallet = getWallet(userId);
    if (!userWallet) {
      userWallet = createWallet(userId, 'cliente', { usd: 50, mtn: 3200 });
    }
    setWallet(userWallet);
    setUserLevel(userWallet.level);
  }, [userId]);

  // Load rentals and transactions
  useEffect(() => {
    const rentals = getUserRentals(userId);
    setRentalHistory(rentals);

    const active = getActiveRental(userId);
    setActiveRental(active);

    const txs = getUserTransactions(userId);
    setTransactions(txs);
  }, [userId]);

  // Countdown timer
  useEffect(() => {
    if (!activeRental || !isRentalActive(activeRental)) return;

    const timer = setInterval(() => {
      const remaining = getRemainingTime(activeRental);
      setCountdown(remaining);

      if (remaining.total <= 0) {
        setActiveRental(null);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeRental]);

  // Get balance
  const getBalance = (): number => {
    if (!wallet) return 0;
    return currency === 'USD' ? wallet.balance.usd : wallet.balance.mtn;
  };

  // Toggle currency
  const handleToggleCurrency = useCallback(() => {
    const newCurrency = currency === 'USD' ? 'MTN' : 'USD';
    setCurrency(newCurrency);
    setPreferredCurrency(newCurrency);
  }, [currency]);

  // Copy to clipboard
  const handleCopy = useCallback(async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      // Could add toast notification here
      console.log('Copied to clipboard');
    }
  }, []);

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-yellow/5 to-transparent" />

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 text-brand-yellow text-sm font-medium mb-4">
            <Wallet className="w-4 h-4 inline mr-2" />
            Painel de Controle
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">
            Seu{' '}
            <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
              Dashboard
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Gerencie sua carteira, aluguéis ativos e histórico de transações.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Wallet & Active Rental */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Rental Banner */}
            {activeRental && isRentalActive(activeRental) && (
              <Card className="relative overflow-hidden border-green-300/30 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5" />
                <CardContent className="relative p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Timer className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-green-600 dark:text-green-400">
                          Aluguel Ativo
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {activeRental.toolName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-center sm:text-right">
                      <p className="text-sm text-muted-foreground mb-1">Tempo Restante</p>
                      <p className="text-3xl font-black text-green-600 dark:text-green-400 font-mono">
                        {countdown.formatted}
                      </p>
                    </div>
                  </div>

                  {/* Credentials Preview */}
                  <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium">Credenciais disponíveis</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 border-green-300 text-green-600 hover:bg-green-50"
                      >
                        <Eye className="w-4 h-4" />
                        Ver Credenciais
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wallet Card */}
            <Card className="relative overflow-hidden backdrop-blur-xl bg-white/5 border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-brand-green/10" />
              <CardHeader className="relative pb-2">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-primary" />
                    Minha Carteira
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleCurrency}
                    className="gap-2"
                  >
                    {currency === 'USD' ? <DollarSign className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                    {currency}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative">
                {/* Balance Display */}
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-2">Saldo Disponível</p>
                  <p className="text-5xl font-black bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
                    {formatCurrency(getBalance(), currency)}
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleToggleCurrency}
                    className="mt-2"
                  >
                    Ver em {currency === 'USD' ? 'MTn' : 'USD'}
                  </Button>
                </div>

                {/* User Level */}
                <div className={`p-4 rounded-xl bg-gradient-to-r ${USER_LEVELS[userLevel].color} bg-opacity-10 border border-white/10 mb-4`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {userLevel === 'vip' && <Sparkles className="w-5 h-5 text-amber-500" />}
                      {userLevel === 'revenda' && <TrendingUp className="w-5 h-5 text-purple-500" />}
                      <span className="font-semibold">
                        Nível: {USER_LEVELS[userLevel].name}
                      </span>
                    </div>
                    {USER_LEVELS[userLevel].discount > 0 && (
                      <Badge className="bg-primary/20 text-primary">
                        -{USER_LEVELS[userLevel].discount}% desconto
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Add Credits Button */}
                <Button
                  className="w-full h-14 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Adicionar Créditos
                </Button>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-2xl font-bold text-foreground">{wallet?.totalRentals || 0}</p>
                    <p className="text-xs text-muted-foreground">Aluguéis</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(
                        currency === 'USD' ? (wallet?.totalSpent.usd || 0) : (wallet?.totalSpent.mtn || 0),
                        currency
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Gasto</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - History & Notifications */}
          <div className="space-y-6">
            
            {/* Notifications */}
            <Card className="relative overflow-hidden backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5 text-primary" />
                  Notificações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GSMNotifications userId={userId} />
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="relative overflow-hidden backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-brand-yellow" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-between rounded-xl">
                  <span className="flex items-center gap-2">
                    <History className="w-4 h-4" />
                    Ver Histórico
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between rounded-xl">
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Configurações
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between rounded-xl">
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Segurança
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="relative overflow-hidden backdrop-blur-xl bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-brand-bright" />
                  Transações Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Nenhuma transação ainda</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {transactions.slice(0, 5).map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                        >
                          <div className="flex items-center gap-2">
                            {tx.type === 'rental' ? (
                              <Key className="w-4 h-4 text-primary" />
                            ) : tx.type === 'topup' ? (
                              <CreditCard className="w-4 h-4 text-green-500" />
                            ) : (
                              <Gift className="w-4 h-4 text-brand-yellow" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{tx.description}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(tx.createdAt)}
                              </p>
                            </div>
                          </div>
                          <span className={`font-bold ${
                            tx.type === 'topup' ? 'text-green-500' : 'text-foreground'
                          }`}>
                            {tx.type === 'topup' ? '+' : '-'}
                            {formatCurrency(
                              currency === 'USD' ? tx.amount.usd : tx.amount.mtn,
                              currency
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GSMRentalDashboard;
