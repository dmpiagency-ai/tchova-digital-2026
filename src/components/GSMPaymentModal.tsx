/**
 * ============================================
 * GSM PAYMENT MODAL
 * ============================================
 * Modal de pagamento para créditos GSM
 * Suporta: M-Pesa, E-mola, Cartão
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Smartphone,
  CreditCard,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowLeft,
  DollarSign
} from 'lucide-react';
import { addCredits, convertCurrency } from '@/services/gsmRentalService';
import { notifyPaymentSuccess, notifyPaymentFailed } from '@/services/gsmFirebase';
import { useToast } from '@/hooks/use-toast';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// ============================================
// TYPES
// ============================================

interface GSMPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (amount: number, method: string) => void;
  userId: string;
  currentBalance: number;
  currency: 'USD' | 'MTN';
}

type PaymentStep = 'amount' | 'method' | 'details' | 'processing' | 'success' | 'error';

interface PaymentMethod {
  id: 'mpesa' | 'emola' | 'card';
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
  enabled: boolean;
}

// Mock gateway for illustrative purposes
const paymentGateway = {
  processMPesaPayment: async (req: any) => ({ success: true, transactionId: 'MP'+Date.now(), confirmationCode: 'ABC-123', message: 'Success' }),
  processEmolaPayment: async (req: any) => ({ success: true, transactionId: 'EM'+Date.now(), confirmationCode: 'XYZ-789', message: 'Success' }),
  processCardPayment: async (req: any) => ({ success: true, transactionId: 'CC'+Date.now(), confirmationCode: 'CARD-XXX', message: 'Success' }),
  validatePhoneNumber: (num: string, type: string) => ({ valid: num.length >= 9 })
};

interface PaymentResponse {
  success: boolean;
  transactionId: string;
  confirmationCode: string;
  message: string;
}

// ============================================
// COMPONENT
// ============================================

const GSMPaymentModal: React.FC<GSMPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
  currentBalance,
  currency
}) => {
  const { toast } = useToast();
  
  // State
  const [step, setStep] = useState<PaymentStep>('amount');
  const [amount, setAmount] = useState<number>(500);
  const [selectedMethod, setSelectedMethod] = useState<'mpesa' | 'emola' | 'card'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<PaymentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Vodacom Moçambique',
      color: 'from-red-500 to-red-600',
      enabled: true
    },
    {
      id: 'emola',
      name: 'E-mola',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Movitel',
      color: 'from-blue-500 to-blue-600',
      enabled: true
    },
    {
      id: 'card',
      name: 'Cartão',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa/Mastercard',
      color: 'from-purple-500 to-purple-600',
      enabled: true
    }
  ];

  // Quick amounts
  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  useGSAP(() => {
    if (isOpen && contentRef.current) {
      gsap.fromTo(contentRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, { scope: containerRef, dependencies: [isOpen, step] });

  // Handlers
  const handleAmountSelect = (value: number) => {
    setAmount(value);
  };

  const handleContinueToMethod = () => {
    if (amount < 10) {
      setError('Valor mínimo: 10 MTn');
      return;
    }
    setError(null);
    setTransitionStep('method');
  };

  const handleMethodSelect = (method: 'mpesa' | 'emola' | 'card') => {
    setSelectedMethod(method);
    setTransitionStep('details');
  };

  const setTransitionStep = contextSafe((newStep: PaymentStep) => {
    gsap.to(contentRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.2,
      onComplete: () => {
        setStep(newStep);
      }
    });
  });

  const handlePayment = useCallback(async () => {
    setIsProcessing(true);
    setTransitionStep('processing');
    setError(null);

    try {
      const paymentRequest = {
        amount,
        currency: 'MZN' as const,
        phoneNumber: selectedMethod !== 'card' ? phoneNumber : undefined,
        method: selectedMethod,
        description: `Créditos GSM TchovaDigital - ${amount} MTn`,
        reference: `GSM-${Date.now()}`,
        userId
      };

      let result: PaymentResponse;
      
      if (selectedMethod === 'mpesa') {
        result = await paymentGateway.processMPesaPayment(paymentRequest);
      } else if (selectedMethod === 'emola') {
        result = await paymentGateway.processEmolaPayment(paymentRequest);
      } else {
        result = await paymentGateway.processCardPayment(paymentRequest);
      }

      setPaymentResult(result);

       if (result.success) {
          const amountUsd = await convertCurrency(amount, 'MTN', 'USD');
          addCredits(userId, { usd: amountUsd, mtn: amount }, selectedMethod, result.transactionId);
        
        notifyPaymentSuccess(userId, amount, selectedMethod).catch(console.error);
        
        setTransitionStep('success');
        
        toast({
          title: 'Pagamento realizado!',
          description: `${amount} MTn adicionados à sua carteira`,
          variant: 'default'
        });

        if (onSuccess) {
          onSuccess(amount, selectedMethod);
        }
      } else {
        notifyPaymentFailed(userId, amount, result.message || 'Erro desconhecido').catch(console.error);
        setError(result.message || 'Erro ao processar pagamento');
        setTransitionStep('error');
      }
    } catch (err) {
      notifyPaymentFailed(userId, amount, err instanceof Error ? err.message : 'Erro desconhecido').catch(console.error);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setTransitionStep('error');
    } finally {
      setIsProcessing(false);
    }
  }, [amount, phoneNumber, selectedMethod, userId, onSuccess, toast, setTransitionStep]);

  const handleBack = () => {
    switch (step) {
      case 'method':
        setTransitionStep('amount');
        break;
      case 'details':
        setTransitionStep('method');
        break;
      case 'error':
        setTransitionStep('details');
        break;
      default:
        setTransitionStep('amount');
    }
  };

  const handleClose = () => {
    setStep('amount');
    setAmount(500);
    setPhoneNumber('');
    setError(null);
    setPaymentResult(null);
    onClose();
  };

  const isPhoneValid = () => {
    if (selectedMethod === 'card') return true;
    const validation = paymentGateway.validatePhoneNumber(
      phoneNumber,
      selectedMethod === 'mpesa' ? 'vodacom' : 'movitel'
    );
    return validation.valid;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md overflow-hidden bg-background/80 backdrop-blur-2xl border-white/10 shadow-3xl rounded-[2.5rem]">
        <div ref={containerRef} className="w-full">
          <div ref={contentRef} className="opacity-0">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <DollarSign className="w-6 h-6 text-primary" />
                </div>
                CRÉDITOS GSM
              </DialogTitle>
              <DialogDescription className="font-bold">
                Saldo atual: <span className="text-primary">
                  {currency === 'USD' ? `$${currentBalance.toFixed(2)}` : `${currentBalance.toLocaleString()} MTn`}
                </span>
              </DialogDescription>
            </DialogHeader>

            {step === 'amount' && (
              <div className="space-y-6 py-4">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Selecione o valor</Label>
                
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((value) => (
                    <Button
                      key={value}
                      variant={amount === value ? 'default' : 'outline'}
                      className={`h-16 rounded-2xl transition-all duration-300 font-black text-lg ${
                        amount === value 
                          ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/20 scale-[1.05]' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleAmountSelect(value)}
                    >
                      {value}
                    </Button>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="custom-amount" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Valor personalizado</Label>
                  <div className="relative group">
                    <Input
                      id="custom-amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="h-16 rounded-2xl bg-muted/50 border-white/5 focus:border-primary/50 text-xl font-black px-6 transition-all"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-muted-foreground tracking-tighter">
                      MTN
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleContinueToMethod}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20 group overflow-hidden"
                >
                  Continuar
                  <ArrowLeft className="w-5 h-5 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {step === 'method' && (
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={handleBack} className="font-black uppercase tracking-widest text-xs">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <Badge className="bg-primary/10 text-primary border-none px-4 py-1.5 font-black text-sm">
                    {amount} MTN
                  </Badge>
                </div>

                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      disabled={!method.enabled}
                      className={`w-full p-6 rounded-[2rem] border-2 transition-all duration-500 group relative overflow-hidden ${
                        selectedMethod === method.id
                          ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/10'
                          : 'border-white/5 bg-muted/30 hover:border-primary/30'
                      }`}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 transition-transform duration-500`}>
                          {method.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-black uppercase tracking-tight text-lg">{method.name}</h4>
                          <p className="text-xs font-bold text-muted-foreground">{method.description}</p>
                        </div>
                        {selectedMethod === method.id && (
                          <div className="p-2 bg-primary rounded-full">
                            <CheckCircle className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 'details' && (
              <div className="space-y-6 py-4">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm" onClick={handleBack} className="font-black uppercase tracking-widest text-xs">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                  <Badge className="bg-primary text-primary-foreground font-black uppercase tracking-widest px-4">
                    {paymentMethods.find(m => m.id === selectedMethod)?.name}
                  </Badge>
                </div>

                {selectedMethod !== 'card' && (
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Número de telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={selectedMethod === 'mpesa' ? '84 XXX XXXX' : '86 XXX XXXX'}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="h-16 rounded-2xl bg-muted/50 border-white/5 font-black text-xl px-6"
                    />
                  </div>
                )}

                <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10">
                  <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-4">Resumo da Transação</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-muted-foreground">Subtotal</span>
                      <span className="font-black">{amount.toLocaleString()} MTn</span>
                    </div>
                    <Separator className="bg-primary/10" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-black uppercase tracking-widest text-xs">Total a Pagar</span>
                      <span className="text-2xl font-black text-primary tracking-tighter">
                        {amount.toLocaleString()} <span className="text-sm">MTn</span>
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={selectedMethod !== 'card' && !isPhoneValid()}
                  className="w-full bg-primary hover:bg-primary/95 text-primary-foreground h-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-primary/20"
                >
                  Confirmar Pagamento
                </Button>
              </div>
            )}

            {step === 'processing' && (
              <div className="py-20 text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                  <Loader2 className="w-20 h-20 animate-spin text-primary relative z-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Processando...</h3>
                  <p className="text-muted-foreground font-bold px-8">
                    Confirme o prompt no seu telefone para autorizar a transação.
                  </p>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-12 text-center space-y-8">
                <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-[2.5rem] flex items-center justify-center border border-green-500/20 shadow-2xl shadow-green-500/10">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-green-600">SUCESSO!</h3>
                  <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">
                    {amount} MTn adicionados à carteira
                  </p>
                </div>
                <Button onClick={handleClose} className="w-full bg-green-600 hover:bg-green-700 h-16 rounded-2xl font-black uppercase tracking-widest">
                  Concluído
                </Button>
              </div>
            )}

            {step === 'error' && (
              <div className="py-12 text-center space-y-8">
                <div className="w-24 h-24 mx-auto bg-red-500/10 rounded-[2.5rem] flex items-center justify-center border border-red-500/20 shadow-2xl shadow-red-500/10">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-red-600">FALHA</h3>
                  <p className="text-muted-foreground font-bold px-8">{error}</p>
                </div>
                <div className="flex gap-4 px-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1 h-14 rounded-xl font-black uppercase tracking-widest text-xs">
                    Tentar Novamente
                  </Button>
                  <Button onClick={handleClose} className="flex-1 h-14 rounded-xl font-black uppercase tracking-widest text-xs bg-red-600 hover:bg-red-700">
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GSMPaymentModal;
