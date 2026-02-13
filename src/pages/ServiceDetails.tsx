import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { INDIVIDUAL_SERVICES, getWhatsAppMessage, Service } from '@/config/pricing';
import { env } from '@/config/env';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useAICredits } from '@/contexts/AICreditsContext';
import { AIToolsDashboard } from '@/components/AIToolsDashboard';
import { AICreditsModal } from '@/components/AICreditsModal';
import { ROICalculator } from '@/components/ROICalculator';
import { ImageEditor } from '@/components/ImageEditor';
import {
  ArrowLeft,
  Package,
  MessageCircle,
  Sparkles,
  Zap,
  Clock,
  Star,
  Shield,
  CreditCard,
  CheckCircle,
  TrendingUp,
  ShoppingCart,
  Heart,
  Eye,
  Share2,
  Award,
  Users,
  Globe,
  Image as ImageIcon,
  Smartphone,
  LogOut
} from 'lucide-react';

// GSM-specific interfaces
interface User {
  id: string;
  name: string;
  email: string;
  serviceAccess?: string;
  accessType?: string;
  partnerReferral?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
  whatsapp?: string;
}

const ServiceDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showGsmLogin, setShowGsmLogin] = useState(false);
  const [showAIDashboard, setShowAIDashboard] = useState(false);
  const [showAICreditsModal, setShowAICreditsModal] = useState(false);
  const [showROICalculator, setShowROICalculator] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const { credits, isLoading: creditsLoading } = useAICredits();

  // Detect mobile device for ScrollStack behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const serviceId = searchParams.get('id');
  const serviceTitle = searchParams.get('title') || 'Serviço';
  const serviceCategory = searchParams.get('category') || '';

  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    const foundService = INDIVIDUAL_SERVICES.find(s => s.id.toString() === serviceId);
    setService(foundService || null);
  }, [serviceId]);


  const handleViewPlans = () => {
    navigate('/#planos');
  };

  const handleSelectPlan = (planName: string, planPrice: string) => {
    if (!service) return;
    navigate(`/customize-plan?plan=${encodeURIComponent(planName)}&price=${planPrice}&service=${encodeURIComponent(service.title)}`);
  };

  const handleQuickPurchase = () => {
    if (!service) return;
    const amount = service.category === 'Produção Audiovisual' ? service.price : '';
    navigate(`/payment?service=${encodeURIComponent(service.title)}${amount ? `&amount=${amount}` : ''}&source=service-details`);
  };

  const handleContact = () => {
    if (!service) return;
    const message = getWhatsAppMessage('service', service.title);
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // GSM-specific handlers
  const handleGsmRent = () => {
    // Se usuário já está logado no site geral, vai direto para GSM dashboard
    if (isAuthenticated) {
      navigate('/gsm-dashboard');
    } else {
      // Senão, mostra modal de login GSM
      setShowGsmLogin(true);
    }
  };

  const handleGSMLogin = (credentials: LoginCredentials) => {
    // Create user session for GSM access
    const gsmUser: User = {
      id: 'gsm_user_' + Date.now(),
      name: credentials.email.split('@')[0],
      email: credentials.email,
      accessType: 'gsm-partner',
      partnerReferral: 'tchova-digital'
    };

    setShowGsmLogin(false);

    // Go to GSM dashboard after login
    navigate('/gsm-dashboard');
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 via-primary/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <Header />
        <div className="container relative z-10 mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-2xl font-bold mb-4 gradient-text">Serviço não encontrado</h1>
            <Button
              onClick={() => navigate('/')}
              className="w-full h-10 sm:h-12 rounded-lg sm:rounded-2xl font-semibold text-primary bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 hover:from-primary/20 hover:to-accent/20 hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-accent transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
            >
              <span className="hidden sm:inline">Voltar ao Início</span>
              <span className="sm:hidden">Voltar</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Early return if still loading
  if (creditsLoading) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 via-primary/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/5 to-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <Header />

      <main className="container relative z-10 mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 max-w-7xl">
        {/* Mobile-First Navigation */}
        <div className="mb-3 sm:mb-4 lg:mb-6">
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="h-11 sm:h-12 px-3 sm:px-4 rounded-xl backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/30 text-foreground hover:text-primary transition-all duration-300 flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Voltar</span>
              <span className="sm:hidden text-lg">←</span>
            </Button>

            {/* Service Category Badge - Always visible but responsive */}
            <Badge className="bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-md text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold flex-shrink-0">
              <span className="hidden sm:inline">{service.category}</span>
              <span className="sm:hidden">{service.category.split(' ')[0]}</span>
            </Badge>

            {/* GSM Status Badge - Only for GSM services when authenticated */}
            {service.category === 'Assistência GSM' && (isAdmin || isAuthenticated) && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg px-2 py-1 sm:px-3 sm:py-1.5 border border-green-200 dark:border-green-800 shadow-sm flex-shrink-0">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-green-800 dark:text-green-200">GSM Ativo</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 lg:space-y-10">
          {/* Hero Section - Unified responsive */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
            <div className="relative h-40 sm:h-56 lg:h-64 xl:h-72 overflow-hidden rounded-2xl lg:rounded-3xl">
              <img
                src={service.image}
                alt={`Imagem ilustrativa do serviço ${service.title} oferecido pela TchovaDigital`}
                className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-105 opacity-100' : 'scale-110 opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8">
                <Badge className="bg-gradient-to-r from-primary/90 to-accent/90 backdrop-blur-md text-white px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold shadow-2xl">
                  {service.category}
                </Badge>
              </div>

              <div className="absolute bottom-3 sm:bottom-4 lg:bottom-6 left-3 sm:left-4 lg:left-6 right-3 sm:right-4 lg:right-6">
                <div className="space-y-3 sm:space-y-4">
                  {service.category === 'Importação' ? (
                    <Button
                      onClick={handleContact}
                      className="w-full h-12 sm:h-14 lg:h-16 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg relative overflow-hidden group touch-manipulation"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 relative z-10 flex-shrink-0" />
                      <span className="hidden sm:inline relative z-10">Solicitar Consulta</span>
                      <span className="sm:hidden relative z-10">Consulta</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={service.category === 'Assistência GSM' ? handleGsmRent : handleQuickPurchase}
                      className="w-full h-12 sm:h-14 lg:h-16 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base lg:text-lg relative overflow-hidden group touch-manipulation"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      {service.category === 'Assistência GSM' ? (
                        <>
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 relative z-10 flex-shrink-0" />
                          <span className="hidden sm:inline relative z-10">Acessar Ferramentas GSM</span>
                          <span className="sm:hidden relative z-10">Acessar GSM</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 relative z-10 flex-shrink-0" />
                          <span className="hidden sm:inline relative z-10">Aderir Agora</span>
                          <span className="sm:hidden relative z-10">Aderir</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informações Essenciais */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl">
            <h2 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-foreground mb-3 sm:mb-4 lg:mb-6 flex items-center">
              <Sparkles className="w-4 h-4 sm:w-5 lg:w-6 text-primary mr-2 flex-shrink-0" />
              Sobre o Serviço
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed mb-3 sm:mb-4 lg:mb-6">
              {service.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-3 h-3 sm:w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">{service.features.length} recursos incluídos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 sm:w-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">Entrega: {service.deliveryTime}</span>
              </div>
            </div>
          </div>

          {/* Service-specific sections */}
          {service && service.category === 'Design Gráfico' && !creditsLoading && (
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-50/50 via-blue-50/50 to-cyan-50/50 dark:from-purple-900/10 dark:via-blue-900/10 dark:to-cyan-900/10 border border-purple-200/30 dark:border-purple-800/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-foreground mb-2 sm:mb-3 lg:mb-4 flex items-center">
                <Sparkles className="w-4 h-4 sm:w-5 text-purple-500 mr-2 flex-shrink-0" />
                <span className="hidden sm:inline">Crie design profissional em minutos com IA de última geração</span>
                <span className="sm:hidden">IA Design</span>
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 lg:mb-4">
                Pague só pelo que usar. Sem mensalidade. Ferramentas de IA treinadas com contexto moçambicano.
              </p>

              {/* Destaque de Capacidades AI */}
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3 mb-3 sm:mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  🚀 O que você pode fazer com a IA
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-2 text-center">
                    <div className="text-lg mb-1">🎨</div>
                    <span>Logos</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-2 text-center">
                    <div className="text-lg mb-1">📱</div>
                    <span>Posts</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-2 text-center">
                    <div className="text-lg mb-1">🏪</div>
                    <span>Banners</span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-lg p-2 text-center">
                    <div className="text-lg mb-1">✏️</div>
                    <span>Edição</span>
                  </div>
                </div>
              </div>

              {/* IA vs Designer Humano */}
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3 mb-3 sm:mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  🤖 IA ou Designer Humano?
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  A IA é rápida e barata para projetos simples. Para designs premium e personalizados, nossos designers profissionais estão à disposição.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs h-8"
                  onClick={() => window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Gostaria de falar com um designer profissional para um projeto personalizado.')}`, '_blank')}
                >
                  Falar com Designer
                </Button>
              </div>

              {/* Templates Prontos */}
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3 mb-3 sm:mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  📋 Templates Prontos para Vender
                </h4>
                <p className="text-xs text-muted-foreground mb-2">
                  Templates otimizados para converter visitantes em clientes com linguagem jovem e elementos locais.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-2 text-center hover:bg-green-500/20 transition-colors cursor-pointer">
                    <div className="text-lg mb-1">🍕</div>
                    <span>Restaurantes</span>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-2 text-center hover:bg-blue-500/20 transition-colors cursor-pointer">
                    <div className="text-lg mb-1">👕</div>
                    <span>Moda</span>
                  </div>
                  <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-lg p-2 text-center hover:bg-pink-500/20 transition-colors cursor-pointer">
                    <div className="text-lg mb-1">💄</div>
                    <span>Beleza</span>
                  </div>
                </div>
              </div>

              {/* Saldo de Créditos */}
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    <span className="text-xs sm:text-sm font-medium">
                      <span className="hidden sm:inline">Créditos IA:</span>
                      <span className="sm:hidden">Créditos:</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Badge variant="secondary" className="text-xs">{credits && credits.balance ? credits.balance : 0} MZN</Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAICreditsModal(true)}
                      className="text-xs h-7 px-2"
                    >
                      + Add
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Use créditos apenas quando gerar ou editar designs. Sem custos ocultos.</p>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    onClick={() => setShowAIDashboard(true)}
                    className="h-10 sm:h-11 lg:h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base relative overflow-hidden group touch-manipulation"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <Sparkles className="w-4 h-4 sm:w-5 mr-2 relative z-10 flex-shrink-0" />
                    <span className="hidden sm:inline relative z-10">Ferramentas IA</span>
                    <span className="sm:hidden relative z-10">IA</span>
                  </Button>

                  <Button
                    onClick={() => setShowImageEditor(true)}
                    variant="outline"
                    className="h-10 sm:h-11 lg:h-12 border-purple-500/30 hover:bg-purple-500/10 hover:border-purple-500 text-purple-600 hover:text-purple-700 font-semibold text-sm sm:text-base touch-manipulation"
                  >
                    <ImageIcon className="w-4 h-4 sm:w-5 mr-2 flex-shrink-0" />
                    <span className="hidden sm:inline">Editar Imagens</span>
                    <span className="sm:hidden">Editar</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center leading-tight">
                  Gere logos, posts, banners e edite imagens com IA treinada no mercado moçambicano
                </p>
              </div>
            </div>
          )}

          {/* Desenvolvimento Web */}
          {service.category === 'Desenvolvimento Web' && (
            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-50/50 via-cyan-50/50 to-teal-50/50 dark:from-blue-900/10 dark:via-cyan-900/10 dark:to-teal-900/10 border border-blue-200/30 dark:border-blue-800/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-foreground mb-2 sm:mb-3 lg:mb-4 flex items-center">
                <span className="text-blue-500 mr-2 text-lg sm:text-xl flex-shrink-0">💻</span>
                <span className="hidden sm:inline">Demo Interativo</span>
                <span className="sm:hidden">Demo Web</span>
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 lg:mb-4">
                Veja uma prévia das tecnologias que utilizamos nos seus projetos.
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 sm:p-3 text-center hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                    <div className="text-xl sm:text-2xl mb-1">⚛️</div>
                    <div className="text-xs font-semibold">React</div>
                  </div>
                  <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 sm:p-3 text-center hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                    <div className="text-xl sm:text-2xl mb-1">📱</div>
                    <div className="text-xs font-semibold">Mobile-First</div>
                  </div>
                  <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 sm:p-3 text-center hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                    <div className="text-xl sm:text-2xl mb-1">🔗</div>
                    <div className="text-xs font-semibold">APIs Locais</div>
                  </div>
                  <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 sm:p-3 text-center hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                    <div className="text-xl sm:text-2xl mb-1">🚀</div>
                    <div className="text-xs font-semibold">Performance</div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full h-9 sm:h-10 border-blue-500/30 hover:bg-blue-500/10 hover:border-blue-500 text-blue-600 hover:text-blue-700 text-sm sm:text-base touch-manipulation"
                  onClick={() => window.open('https://tchova-digital.vercel.app', '_blank')}
                >
                  <span className="hidden sm:inline">VER PORTFÓLIO WEB</span>
                  <span className="sm:hidden">VER PORTFÓLIO</span>
                </Button>
              </div>
            </div>
          )}

          {/* Marketing Digital */}
          {service.category === 'Marketing Digital' && (
            <div className="backdrop-blur-xl bg-gradient-to-br from-green-50/50 via-emerald-50/50 to-teal-50/50 dark:from-green-900/10 dark:via-emerald-900/10 dark:to-teal-900/10 border border-green-200/30 dark:border-green-800/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-foreground mb-2 sm:mb-3 lg:mb-4 flex items-center">
                <span className="text-green-500 mr-2 text-lg sm:text-xl flex-shrink-0">📊</span>
                <span className="hidden sm:inline">Ferramentas de Marketing</span>
                <span className="sm:hidden">Ferramentas</span>
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 lg:mb-4">
                Ferramentas práticas para calcular ROI e planejar campanhas.
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <Button
                    variant="outline"
                    className="h-9 sm:h-10 border-green-500/30 hover:bg-green-500/10 hover:border-green-500 text-green-600 hover:text-green-700 text-sm sm:text-base touch-manipulation"
                    onClick={() => setShowROICalculator(true)}
                  >
                    📈 Calculadora ROI
                  </Button>
                  <Button
                    variant="outline"
                    className="h-9 sm:h-10 border-green-500/30 hover:bg-green-500/10 hover:border-green-500 text-green-600 hover:text-green-700 text-sm sm:text-base touch-manipulation"
                    onClick={() => {/* TODO: Abrir planner */}}
                  >
                    📅 Planner
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* GSM */}
          {service.category === 'Assistência GSM' && (
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-50/50 via-indigo-50/50 to-blue-50/50 dark:from-purple-900/10 dark:via-indigo-900/10 dark:to-blue-900/10 border border-purple-200/30 dark:border-purple-800/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-foreground mb-2 sm:mb-3 lg:mb-4 flex items-center">
                <span className="text-purple-500 mr-2 text-lg sm:text-xl flex-shrink-0">🔧</span>
                <span className="hidden sm:inline">Ferramentas GSM Disponíveis</span>
                <span className="sm:hidden">Ferramentas GSM</span>
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 lg:mb-4">
                Acesso a mais de 500 ferramentas profissionais para reparações avançadas.
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 sm:p-3 text-center hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                    <div className="text-xl sm:text-2xl mb-1">📱</div>
                    <div className="text-xs font-semibold">Desbloqueio</div>
                  </div>
                  <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 sm:p-3 text-center hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                    <div className="text-xl sm:text-2xl mb-1">🔄</div>
                    <div className="text-xs font-semibold">Flashing</div>
                  </div>
                  <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 sm:p-3 text-center hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                    <div className="text-xl sm:text-2xl mb-1">📞</div>
                    <div className="text-xs font-semibold">IMEI</div>
                  </div>
                  <div className="bg-white/20 dark:bg-black/20 rounded-lg p-2 sm:p-3 text-center hover:bg-white/30 dark:hover:bg-black/30 transition-colors">
                    <div className="text-xl sm:text-2xl mb-1">🛠️</div>
                    <div className="text-xs font-semibold">Reparações</div>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-2 sm:p-3">
                  <div className="text-xs sm:text-sm text-center leading-tight">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">500+ Ferramentas</span>
                    <span className="text-muted-foreground ml-1 sm:ml-2">•</span>
                    <span className="text-muted-foreground ml-1 sm:ml-2">Suporte 24/7</span>
                    <span className="text-muted-foreground ml-1 sm:ml-2">•</span>
                    <span className="text-muted-foreground ml-1 sm:ml-2">Atualizações</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Importação */}
          {service.category === 'Importação' && (
            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-50/50 via-cyan-50/50 to-teal-50/50 dark:from-blue-900/10 dark:via-cyan-900/10 dark:to-teal-900/10 border border-blue-200/30 dark:border-blue-800/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
              <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-foreground mb-2 sm:mb-3 lg:mb-4 flex items-center">
                <span className="text-blue-500 mr-2 text-lg sm:text-xl flex-shrink-0">🔄</span>
                <span className="hidden sm:inline">Como Funciona a Importação</span>
                <span className="sm:hidden">Como Funciona</span>
              </h3>

              {/* Explicação do Serviço */}
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3 mb-3 sm:mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  ℹ️ Sobre o Serviço
                </h4>
                <p className="text-xs text-muted-foreground leading-tight">
                  Este serviço funciona por consulta. Após análise e confirmação, o pagamento é realizado pela TchovaDigital e a importação é acompanhada num sistema privado até a chegada do produto.
                </p>
              </div>

              {/* 5-Step Process */}
              <div className="bg-white/10 dark:bg-black/10 rounded-lg p-3 mb-3 sm:mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  📋 Processo em 5 Etapas
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">1</div>
                    <span>CONSULTA - Cliente solicita análise do produto</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">2</div>
                    <span>ANÁLISE - TchovaDigital analisa e valida fornecedor</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">3</div>
                    <span>PROPOSTA - Envia orçamento final em metical</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">4</div>
                    <span>CONFIRMAÇÃO - Cliente aceita proposta</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-5 h-5 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">5</div>
                    <span>ATIVAÇÃO - Sistema de acompanhamento é ativado</span>
                  </div>
                </div>
              </div>

              {/* Importante - Pagamento */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-3 mb-3 sm:mb-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  💳 Importante - Pagamento
                </h4>
                <p className="text-xs text-muted-foreground leading-tight">
                  O pagamento só acontece após a aprovação da proposta. A importação é iniciada apenas depois da confirmação do pagamento via API TchovaDigital.
                </p>
              </div>

              {/* Sistema Privado */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-3">
                <h4 className="text-sm font-semibold mb-2 flex items-center">
                  🔒 Sistema Privado de Acompanhamento
                </h4>
                <p className="text-xs text-muted-foreground leading-tight">
                  O sistema de acompanhamento é ativado apenas após o pagamento confirmado. Importações externas não têm acesso ao sistema.
                </p>
              </div>
            </div>
          )}

          {/* Benefícios */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-xl">
            <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-foreground mb-2 sm:mb-3 lg:mb-4 flex items-center">
              <TrendingUp className="w-4 h-4 sm:w-5 text-green-500 mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Principais Benefícios</span>
              <span className="sm:hidden">Benefícios</span>
            </h3>

            {/* Audiovisual Event Packages */}
            {service.category === 'Produção Audiovisual' ? (
              <div className="space-y-4">
                {/* Pacote Básico */}
                <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-xl p-4 border border-blue-200/30 dark:border-blue-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-blue-800 dark:text-blue-200">🎬 Pacote Básico</h4>
                    <span className="font-bold text-blue-600">10.000 MZN</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Filmagem de vídeos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Seção fotográfica</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Edição de vídeo</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>USB de Fotos + Vídeo</span>
                    </div>
                  </div>
                </div>

                {/* Pacote Médio */}
                <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl p-4 border border-green-200/30 dark:border-green-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-green-800 dark:text-green-200">🎥 Pacote Médio</h4>
                    <span className="font-bold text-green-600">15.000 MZN</span>
                  </div>
                  <div className="text-sm">
                    <span>Todos os benefícios do Básico + </span>
                    <span className="font-semibold text-green-700">Fogo de artifício</span>
                  </div>
                </div>

                {/* Pacote Clássico */}
                <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-xl p-4 border border-purple-200/30 dark:border-purple-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-purple-800 dark:text-purple-200">🎪 Pacote Clássico</h4>
                    <span className="font-bold text-purple-600">25.000 MZN</span>
                  </div>
                  <div className="text-sm">
                    <span>Todos os benefícios do Básico + </span>
                    <span className="font-semibold text-purple-700">Bolas de Fumaça</span>
                  </div>
                </div>

                {/* Pacote VIP */}
                <div className="bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-900/10 dark:to-orange-900/10 rounded-xl p-4 border border-yellow-200/30 dark:border-yellow-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-yellow-800 dark:text-yellow-200">👑 Pacote VIP</h4>
                    <span className="font-bold text-yellow-600">35.000 MZN</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      <span>Filmagem com drone</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      <span>Bolas de Fumaça</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      <span>Fogo de artifício</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                      <span>USB completo</span>
                    </div>
                  </div>
                </div>

                {/* Adicionais */}
                <div className="bg-gradient-to-r from-gray-50/50 to-slate-50/50 dark:from-gray-800/20 dark:to-slate-800/20 rounded-xl p-4 border border-gray-200/30 dark:border-gray-700/30">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-2">Adicionais Disponíveis</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">Filmagem com drone</div>
                      <div className="text-green-600 font-bold">5.000 MZN</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Bolas de Fumaça</div>
                      <div className="text-green-600 font-bold">5.000 MZN</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">Fogo de artifício</div>
                      <div className="text-green-600 font-bold">5.000 MZN</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Benefits grid - responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.benefits.slice(0, 6).map((benefit: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-lg p-3 border border-green-200/30 dark:border-green-800/30">
                      <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-2 flex-shrink-0 shadow-sm" />
                      <span className="text-foreground text-sm leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Show more indicator if there are more benefits */}
                {service.benefits.length > 6 && (
                  <div className="text-center mt-4">
                    <span className="text-xs text-muted-foreground bg-white/10 rounded-full px-3 py-1">
                      +{service.benefits.length - 6} benefícios adicionais
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* CTA Section */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-primary/5 via-accent/5 to-white/5 border-2 border-primary/20 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-4 sm:p-6 border-b border-white/20">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground text-center">
                <span className="hidden sm:inline">Pronto para começar?</span>
                <span className="sm:hidden">Vamos começar!</span>
              </h3>
              <p className="text-muted-foreground text-center mt-1 text-xs sm:text-sm">
                <span className="hidden sm:inline">Invista no seu negócio hoje</span>
                <span className="sm:hidden">Invista hoje mesmo</span>
              </p>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Price Display - Only for Audiovisual */}
              {service.category === 'Produção Audiovisual' && (
                <div className="text-center bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-4 border border-primary/10">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {service.price.toLocaleString()} MZN
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{service.priceNote}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-4">
                {/* Primary Action */}
                {service.category === 'Importação' ? (
                  <Button
                    onClick={handleContact}
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold text-sm sm:text-base lg:text-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 relative z-10" />
                    <span className="hidden sm:inline relative z-10">Solicitar Consulta</span>
                    <span className="sm:hidden relative z-10">Consulta</span>
                  </Button>
                ) : service.category === 'Assistência GSM' ? (
                  <Button
                    onClick={handleGsmRent}
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold text-sm sm:text-base lg:text-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 relative z-10" />
                    <span className="hidden sm:inline relative z-10">
                      {isAuthenticated ? 'Acessar GSM Dashboard' : 'Alugar Ferramentas GSM'}
                    </span>
                    <span className="sm:hidden relative z-10">
                      {isAuthenticated ? 'GSM Dashboard' : 'Alugar GSM'}
                    </span>
                  </Button>
                ) : (
                  <Button
                    onClick={handleQuickPurchase}
                    className="w-full h-12 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl font-bold text-sm sm:text-base lg:text-lg relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 relative z-10" />
                    <span className="hidden sm:inline relative z-10">
                      {service.category === 'Produção Audiovisual' ? 'PEDIR ORÇAMENTO' :
                       service.category === 'Marketing Digital' ? 'PEDIR ORÇAMENTO' :
                       service.category === 'Desenvolvimento Web' ? 'PEDIR ORÇAMENTO' :
                       service.category === 'Assistência GSM' ? 'ALUGAR FERRAMENTAS' :
                       'CRIAR MEU DESIGN AGORA'}
                    </span>
                    <span className="sm:hidden relative z-10">
                      {service.category === 'Produção Audiovisual' ? 'Orçamento' :
                       service.category === 'Marketing Digital' ? 'Orçamento' :
                       service.category === 'Desenvolvimento Web' ? 'Orçamento' :
                       service.category === 'Assistência GSM' ? 'Alugar' :
                       'Criar Design'}
                    </span>
                  </Button>
                )}

                {/* Secondary Actions - Simplified */}
                {service.category !== 'Importação' && (
                  <div className="grid grid-cols-1 gap-3">
                    {/* Contact */}
                    <Button
                      onClick={handleContact}
                      variant="outline"
                      className="h-10 sm:h-12 border-2 border-green-500/30 hover:bg-green-500/10 hover:border-green-500 text-green-600 hover:text-green-700 font-semibold rounded-xl text-xs sm:text-sm transition-all duration-300"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">WhatsApp</span>
                      <span className="sm:hidden">WhatsApp</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Botão Flutuante para Recarregar Créditos - Mobile */}
      {service && service.category === 'Design Gráfico' && isMobile && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            onClick={() => setShowAICreditsModal(true)}
            className="h-12 w-12 rounded-full bg-purple-500 hover:bg-purple-600 shadow-lg"
            size="sm"
          >
            <CreditCard className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* GSM Login Modal */}
      {showGsmLogin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6 pt-6 px-6">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📱</span>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold mb-2 gradient-text">
                GSM Premium
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                Ferramentas GSM profissionais
              </p>
            </div>

            <div className="px-6 pb-6">
              <h3 className="text-base font-bold mb-3 flex items-center">
                <span className="mr-2">🔐</span>
                Criar Conta
              </h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                handleGSMLogin({
                  email: formData.get('email') as string,
                  password: formData.get('password') as string,
                  whatsapp: formData.get('whatsapp') as string
                });
              }} className="space-y-3">
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="E-mail"
                />
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="WhatsApp"
                />
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Palavra-passe"
                />
                <button
                  type="submit"
                  className="w-full neo hover-lift px-3 py-3 rounded-lg font-semibold text-sm transition-all duration-300"
                >
                  Criar conta
                </button>
              </form>

              <div className="mt-6">
                <h3 className="text-sm font-bold mb-3 flex items-center">
                  <span className="mr-2">💰</span>
                  Adicionar Saldo
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    onClick={() => navigate('/payment?service=GSM%20Saldo%20-%20500&amount=500')}
                    className="neo hover-lift px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300"
                  >
                    500 MZN
                  </button>
                  <button
                    onClick={() => navigate('/payment?service=GSM%20Saldo%20-%201000&amount=1000')}
                    className="neo hover-lift px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300"
                  >
                    1000 MZN
                  </button>
                  <button
                    onClick={() => navigate('/payment?service=GSM%20Saldo%20-%202000&amount=2000')}
                    className="neo hover-lift px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300"
                  >
                    2000 MZN
                  </button>
                  <button
                    onClick={() => {
                      const message = encodeURIComponent(`Olá! Gostaria de adicionar saldo ao meu GSM.`);
                      window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center justify-center"
                  >
                    <span>💳</span>
                    Outros
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate('/gsm-dashboard')}
                    className="neo hover-lift px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center justify-center"
                  >
                    <span className="mr-1">🔧</span>
                    GSM
                  </button>
                  <button
                    onClick={() => {
                      const message = encodeURIComponent(`Olá! Preciso de suporte GSM.`);
                      window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-3 rounded-lg font-semibold text-xs transition-all duration-300 flex items-center justify-center"
                  >
                    <span className="mr-1">💬</span>
                    Suporte
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  try {
                    setShowGsmLogin(false);
                    // Limpar qualquer estado GSM se necessário
                  } catch (error) {
                    console.error('Erro ao fechar modal GSM:', error);
                    // Fallback forçado
                    setShowGsmLogin(false);
                  }
                }}
                className="w-full mt-4 neo hover-lift px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center"
              >
                ← Voltar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Tools Dashboard Modal */}
      {showAIDashboard && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-background rounded-xl sm:rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold gradient-text">Ferramentas de IA</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAIDashboard(false)}
                  className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10 p-0"
                >
                  ✕
                </Button>
              </div>
              <AIToolsDashboard onClose={() => setShowAIDashboard(false)} />
            </div>
          </div>
        </div>
      )}

      {/* AI Credits Modal */}
      <AICreditsModal
        isOpen={showAICreditsModal}
        onClose={() => setShowAICreditsModal(false)}
      />

      {/* ROI Calculator Modal */}
      {showROICalculator && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-background rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold gradient-text">Calculadora de ROI</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowROICalculator(false)}
                  className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10 p-0"
                >
                  ✕
                </Button>
              </div>
              <ROICalculator onClose={() => setShowROICalculator(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Image Editor Modal */}
      {showImageEditor && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-background rounded-xl sm:rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold gradient-text">Editor de Imagens IA</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageEditor(false)}
                  className="text-muted-foreground hover:text-foreground h-8 w-8 sm:h-10 sm:w-10 p-0"
                >
                  ✕
                </Button>
              </div>
              <ImageEditor onClose={() => setShowImageEditor(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetails;