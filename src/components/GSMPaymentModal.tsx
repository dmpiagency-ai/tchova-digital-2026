/**
 * ============================================
 * GSM PAYMENT MODAL
 * ============================================
 * Modal de pagamento para créditos GSM
 * Suporta: M-Pesa, E-mola, Cartão
 */

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
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
  DollarSign,
  Coins
} from 'lucide-react';
import { paymentGateway, PaymentResponse } from '@/services/paymentGateway';
import { addCredits } from '@/services/gsmRentalService';
import { useToast } from '@/hooks/use-toast';
import { notifyPaymentSuccess, notifyPaymentFailed } from '@/services/gsmFirebase';

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
    setStep('method');
  };

  const handleMethodSelect = (method: 'mpesa' | 'emola' | 'card') => {
    setSelectedMethod(method);
    setStep('details');
  };

  const handlePayment = useCallback(async () => {
    setIsProcessing(true);
    setStep('processing');
    setError(null);

    try {
      // Criar request base
      const paymentRequest = {
        amount,
        currency: 'MZN' as const,
        phoneNumber: selectedMethod !== 'card' ? phoneNumber : undefined,
        method: selectedMethod,
        description: `Créditos GSM TchovaDigital - ${amount} MTn`,
        reference: `GSM-${Date.now()}`,
        userId
      };

      // Chamar método correto baseado no tipo
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
         // Adicionar créditos à carteira
         const amountUsd = convertCurrency(amount, 'MTN', 'USD');
         addCredits(userId, { usd: amountUsd, mtn: amount }, selectedMethod, result.transactionId);
        
        // Enviar notificação de sucesso
        notifyPaymentSuccess(userId, amount, selectedMethod).catch(console.error);
        
        setStep('success');
        
        toast({
          title: 'Pagamento realizado!',
          description: `${amount} MTn adicionados à sua carteira`,
          variant: 'default'
        });

        if (onSuccess) {
          onSuccess(amount, selectedMethod);
        }
      } else {
        // Enviar notificação de falha
        notifyPaymentFailed(userId, amount, result.message).catch(console.error);
        
        setError(result.message || 'Erro ao processar pagamento');
        setStep('error');
      }
    } catch (err) {
      // Enviar notificação de falha
      notifyPaymentFailed(userId, amount, err instanceof Error ? err.message : 'Erro desconhecido').catch(console.error);
      
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  }, [amount, phoneNumber, selectedMethod, userId, onSuccess, toast]);

  const handleBack = () => {
    switch (step) {
      case 'method':
        setStep('amount');
        break;
      case 'details':
        setStep('method');
        break;
      case 'error':
        setStep('details');
        break;
      default:
        setStep('amount');
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

  // Validate phone for M-Pesa/E-mola
  const isPhoneValid = () => {
    if (selectedMethod === 'card') return true;
    
    const validation = paymentGateway.validatePhoneNumber(
      phoneNumber,
      selectedMethod === 'mpesa' ? 'vodacom' : 'movitel'
    );
    return validation.valid;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Adicionar Créditos GSM
          </DialogTitle>
          <DialogDescription>
            Saldo atual: <span className="font-bold text-primary">
              {currency === 'USD' ? `$${currentBalance.toFixed(2)}` : `${currentBalance.toLocaleString()} MTn`}
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Step: Amount Selection */}
        {step === 'amount' && (
          <div className="space-y-4 py-4">
            <Label className="text-base font-semibold">Selecione o valor</Label>
            
            {/* Quick Amounts */}
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((value) => (
                <Button
                  key={value}
                  variant={amount === value ? 'default' : 'outline'}
                  className={`h-14 ${amount === value ? 'bg-gradient-to-r from-primary to-brand-green' : ''}`}
                  onClick={() => handleAmountSelect(value)}
                >
                  <span className="font-bold">{value}</span>
                  <span className="text-xs ml-1">MTn</span>
                </Button>
              ))}
            </div>

            {/* Custom Amount */}
            <div className="space-y-2">
              <Label htmlFor="custom-amount">Ou digite um valor personalizado</Label>
              <div className="relative">
                <Input
                  id="custom-amount"
                  type="number"
                  min="10"
                  max="50000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="pr-16"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  MTn
                </span>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <Button
              onClick={handleContinueToMethod}
              className="w-full bg-gradient-to-r from-primary to-brand-green"
              size="lg"
            >
              Continuar
            </Button>
          </div>
        )}

        {/* Step: Method Selection */}
        {step === 'method' && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <Badge variant="secondary" className="text-lg">
                {amount.toLocaleString()} MTn
              </Badge>
            </div>

            <Label className="text-base font-semibold">Escolha o método de pagamento</Label>

            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id)}
                  disabled={!method.enabled}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] ${
                    selectedMethod === method.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  } ${!method.enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center text-white`}>
                      {method.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-bold">{method.name}</h4>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Payment Details */}
        {step === 'details' && (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
              <Badge className="bg-gradient-to-r from-primary to-brand-green">
                {paymentMethods.find(m => m.id === selectedMethod)?.name}
              </Badge>
            </div>

            {/* Phone Number for M-Pesa/E-mola */}
            {selectedMethod !== 'card' && (
              <div className="space-y-2">
                <Label htmlFor="phone">Número de telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={selectedMethod === 'mpesa' ? '84/85 XXX XXXX' : '86/87 XXX XXXX'}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {selectedMethod === 'mpesa' 
                    ? 'Digite seu número M-Pesa (Vodacom)'
                    : 'Digite seu número E-mola (Movitel)'}
                </p>
              </div>
            )}

            {/* Card Info */}
            {selectedMethod === 'card' && (
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <CreditCard className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Você será redirecionado para uma página segura para inserir os dados do cartão
                </p>
              </div>
            )}

            {/* Summary */}
            <div className="bg-gradient-to-r from-primary/10 to-brand-green/10 rounded-xl p-4">
              <h4 className="font-semibold mb-2">Resumo</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Valor:</span>
                  <span className="font-bold">{amount.toLocaleString()} MTn</span>
                </div>
                <div className="flex justify-between">
                  <span>Método:</span>
                  <span>{paymentMethods.find(m => m.id === selectedMethod)?.name}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span className="text-primary">{amount.toLocaleString()} MTn</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={selectedMethod !== 'card' && !isPhoneValid()}
              className="w-full bg-gradient-to-r from-primary to-brand-green"
              size="lg"
            >
              {selectedMethod !== 'card' && !isPhoneValid() 
                ? 'Número inválido' 
                : `Pagar ${amount.toLocaleString()} MTn`}
            </Button>
          </div>
        )}

        {/* Step: Processing */}
        {step === 'processing' && (
          <div className="py-12 text-center">
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processando pagamento...</h3>
            <p className="text-muted-foreground">
              {selectedMethod === 'card' 
                ? 'Aguarde enquanto processamos seu cartão'
                : 'Verifique seu telefone e confirme a transação'}
            </p>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Pagamento realizado!</h3>
            <p className="text-muted-foreground mb-4">
              {amount.toLocaleString()} MTn foram adicionados à sua carteira
            </p>
            {paymentResult?.confirmationCode && (
              <Badge variant="secondary" className="mb-4">
                Código: {paymentResult.confirmationCode}
              </Badge>
            )}
            <Button onClick={handleClose} className="w-full">
              Concluir
            </Button>
          </div>
        )}

        {/* Step: Error */}
        {step === 'error' && (
          <div className="py-8 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-red-600 mb-2">Erro no pagamento</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Tentar novamente
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GSMPaymentModal;
