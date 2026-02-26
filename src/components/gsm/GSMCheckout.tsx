// ============================================
// GSM RENTAL PAINEL - CHECKOUT FLOW
// Design Liquid Glass Moderno
// Duration Selection, Payment, Confirmation
// ============================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup } from '@/components/ui/radio-group';
import {
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Copy,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Coins,
  Wallet,
  Shield,
  Key,
  Smartphone,
  Gift,
  Star,
  Loader2,
  Check,
  X
} from 'lucide-react';

import {
  GSMTool,
  Currency,
  UserLevel,
  GSMRental,
  USER_LEVELS
} from '@/types/gsm';

import {
  formatCurrency,
  calculateRentalPrice,
  getWallet,
  hasSufficientBalance,
  createRental,
  getPreferredCurrency,
  setPreferredCurrency
} from '@/services/gsmRentalService';

import { useAuth } from '@/contexts/AuthContext';

// Duration options for rental
const DURATION_OPTIONS = [
  { value: 1, label: '1 Hora', discount: 0 },
  { value: 2, label: '2 Horas', discount: 0 },
  { value: 4, label: '4 Horas', discount: 5 },
  { value: 6, label: '6 Horas', discount: 10 },
  { value: 8, label: '8 Horas', discount: 15 },
  { value: 12, label: '12 Horas', discount: 20 },
  { value: 24, label: '24 Horas', discount: 25 }
];

interface GSMCheckoutProps {
  tool: GSMTool | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rental: GSMRental) => void;
  userLevel?: UserLevel;
}

type CheckoutStep = 'duration' | 'payment' | 'confirmation';

