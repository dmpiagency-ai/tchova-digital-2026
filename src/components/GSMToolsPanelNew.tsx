// ============================================
// GSM TOOLS PANEL NEW
// Painel de ferramentas GSM com interface moderna
// Suporta aluguel instantâneo, checkout seguro e pagamentos M-Pesa/E-mola
// ============================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Clock, 
  Shield, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  ExternalLink,
  Copy,
  Search,
  Zap,
  Wallet
} from 'lucide-react';

import { 
  GSMTool, 
  GSMRental, 
  GSMTransaction, 
  GSMWallet, 
  Currency, 
  EXCHANGE_RATES 
} from '@/types/gsm';
import { 
  GSM_TOOLS, 
  TOOL_CATEGORIES, 
  getToolByKey, 
  getToolsByCategory, 
  getAvailableSlots, 
  hasAvailableSlots 
} from '@/config/gsmToolsConfig';
import { 
  createRental, 
  getUserRentals, 
  getActiveRental, 
  isRentalActive, 
  getRemainingTime, 
  getUserTransactions, 
  getWallet, 
  createWallet, 
  convertCurrency, 
  formatCurrency, 
  addCredits, 
  hasSufficientBalance, 
  calculateRentalPrice, 
  copyToClipboard 
} from '@/services/gsmRentalService';
import GSMPaymentModal from './GSMPaymentModal';

// ============================================
// COMPONENT
// ============================================

interface GSMToolsPanelNewProps {
  onRentalComplete?: (rental: GSMRental) => void;
  showCategories?: boolean;
  initialCategory?: string;
}

const GSMToolsPanelNew: React.FC<GSMToolsPanelNewProps> = ({
  onRentalComplete,
  showCategories = true,
  initialCategory = 'all'
}) => {
  const [userId] = useState('test-user-123'); // Demo user ID
  const [wallet, setWallet] = useState<GSMWallet | null>(null);
  const [activeRental, setActiveRental] = useState<GSMRental | null>(null);
  const [rentalHistory, setRentalHistory] = useState<GSMRental[]>([]);
  const [transactions, setTransactions] = useState<GSMTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTool, setSelectedTool] = useState<GSMTool | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [priceCalculation, setPriceCalculation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentDialog, setCurrentDialog] = useState<'none' | 'rent' | 'credentials' | 'history'>('none');
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0, formatted: '00:00:00' });

  // ============================================
  // EFFECTS
  // ============================================

  // Initialize user wallet
  useEffect(() => {
    const initializeUserWallet = () => {
      let userWallet = getWallet(userId);
      if (!userWallet) {
        userWallet = createWallet(userId, 'cliente', { usd: 50, mtn: 3200 });
      }
      setWallet(userWallet);
    };
    
    initializeUserWallet();
  }, [userId]);

  // Load rental data
  useEffect(() => {
    const rentals = getUserRentals(userId);
    setRentalHistory(rentals);
    
    const active = getActiveRental(userId);
    setActiveRental(active);
    
    const txs = getUserTransactions(userId);
    setTransactions(txs);
  }, [userId]);

  // Countdown timer for active rental
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

  // Calculate price when tool or duration changes
  useEffect(() => {
    const calculatePrice = async () => {
      if (!selectedTool) {
        setPriceCalculation(null);
        return;
      }
      const result = await calculateRentalPrice(selectedTool, selectedDuration, 'cliente', 'MTN');
      setPriceCalculation(result);
    };
    
    calculatePrice();
  }, [selectedTool, selectedDuration]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  // Filtered tools based on category and search
  const filteredTools = useMemo(() => {
    let tools = getToolsByCategory(selectedCategory as 'all' | 'instant' | 'teamviewer' | 'server' | 'box');
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(query) || 
        tool.description.toLowerCase().includes(query) ||
        tool.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    return tools;
  }, [selectedCategory, searchQuery]);

  // Balance check
  const balanceCheck = useMemo(() => {
    if (!priceCalculation) return { sufficient: false, balance: 0, deficit: 0 };
    return hasSufficientBalance(userId, priceCalculation.finalPrice, 'MTN');
  }, [priceCalculation, userId]);

  // ============================================
  // HANDLERS
  // ============================================

  // Handle tool selection for rental
  const handleSelectTool = useCallback((tool: GSMTool) => {
    setSelectedTool(tool);
    setSelectedDuration(tool.duration.options[0]);
    setCurrentDialog('rent');
  }, []);

  // Handle rental confirmation
  const handleConfirmRental = useCallback(async () => {
    if (!selectedTool || !priceCalculation || !balanceCheck.sufficient) return;
    
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = await createRental(
      selectedTool,
      userId,
      'test@example.com',
      'Test User',
      selectedDuration,
      'MTN'
    );
    
    if (result) {
      setActiveRental(result.rental);
      setRentalHistory(prev => [result.rental, ...prev]);
      setTransactions(prev => [result.transaction, ...prev]);
      
      // Update wallet
      const updatedWallet = getWallet(userId);
      setWallet(updatedWallet);
      
      setCurrentDialog('credentials');
      
      if (onRentalComplete) {
        onRentalComplete(result.rental);
      }
    }
    
    setIsLoading(false);
  }, [selectedTool, priceCalculation, balanceCheck, userId, selectedDuration, onRentalComplete]);

  // Handle add credits
  const handleAddCredits = useCallback(async (amountUsd: number) => {
    const amountMtn = await convertCurrency(amountUsd, 'USD', 'MTN');
    
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

  // Handle payment success
  const handlePaymentSuccess = useCallback((amount: number, method: string) => {
    // Refresh wallet and transactions
    const updatedWallet = getWallet(userId);
    setWallet(updatedWallet);
    const txs = getUserTransactions(userId);
    setTransactions(txs);
    
    setCurrentDialog('rent');
    setShowPaymentModal(false);
  }, [userId]);

  // Copy to clipboard
  const handleCopy = useCallback(async (text: string) => {
    await copyToClipboard(text);
  }, []);

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
          {/* Balance */}
          {wallet && (
            <button
              onClick={() => setCurrentDialog('history')}
              className="bg-gradient-to-r from-primary/10 to-brand-green/10 rounded-xl px-4 py-2 border border-primary/20 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="font-bold text-primary">
                  {formatCurrency(wallet.balance.mtn, 'MTN')}
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
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Histórico</span>
          </Button>
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
                <Clock className="w-6 h-6 text-white" />
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
              <ExternalLink className="w-4 h-4" />
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
        {showCategories && (
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {TOOL_CATEGORIES.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap gap-2"
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {/* ============================================ */}
      {/* TOOLS GRID */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const availableSlots = getAvailableSlots(tool);
          const isAvailable = hasAvailableSlots(tool);
          
          return (
            <Card
              key={tool.id}
              className={`group relative overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer rounded-2xl border border-border/50 hover:border-primary/50 ${
                tool.popular ? 'border-primary/50 ring-2 ring-primary/20' : ''
              } ${!isAvailable ? 'opacity-60 grayscale-[0.5]' : ''}`}
              onClick={() => isAvailable && handleSelectTool(tool)}
            >
              {/* Popular Badge */}
              {tool.popular && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-gradient-to-r from-primary to-brand-green text-white rounded-full px-3 py-1">
                    <Zap className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300"
                    style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.gradient.split(' ')[0].replace('from-', '')})` }}
                  >
                    <span className="text-white">
                      <Shield className="w-6 h-6" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-bold truncate">{tool.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground mt-1">
                      {tool.shortDescription}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-1">
                  <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{tool.rating}</span>
                  <span className="text-xs text-muted-foreground">({tool.reviewCount})</span>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1">
                  {tool.features.slice(0, 2).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                      {feature}
                    </Badge>
                  ))}
                  {tool.features.length > 2 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{tool.features.length - 2}
                    </Badge>
                  )}
                </div>
                
                {/* Price & Action */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        {formatCurrency(tool.pricing.cliente.mtn, 'MTN')}
                      </span>
                      <span className="text-sm text-muted-foreground">/hora</span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-1">
                        {availableSlots} slots
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green rounded-xl"
                    disabled={!isAvailable}
                  >
                    {isAvailable ? 'Alugar' : 'Esgotado'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* ============================================ */}
      {/* RENT DIALOG */}
      {/* ============================================ */}
      <Dialog open={currentDialog === 'rent'} onOpenChange={() => setCurrentDialog('none')}>
        <DialogContent className="sm:max-w-lg">
          {selectedTool && priceCalculation && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedTool.name}</DialogTitle>
                <CardDescription>Confirme os detalhes do aluguel</CardDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Duration Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Selecione a Duração</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {selectedTool.duration.options.map((duration) => {
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
                          <span className="font-bold">{duration}h</span>
                          <span className="text-xs mt-1">
                            {formatCurrency(priceCalculation.finalPrice, 'MTN')}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Price Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Preço base</span>
                    <span>{formatCurrency(priceCalculation.basePrice, 'MTN')}</span>
                  </div>
                  
                  {priceCalculation.durationDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Desconto por duração</span>
                      <span>-{formatCurrency(priceCalculation.durationDiscount, 'MTN')}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        {formatCurrency(priceCalculation.finalPrice, 'MTN')}
                      </span>
                    </div>
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
                          Saldo após: {formatCurrency(balanceCheck.balance - priceCalculation.finalPrice, 'MTN')}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-500" />
                      <div className="flex-1">
                        <p className="font-semibold text-red-600">Saldo insuficiente</p>
                        <p className="text-sm text-muted-foreground">
                          Necessário: {formatCurrency(balanceCheck.deficit, 'MTN')} adicional
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
                        <Wallet className="w-4 h-4 mr-1" />
                        Adicionar
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setCurrentDialog('none')} className="flex-1">
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmRental}
                  disabled={!balanceCheck.sufficient || isLoading}
                  className="flex-1 bg-gradient-to-r from-primary to-brand-green"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Confirmar Aluguel
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* ============================================ */}
      {/* CREDENTIALS DIALOG */}
      {/* ============================================ */}
      <Dialog open={currentDialog === 'credentials'} onOpenChange={() => setCurrentDialog('none')}>
        <DialogContent className="sm:max-w-md">
          {activeRental && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Credenciais de Acesso
                </DialogTitle>
                <CardDescription>
                  Guarde estas credenciais em segurança
                </CardDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Timer */}
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 text-center">
                  <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
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
                        type="password"
                        value={activeRental.credentials.password}
                        readOnly
                        className="font-mono text-sm"
                      />
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
            </>
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
              <RefreshCw className="w-5 h-5" />
              Histórico de Aluguéis
            </DialogTitle>
            <CardDescription>
              Seus aluguéis anteriores e ativos
            </CardDescription>
          </DialogHeader>
          
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {rentalHistory.length === 0 ? (
              <div className="text-center py-12">
                <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum aluguel ainda</h3>
                <p className="text-muted-foreground">
                  Seus aluguéis aparecerão aqui
                </p>
              </div>
            ) : (
              rentalHistory.map((rental) => (
                <div
                  key={rental.id}
                  className={`p-4 rounded-xl border ${
                    isRentalActive(rental) 
                      ? 'bg-green-500/10 border-green-300/30' 
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-brand-green flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{rental.toolName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {rental.duration}h - {formatCurrency(rental.pricing.finalPrice.mtn, 'MTN')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={isRentalActive(rental) ? 'default' : 'secondary'} className={isRentalActive(rental) ? 'bg-green-500' : ''}>
                      {isRentalActive(rental) ? 'Ativo' : 'Expirado'}
                    </Badge>
                  </div>
                  
                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>Data: {new Date(rental.createdAt).toLocaleString()}</p>
                    <p>Expiração: {new Date(rental.expiresAt).toLocaleString()}</p>
                  </div>
                  
                  {isRentalActive(rental) && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => {
                        setActiveRental(rental);
                        setCurrentDialog('credentials');
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver Credenciais
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
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
        currentBalance={wallet?.balance.mtn || 0}
        currency="MTN"
      />
    </div>
  );
};

export default GSMToolsPanelNew;
