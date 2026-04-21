import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Film, Camera, Crown, Mountain, Sparkle, Zap, Check } from 'lucide-react';
import { env } from '@/config/env';

interface Package {
  name: string;
  price: number;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
}

interface ServicePackagesProps {
  onRequestQuote: (packageName: string, price: number) => void;
}

const ServicePackages = ({ onRequestQuote }: ServicePackagesProps) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [showExtras, setShowExtras] = useState(false);

  const audiovisualPackages: Package[] = [
    {
      name: 'Básico',
      price: 10000,
      icon: <Video className="w-8 h-8" />,
      features: ['Filmagem de vídeos', 'Sessão fotográfica', 'Edição de vídeo', 'USB de Fotos + Vídeo']
    },
    {
      name: 'Médio',
      price: 15000,
      icon: <Film className="w-8 h-8" />,
      features: ['Todos os benefícios do Básico', 'Fogo de artifício'],
      popular: false
    },
    {
      name: 'Clássico',
      price: 25000,
      icon: <Camera className="w-8 h-8" />,
      features: ['Todos os benefícios do Básico', 'Bolas de Fumaça'],
      popular: false
    },
    {
      name: 'VIP',
      price: 35000,
      icon: <Crown className="w-8 h-8" />,
      features: ['Filmagem com drone', 'Bolas de Fumaça', 'Fogo de artifício', 'USB completo'],
      popular: true
    }
  ];

  const audiovisualExtras = [
    { name: 'Filmagem com drone', price: 5000, icon: <Mountain className="w-6 h-6" /> },
    { name: 'Bolas de Fumaça', price: 5000, icon: <Sparkle className="w-6 h-6" /> },
    { name: 'Fogo de artifício', price: 5000, icon: <Zap className="w-6 h-6" /> }
  ];

  const toggleExtra = (extra: string) => {
    setSelectedExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  };

  const handleRequestQuote = (packageName: string, price: number) => {
    const extras = selectedExtras.map(e => `\n- ${e}`).join('');
    const message = `Olá! Gostaria de pedir um orçamento para Produção Audiovisual.\n\nPacote: ${packageName}\nValor base: ${price.toLocaleString('pt-MZ')} MZN${selectedExtras.length > 0 ? `\nAdicionais:${extras}` : ''}\n\nPodem entrar em contacto para alinharmos os detalhes?`;
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="liquid-card rounded-[48px] p-8 lg:p-12 mb-12 lg:mb-16 backdrop-blur-xl dark:bg-black/5 bg-slate-50/80 border dark:border-white/10 border-slate-200 shadow-2xl">
      <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-8 lg:mb-12 flex items-center">
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-black">
          Pacotes Disponíveis
        </span>
      </h2>
      
      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {audiovisualPackages.map((pkg, index) => (
          <div 
            key={index}
            onClick={() => setSelectedPackage(pkg.name)}
            className={`group bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-transparent backdrop-blur-lg rounded-[24px] p-6 border transition-all duration-500 hover:scale-[1.02] cursor-pointer ${
              selectedPackage === pkg.name
                ? 'border-purple-300/50 shadow-2xl'
                : 'border-purple-200/30 hover:border-purple-300/50'
            }`}
          >
            {pkg.popular && (
              <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Popular
              </Badge>
            )}
            
            <div className="flex justify-center mb-4">
              <div className="text-purple-600 dark:text-purple-400">
                {pkg.icon}
              </div>
            </div>
            
            <h3 className="font-bold text-lg lg:text-xl text-purple-600 dark:text-purple-400 mb-4 text-center">
              {pkg.name}
            </h3>
            
            <ul className="space-y-2 mb-4">
              {pkg.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-foreground">
                  <Check className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="text-center">
              <p className="text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400">
                {pkg.price.toLocaleString('pt-MZ')} MZN
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Extras Section */}
      <div className="space-y-6">
        <Button
          onClick={() => setShowExtras(!showExtras)}
          variant="outline"
          className="w-full"
        >
          {showExtras ? 'Ocultar Extras' : 'Mostrar Extras'}
        </Button>

        {showExtras && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-6">
            {audiovisualExtras.map((extra, index) => (
              <div 
                key={index}
                onClick={() => toggleExtra(extra.name)}
                className={`group bg-gradient-to-br from-pink-500/10 via-pink-400/5 to-transparent backdrop-blur-lg rounded-[24px] p-6 border transition-all duration-500 hover:scale-[1.02] cursor-pointer ${
                  selectedExtras.includes(extra.name)
                    ? 'border-pink-300/50 shadow-xl'
                    : 'border-pink-200/30 hover:border-pink-300/50'
                }`}
              >
                <div className="flex justify-center mb-3">
                  <div className="text-pink-600 dark:text-pink-400">
                    {extra.icon}
                  </div>
                </div>
                
                <h3 className="font-bold text-base lg:text-lg text-pink-600 dark:text-pink-400 mb-2 text-center">
                  {extra.name}
                </h3>
                
                <div className="text-center">
                  <p className="text-xl lg:text-2xl font-bold text-pink-600 dark:text-pink-400">
                    +{extra.price.toLocaleString('pt-MZ')} MZN
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Quote Button */}
      {selectedPackage && (
        <div className="mt-8">
          <Button
            onClick={() => handleRequestQuote(selectedPackage, audiovisualPackages.find(p => p.name === selectedPackage)!.price)}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01]"
          >
            Solicitar Orçamento
          </Button>
        </div>
      )}
    </div>
  );
};

export default ServicePackages;
