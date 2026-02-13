import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { paymentService, PaymentMethod, PaymentRequest, PaymentResult } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  CreditCard,
  Smartphone,
  DollarSign,
  Bitcoin,
  CheckCircle,
  XCircle,
  Loader2,
  Shield,
  Clock,
  AlertTriangle,
  Lock,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Gift,
  Award,
  ArrowLeft
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (result: PaymentResult) => void;
  initialAmount?: number;
  serviceName?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  initialAmount = 0,
  serviceName = 'Serviço Digital'
}) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'methods' | 'details' | 'processing' | 'result'>('methods');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState(initialAmount.toString());
  const [paymentData, setPaymentData] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string>('');

  const paymentMethods = paymentService.getAvailablePaymentMethods();

  useEffect(() => {
    if (initialAmount > 0) {
      setAmount(initialAmount.toString());
    }
  }, [initialAmount]);

  const resetModal = () => {
    setStep('methods');
    setSelectedMethod(null);
    setAmount(initialAmount.toString());
    setPaymentData({});
    setIsProcessing(false);
    setProgress(0);
    setResult(null);
    setError('');
  };

  const handleClose = () => {
    const modalElement = document.querySelector('[data-modal="payment"]') as HTMLElement;
    if (modalElement) {
      modalElement.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      modalElement.style.transform = 'scale(0.9) translateY(10px)';
      modalElement.style.opacity = '0';

      const modalWithCleanup = modalElement as HTMLElement & { _cleanup?: () => void };
      if (modalWithCleanup._cleanup) {
        modalWithCleanup._cleanup();
      }

      setTimeout(() => {
        resetModal();
        onClose();
      }, 400);
    } else {
      resetModal();
      onClose();
    }
  };

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep('details');
    setError('');
  };

  const validateAmount = (value: string): boolean => {
    const numValue = parseFloat(value);
    if (!selectedMethod) return false;

    if (isNaN(numValue) || numValue <= 0) {
      setError('Valor deve ser maior que zero');
      return false;
    }

    if (numValue < selectedMethod.config.minAmount) {
      setError(`Valor mínimo: ${selectedMethod.config.minAmount} MZN`);
      return false;
    }

    if (numValue > selectedMethod.config.maxAmount) {
      setError(`Valor máximo: ${selectedMethod.config.maxAmount} MZN`);
      return false;
    }

    return true;
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (error && validateAmount(value)) {
      setError('');
    }
  };

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'mpesa': return <Smartphone className="w-6 h-6 text-green-600" />;
      case 'emola': return <Smartphone className="w-6 h-6 text-orange-600" />;
      case 'paypal': return <DollarSign className="w-6 h-6 text-blue-600" />;
      case 'card': return <CreditCard className="w-6 h-6 text-purple-600" />;
      case 'bitcoin': return <Bitcoin className="w-6 h-6 text-orange-500" />;
      default: return <CreditCard className="w-6 h-6" />;
    }
  };

  const getMethodColor = (type: string) => {
    switch (type) {
      case 'mpesa': return 'border-green-200 bg-green-50 hover:bg-green-100 dark:bg-green-900/20';
      case 'emola': return 'border-orange-200 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20';
      case 'paypal': return 'border-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20';
      case 'card': return 'border-purple-200 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20';
      case 'bitcoin': return 'border-orange-200 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20';
      default: return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
    }
  };

  const renderPaymentFields = () => {
    if (!selectedMethod) return null;

    switch (selectedMethod.type) {
      case 'mpesa':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-sm font-semibold">Número M-Pesa</Label>
              <Input
                id="phone"
                placeholder="+258 84/85 XXX XXXX"
                value={paymentData.phone || ''}
                onChange={(e) => setPaymentData({...paymentData, phone: e.target.value})}
                className="mt-2 h-12"
              />
            </div>
          </div>
        );

      case 'emola':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-sm font-semibold">Número E-mola</Label>
              <Input
                id="phone"
                placeholder="+258 82/83 XXX XXXX"
                value={paymentData.phone || ''}
                onChange={(e) => setPaymentData({...paymentData, phone: e.target.value})}
                className="mt-2 h-12"
              />
            </div>
          </div>
        );

      case 'paypal':
        return (
          <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Você será redirecionado para o PayPal para completar o pagamento.
            </AlertDescription>
          </Alert>
        );

      case 'card':
        return (
          <div className="space-y-4">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="cardNumber" className="text-xs sm:text-sm font-semibold">Número do Cartão</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData.cardNumber || ''}
                  onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                  className="mt-1 sm:mt-2 h-10 sm:h-12 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <Label htmlFor="expiry" className="text-xs sm:text-sm font-semibold">Validade</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/AA"
                    value={paymentData.expiry || ''}
                    onChange={(e) => setPaymentData({...paymentData, expiry: e.target.value})}
                    className="mt-1 sm:mt-2 h-10 sm:h-12 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv" className="text-xs sm:text-sm font-semibold">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    type="password"
                    value={paymentData.cvv || ''}
                    onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                    className="mt-1 sm:mt-2 h-10 sm:h-12 text-sm"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cardName" className="text-xs sm:text-sm font-semibold">Nome no Cartão</Label>
                <Input
                  id="cardName"
                  placeholder="João Silva"
                  value={paymentData.cardName || ''}
                  onChange={(e) => setPaymentData({...paymentData, cardName: e.target.value})}
                  className="mt-1 sm:mt-2 h-10 sm:h-12 text-sm"
                />
              </div>
            </div>
          </div>
        );

      case 'bitcoin':
        return (
          <div className="space-y-4">
            <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
              <Bitcoin className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Você receberá instruções para enviar Bitcoin após confirmar o pagamento.
              </AlertDescription>
            </Alert>
            <div>
              <Label className="text-sm font-semibold">Taxa de conversão aproximada</Label>
              <p className="text-sm text-muted-foreground mt-1">
                1 BTC ≈ 50,000 MZN (valor aproximado)
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod || !user) return;

    if (!validateAmount(amount)) return;

    if (selectedMethod.type === 'mpesa' || selectedMethod.type === 'emola') {
      if (!paymentData.phone) {
        setError('Número de telefone é obrigatório');
        return;
      }
    }

    if (selectedMethod.type === 'card') {
      if (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv || !paymentData.cardName) {
        setError('Todos os campos do cartão são obrigatórios');
        return;
      }
    }

    setIsProcessing(true);
    setStep('processing');
    setError('');

    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const request: PaymentRequest = {
        amount: parseFloat(amount),
        currency: 'MZN',
        method: selectedMethod.id,
        userId: user.id,
        description: `Depósito - ${serviceName}`,
        metadata: paymentData
      };

      const paymentResult = await paymentService.processPayment(request);

      clearInterval(progressInterval);
      setProgress(100);
      setResult(paymentResult);

      if (paymentResult.status === 'completed') {
        setStep('result');
        onPaymentSuccess?.(paymentResult);
      } else {
        setStep('result');
        setError(paymentResult.errorMessage || 'Pagamento falhou');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setError(err instanceof Error ? err.message : 'Erro no processamento');
      setStep('details');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  const totalPrice = parseFloat(amount) || 0;
  const processingFee = selectedMethod?.config.processingFee ? (totalPrice * selectedMethod.config.processingFee / 100) : 0;
  const finalTotal = totalPrice + processingFee;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4 animate-fade-in backdrop-blur-sm" data-modal-backdrop="payment">
      <div className="bg-white dark:bg-card rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-up border border-white/20 relative flex flex-col lg:flex-row" data-modal="payment" style={{maxHeight: '95vh'}}>
        
        {/* Desktop Layout - Side by Side */}
        <div className="hidden lg:flex w-full">
          {/* Left Side - Payment Form */}
          <div className="flex-1 p-8 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground">Checkout Seguro</h2>
                  <p className="text-sm text-gray-500 dark:text-muted-foreground">Processamento protegido</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 h-10 w-10 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <XCircle className="w-5 h-5" />
              </Button>
            </div>

            {/* Service Info */}
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{serviceName}</h3>
                      <p className="text-muted-foreground">Serviço digital profissional</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{totalPrice.toLocaleString()} MZN</div>
                      <p className="text-sm text-muted-foreground">Valor do serviço</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {step === 'methods' && (
              <div className="space-y-8">
                {/* Amount Input */}
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border">
                  <Label htmlFor="amount" className="text-lg font-semibold mb-4 block">
                    💰 Valor do Investimento
                  </Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      placeholder="3500"
                      value={amount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="text-2xl font-bold h-16 border-2 focus:border-primary text-center"
                      min="1"
                      max="100000"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                      MZN
                    </div>
                  </div>
                  {error && (
                    <Alert variant="destructive" className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="font-medium">{error}</AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Payment Methods */}
                <div>
                  <h3 className="text-xl font-bold mb-6">Escolha o Método de Pagamento</h3>
                  <div className="grid gap-4">
                    {paymentMethods.map((method) => (
                      <Card
                        key={method.id}
                        className={`cursor-pointer transition-all duration-300 border hover:scale-[1.02] hover:shadow-lg ${getMethodColor(method.type)} ${
                          selectedMethod?.id === method.id ? 'ring-2 ring-primary shadow-lg scale-[1.02]' : 'hover:shadow-md'
                        }`}
                        onClick={() => handleMethodSelect(method)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                {getMethodIcon(method.type)}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg">{method.name}</h3>
                                <p className="text-sm text-muted-foreground">{method.description}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-sm px-4 py-2 font-semibold bg-white/50">
                              {method.config.processingFee ? `${method.config.processingFee}% taxa` : 'Sem taxa'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'details' && selectedMethod && (
              <div className="space-y-8">
                {/* Payment Summary */}
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20">
                  <div className="flex items-center space-x-4 mb-4">
                    {getMethodIcon(selectedMethod.type)}
                    <div>
                      <h3 className="text-xl font-bold">{selectedMethod.name}</h3>
                      <p className="text-muted-foreground">Revise sua transação</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Subtotal:</span>
                      <span className="font-semibold">{totalPrice.toLocaleString()} MZN</span>
                    </div>
                    {processingFee > 0 && (
                      <div className="flex justify-between items-center text-orange-600">
                        <span>Taxa de processamento:</span>
                        <span className="font-semibold">+{processingFee.toFixed(2)} MZN</span>
                      </div>
                    )}
                    <div className="border-t border-primary/20 pt-2">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-primary">{finalTotal.toLocaleString()} MZN</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Fields */}
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border">
                  <h4 className="text-lg font-semibold mb-6 flex items-center">
                    <Lock className="w-5 h-5 mr-2 text-primary" />
                    Informações de Pagamento
                  </h4>
                  {renderPaymentFields()}
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep('methods')}
                    className="h-12 text-base font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    ← Voltar aos métodos
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="h-14 text-lg font-bold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
                  >
                    <Lock className="w-5 h-5 mr-2" />
                    <span className="hidden sm:inline">🔒 Confirmar Pagamento - {finalTotal.toLocaleString()} MZN</span>
                    <span className="sm:hidden">Confirmar - {finalTotal.toLocaleString()} MZN</span>
                  </Button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="text-center space-y-8 py-12">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">Processando seu pagamento</h3>
                  <p className="text-muted-foreground text-lg">Estamos garantindo tudo para você...</p>
                </div>
                <div className="space-y-4">
                  <Progress value={progress} className="w-full h-3" />
                  <p className="text-lg font-semibold text-primary">{progress}% concluído</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {step === 'result' && result && (
              <div className="text-center space-y-8 py-12">
                {result.status === 'completed' ? (
                  <>
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                        <span className="text-sm font-bold text-yellow-900">✓</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-600 mb-3">Pagamento Aprovado! 🎉</h3>
                      <p className="text-muted-foreground text-lg">
                        Seu investimento de <span className="font-bold text-primary text-xl">{result.amount} MZN</span> foi processado com sucesso
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800 dark:text-green-200">Transação Segura</span>
                      </div>
                      <p className="text-sm font-mono bg-white dark:bg-gray-800 p-3 rounded-lg border">{result.transactionId}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {result.timestamp.toLocaleString('pt-MZ')}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <XCircle className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-red-600 mb-3">Ops! Algo deu errado</h3>
                      <p className="text-muted-foreground text-lg">{error || 'Vamos tentar novamente?'}</p>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleClose}
                  className={`w-full h-12 text-lg font-bold ${
                    result.status === 'completed'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg'
                      : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg'
                  }`}
                >
                  {result.status === 'completed' ? '🎯 Continuar' : '🔄 Tentar Novamente'}
                </Button>
              </div>
            )}
          </div>

          {/* Right Side - Summary */}
          <div className="w-80 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8 border-l border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-foreground mb-6">Resumo do Pedido</h3>
            
            {/* Service Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{serviceName}</h4>
                  <p className="text-sm text-muted-foreground">Serviço digital</p>
                </div>
              </div>
            </div>

            {/* Payment Breakdown */}
            <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{totalPrice.toLocaleString()} MZN</span>
              </div>
              
              {processingFee > 0 && (
                <div className="flex justify-between items-center text-orange-600">
                  <span>Taxa ({selectedMethod?.config.processingFee}%)</span>
                  <span className="font-semibold">+{processingFee.toFixed(2)} MZN</span>
                </div>
              )}
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{finalTotal.toLocaleString()} MZN</span>
                </div>
              </div>
            </div>

            {/* Security Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">Pagamento 100% seguro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Dados protegidos</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-foreground">Garantia de qualidade</span>
              </div>
            </div>

            {/* Support */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl border border-primary/20">
              <h4 className="font-semibold text-foreground mb-2">Precisa de ajuda?</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Nossa equipe está disponível
              </p>
              <Button
                variant="outline"
                className="w-full h-10 text-sm font-semibold border-primary/30 hover:bg-primary/10"
                onClick={() => window.open('https://wa.me/258123456789', '_blank')}
              >
                💬 Falar com Suporte
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Full Screen */}
        <div className="lg:hidden w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary/5 to-accent/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-foreground">
                  Checkout Seguro
                </h2>
                <p className="text-sm text-gray-500 dark:text-muted-foreground">
                  Processamento protegido
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <XCircle className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6">
            {step === 'methods' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-2">
                    Valor do Investimento
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-muted-foreground">
                    Quanto investir no seu negócio digital?
                  </p>
                </div>

                <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10">
                  <Label htmlFor="amount" className="text-sm font-semibold mb-2 block">Valor (MZN)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="3500"
                    value={amount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="text-xl font-bold h-12 border-2 focus:border-primary"
                    min="1"
                    max="100000"
                  />
                  {error && (
                    <div className="flex items-center space-x-2 mt-2 text-red-600">
                      <AlertTriangle className="w-4 h-4" />
                      <p className="text-sm font-medium">{error}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <Label className="text-xs sm:text-sm font-semibold">Escolha o Método de Pagamento</Label>
                  <div className="space-y-2 sm:space-y-3">
                    {paymentMethods.map((method) => (
                      <Card
                        key={method.id}
                        className={`cursor-pointer transition-all duration-200 border hover:scale-[1.01] hover:shadow-md ${getMethodColor(method.type)} ${
                          selectedMethod?.id === method.id ? 'ring-1 sm:ring-2 ring-primary shadow-md scale-[1.01]' : 'hover:shadow-sm'
                        }`}
                        onClick={() => handleMethodSelect(method)}
                      >
                        <CardContent className="p-2 sm:p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                                {getMethodIcon(method.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-xs sm:text-sm truncate">{method.name}</h3>
                                <p className="text-xs text-muted-foreground leading-tight line-clamp-2">{method.description}</p>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5 sm:px-2 sm:py-1 font-medium ml-1 sm:ml-2 flex-shrink-0">
                              {method.config.processingFee ? `${method.config.processingFee}%` : 'Grátis'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 'details' && selectedMethod && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-3">
                    Finalizar Investimento
                  </h3>
                  <p className="text-gray-600 dark:text-muted-foreground text-sm">
                    Complete as informações para garantir seu serviço digital
                  </p>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl border border-primary/10">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                    {getMethodIcon(selectedMethod.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm sm:text-base">{selectedMethod.name}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{selectedMethod.description}</p>
                    <div className="flex flex-col space-y-1 mt-2">
                      <span className="font-semibold text-primary text-base sm:text-lg">{amount} MZN</span>
                      {selectedMethod.config.processingFee && (
                        <span className="text-orange-600 text-xs sm:text-sm font-medium">
                          Taxa: {(parseFloat(amount) * selectedMethod.config.processingFee / 100).toFixed(2)} MZN
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 border">
                  <h4 className="font-semibold text-base mb-4">Informações de Pagamento</h4>
                  {renderPaymentFields()}
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="font-medium">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex flex-col space-y-2 sm:space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('methods')}
                    className="h-10 sm:h-12 text-sm sm:text-base font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    ← Voltar
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="h-10 sm:h-12 text-sm sm:text-base font-bold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl"
                  >
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Confirmar - {finalTotal.toLocaleString()} MZN</span>
                    <span className="sm:hidden">Confirmar</span>
                  </Button>
                </div>
              </div>
            )}

            {step === 'processing' && (
              <div className="text-center space-y-8 py-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Loader2 className="w-12 h-12 text-white animate-spin" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground">Processando seu investimento</h3>
                  <p className="text-muted-foreground text-base">Estamos garantindo tudo para você...</p>
                </div>
                <div className="space-y-4">
                  <Progress value={progress} className="w-full h-3" />
                  <p className="text-sm text-muted-foreground font-medium">{progress}% concluído</p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {step === 'result' && result && (
              <div className="text-center space-y-8 py-8">
                {result.status === 'completed' ? (
                  <>
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <CheckCircle className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                        <span className="text-sm font-bold text-yellow-900">✓</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-600 mb-3">Investimento Aprovado! 🎉</h3>
                      <p className="text-muted-foreground text-base">
                        Seu investimento de <span className="font-bold text-primary text-lg">{result.amount} MZN</span> foi processado com sucesso
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-2xl border border-green-200 dark:border-green-800">
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-800 dark:text-green-200">Transação Segura</span>
                      </div>
                      <p className="text-sm font-mono bg-white dark:bg-gray-800 p-3 rounded-lg border">{result.transactionId}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {result.timestamp.toLocaleString('pt-MZ')}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <XCircle className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-red-600 mb-3">Ops! Algo deu errado</h3>
                      <p className="text-muted-foreground text-base">{error || 'Vamos tentar novamente?'}</p>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleClose}
                  className={`w-full h-12 text-base font-bold ${
                    result.status === 'completed'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg'
                      : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg'
                  }`}
                >
                  {result.status === 'completed' ? '🎯 Começar a usar meu serviço' : '🔄 Tentar Novamente'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;