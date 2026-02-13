import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAICredits } from '@/contexts/AICreditsContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  CreditCard,
  Smartphone,
  Building2,
  CheckCircle2,
  Coins,
  Zap,
  Star,
  DollarSign,
  Wallet,
  Gift
} from 'lucide-react';

interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  bonus: number;
  isPopular?: boolean;
  features: string[];
}

const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: 'basic',
    name: 'Pacote Básico',
    price: 100,
    credits: 100,
    bonus: 0,
    features: ['100 créditos', 'Suporte básico', 'Validade 30 dias']
  },
  {
    id: 'standard',
    name: 'Pacote Standard',
    price: 250,
    credits: 250,
    bonus: 25,
    features: ['275 créditos', 'Suporte prioritário', 'Validade 60 dias', 'Downloads HD']
  },
  {
    id: 'popular',
    name: 'Pacote Popular',
    price: 500,
    credits: 500,
    bonus: 75,
    isPopular: true,
    features: ['575 créditos', 'Suporte VIP', 'Validade 90 dias', 'Downloads 4K', 'Templates exclusivos']
  },
  {
    id: 'premium',
    name: 'Pacote Premium',
    price: 1000,
    credits: 1000,
    bonus: 200,
    features: ['1200 créditos', 'Suporte 24/7', 'Validade 180 dias', 'Downloads 8K', 'API Access']
  },
  {
    id: 'enterprise',
    name: 'Pacote Enterprise',
    price: 2500,
    credits: 2500,
    bonus: 625,
    features: ['3125 créditos', 'Suporte dedicado', 'Validade 365 dias', 'Todos os recursos', 'Consultoria personalizada']
  }
];

const PAYMENT_METHODS = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    icon: <Smartphone className="w-5 h-5" />,
    description: 'Pagamento móvel local'
  },
  {
    id: 'emola',
    name: 'E-Mola',
    icon: <Smartphone className="w-5 h-5" />,
    description: 'Carteira digital local'
  },
  {
    id: 'bank',
    name: 'Transferência Bancária',
    icon: <Building2 className="w-5 h-5" />,
    description: 'Transferência direta'
  },
  {
    id: 'card',
    name: 'Cartão de Crédito',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Visa, Mastercard'
  }
];

