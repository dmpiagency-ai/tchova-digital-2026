import { useState, useEffect } from 'react';import { PaymentType, PaymentStage, getPaymentUIContext, getServicePaymentConfig } from '../types/payment';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { paymentService, PaymentMethod, PaymentRequest, PaymentResult } from '@/services/paymentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header';
import {
  CreditCard,
  Smartphone,
  DollarSign,
  Bitcoin,
  CheckCircle,
  XCircle,
  Loader2,
  Shield,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Zap
} from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [step, setStep] = useState<'methods' | 'details' | 'processing' | 'result'>('methods');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState(searchParams.get('amount') || '');
  const [paymentData, setPaymentData] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<string>('');

  const paymentMethods = paymentService.getAvailablePaymentMethods();
  const serviceName = searchParams.get('service') || 'Serviço';

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'mpesa': return <Smartphone className="w-7 h-7 text-green-600" />;
      case 'emola': return <Smartphone className="w-7 h-7 text-orange-600" />;
      case 'paypal': return <DollarSign className="w-7 h-7 text-blue-600" />;
      case 'card': return <CreditCard className="w-7 h-7 text-purple-600" />;
      case 'bitcoin': return <Bitcoin className="w-7 h-7 text-orange-500" />;
      default: return <CreditCard className="w-7 h-7" />;
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

  const handleMethodSelect = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setStep('details');
    setError('');
  };

  const renderPaymentFields = () => {
    if (!selectedMethod) return null;

    switch (selectedMethod.type) {
      case 'mpesa':
      case 'emola':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-sm font-semibold">Número {selectedMethod.name}</Label>
              <Input
                id="phone"
                placeholder="+258 8X XXX XXXX"
                value={paymentData.phone || ''}
                onChange={(e) => setPaymentData({...paymentData, phone: e.target.value})}
                className="mt-2 h-12 text-base rounded-[16px]"
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
            <div>
              <Label htmlFor="cardNumber" className="text-sm font-semibold">Número do Cartão</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber || ''}
                onChange={(e) => setPaymentData({...paymentData, cardNumber: e.target.value})}
                className="mt-2 h-12 text-base rounded-[16px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry" className="text-sm font-semibold">Validade</Label>
                <Input
                  id="expiry"
                  placeholder="MM/AA"
                  value={paymentData.expiry || ''}
                  onChange={(e) => setPaymentData({...paymentData, expiry: e.target.value})}
                  className="mt-2 h-12 text-base rounded-[16px]"
                />
              </div>
              <div>
                <Label htmlFor="cvv" className="text-sm font-semibold">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  value={paymentData.cvv || ''}
                  onChange={(e) => setPaymentData({...paymentData, cvv: e.target.value})}
                  className="mt-2 h-12 text-base rounded-[16px]"
                />
              </div>
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

    if ((selectedMethod.type === 'mpesa' || selectedMethod.type === 'emola') && !paymentData.phone) {
      setError('Número de telefone é obrigatório');
      return;
    }

    if (selectedMethod.type === 'card' && (!paymentData.cardNumber || !paymentData.expiry || !paymentData.cvv)) {
      setError('Todos os campos do cartão são obrigatórios');
      return;
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
        description: `Pagamento - ${serviceName}`,
        metadata: paymentData
      };

      const paymentResult = await paymentService.processPayment(request);

      clearInterval(progressInterval);
      setProgress(100);
      setResult(paymentResult);
      setStep('result');
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setError(err instanceof Error ? err.message : 'Erro no processamento');
      setStep('details');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalPrice = parseFloat(amount) || 0;
  const processingFee = selectedMethod?.config.processingFee ? (totalPrice * selectedMethod.config.processingFee / 100) : 0;
  const finalTotal = totalPrice + processingFee;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Enhanced liquid glass background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 via-primary/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/5 to-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      <main className="container relative z-10 mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-8 max-w-6xl">
        {/* Header Compacto */}
        <div className="mb-3 sm:mb-4 lg:mb-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="h-8 sm:h-10 px-3 sm:px-4 rounded-lg sm:rounded-xl backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/30 text-foreground hover:text-primary transition-all duration-300"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>

            <div className="text-center sm:text-right">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
                <span className="hidden sm:inline">Pagamento Seguro</span>
                <span className="sm:hidden">Pagar</span>
              </h1>
              <p className="text-xs text-muted-foreground">100% protegido</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-8">
          {/* Formulário Principal */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-[48px] shadow-2xl overflow-hidden">

              <div className="p-4 sm:p-6 lg:p-8">
                {/* Service Info Card */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                  <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-foreground truncate">{serviceName}</h3>
                          <p className="text-sm text-muted-foreground">Serviço digital profissional</p>
                          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                              <span className="text-xs sm:text-sm font-medium text-green-600">100% Seguro</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                              <span className="text-xs sm:text-sm font-medium text-primary">Entrega Rápida</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="text-xl sm:text-2xl font-bold text-primary">{totalPrice.toLocaleString()} MZN</div>
                          <p className="text-xs sm:text-sm text-muted-foreground">Valor do serviço</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {step === 'methods' && (
                  <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                    {/* Valor - CTA Principal */}
                    <div className="text-center">
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Quanto investir?</h2>
                      <p className="text-sm text-muted-foreground mb-4">Digite o valor do seu investimento</p>

                      <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 border max-w-sm mx-auto">
                        <div className="relative">
                          <Input
                            id="amount"
                            type="number"
                            placeholder="3500"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="text-2xl sm:text-3xl font-bold h-14 sm:h-16 border-2 focus:border-primary text-center rounded-[16px]"
                            min="1"
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lg font-semibold text-muted-foreground">
                            MZN
                          </div>
                        </div>
                        {error && (
                          <Alert variant="destructive" className="mt-3">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription className="font-medium text-sm">{error}</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>

                    {/* Métodos de Pagamento */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 text-center">
                        Como prefere pagar?
                      </h3>
                      <div className="grid gap-3 sm:gap-4 grid-cols-1">
                        {paymentMethods.map((method) => (
                          <Card
                            key={method.id}
                            className={`cursor-pointer transition-all duration-300 ${getMethodColor(method.type)} hover:scale-[1.01] hover:shadow-lg border-2 ${
                              selectedMethod?.id === method.id ? 'ring-2 ring-primary shadow-lg scale-[1.01] border-primary' : 'border-transparent'
                            }`}
                            onClick={() => handleMethodSelect(method)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center shadow-lg">
                                    {getMethodIcon(method.type)}
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-bold text-sm sm:text-base">{method.name}</h3>
                                    <p className="text-xs text-muted-foreground">{method.description}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <Badge
                                    variant="outline"
                                    className="text-xs px-2 py-1 font-semibold bg-white/50"
                                  >
                                    {method.config.processingFee ? `${method.config.processingFee}%` : 'Grátis'}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 'details' && selectedMethod && (
                  <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                    {/* Método Selecionado */}
                    <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg sm:rounded-xl p-4 border border-primary/20">
                      <div className="flex items-center space-x-3 mb-3">
                        {getMethodIcon(selectedMethod.type)}
                        <div>
                          <h3 className="text-lg font-bold">{selectedMethod.name}</h3>
                          <p className="text-sm text-muted-foreground">Confirme os dados</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{finalTotal.toLocaleString()} MZN</div>
                        <p className="text-sm text-muted-foreground">Valor total</p>
                      </div>
                    </div>

                    {/* Campos do Pagamento */}
                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-4 border">
                      <h4 className="text-lg font-semibold mb-4 flex items-center">
                        <Lock className="w-5 h-5 mr-2 text-primary" />
                        Dados do Pagamento
                      </h4>
                      {renderPaymentFields()}
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="font-medium">{error}</AlertDescription>
                      </Alert>
                    )}

                    {/* Ações */}
                    <div className="space-y-3">
                      <Button
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full h-10 sm:h-12 text-sm sm:text-base font-bold bg-gradient-to-r from-[#22C55E] to-emerald-600 hover:from-[#16A34A] hover:to-emerald-700 shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-400 rounded-[24px]"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Pagar {finalTotal.toLocaleString()} MZN</span>
                        <span className="sm:hidden">Pagar</span>
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => setStep('methods')}
                        className="w-full h-9 sm:h-10 text-xs sm:text-sm font-semibold border-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-[24px]"
                      >
                        ← <span className="hidden sm:inline">Alterar método</span>
                        <span className="sm:hidden">Voltar</span>
                      </Button>
                    </div>
                  </div>
                )}

                {step === 'processing' && (
                  <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8 py-6 sm:py-8 lg:py-12">
                    <div className="relative">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto shadow-2xl">
                        <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-white animate-spin" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Processando seu pagamento</h3>
                      <p className="text-muted-foreground text-base sm:text-lg">Estamos garantindo tudo para você...</p>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                      <Progress value={progress} className="w-full h-2 sm:h-3" />
                      <p className="text-base sm:text-lg font-semibold text-primary">{progress}% concluído</p>
                      <div className="flex justify-center space-x-2 sm:space-x-3">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 'result' && result && (
                  <div className="text-center space-y-4 sm:space-y-6 lg:space-y-8 py-6 sm:py-8 lg:py-12">
                    {result.status === 'completed' ? (
                      <>
                        <div className="relative">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-12 sm:h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                            <span className="text-sm sm:text-lg font-bold text-yellow-900">✓</span>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-green-600 mb-3">Pagamento Aprovado! 🎉</h3>
                          <p className="text-muted-foreground text-base sm:text-lg">
                            Seu investimento de <span className="font-bold text-primary text-xl sm:text-2xl">{result.amount} MZN</span> foi processado com sucesso
                          </p>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 sm:p-8 rounded-xl sm:rounded-2xl border border-green-200 dark:border-green-800 max-w-md mx-auto">
                          <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                            <Shield className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                            <span className="font-semibold text-green-800 dark:text-green-200 text-sm sm:text-lg">Transação Segura</span>
                          </div>
                          <p className="text-xs sm:text-sm font-mono bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-lg border">{result.transactionId}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">
                            {result.timestamp.toLocaleString('pt-MZ')}
                          </p>
                        </div>
                        <Button
                          onClick={() => navigate('/')}
                          className="w-full h-10 sm:h-12 text-sm sm:text-base font-bold bg-gradient-to-r from-[#22C55E] to-emerald-600 hover:from-[#16A34A] hover:to-emerald-700 shadow-xl transform hover:scale-[1.01] transition-all duration-400 rounded-[24px]"
                        >
                          🎯 <span className="hidden sm:inline">Continuar Explorando</span>
                          <span className="sm:hidden">Explorar</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="relative">
                          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                            <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 sm:w-12 sm:h-12 bg-orange-400 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-red-600 mb-3">Ops! Algo deu errado</h3>
                          <p className="text-muted-foreground text-base sm:text-lg">{error || 'Vamos tentar novamente?'}</p>
                        </div>
                        <Button
                          onClick={() => setStep('methods')}
                          className="w-full h-10 sm:h-12 text-sm sm:text-base font-bold bg-gradient-to-r from-[#22C55E] to-emerald-600 hover:from-[#16A34A] hover:to-emerald-700 shadow-xl transform hover:scale-[1.01] transition-all duration-400 rounded-[24px]"
                        >
                          🔄 <span className="hidden sm:inline">Tentar Novamente</span>
                          <span className="sm:hidden">Tentar</span>
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Resumo - Mobile-First */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="lg:sticky lg:top-8">
              <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-[48px] shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 border-b border-white/20">
                  <h3 className="text-lg font-bold text-foreground text-center">
                    <span className="hidden sm:inline">Resumo</span>
                    <span className="sm:hidden">Total</span>
                  </h3>
                </div>

                <div className="p-4 space-y-4">
                  {/* Serviço */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm">{serviceName}</h4>
                  </div>

                  {/* Valores */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">{totalPrice.toLocaleString()} MZN</span>
                    </div>

                    {processingFee > 0 && (
                      <div className="flex justify-between items-center text-orange-600 text-sm">
                        <span>Taxa</span>
                        <span className="font-semibold">+{processingFee.toFixed(2)} MZN</span>
                      </div>
                    )}

                    <div className="border-t border-primary/20 pt-2">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span className="text-primary">{finalTotal.toLocaleString()} MZN</span>
                      </div>
                    </div>
                  </div>

                  {/* Segurança */}
                  <div className="space-y-2 border-t border-white/20 pt-4">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-xs font-medium text-green-600">100% Seguro</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-foreground">Protegido</span>
                    </div>
                  </div>

                  {/* Suporte */}
                  <div className="border-t border-white/20 pt-4">
                    <Button
                      variant="outline"
                      className="w-full h-9 text-xs font-semibold border-[#22C55E]/30 hover:bg-[#22C55E]/10 rounded-[24px]"
                      onClick={() => window.open('https://wa.me/258123456789', '_blank')}
                    >
                      💬 Suporte
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Payment;