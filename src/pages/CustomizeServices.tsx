import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import {
  Calculator,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  MessageCircle,
  ArrowLeft,
  Package,
  Star,
  CheckCircle,
  Info
} from 'lucide-react';

// Service images from Cloudinary
const designServiceImage = 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762746750/1762703395544_lhphsq.png';
const websitesServiceImage = 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png';
const marketingServiceImage = 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762747013/1762701812733_p93nsd.png';
const audiovisualServiceImage = 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755464/1762703721009_w7posw.png';
const importServiceImage = 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png';
const gsmServiceImage = 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755441/Gemini_Generated_Image_66r0q266r0q266r0_kbpqc8.png';

interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
  features: string[];
  image: string;
  popular?: boolean;
}

const CustomizeServices = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const planName = searchParams.get('plan') || 'Orçamento Personalizado';
  const basePrice = parseInt(searchParams.get('price') || '0');
  
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customNotes, setCustomNotes] = useState<string>('');

  const availableServices: Service[] = [
    {
      id: 'identidade-visual',
      name: 'Design Gráfico & Identidade Visual',
      category: 'Design Gráfico',
      basePrice: 3500,
      description: 'Transformamos marcas em presença visual forte com identidade memorável',
      features: ['Logotipos profissionais', 'Identidade visual completa', 'Artes para redes sociais', 'Motion design', 'Materiais impressos'],
      image: designServiceImage,
      popular: true
    },
    {
      id: 'website-profissional',
      name: 'Website Profissional',
      category: 'Desenvolvimento Web',
      basePrice: 4500,
      description: 'Sites responsivos, otimizados e com painel administrativo',
      features: ['Design responsivo', 'Painel admin', 'SEO básico', 'Hosting 1 ano'],
      image: websitesServiceImage,
      popular: true
    },
    {
      id: 'marketing-digital',
      name: 'Marketing Digital',
      category: 'Marketing',
      basePrice: 0,
      description: 'Gerimos e expandimos a presença da sua marca no digital com campanhas orientadas a resultados',
      features: ['Gestão de redes sociais', 'Criação de conteúdo', 'Tráfego pago', 'Estratégias de conversão', 'Copywriting persuasivo', 'SEO técnico'],
      image: marketingServiceImage,
      popular: true
    },
    {
      id: 'producao-video',
      name: 'Produção Audiovisual Profissional',
      category: 'Produção',
      basePrice: 0,
      description: 'Criamos vídeos profissionais que comunicam, envolvem e geram impacto',
      features: ['Vídeos institucionais', 'Reels para redes sociais', 'Comerciais TV/digital', 'Motion graphics', 'Roteirização e filmagem', 'Edição profissional'],
      image: audiovisualServiceImage
    },
    {
      id: 'seo-otimizacao',
      name: 'SEO e Otimização',
      category: 'Marketing',
      basePrice: 2500,
      description: 'Otimização para motores de busca e performance',
      features: ['SEO técnico', 'Otimização de velocidade', 'Google Analytics', 'Relatórios SEO'],
      image: marketingServiceImage
    },
    {
      id: 'apps-mobile',
      name: 'Aplicativo Mobile',
      category: 'Desenvolvimento',
      basePrice: 8000,
      description: 'Apps iOS e Android com funcionalidades customizadas',
      features: ['iOS e Android', 'Design nativo', 'APIs customizadas', 'Publicação stores'],
      image: websitesServiceImage
    },
    {
      id: 'gestao-redes',
      name: 'Gestão de Redes Sociais',
      category: 'Marketing',
      basePrice: 3000,
      description: 'Gestão completa de Instagram, Facebook e TikTok',
      features: ['Criação de conteúdo', 'Agendamento', 'Interação com followers', 'Relatórios'],
      image: importServiceImage
    },
    {
      id: 'suporte-premium',
      name: 'Suporte Premium',
      category: 'Suporte',
      basePrice: 2000,
      description: 'Suporte prioritário 24/7 e consultoria mensal',
      features: ['Suporte 24/7', 'Consultoria mensal', 'Urgências incluidas', 'Acesso direto'],
      image: websitesServiceImage
    }
  ];

  const calculateTotal = () => {
    let total = basePrice;
    selectedServices.forEach(serviceId => {
      const service = availableServices.find(s => s.id === serviceId);
      if (service) {
        const quantity = quantities[serviceId] || 1;
        if (service.basePrice > 0) {
          total += service.basePrice * quantity;
        }
      }
    });
    return total;
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
      const newQuantities = { ...quantities };
      delete newQuantities[serviceId];
      setQuantities(newQuantities);
    }
  };

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    if (quantity < 1) return;
    setQuantities({ ...quantities, [serviceId]: quantity });
  };

  const handleSendProposal = () => {
    const customizations = selectedServices.map(id => {
      const service = availableServices.find(s => s.id === id);
      const qty = quantities[id] || 1;
      return `${service?.name} ${qty > 1 ? `x${qty}` : ''}`;
    });

    const message = encodeURIComponent(
      `🤝 Olá! Gostaria de solicitar um orçamento personalizado.\n\n` +
      `📋 Plano Base: ${planName} (${basePrice.toLocaleString()} MZN)\n\n` +
      `🎯 Serviços Adicionais Selecionados:\n${customizations.map(item => `- ${item}`).join('\n')}\n\n` +
      `💰 Total Estimado: ${calculateTotal().toLocaleString()} MZN\n\n` +
      `📝 Observações: ${customNotes || 'Nenhuma'}\n\n` +
      `Podemos discutir os detalhes e condições especiais?`
    );
    window.open(`https://wa.me/258123456789?text=${message}`, '_blank');
  };

  const totalPrice = calculateTotal();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-2 py-4 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Services Selection */}
          <div className="lg:col-span-2 space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold gradient-text mb-2">
                Personalize seu Orçamento
              </h1>
              <p className="text-muted-foreground">
                Misture e combine serviços para criar a solução perfeita para seu negócio
              </p>
            </div>

            {/* Base Plan Info - Only show if there's a meaningful base price */}
            {basePrice > 0 && (
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{planName}</h3>
                        <p className="text-sm text-muted-foreground">Plano base selecionado</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {basePrice.toLocaleString()} MZN
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Custom Budget Info for when no base plan */}
            {basePrice === 0 && (
              <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{planName}</h3>
                        <p className="text-sm text-muted-foreground">Selecione os serviços desejados</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        0 MZN
                      </div>
                      <p className="text-xs text-muted-foreground">valor inicial</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Services */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">Adicionar Serviços</h2>
                <Badge variant="secondary">{availableServices.length} opções</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableServices.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  const quantity = quantities[service.id] || 1;

                  return (
                    <Card 
                      key={service.id} 
                      className={`cursor-pointer transition-all duration-300 ${
                        isSelected 
                          ? 'border-primary bg-primary/5 shadow-lg' 
                          : 'hover:border-primary/50 hover:shadow-md'
                      }`}
                      onClick={() => handleServiceToggle(service.id, !isSelected)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                            className="mt-1"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-bold text-sm line-clamp-1">{service.name}</h3>
                              {service.popular && (
                                <Badge className="bg-yellow-500/10 text-yellow-700 text-xs">
                                  <Star className="w-3 h-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {service.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-bold text-primary">
                                {service.basePrice.toLocaleString()} MZN
                              </div>
                              
                              {isSelected && (
                                <div className="flex items-center space-x-1">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantityChange(service.id, quantity - 1);
                                    }}
                                    disabled={quantity <= 1}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </Button>
                                  <span className="w-6 text-center font-bold text-sm">{quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleQuantityChange(service.id, quantity + 1);
                                    }}
                                    className="h-6 w-6 p-0"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-1 mt-2">
                              {service.features.slice(0, 2).map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                  {feature}
                                </Badge>
                              ))}
                              {service.features.length > 2 && (
                                <Badge variant="outline" className="text-xs px-1 py-0">
                                  +{service.features.length - 2} mais
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Summary and Actions */}
          <div className="space-y-6">
            <div className="sticky top-24">
              {/* Price Summary */}
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    <span>Resumo do Orçamento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {basePrice > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Plano Base</span>
                        <span>{basePrice.toLocaleString()} MZN</span>
                      </div>
                    )}
                    
                    {selectedServices.map(serviceId => {
                      const service = availableServices.find(s => s.id === serviceId);
                      const qty = quantities[serviceId] || 1;
                      return service ? (
                        <div key={serviceId} className="flex justify-between text-sm">
                          <span className="flex-1">{service.name} {qty > 1 && `x${qty}`}</span>
                          <div className="flex items-center space-x-2">
                            <span>{(service.basePrice * qty).toLocaleString()} MZN</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleServiceToggle(serviceId, false)}
                              className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{totalPrice.toLocaleString()} MZN</span>
                  </div>
                  
                  {selectedServices.length > 0 && (
                    <div className="text-xs text-muted-foreground text-center">
                      {selectedServices.length} serviço{selectedServices.length !== 1 ? 's' : ''} selecionado{selectedServices.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Custom Notes */}
              <Card className="mt-4">
                <CardContent className="p-4">
                  <Label htmlFor="notes" className="text-sm font-semibold mb-2 block">
                    Observações (Opcional)
                  </Label>
                  <Input
                    id="notes"
                    placeholder="Adicione suas preferências ou requisitos especiais..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    className="text-sm"
                  />
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3 mt-4">
                <Button
                  onClick={handleSendProposal}
                  className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Solicitar Orçamento
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/payment', {
                      state: {
                        service: planName,
                        amount: totalPrice,
                        customizations: selectedServices.map(id => {
                          const service = availableServices.find(s => s.id === id);
                          const qty = quantities[id] || 1;
                          return service ? { ...service, quantity: qty } : null;
                        }).filter(Boolean)
                      }
                    })}
                    className="h-10"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pagar Agora
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="h-10"
                  >
                    Voltar
                  </Button>
                </div>
              </div>

              {/* Info Alert */}
              <Alert className="mt-4">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Após solicitar o orçamento, nossa equipe entrará em contacto para discutir detalhes e condições especiais.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomizeServices;