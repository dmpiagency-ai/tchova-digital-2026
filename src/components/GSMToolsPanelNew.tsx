// ============================================
// GSM TOOLS PANEL - IMPROVED VERSION
// Sistema de aluguel de ferramentas GSM
// UX melhorada com checkout flow completo
// ============================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Box,
  Lock,
  Activity,
  Zap,
  RefreshCw,
  Smartphone,
  Monitor,
  Server,
  Search,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Timer,
  History,
  Wallet,
  Key,
  ExternalLink,
  Star,
  X,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  Grid,
  ChevronRight,
  ArrowLeft,
  DollarSign,
  Coins,
  Gift,
  ArrowRight,
  Check,
  Info
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
  GSM_TOOLS,
  TOOL_CATEGORIES,
  getToolsByCategory,
  searchTools,
  hasAvailableSlots,
  getAvailableSlots,
  getToolByKey
} from '@/config/gsmToolsConfig';

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
import GSMPaymentModal from '@/components/GSMPaymentModal';
import GSMNotifications from '@/components/GSMNotifications';
import { notifyPaymentSuccess, notifyPaymentFailed, notifyRentalCreated } from '@/services/gsmFirebase';

// ============================================
// ICON MAP
// ============================================

const iconMap: Record<string, React.ReactNode> = {
  Box: <Box className="w-5 h-5" />,
  Lock: <Lock className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Key: <Key className="w-5 h-5" />,
  Grid: <Grid className="w-5 h-5" />
};

// ============================================
// MAIN COMPONENT
// ============================================

interface GSMToolsPanelProps {
  onRentTool?: (tool: GSMTool, duration: number, price: number) => void;
  showBalance?: boolean;
  initialCategory?: string;
}

