// ============================================
// USER ACCOUNT MODAL
// Shows logged-in user's account info, rented tools, and credits
// Design Liquid Glass Moderno
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Wallet, 
  Key, 
  CreditCard, 
  History,
  Copy,
  Eye,
  EyeOff,
  Mail,
  Sparkles,
  TrendingUp,
  Coins,
  DollarSign,
  AlertCircle,
  X,
  Zap,
  Settings,
  Shield
} from 'lucide-react';

import { 
  GSMRental, 
  Currency, 
  UserLevel, 
  GSMWallet,
  GSMTransaction,
  USER_LEVELS
} from '@/types/gsm';

import { 
  formatCurrency, 
  getWallet, 
  getUserRentals, 
  getActiveRental,
  isRentalActive,
  getRemainingTime,
  getUserTransactions,
  copyToClipboard,
  formatDuration,
  formatDate,
  getPreferredCurrency
} from '@/services/gsmRentalService';

import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';

interface UserAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserAccountModal: React.FC<UserAccountModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || 'guest';

  // State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currency, setCurrency] = useState<Currency>(getPreferredCurrency());
  const [userLevel, setUserLevel] = useState<UserLevel>('cliente');
  const [wallet, setWallet] = useState<GSMWallet | null>(null);
  const [activeRental, setActiveRental] = useState<GSMRental | null>(null);
  const [rentalHistory, setRentalHistory] = useState<GSMRental[]>([]);
  const [transactions, setTransactions] = useState<GSMTransaction[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0, formatted: '00:00:00' });
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Handle modal open - show login if not authenticated
  useEffect(() => {
    if (isOpen && !isAuthenticated) {
      setShowLoginModal(true);
    }
  }, [isOpen, isAuthenticated]);

  // Load data (only if authenticated)
  useEffect(() => {
    if (!isOpen || !isAuthenticated) return;

    // Load wallet
    const userWallet = getWallet(userId);
    setWallet(userWallet);
    setUserLevel(userWallet?.level || 'cliente');

    // Load rentals
    const rentals = getUserRentals(userId);
    setRentalHistory(rentals);

    const active = getActiveRental(userId);
    setActiveRental(active);

    // Load transactions
    const txs = getUserTransactions(userId);
    setTransactions(txs);
  }, [isOpen, isAuthenticated, userId]);

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
  const getBalance = useMemo((): number => {
    if (!wallet) return 0;
    return currency === 'USD' ? wallet.balance.usd : wallet.balance.mtn;
  }, [wallet, currency]);

  // Toggle currency
  const handleToggleCurrency = () => {
    const newCurrency = currency === 'USD' ? 'MTN' : 'USD';
    setCurrency(newCurrency);
  };

  // Copy to clipboard
  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Get user initials
  const getUserInitials = useMemo(() => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return 'U';
  }, [user]);

  const levelInfo = USER_LEVELS[userLevel] || USER_LEVELS.cliente;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-black/80 backdrop-blur-xl border-white/10 p-0">
        {/* Header */}
        <div className="relative p-6 pb-4 bg-gradient-to-r from-primary/20 via-brand-green/10 to-primary/20 border-b border-white/10">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/10 hover:bg-white/20"
          >
            <X className="w-4 h-4" />
          </Button>

          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-brand-green flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {getUserInitials}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {user?.name || 'Usuário'}
              </h2>
              <p className="text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email || 'email@exemplo.com'}
              </p>
            </div>
          </div>

          {/* Level Badge */}
          <div className="mt-4 flex items-center gap-3">
            <Badge className={`${levelInfo.color} px-4 py-1.5`}>
              {userLevel === 'vip' && <Sparkles className="w-4 h-4 mr-1" />}
              {userLevel === 'revenda' && <TrendingUp className="w-4 h-4 mr-1" />}
              {levelInfo.name}
            </Badge>
            {levelInfo.discount > 0 && (
              <Badge variant="outline" className="border-primary/30 text-primary">
                -{levelInfo.discount}% desconto
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            
            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full bg-white/5 border border-white/10 rounded-xl p-1">
                <TabsTrigger 
                  value="overview" 
                  className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger 
                  value="rentals" 
                  className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Aluguéis
                </TabsTrigger>
                <TabsTrigger 
                  value="transactions" 
                  className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <History className="w-4 h-4 mr-2" />
                  Transações
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-4 mt-4">
                {/* Active Rental */}
                {activeRental && isRentalActive(activeRental) ? (
                  <Card className="border-green-300/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-green-400">
                        <Zap className="w-5 h-5" />
                        Aluguel Ativo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-lg">{activeRental.toolName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDuration(activeRental.duration)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground mb-1">Tempo Restante</p>
                          <p className="text-2xl font-black text-green-400 font-mono">
                            {countdown.formatted}
                          </p>
                        </div>
                      </div>

                      {/* Credentials */}
                      <Separator className="my-4 bg-white/10" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Credenciais de Acesso</p>
                        {activeRental.credentials && (
                          <div className="space-y-2">
                            {activeRental.credentials.username && (
                              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                <span className="text-sm text-muted-foreground">Usuário:</span>
                                <div className="flex items-center gap-2">
                                  <code className="text-sm">{activeRental.credentials.username}</code>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleCopy(activeRental.credentials?.username || '', 'username')}
                                  >
                                    {copiedField === 'username' ? (
                                      <span className="text-green-500 text-xs">OK</span>
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}
                            {activeRental.credentials.password && (
                              <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                <span className="text-sm text-muted-foreground">Senha:</span>
                                <div className="flex items-center gap-2">
                                  <code className="text-sm">
                                    {showPassword ? activeRental.credentials.password : '••••••••'}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => handleCopy(activeRental.credentials?.password || '', 'password')}
                                  >
                                    {copiedField === 'password' ? (
                                      <span className="text-green-500 text-xs">OK</span>
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-yellow-300/30 bg-yellow-500/5">
                    <CardContent className="py-8 text-center">
                      <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                      <p className="text-muted-foreground">Nenhum aluguel ativo</p>
                      <Button className="mt-4 bg-gradient-to-r from-primary to-brand-green">
                        <Zap className="w-4 h-4 mr-2" />
                        Alugar Agora
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Wallet Balance */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-primary" />
                        Saldo da Carteira
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleCurrency}
                        className="gap-1"
                      >
                        {currency === 'USD' ? <DollarSign className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
                        {currency}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-4xl font-black bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
                      {formatCurrency(getBalance, currency)}
                    </p>
                    <Button 
                      className="w-full mt-4 bg-gradient-to-r from-primary to-brand-green"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Adicionar Créditos
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="py-4 text-center">
                      <p className="text-2xl font-bold">{wallet?.totalRentals || 0}</p>
                      <p className="text-xs text-muted-foreground">Total de Aluguéis</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="py-4 text-center">
                      <p className="text-2xl font-bold">
                        {formatCurrency(
                          currency === 'USD' ? (wallet?.totalSpent.usd || 0) : (wallet?.totalSpent.mtn || 0),
                          currency
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Gasto</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Rentals Tab */}
              <TabsContent value="rentals" className="mt-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    {rentalHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <Key className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Nenhum aluguel realizado</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {rentalHistory.map((rental: GSMRental) => (
                          <div
                            key={rental.id}
                            className={`p-4 rounded-xl border ${
                              isRentalActive(rental) 
                                ? 'bg-green-500/10 border-green-500/30' 
                                : 'bg-white/5 border-white/10'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  isRentalActive(rental) 
                                    ? 'bg-green-500/20' 
                                    : 'bg-white/10'
                                }`}>
                                  {isRentalActive(rental) ? (
                                    <Zap className="w-5 h-5 text-green-500" />
                                  ) : (
                                    <Key className="w-5 h-5 text-muted-foreground" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{rental.toolName}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(rental.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant={isRentalActive(rental) ? 'default' : 'secondary'}>
                                  {isRentalActive(rental) ? 'Ativo' : 'Expirado'}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {formatDuration(rental.duration)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Transactions Tab */}
              <TabsContent value="transactions" className="mt-4">
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    {transactions.length === 0 ? (
                      <div className="text-center py-8">
                        <History className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Nenhuma transação</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {transactions.map((tx: GSMTransaction) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                tx.type === 'topup' ? 'bg-green-500/20' : 'bg-primary/20'
                              }`}>
                                {tx.type === 'topup' ? (
                                  <CreditCard className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Key className="w-4 h-4 text-primary" />
                                )}
                              </div>
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 flex gap-2">
          <Button variant="outline" className="flex-1 rounded-xl">
            <Settings className="w-4 h-4 mr-2" />
            Configurações
          </Button>
          <Button variant="outline" className="flex-1 rounded-xl">
            <Shield className="w-4 h-4 mr-2" />
            Segurança
          </Button>
        </div>
      </DialogContent>

      {/* Login Modal - Show when not authenticated */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          onClose();
        }}
        title="Acesse sua Conta"
        description="Faça login para ver suas ferramentas e saldo"
      />
    </Dialog>
  );
};

export default UserAccountModal;
