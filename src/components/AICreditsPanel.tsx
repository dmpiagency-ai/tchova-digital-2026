import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CreditCard,
  Coins,
  Zap,
  Star,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Gift,
  DollarSign
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

interface AICreditsPanelProps {
  currentCredits: number;
  onPurchase: (amount: number) => void;
  onCustomAmount?: (amount: number) => void;
}

export const AICreditsPanel: React.FC<AICreditsPanelProps> = ({
  currentCredits,
  onPurchase,
  onCustomAmount
}) => {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePackageSelect = (pkg: CreditPackage) => {
    setSelectedPackage(pkg);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 50 && parseInt(value) <= 10000)) {
      setCustomAmount(value);
      setSelectedPackage(null);
    }
  };

  const handlePurchase = () => {
    setIsProcessing(true);
    // Simulate purchase process
    setTimeout(() => {
      if (selectedPackage) {
        onPurchase(selectedPackage.price);
      } else if (customAmount) {
        onCustomAmount?.(parseInt(customAmount));
      }
      setIsProcessing(false);
    }, 2000);
  };

  const handleQuickPurchase = (amount: number) => {
    setIsProcessing(true);
    setTimeout(() => {
      onPurchase(amount);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header com Saldo */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl animate-glow">
            <Coins className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text">Adicionar Créditos de IA</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
          Recarregue seus créditos para usar as ferramentas de IA e criar conteúdo profissional.
        </p>

        {/* Saldo Atual com Efeito Premium */}
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-2xl shadow-xl backdrop-blur-xl">
            <CardContent className="pt-6 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Wallet className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground font-medium">
                      Créditos Atuais
                    </p>
                    <p className="text-3xl font-bold text-primary mt-1">
                      {currentCredits} MZN
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg font-bold px-4 py-2 bg-gradient-to-r from-primary to-accent text-white">
                  ✔ Ativo
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
        <h2 className="text-2xl font-bold text-center">Escolha um Pacote</h2>
        <p className="text-center text-muted-foreground text-sm sm:text-base">
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
        <div className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl border border-orange-200 dark:border-orange-800">
          <div className="flex items-start space-x-3">
            <Gift className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-orange-800 dark:text-orange-200">Valor Personalizado</h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
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
                  onChange={handleCustomAmountChange}
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
        </div>

        {/* Quick Purchase Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[50, 100, 200, 500].map(amount => (
            <Button
              key={amount}
              onClick={() => handleQuickPurchase(amount)}
              disabled={isProcessing}
              className="h-11 premium-button text-sm"
            >
              {amount} MZN
            </Button>
          ))}
        </div>
      </div>

      {/* Botão de Compra Final */}
      <div className="text-center space-y-4">
        <Button
          onClick={handlePurchase}
          disabled={!selectedPackage && (!customAmount || parseInt(customAmount) < 50) || isProcessing}
          className="w-full sm:w-96 h-12 premium-button text-base font-semibold"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processando Pagamento...
            </>
          ) : selectedPackage ? (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Comprar {selectedPackage.price} MZN ({selectedPackage.bonus > 0 ? selectedPackage.credits + selectedPackage.bonus : selectedPackage.credits} créditos)
            </>
          ) : customAmount && parseInt(customAmount) >= 50 ? (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Comprar {customAmount} MZN ({customAmount} créditos)
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Escolha um Pacote ou Valor
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Ao prosseguir com a compra, você concorda com nossos <a href="#" className="text-primary hover:underline">Termos de Serviço</a> e <a href="#" className="text-primary hover:underline">Política de Reembolso</a>.
        </p>
      </div>

      {/* Métodos de Pagamento */}
      <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-bold">Métodos de Pagamento Aceitos</h4>
          <Badge variant="secondary" className="text-sm">
            100% Seguro
          </Badge>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {[
            'MPesa', 'Vodacom Money', 'Tigo Money', 'Banco Standard', 'Banco de Moçambique', 'PayPal'
          ].map((method, index) => (
            <div key={index} className="p-3 bg-white/50 dark:bg-black/30 rounded-xl border border-gray-200 dark:border-gray-700 text-center text-sm">
              {method}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};