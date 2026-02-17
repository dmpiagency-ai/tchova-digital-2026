
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import {
  Calculator,
  Plus,
  Minus,
  MessageCircle,
  Package,
  ArrowLeft,
  Sparkles,
  CheckCircle,
  Clock,
  Shield,
  Gift,
  Users,
  Award,
  Rocket,
  Heart
} from 'lucide-react';
import { env } from '@/config/env';

interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
  features: string[];
  popular?: boolean;
  savings?: number;
}

const PlanCustomizer = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const planName = searchParams.get('plan') || 'Plano Personalizado';
  const basePrice = parseInt(searchParams.get('price') || '0');
  const serviceTitle = searchParams.get('service') || '';
  
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);
  
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const getAvailableServices = (): Service[] => {
    if (serviceTitle.includes('Design') || serviceTitle.includes('Identidade Visual')) {
      return [
        {
          id: 'design-pack-premium',
          name: 'Pacote Premium de Design',
          category: 'Design',
          basePrice: 2500,
          description: 'Materiais completos de identidade visual premium',
          features: ['Manual da marca completo', 'Versões para todos os meios', 'Arquivos editáveis', 'Orientação de uso'],
          popular: true,
          savings: 20
        },
        {
          id: 'design-mockups',
          name: 'Mockups Profissionais',
          category: 'Design',
          basePrice: 1200,
          description: 'Apresentação profissional dos seus designs',
          features: ['Mockups de alta qualidade', 'Diferentes contextos', 'Para apresentações', 'Versões digitais'],
          popular: false,
          savings: 15
        },
        {
          id: 'design-print-materials',
          name: 'Materiais para Impressão',
          category: 'Design',
          basePrice: 800,
          description: 'Preparação completa para impressão',
          features: ['Ajustes de cor CMYK', 'Sangria e marca de corte', 'Arquivos otimizados', 'Orientação gráfica'],
          popular: false,
          savings: 10
        }
      ];
    }

    if (serviceTitle.includes('Website') || serviceTitle.includes('Web')) {
      return [
        {
          id: 'web-seo-package',
          name: 'Pacote SEO Completo',
          category: 'Web',
          basePrice: 1800,
          description: 'Otimização completa para motores de busca',
          features: ['Otimização on-page', 'Meta tags avançadas', 'Schema markup', 'Sitemap XML', 'Robots.txt'],
          popular: true,
          savings: 25
        },
        {
          id: 'web-ecommerce-integration',
          name: 'Integração E-commerce',
          category: 'Web',
          basePrice: 2200,
          description: 'Transforme seu site em loja online',
          features: ['Sistema de pagamentos', 'Gestão de produtos', 'Carrinho de compras', 'Área do cliente'],
          popular: true,
          savings: 18
        },
        {
          id: 'web-blog-system',
          name: 'Sistema de Blog',
          category: 'Web',
          basePrice: 1200,
          description: 'Plataforma completa para conteúdo',
          features: ['CMS integrado', 'Sistema de comentários', 'SEO para blog', 'Analytics integrado'],
          popular: false,
          savings: 15
        }
      ];
    }

    if (serviceTitle.includes('Marketing')) {
      return [
        {
          id: 'marketing-ads-boost',
          name: 'Impulsionamento Anúncios',
          category: 'Marketing',
          basePrice: 3000,
          description: 'Campanhas pagas otimizadas para resultados',
          features: ['Google Ads + Facebook Ads', 'Otimização diária', 'Relatórios semanais', 'A/B testing'],
          popular: true,
          savings: 15
        },
        {
          id: 'marketing-content-creation',
          name: 'Criação de Conteúdo',
          category: 'Marketing',
          basePrice: 2000,
          description: 'Conteúdo estratégico para todas as plataformas',
          features: ['Posts para redes sociais', 'Artigos para blog', 'Email marketing', 'Calendário editorial'],
          popular: true,
          savings: 12
        }
      ];
    }

    if (planName === 'Pacotes Audiovisuais') {
      return [
        {
          id: 'pacote-basico',
          name: '🎬 Pacote Básico',
          category: 'Evento',
          basePrice: 10000,
          description: 'Cobertura essencial do seu evento',
          features: ['Filmagem de vídeos', 'Seção fotográfica', 'Edição de vídeo', 'USB de Fotos', 'USB de Vídeo'],
          popular: true,
          savings: 0
        },
        {
          id: 'pacote-medio',
          name: '🎥 Pacote Médio',
          category: 'Evento',
          basePrice: 15000,
          description: 'Cobertura completa com efeitos especiais',
          features: ['Filmagem de vídeos', 'Seção fotográfica', 'Edição de vídeo', 'Fogo de artifício', 'USB de Fotos', 'USB de Vídeo'],
          popular: true,
          savings: 0
        },
        {
          id: 'adicional-drone',
          name: '✈️ Filmagem com Drone',
          category: 'Adicional',
          basePrice: 5000,
          description: 'Imagens aéreas profissionais',
          features: ['Filmagem com drone 4K', 'Edição incluída', 'Autorização de voo', 'Seguro de equipamento'],
          popular: false,
          savings: 0
        }
      ];
    }

    return [
      {
        id: 'consultoria-especializada',
        name: 'Consultoria Especializada',
        category: 'Consultoria',
        basePrice: 1500,
        description: 'Orientação especializada para otimizar resultados',
        features: ['Análise detalhada', 'Recomendações estratégicas', 'Plano de ação', 'Acompanhamento'],
        popular: true,
        savings: 20
      }
    ];
  };

  const availableServices = getAvailableServices();

  const calculateTotal = () => {
    let total = basePrice;
    selectedServices.forEach(serviceId => {
      const service = availableServices.find(s => s.id === serviceId);
      if (service) {
        const quantity = quantities[serviceId] || 1;
        total += service.basePrice * quantity;
      }
    });
    return total;
  };

  const calculateSavings = () => {
    let totalSavings = 0;
    selectedServices.forEach(serviceId => {
      const service = availableServices.find(s => s.id === serviceId);
      if (service?.savings) {
        const quantity = quantities[serviceId] || 1;
        totalSavings += (service.basePrice * quantity * service.savings) / 100;
      }
    });
    return totalSavings;
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

  const handleRequestProposal = () => {
    const customizations = selectedServices.map(id => {
      const service = availableServices.find(s => s.id === id);
      const qty = quantities[id] || 1;
      return `${service?.name} ${qty > 1 ? `x${qty}` : ''}`;
    });

    const serviceContext = serviceTitle ? ` para o serviço "${serviceTitle}"` : '';
    const message = encodeURIComponent(
      `🤝 Olá! Gostaria de solicitar uma proposta${serviceContext}.\n\n` +
      `📋 Personalizações Selecionadas:\n${customizations.map(item => `- ${item}`).join('\n')}\n\n` +
      `💰 Valor Estimado: ${calculateTotal().toLocaleString()} MZN\n` +
      `💎 Economia: ${calculateSavings().toLocaleString()} MZN\n\n` +
      `Podemos discutir condições especiais e ajustes?`
    );
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const totalPrice = calculateTotal();
  const totalSavings = calculateSavings();
  const finalPrice = totalPrice - totalSavings;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 via-primary/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Header />

      <main className="container relative z-10 mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 max-w-7xl">
        <div className="mb-3 sm:mb-4 lg:mb-6 animate-fade-up">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="h-10 sm:h-12 px-3 sm:px-4 rounded-xl backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/30 text-foreground hover:text-primary transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span className="hidden sm:inline">Voltar</span>
              <span className="sm:hidden">←</span>
            </Button>

            <div className="sm:hidden">
              <Badge className="bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                {serviceTitle || 'Personalização'}
              </Badge>
            </div>
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-2">
              <span className="hidden sm:inline">Personalizar {serviceTitle || 'Plano'}</span>
              <span className="sm:hidden">Personalizar Plano</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              <span className="hidden sm:inline">Adicione funcionalidades extras para potencializar seu projeto</span>
              <span className="sm:hidden">Adicione funcionalidades extras</span>
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
           <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
             <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 border-b border-white/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground">{planName}</h2>
                      <p className="text-sm text-muted-foreground">Plano base selecionado</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-bold text-primary">{basePrice.toLocaleString()} MZN</div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Valor base</p>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <Shield className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <h4 className="font-bold text-green-800 dark:text-green-200 text-xs sm:text-sm">Seguro</h4>
                  </div>
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Rocket className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <h4 className="font-bold text-blue-800 dark:text-blue-200 text-xs sm:text-sm">Rápido</h4>
                  </div>
                  <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <Award className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <h4 className="font-bold text-purple-800 dark:text-purple-200 text-xs sm:text-sm">Premium</h4>
                  </div>
                </div>
              </div>
           </div>

           <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-2xl shadow-xl">
             <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 border-b border-white/20">
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center">
                  <Sparkles className="w-5 h-5 text-primary mr-2" />
                  <span className="hidden sm:inline">Adicionar Serviços</span>
                  <span className="sm:hidden">Extras</span>
                </h2>
                <p className="text-sm text-muted-foreground">Personalize com funcionalidades extras</p>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid gap-4 sm:gap-6 grid-cols-1">
                  {availableServices.map((service) => {
                    const isSelected = selectedServices.includes(service.id);
                    const quantity = quantities[service.id] || 1;
                    const discountedPrice = service.savings ? service.basePrice * (1 - service.savings / 100) : service.basePrice;

                    return (
                      <Card
                        key={service.id}
                        className={`cursor-pointer transition-all duration-300 touch-manipulation ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-lg scale-[1.01] ring-2 ring-primary/20'
                            : 'border-white/20 hover:border-primary/30 hover:shadow-md active:scale-[0.99]'
                        } ${service.popular ? 'ring-1 ring-yellow-400/30' : ''}`}
                        onClick={() => handleServiceToggle(service.id, !isSelected)}
                      >
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-start space-x-3 sm:space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              <Checkbox
                                id={service.id}
                                checked={isSelected}
                                onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                                className="w-5 h-5 sm:w-4 sm:h-4"
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Label htmlFor={service.id} className="font-bold text-sm sm:text-base cursor-pointer text-foreground leading-tight">
                                        {service.name}
                                      </Label>
                                      {service.popular && (
                                        <Badge className="bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5">Popular</Badge>
                                      )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                                  </div>

                                  <div className="flex flex-col items-end ml-2">
                                    <div className="text-base sm:text-lg font-bold text-primary">
                                      {discountedPrice.toLocaleString()} MZN
                                    </div>
                                    {service.savings && (
                                      <div className="text-xs text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                                        -{service.savings}% desconto
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                  {service.features.slice(0, isMobile ? 2 : 3).map((feature: string, index: number) => (
                                    <div key={index} className="flex items-center space-x-1.5 bg-green-50 dark:bg-green-900/10 rounded-full px-2 py-1">
                                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                      <span className="text-xs text-green-700 dark:text-green-300 font-medium">{feature}</span>
                                    </div>
                                  ))}
                                  {service.features.length > (isMobile ? 2 : 3) && (
                                    <div className="text-xs text-muted-foreground bg-gray-50 dark:bg-gray-800/50 rounded-full px-2 py-1">
                                      +{service.features.length - (isMobile ? 2 : 3)} mais
                                    </div>
                                  )}
                                </div>
                              </div>

                              {isSelected && (
                                <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-foreground">Quantidade:</span>
                                    <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 rounded-lg p-1 border shadow-sm">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuantityChange(service.id, quantity - 1);
                                        }}
                                        disabled={quantity <= 1}
                                        className="h-8 w-8 p-0 touch-manipulation"
                                      >
                                        <Minus className="w-4 h-4" />
                                      </Button>
                                      <span className="w-8 text-center font-bold text-base">{quantity}</span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleQuantityChange(service.id, quantity + 1);
                                        }}
                                        className="h-8 w-8 p-0 touch-manipulation"
                                      >
                                        <Plus className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
           </div>

           <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
             <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 border-b border-white/20">
                <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center">
                  <Calculator className="w-5 h-5 text-primary mr-2" />
                  <span className="hidden sm:inline">Resumo Final</span>
                  <span className="sm:hidden">Total</span>
                </h3>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                <div className="bg-gradient-to-r from-gray-50/50 to-slate-50/50 dark:from-gray-800/20 dark:to-slate-800/20 rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30 mb-4">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Resumo do Pedido</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Plano base</span>
                      <span className="font-semibold text-sm">{basePrice.toLocaleString()} MZN</span>
                    </div>

                    {selectedServices.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Extras ({selectedServices.length})</span>
                        <span className="font-semibold text-sm text-primary">+{(totalPrice - basePrice).toLocaleString()} MZN</span>
                      </div>
                    )}

                    {totalSavings > 0 && (
                      <div className="flex justify-between items-center text-green-600 bg-green-50/50 dark:bg-green-900/10 rounded-lg px-2 py-1">
                        <span className="text-sm font-medium">Desconto</span>
                        <span className="font-bold text-sm">-{totalSavings.toLocaleString()} MZN</span>
                      </div>
                    )}

                    <Separator className="bg-white/20 my-3" />

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground text-base">Total Final</span>
                      <span className="font-bold text-primary text-lg">
                        {finalPrice.toLocaleString()} MZN
                      </span>
                    </div>
                  </div>
                </div>

                {totalSavings > 0 && (
                  <div className="text-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 mb-4">
                    <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-300">
                      <Gift className="w-5 h-5" />
                      <span className="font-bold">Você economiza {totalSavings.toLocaleString()} MZN!</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handleRequestProposal}
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-[#22C55E] to-emerald-500 hover:from-[#16A34A] hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 rounded-xl font-bold text-sm sm:text-base touch-manipulation"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    <span className="hidden sm:inline">Solicitar Proposta</span>
                    <span className="sm:hidden">Solicitar Proposta</span>
                  </Button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      onClick={() => navigate(-1)}
                      variant="outline"
                      className="h-10 sm:h-12 border-2 border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-semibold rounded-xl text-sm touch-manipulation"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Voltar</span>
                      <span className="sm:hidden">Voltar</span>
                    </Button>

                    <Button
                      onClick={handleRequestProposal}
                      variant="outline"
                      className="h-10 sm:h-12 border-2 border-primary/30 hover:bg-primary/10 hover:border-primary text-primary hover:text-primary font-semibold rounded-xl text-sm touch-manipulation"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Conversar</span>
                      <span className="sm:hidden">Chat</span>
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 pt-2 border-t border-white/20">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-xs font-medium text-green-600">Garantia</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-primary">Entrega</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-blue-600">Suporte</span>
                  </div>
                </div>
              </div>
           </div>

           {selectedServices.length === 0 && (
             <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-2xl p-4 shadow-xl">
                <h4 className="font-bold text-foreground mb-2 text-center">Dúvidas?</h4>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Nossa equipe ajuda você a escolher os melhores extras
                </p>
                <Button
                  variant="outline"
                  className="w-full h-10 rounded-lg font-semibold border-green-500/50 hover:bg-green-500/10 hover:border-green-500 text-green-600 hover:text-green-700 text-sm"
                  onClick={() => window.open(`https://wa.me/${env.WHATSAPP_NUMBER}`, '_blank')}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Falar com Especialista
                </Button>
              </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default PlanCustomizer;