const GSMCheckout: React.FC<GSMCheckoutProps> = ({
  tool,
  isOpen,
  onClose,
  onConfirm,
  userLevel = 'cliente'
}) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const userEmail = user?.email || 'guest@example.com';
  const userName = user?.name || 'Guest';

  // State
  const [currency, setCurrency] = useState<Currency>(getPreferredCurrency());
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('duration');
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'wallet' | 'mpesa' | 'emola' | 'card'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdRental, setCreatedRental] = useState<GSMRental | null>(null);

  // Wallet
  const wallet = useMemo(() => getWallet(userId), [userId]);
  const balance = useMemo(() => {
    if (!wallet) return 0;
    return currency === 'USD' ? wallet.balance.usd : wallet.balance.mtn;
  }, [wallet, currency]);

  // Pricing calculation
  const pricing = useMemo(() => {
    if (!tool) return null;
    return calculateRentalPrice(tool, selectedDuration, userLevel, currency);
  }, [tool, selectedDuration, userLevel, currency]);

  // Check if user has sufficient balance
  const canPayWithWallet = useMemo(() => {
    if (!wallet || !pricing) return false;
    const result = hasSufficientBalance(userId, pricing.finalPrice, currency);
    return result.sufficient;
  }, [wallet, pricing, userId, currency]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setCurrentStep('duration');
      setSelectedDuration(1);
      setSelectedPaymentMethod('wallet');
      setError(null);
      setCreatedRental(null);
    }
  }, [isOpen]);

  // Handle currency toggle
  const handleToggleCurrency = useCallback(() => {
    const newCurrency = currency === 'USD' ? 'MTN' : 'USD';
    setCurrency(newCurrency);
    setPreferredCurrency(newCurrency);
  }, [currency]);

  // Handle next step
  const handleNextStep = useCallback(() => {
    if (currentStep === 'duration') {
      setCurrentStep('payment');
    }
  }, [currentStep]);

  // Handle previous step
  const handlePreviousStep = useCallback(() => {
    if (currentStep === 'payment') {
      setCurrentStep('duration');
    }
  }, [currentStep]);

  // Handle confirm payment
  const handleConfirmPayment = useCallback(async () => {
    if (!tool || !pricing) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create rental using the service
      const result = createRental(tool, userId, userEmail, userName, selectedDuration, currency);

      if (!result) {
        throw new Error('Erro ao criar aluguel. Verifique seu saldo e tente novamente.');
      }

      setCreatedRental(result.rental);
      setCurrentStep('confirmation');
      onConfirm(result.rental);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsProcessing(false);
    }
  }, [tool, pricing, userId, userEmail, userName, selectedDuration, currency, onConfirm]);

  // Handle close
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!tool) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[480px] p-0 gap-0 bg-background/95 backdrop-blur-xl border-white/10">
        {/* Header */}
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStep === 'payment' && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePreviousStep}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <DialogTitle className="text-xl font-bold">
                {currentStep === 'duration' && 'Escolher Duração'}
                {currentStep === 'payment' && 'Pagamento'}
                {currentStep === 'confirmation' && 'Confirmado!'}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="mt-2">
            {currentStep === 'duration' && `Configure seu aluguel para ${tool.name}`}
            {currentStep === 'payment' && 'Escolha como pagar'}
            {currentStep === 'confirmation' && 'Seu aluguel foi ativado com sucesso'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress */}
        <div className="px-6 py-4">
          <div className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
              currentStep === 'duration' || currentStep === 'payment' || currentStep === 'confirmation'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground'
            }`}>
              {currentStep === 'payment' || currentStep === 'confirmation' ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className={`flex-1 h-1 rounded ${
              currentStep === 'payment' || currentStep === 'confirmation' ? 'bg-primary' : 'bg-muted'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
              currentStep === 'payment'
                ? 'bg-primary text-white'
                : currentStep === 'confirmation'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground'
            }`}>
              {currentStep === 'confirmation' ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div className={`flex-1 h-1 rounded ${
              currentStep === 'confirmation' ? 'bg-primary' : 'bg-muted'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
              currentStep === 'confirmation'
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground'
            }`}>
              3
            </div>
          </div>
        </div>

        <Separator />

        {/* Content */}
        <div className="p-6">
          {/* Duration Step */}
          {currentStep === 'duration' && (
            <div className="space-y-6">
              {/* Tool Preview */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-brand-green rounded-xl flex items-center justify-center">
                  <Key className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">{tool.name}</h4>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
                {tool.popular && (
                  <Badge className="bg-brand-yellow/20 text-brand-yellow">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
              </div>

              {/* Duration Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Duração do Aluguel</Label>
                <div className="grid grid-cols-2 gap-3">
                  {DURATION_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className={`relative flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedDuration === option.value
                          ? 'border-primary bg-primary/5'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                      onClick={() => setSelectedDuration(option.value)}
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="font-semibold">{option.label}</p>
                          {option.discount > 0 && (
                            <p className="text-xs text-green-500">-{option.discount}% desconto</p>
                          )}
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedDuration === option.value
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {selectedDuration === option.value && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              {pricing && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-brand-green/5 border border-white/10">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Preço base</span>
                      <span>{formatCurrency(pricing.basePrice, currency)}</span>
                    </div>
                    {pricing.levelDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Desconto ({USER_LEVELS[userLevel].name})</span>
                        <span>-{formatCurrency(pricing.levelDiscount, currency)}</span>
                      </div>
                    )}
                    {pricing.durationDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-500">
                        <span>Desconto duração</span>
                        <span>-{formatCurrency(pricing.durationDiscount, currency)}</span>
                      </div>
                    )}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(pricing.finalPrice, currency)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Currency Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleCurrency}
                className="w-full"
              >
                {currency === 'USD' ? <DollarSign className="w-4 h-4 mr-2" /> : <Coins className="w-4 h-4 mr-2" />}
                Ver em {currency === 'USD' ? 'Metical (MTn)' : 'Dólar (USD)'}
              </Button>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === 'payment' && (
            <div className="space-y-6">
              {/* Wallet Balance */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-brand-green/10 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Saldo disponível</p>
                      <p className="text-xl font-bold">{formatCurrency(balance, currency)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleCurrency}
                  >
                    {currency === 'USD' ? 'USD' : 'MTn'}
                  </Button>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Método de Pagamento</Label>
                
                {/* Wallet Option */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'wallet'
                      ? 'border-primary bg-primary/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  } ${!canPayWithWallet ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => canPayWithWallet && setSelectedPaymentMethod('wallet')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-brand-green rounded-xl flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Pagar com Saldo</p>
                      <p className="text-sm text-muted-foreground">
                        {canPayWithWallet ? 'Saldo suficiente' : 'Saldo insuficiente'}
                      </p>
                    </div>
                  </div>
                  {canPayWithWallet && selectedPaymentMethod === 'wallet' && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>

                {/* M-Pesa Option */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'mpesa'
                      ? 'border-red-500 bg-red-500/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedPaymentMethod('mpesa')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">M-Pesa</p>
                      <p className="text-sm text-muted-foreground">Vodacom Moçambique</p>
                    </div>
                  </div>
                  {selectedPaymentMethod === 'mpesa' && (
                    <Check className="w-5 h-5 text-red-500" />
                  )}
                </div>

                {/* E-mola Option */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'emola'
                      ? 'border-orange-500 bg-orange-500/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedPaymentMethod('emola')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">E-mola</p>
                      <p className="text-sm text-muted-foreground">Movitel</p>
                    </div>
                  </div>
                  {selectedPaymentMethod === 'emola' && (
                    <Check className="w-5 h-5 text-orange-500" />
                  )}
                </div>

                {/* Card Option */}
                <div
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-500/5'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedPaymentMethod('card')}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">Cartão</p>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                    </div>
                  </div>
                  {selectedPaymentMethod === 'card' && (
                    <Check className="w-5 h-5 text-blue-500" />
                  )}
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Confirmation Step */}
          {currentStep === 'confirmation' && createdRental && (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Aluguel Ativado!</h3>
              <p className="text-muted-foreground mb-6">
                Seu acesso foi liberado com sucesso.
              </p>

              {/* Rental Details */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ferramenta</span>
                  <span className="font-semibold">{tool.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duração</span>
                  <span className="font-semibold">{selectedDuration} hora(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expira em</span>
                  <span className="font-semibold text-primary">
                    {new Date(createdRental.expiresAt).toLocaleTimeString('pt-MZ')}
                  </span>
                </div>
              </div>

              {/* Credentials */}
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-brand-green/10 border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Key className="w-5 h-5 text-primary" />
                  <span className="font-semibold">Credenciais de Acesso</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-sm font-mono">{createdRental.credentials.username}</span>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                    <span className="text-sm font-mono">••••••••</span>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStep !== 'confirmation' && (
          <>
            <Separator />
            <div className="p-6">
              {currentStep === 'duration' && (
                <Button
                  className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green"
                  onClick={handleNextStep}
                >
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              {currentStep === 'payment' && (
                <Button
                  className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green"
                  onClick={handleConfirmPayment}
                  disabled={isProcessing || (selectedPaymentMethod === 'wallet' && !canPayWithWallet)}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Confirmar Pagamento
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        )}

        {currentStep === 'confirmation' && (
          <>
            <Separator />
            <div className="p-6">
              <Button
                className="w-full h-12 text-lg font-bold rounded-xl bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green"
                onClick={handleClose}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Concluído
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GSMCheckout;