const GSMToolsPanel: React.FC<GSMToolsPanelProps> = ({
  onRentTool,
  showBalance = true,
  initialCategory = 'all'
}) => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id || 'guest';
  
  // ============================================
  // STATE
  // ============================================
  
  // Currency & Level
  const [currency, setCurrency] = useState<Currency>(getPreferredCurrency());
  const [userLevel, setUserLevel] = useState<UserLevel>('cliente');
  
  // Wallet
  const [wallet, setWallet] = useState<GSMWallet | null>(null);
  
  // Tools
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<GSMTool | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  
  // Rentals
  const [activeRental, setActiveRental] = useState<GSMRental | null>(null);
  const [rentalHistory, setRentalHistory] = useState<GSMRental[]>([]);
  const [transactions, setTransactions] = useState<GSMTransaction[]>([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0, formatted: '00:00:00' });
  
  // Dialogs
  const [currentDialog, setCurrentDialog] = useState<'none' | 'tool' | 'checkout' | 'credentials' | 'history' | 'wallet' | 'success'>('none');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // ============================================
  // COMPUTED VALUES
  // ============================================
  
  // Filtered tools
  const filteredTools = useMemo(() => {
    let tools = getToolsByCategory(selectedCategory as 'all' | 'instant' | 'server' | 'box' | 'teamviewer');
    
    if (searchQuery) {
      tools = searchTools(searchQuery);
    }
    
    return tools;
  }, [selectedCategory, searchQuery]);
  
  // Price calculation
  const priceCalculation = useMemo(() => {
    if (!selectedTool) return null;
    return calculateRentalPrice(selectedTool, selectedDuration, userLevel, currency);
  }, [selectedTool, selectedDuration, userLevel, currency]);
  
  // Balance check
  const balanceCheck = useMemo(() => {
    if (!priceCalculation) return { sufficient: false, balance: 0, deficit: 0 };
    return hasSufficientBalance(userId, priceCalculation.finalPrice, currency);
  }, [priceCalculation, userId, currency]);
  
  // ============================================
  // EFFECTS
  // ============================================
  
  // Initialize wallet
  useEffect(() => {
    let userWallet = getWallet(userId);
    if (!userWallet) {
      // Create wallet with demo balance for testing
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
  
  // ============================================
  // HANDLERS
  // ============================================
  
  // Toggle currency
  const handleToggleCurrency = useCallback(() => {
    const newCurrency = currency === 'USD' ? 'MTN' : 'USD';
    setCurrency(newCurrency);
    setPreferredCurrency(newCurrency);
  }, [currency]);
  
  // Select tool for rental
  const handleSelectTool = useCallback((tool: GSMTool) => {
    setSelectedTool(tool);
    setSelectedDuration(tool.duration.options[0]);
    setCurrentDialog('tool');
  }, []);
  
  // Proceed to checkout
  const handleProceedToCheckout = useCallback(() => {
    setCurrentDialog('checkout');
  }, []);
  
  // Confirm rental
  const handleConfirmRental = useCallback(async () => {
    if (!selectedTool || !priceCalculation || !balanceCheck.sufficient) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = createRental(
      selectedTool,
      userId,
      user?.email || 'guest@example.com',
      user?.name || 'Guest',
      selectedDuration,
      currency
    );
    
    if (result) {
      setActiveRental(result.rental);
      setRentalHistory(prev => [result.rental, ...prev]);
      setTransactions(prev => [result.transaction, ...prev]);
      
      // Update wallet
      const updatedWallet = getWallet(userId);
      setWallet(updatedWallet);
      
      setCurrentDialog('success');
      
      if (onRentTool) {
        onRentTool(selectedTool, selectedDuration, priceCalculation.finalPrice);
      }
    }
    
    setIsLoading(false);
  }, [selectedTool, priceCalculation, balanceCheck, userId, user, selectedDuration, currency, onRentTool]);
  
  // Add credits
  const handleAddCredits = useCallback((amountUsd: number) => {
    const amountMtn = convertCurrency(amountUsd, 'USD', 'MTN');
    
    const tx = addCredits(
      userId,
      { usd: amountUsd, mtn: amountMtn },
      'demo_payment',
      `DEMO_${Date.now()}`
    );
    
    if (tx) {
      const updatedWallet = getWallet(userId);
      setWallet(updatedWallet);
      setTransactions(prev => [tx, ...prev]);
    }
  }, [userId]);
  
  // Copy to clipboard with feedback
  const handleCopy = useCallback(async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      // Could add toast notification here
      console.log('Copied to clipboard');
    }
  }, []);
  
  // Handle payment success
  const handlePaymentSuccess = useCallback((amount: number, method: string) => {
    // Refresh wallet
    const updatedWallet = getWallet(userId);
    setWallet(updatedWallet);
    
    // Refresh transactions
    const txs = getUserTransactions(userId);
    setTransactions(txs);
    
    // Close wallet dialog if open
    setCurrentDialog('none');
    setShowPaymentModal(false);
  }, [userId]);
  
  // ============================================
  // RENDER HELPERS
  // ============================================
  
  // Get price for user level
  const getPriceForLevel = (tool: GSMTool, curr: Currency): number => {
    return curr === 'USD' ? tool.pricing[userLevel].usd : tool.pricing[userLevel].mtn;
  };
  
  // Get balance in current currency
  const getBalance = (): number => {
    if (!wallet) return 0;
    return currency === 'USD' ? wallet.balance.usd : wallet.balance.mtn;
  };
  
  // ============================================
  // RENDER
  // ============================================
  
  return (
    <div className="w-full space-y-6">
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
            Tchova Rent Painel
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Aluguel de ferramentas GSM com ativação instantânea
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Currency Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleCurrency}
            className="gap-2"
          >
            {currency === 'USD' ? <DollarSign className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
            {currency}
          </Button>
          
          {/* Balance */}
          {showBalance && wallet && (
            <button
              onClick={() => setCurrentDialog('wallet')}
              className="bg-gradient-to-r from-primary/10 to-brand-green/10 rounded-xl px-4 py-2 border border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="font-bold text-primary">
                  {formatCurrency(getBalance(), currency)}
                </span>
              </div>
            </button>
          )}
          
          {/* History Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDialog('history')}
            className="gap-2"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Histórico</span>
          </Button>
          
          {/* Notifications */}
          <GSMNotifications userId={userId} />
        </div>
      </div>
      
      {/* ============================================ */}
      {/* ACTIVE RENTAL BANNER */}
      {/* ============================================ */}
      {activeRental && isRentalActive(activeRental) && (
        <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 rounded-2xl p-4 border border-green-300/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-600 dark:text-green-400">
                  Aluguel Ativo: {activeRental.toolName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Expira em {countdown.formatted}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDialog('credentials')}
              className="gap-2 border-green-300 text-green-600 hover:bg-green-50"
            >
              <Eye className="w-4 h-4" />
              Ver Credenciais
            </Button>
          </div>
        </div>
      )}
      
      {/* ============================================ */}
      {/* SEARCH AND FILTERS */}
      {/* ============================================ */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ferramentas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {TOOL_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap gap-2"
            >
              {iconMap[category.icon]}
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* ============================================ */}
      {/* USER LEVEL INFO */}
      {/* ============================================ */}
      <div className={`bg-gradient-to-r ${USER_LEVELS[userLevel].color} bg-opacity-10 rounded-xl p-3 border border-opacity-30`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {userLevel === 'vip' && <Sparkles className="w-4 h-4 text-amber-500" />}
            {userLevel === 'revenda' && <TrendingUp className="w-4 h-4 text-purple-500" />}
            <span className="font-semibold">
              Nível: {USER_LEVELS[userLevel].name}
            </span>
            {USER_LEVELS[userLevel].discount > 0 && (
              <Badge variant="secondary" className="ml-2">
                -{USER_LEVELS[userLevel].discount}% desconto
              </Badge>
            )}
          </div>
          {userLevel !== 'revenda' && (
            <Button variant="link" size="sm" className="text-primary">
              Fazer upgrade <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* ============================================ */}
      {/* TOOLS GRID */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const availableSlots = getAvailableSlots(tool);
          const isAvailable = hasAvailableSlots(tool);
          
          return (
            <Card
              key={tool.id}
              className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
                tool.popular ? 'border-primary/50 ring-2 ring-primary/20' : ''
              } ${!isAvailable ? 'opacity-60' : ''}`}
              onClick={() => isAvailable && handleSelectTool(tool)}
            >
              {/* Popular Badge */}
              {tool.popular && (
                <div className="absolute top-2 right-2 z-10">
                  <Badge className="bg-gradient-to-r from-primary to-brand-green text-white">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.gradient.split(' ')[0].replace('from-', '')})` }}
                  >
                    <span className="text-white">
                      {iconMap[tool.icon]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{tool.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {tool.shortDescription}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{tool.rating}</span>
                  <span className="text-xs text-muted-foreground">({tool.reviewCount})</span>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {tool.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {tool.features.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{tool.features.length - 2}
                    </Badge>
                  )}
                </div>
                
                <Separator />
                
                {/* Price & Action */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(getPriceForLevel(tool, currency), currency)}
                    </span>
                    <span className="text-sm text-muted-foreground">/hora</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">
                      {availableSlots} slots
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green"
                      disabled={!isAvailable}
                    >
                      {isAvailable ? 'Alugar' : 'Esgotado'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* No Results */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma ferramenta encontrada</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou a busca
          </p>
        </div>
      )}
      
      {/* ============================================ */}
      {/* TOOL DETAIL DIALOG */}
      {/* ============================================ */}
      <Dialog open={currentDialog === 'tool'} onOpenChange={() => setCurrentDialog('none')}>
        <DialogContent className="sm:max-w-2xl">
          {selectedTool && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${selectedTool.color}, ${selectedTool.gradient.split(' ')[0].replace('from-', '')})` }}
                  >
                    <span className="text-white text-2xl">
                      {iconMap[selectedTool.icon]}
                    </span>
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedTool.name}</DialogTitle>
                    <DialogDescription>{selectedTool.shortDescription}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Description */}
                <p className="text-muted-foreground">{selectedTool.description}</p>
                
                {/* Duration Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Selecione a Duração</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedTool.duration.options.map((duration) => {
                      const pricing = calculateRentalPrice(selectedTool, duration, userLevel, currency);
                      const isSelected = selectedDuration === duration;
                      
                      return (
                        <Button
                          key={duration}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`flex flex-col h-auto py-3 ${
                            isSelected ? 'bg-gradient-to-r from-primary to-brand-green' : ''
                          }`}
                          onClick={() => setSelectedDuration(duration)}
                        >
                          <span className="font-bold">{formatDuration(duration)}</span>
                          <span className="text-xs mt-1">
                            {formatCurrency(pricing.finalPrice, currency)}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Features */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold">O que está incluído:</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTool.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Slots Info */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{getAvailableSlots(selectedTool)} de {selectedTool.slots.total} slots disponíveis</span>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setCurrentDialog('none')}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleProceedToCheckout}
                  className="bg-gradient-to-r from-primary to-brand-green"
                >
                  Continuar para Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* ============================================ */}
      {/* CHECKOUT DIALOG */}
      {/* ============================================ */}
      <Dialog open={currentDialog === 'checkout'} onOpenChange={() => setCurrentDialog('tool')}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Finalizar Compra</DialogTitle>
            <DialogDescription>Confirme os detalhes do seu pedido</DialogDescription>
          </DialogHeader>
          
          {selectedTool && priceCalculation && (
            <div className="space-y-6 py-4">
              {/* Tool Summary */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${selectedTool.color}, ${selectedTool.gradient.split(' ')[0].replace('from-', '')})` }}
                >
                  <span className="text-white">{iconMap[selectedTool.icon]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedTool.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {formatDuration(selectedDuration)} de acesso
                  </p>
                </div>
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Preço base ({formatDuration(selectedDuration)})</span>
                  <span>{formatCurrency(priceCalculation.basePrice, currency)}</span>
                </div>
                
                {priceCalculation.durationDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto por duração</span>
                    <span>-{formatCurrency(priceCalculation.durationDiscount, currency)}</span>
                  </div>
                )}
                
                {USER_LEVELS[userLevel].discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto {USER_LEVELS[userLevel].name}</span>
                    <span>-{USER_LEVELS[userLevel].discount}%</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatCurrency(priceCalculation.finalPrice, currency)}
                  </span>
                </div>
              </div>
              
              {/* Balance Check */}
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                balanceCheck.sufficient 
                  ? 'bg-green-500/10 border border-green-300/30' 
                  : 'bg-red-500/10 border border-red-300/30'
              }`}>
                {balanceCheck.sufficient ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-600">Saldo suficiente</p>
                      <p className="text-sm text-muted-foreground">
                        Saldo após: {formatCurrency(balanceCheck.balance - priceCalculation.finalPrice, currency)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-600">Saldo insuficiente</p>
                      <p className="text-sm text-muted-foreground">
                        Necessário: {formatCurrency(balanceCheck.deficit, currency)} adicional
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCurrentDialog('none');
                        setShowPaymentModal(true);
                      }}
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                  </>
                )}
              </div>
              
              {/* What you get */}
              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="font-semibold mb-2">O que você receberá:</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Acesso imediato após confirmação
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Credenciais válidas por {formatDuration(selectedDuration)}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    Histórico completo no painel
                  </li>
                </ul>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setCurrentDialog('tool')} className="w-full sm:w-auto">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button
              onClick={handleConfirmRental}
              disabled={!balanceCheck.sufficient || isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-brand-green"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Confirmar Aluguel
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* ============================================ */}
      {/* SUCCESS DIALOG */}
      {/* ============================================ */}
      <Dialog open={currentDialog === 'success'} onOpenChange={() => setCurrentDialog('credentials')}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Aluguel Confirmado!
            </DialogTitle>
            <DialogDescription>
              Suas credenciais foram geradas com sucesso
            </DialogDescription>
          </DialogHeader>
          
          {activeRental && (
            <div className="space-y-4 py-4">
              {/* Timer */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 text-center">
                <Timer className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Tempo restante</p>
                <p className="text-2xl font-bold text-green-600">{countdown.formatted}</p>
              </div>
              
              {/* Credentials */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">URL de Acesso</Label>
                  <div className="flex gap-2">
                    <Input value={activeRental.credentials.url} readOnly className="font-mono text-sm" />
                    <Button size="icon" variant="outline" onClick={() => handleCopy(activeRental.credentials.url)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Usuário</Label>
                  <div className="flex gap-2">
                    <Input value={activeRental.credentials.username} readOnly className="font-mono text-sm" />
                    <Button size="icon" variant="outline" onClick={() => handleCopy(activeRental.credentials.username)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Senha</Label>
                  <div className="flex gap-2">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={activeRental.credentials.password}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button size="icon" variant="outline" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleCopy(activeRental.credentials.password)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full bg-gradient-to-r from-primary to-brand-green"
                onClick={() => window.open(activeRental.credentials.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Ferramenta
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* ============================================ */}
      {/* CREDENTIALS DIALOG */}
      {/* ============================================ */}
      <Dialog open={currentDialog === 'credentials'} onOpenChange={() => setCurrentDialog('none')}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Credenciais de Acesso
            </DialogTitle>
            <DialogDescription>
              Guarde estas credenciais em segurança
            </DialogDescription>
          </DialogHeader>
          
          {activeRental && (
            <div className="space-y-4 py-4">
              {/* Timer */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 text-center">
                <Timer className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Tempo restante</p>
                <p className="text-2xl font-bold text-green-600">{countdown.formatted}</p>
              </div>
              
              {/* Credentials */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">URL</Label>
                  <div className="flex gap-2">
                    <Input value={activeRental.credentials.url} readOnly className="font-mono text-sm" />
                    <Button size="icon" variant="outline" onClick={() => handleCopy(activeRental.credentials.url)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Usuário</Label>
                  <div className="flex gap-2">
                    <Input value={activeRental.credentials.username} readOnly className="font-mono text-sm" />
                    <Button size="icon" variant="outline" onClick={() => handleCopy(activeRental.credentials.username)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Senha</Label>
                  <div className="flex gap-2">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={activeRental.credentials.password}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button size="icon" variant="outline" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" variant="outline" onClick={() => handleCopy(activeRental.credentials.password)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Button
                className="w-full bg-gradient-to-r from-primary to-brand-green"
                onClick={() => window.open(activeRental.credentials.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Ferramenta
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* ============================================ */}
      {/* HISTORY DIALOG */}
      {/* ============================================ */}
      <Dialog open={currentDialog === 'history'} onOpenChange={() => setCurrentDialog('none')}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico de Aluguéis
            </DialogTitle>
            <DialogDescription>
              Seus aluguéis anteriores e ativos
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            {rentalHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum aluguel ainda</h3>
                <p className="text-muted-foreground">
                  Seus aluguéis aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {rentalHistory.map((rental) => {
                  const tool = GSM_TOOLS.find(t => t.id === rental.toolId);
                  const isActive = isRentalActive(rental);
                  
                  return (
                    <div
                      key={rental.id}
                      className={`p-4 rounded-xl border ${
                        isActive 
                          ? 'bg-green-500/10 border-green-300/30' 
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: tool ? `linear-gradient(135deg, ${tool.color}, ${tool.gradient.split(' ')[0].replace('from-', '')})` : '#888' }}
                          >
                            <span className="text-white">{iconMap[tool?.icon || 'Box']}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{rental.toolName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {formatDuration(rental.duration)} - {formatCurrency(
                                currency === 'USD' ? rental.pricing.finalPrice.usd : rental.pricing.finalPrice.mtn,
                                currency
                              )}
                            </p>
                          </div>
                        </div>
                        <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-500' : ''}>
                          {isActive ? 'Ativo' : rental.status === 'expired' ? 'Expirado' : 'Finalizado'}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p>Criado: {formatDate(rental.createdAt)}</p>
                        <p>Expirou: {formatDate(rental.expiresAt)}</p>
                      </div>
                      
                      {isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3"
                          onClick={() => {
                            setActiveRental(rental);
                            setCurrentDialog('credentials');
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Credenciais
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* ============================================ */}
      {/* WALLET DIALOG */}
      {/* ============================================ */}
      <Dialog open={currentDialog === 'wallet'} onOpenChange={() => setCurrentDialog('none')}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Minha Carteira
            </DialogTitle>
            <DialogDescription>
              Gerencie seus créditos
            </DialogDescription>
          </DialogHeader>
          
          {wallet && (
            <div className="space-y-6 py-4">
              {/* Balance */}
              <div className="bg-gradient-to-r from-primary/10 to-brand-green/10 rounded-xl p-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Saldo Disponível</p>
                <p className="text-3xl font-bold text-primary">
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
              
              {/* Level */}
              <div className={`p-4 rounded-xl bg-gradient-to-r ${USER_LEVELS[userLevel].color} bg-opacity-10`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Nível Atual</p>
                    <p className="font-semibold">{USER_LEVELS[userLevel].name}</p>
                  </div>
                  {USER_LEVELS[userLevel].discount > 0 && (
                    <Badge>{USER_LEVELS[userLevel].discount}% desconto</Badge>
                  )}
                </div>
              </div>
              
              {/* Add Credits */}
              <div className="space-y-3">
                <Label className="font-semibold">Adicionar Créditos</Label>
                <Button
                  onClick={() => {
                    setCurrentDialog('none');
                    setShowPaymentModal(true);
                  }}
                  className="w-full bg-gradient-to-r from-primary to-brand-green"
                  size="lg"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Adicionar via M-Pesa / E-mola / Cartão
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Pagamento seguro via M-Pesa, E-mola ou Cartão
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  <p className="text-2xl font-bold">{wallet.totalRentals}</p>
                  <p className="text-xs text-muted-foreground">Aluguéis</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-xl">
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      currency === 'USD' ? wallet.totalSpent.usd : wallet.totalSpent.mtn,
                      currency
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Gasto</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* ============================================ */}
      {/* PAYMENT MODAL */}
      {/* ============================================ */}
      <GSMPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
        userId={userId}
        currentBalance={getBalance()}
        currency={currency}
      />
    </div>
  );
};

export default GSMToolsPanel;