interface AICreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AICreditsModal: React.FC<AICreditsModalProps> = ({ isOpen, onClose }) => {
  const { addCredits } = useAICredits();
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [customAmount, setCustomAmount] = useState('');
  const [step, setStep] = useState<'packages' | 'method' | 'confirm' | 'success'>('packages');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePackageSelect = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
    setCustomAmount('');
    setStep('method');
  };

  const handleCustomAmount = () => {
    const amount = parseInt(customAmount);
    if (amount >= 50) {
      setSelectedPackage({
        id: 'custom',
        name: 'Pacote Personalizado',
        price: amount,
        credits: amount,
        bonus: Math.floor(amount * 0.1),
        features: ['Créditos personalizados', 'Suporte prioritário', 'Validade 30 dias']
      });
      setStep('method');
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    setStep('confirm');
  };

  const handleConfirmPayment = async () => {
    if (!selectedPackage || !selectedMethod) return;

    setIsProcessing(true);

    // Simular processamento de pagamento
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Adicionar créditos
    const totalCredits = selectedPackage.credits + selectedPackage.bonus;
    addCredits(totalCredits, `Recarga de ${selectedPackage.credits} MZN + ${selectedPackage.bonus} bônus`);

    setIsProcessing(false);
    setStep('success');

    // Reset após 3 segundos
    setTimeout(() => {
      setStep('packages');
      setSelectedPackage(null);
      setSelectedMethod('');
      setCustomAmount('');
      onClose();
    }, 3000);
  };

  const resetModal = () => {
    setStep('packages');
    setSelectedPackage(null);
    setSelectedMethod('');
    setCustomAmount('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl backdrop-blur-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            <div className="p-2 bg-gradient-to-br from-primary to-accent text-white rounded-xl">
              <Coins className="w-6 h-6" />
            </div>
            <span>Adicionar Créditos de IA</span>
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Recarregue seus créditos para usar as ferramentas de IA e criar conteúdo profissional.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Escolher Pacote */}
        {step === 'packages' && (
          <div className="space-y-8">
            {/* Dica para Iniciantes */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-blue-800 dark:text-blue-200">Dica para Iniciantes</h5>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    Não sabe quanto carregar? Comece com <span className="font-bold text-blue-900 dark:text-blue-200">100 MZN</span> e teste nossos serviços de IA. É o preço de um pacote de dados diário!
                  </p>
                </div>
              </div>
            </div>

            {/* Pacotes de Créditos */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">Escolha um Pacote</h3>
              <p className="text-center text-muted-foreground text-sm">
                Pacotes com <span className="text-primary font-semibold">créditos bonus</span> para maximizar seu investimento
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {CREDIT_PACKAGES.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 ${
                      selectedPackage?.id === pkg.id
                        ? 'border-primary shadow-lg scale-105'
                        : pkg.isPopular
                        ? 'border-accent shadow-md'
                        : 'border-gray-200 dark:border-gray-700'
                    } bg-gradient-to-br from-white/10 to-white/5 rounded-2xl hover:-translate-y-1`}
                  >
                    {pkg.isPopular && (
                      <div className="absolute top-0 right-0">
                        <Badge variant="secondary" className="bg-accent text-primary-foreground font-bold px-3 py-1">
                          <Star className="w-4 h-4 mr-1" />
                          Mais Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold">{pkg.name}</CardTitle>
                        {pkg.bonus > 0 && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                            +{pkg.bonus} Bônus
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-sm">
                        {pkg.features.length} recursos incluídos
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        {/* Preço */}
                        <div className="text-center space-y-1">
                          <div className="flex items-center justify-center gap-1">
                            <DollarSign className="w-5 h-5 text-primary" />
                            <span className="text-3xl font-bold text-primary">{pkg.price}</span>
                            <span className="text-muted-foreground">MZN</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {pkg.bonus > 0 ? 'Total: ' + (pkg.credits + pkg.bonus) : pkg.credits} créditos
                          </p>
                          {pkg.bonus > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {Math.round((pkg.bonus / pkg.credits) * 100)}% OFF
                            </Badge>
                          )}
                        </div>

                        {/* Recursos */}
                        <div className="space-y-2">
                          {pkg.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </div>
                          ))}
                        </div>

                        {/* Botão de Seleção */}
                        <Button
                          onClick={() => handlePackageSelect(pkg)}
                          className={`w-full h-11 ${
                            selectedPackage?.id === pkg.id
                              ? 'bg-gradient-to-r from-primary to-accent text-white'
                              : 'premium-button'
                          }`}
                        >
                          {selectedPackage?.id === pkg.id ? 'Selecionado' : 'Escolher'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Valor Personalizado */}
            <div className="space-y-6">
              <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200 dark:border-orange-700">
                <div className="flex items-start space-x-3">
                  <Gift className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-orange-800 dark:text-orange-200">Valor Personalizado</h3>
                    <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                      Escolha um valor personalizado para recarregar seus créditos. Mínimo: 50 MZN
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-amount" className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Valor em MZN
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="custom-amount"
                        type="number"
                        min="50"
                        max="10000"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="50"
                        className="pl-9 pr-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-orange-200 dark:border-orange-700 focus:border-orange-500 focus:ring-2 focus:ring-orange/20"
                      />
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400">
                      Mínimo: 50 MZN | Máximo: 10000 MZN
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calculated-credits" className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Créditos Calculados
                    </Label>
                    <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-black/30 rounded-xl border border-orange-200 dark:border-orange-700">
                      <span className="text-sm text-muted-foreground">
                        {customAmount ? parseInt(customAmount) : 0} créditos
                      </span>
                      {customAmount && parseInt(customAmount) >= 50 && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                          ✔ Válido
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    onClick={handleCustomAmount}
                    disabled={!customAmount || parseInt(customAmount) < 50}
                    className="premium-button w-full sm:w-auto"
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Método de Pagamento */}
        {step === 'method' && selectedPackage && (
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">Método de Pagamento</h3>
              <div className="space-y-4">
                {PAYMENT_METHODS.map((method) => (
                  <Card
                    key={method.id}
                    className={`cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 ${
                      selectedMethod === method.id
                        ? 'border-primary shadow-lg scale-105'
                        : 'border-gray-200 dark:border-gray-700'
                    } bg-gradient-to-br from-white/10 to-white/5 rounded-2xl hover:-translate-y-1`}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          {method.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-lg">{method.name}</div>
                          <div className="text-sm text-muted-foreground">{method.description}</div>
                        </div>
                        {selectedMethod === method.id && (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep('packages')} className="flex-1">
                ← Voltar
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmar Pagamento */}
        {step === 'confirm' && selectedPackage && selectedMethod && (
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-center">Confirmar Recarga</h3>
              
              <Card className="bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Pacote:</span>
                      <span className="font-semibold text-lg">{selectedPackage.name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Créditos:</span>
                      <span className="font-semibold">{selectedPackage.credits} MZN</span>
                    </div>
                    {selectedPackage.bonus > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Bônus:</span>
                        <span className="font-semibold">+{selectedPackage.bonus} MZN</span>
                      </div>
                    )}
                    <div className="border-t pt-3 flex justify-between items-center font-bold text-lg">
                      <span>Total de Créditos:</span>
                      <span>{selectedPackage.credits + selectedPackage.bonus} MZN</span>
                    </div>
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>Método:</span>
                      <span>{PAYMENT_METHODS.find(m => m.id === selectedMethod)?.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep('method')} className="flex-1">
                ← Voltar
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="flex-1 premium-button"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processando Pagamento...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Confirmar Pagamento
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Sucesso */}
        {step === 'success' && (
          <div className="text-center space-y-8 py-8">
            <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-3xl border border-green-200 dark:border-green-800 inline-block">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-green-600">Recarga Concluída!</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                {selectedPackage && `${selectedPackage.credits + selectedPackage.bonus} créditos foram adicionados à sua conta.`}
              </p>
              <p className="text-sm text-muted-foreground">
                Você pode começar a usar seus créditos imediatamente!
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};