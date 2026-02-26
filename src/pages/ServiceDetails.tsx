import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import ProjectStatus from '@/components/ProjectStatus';
import BotaoPagamentoMagico from '@/components/BotaoPagamentoMagico';
import { GSMServicePage } from '@/components/gsm';
import { INDIVIDUAL_SERVICES, getWhatsAppMessage, Service } from '@/config/pricing';
import { env } from '@/config/env';
import {
  ArrowLeft,
  MessageCircle,
  CheckCircle,
  Users,
  Award,
  TrendingUp,
  Star,
  Clock,
  Globe,
  Building,
  Shield,
  Headphones,
  Rocket,
  Target,
  Sparkles,
  ArrowRight,
  Phone,
  Lock,
  BarChart3,
  Lightbulb,
  ThumbsUp,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Video,
  Camera,
  Film,
  Sparkle,
  Package,
  Plus,
  CreditCard,
  Wallet,
  Calendar,
  Zap,
  Crown,
  Mountain,
  Search,
  FileText,
  CheckCircle2,
  Eye,
  Truck,
  Box,
  User,
  DollarSign,
  MapPin,
  ShieldCheck,
  RefreshCw,
  ArrowRightCircle,
  ClipboardList,
  Handshake,
  PackageOpen,
  AlertCircle,
  SearchCheck,
  ClipboardCheck,
  Activity,
  LockKeyhole,
  Info,
  Timer,
  Palette,
  PenTool,
  Image,
  Layout,
  FileImage,
  Printer,
  Shirt,
  Instagram,
  Facebook,
  Megaphone,
  Play,
  Smartphone
} from 'lucide-react';

const ServiceDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [benefitsSlide, setBenefitsSlide] = useState(0);
  const benefitsPerView = 2;
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [showExtras, setShowExtras] = useState(false);
  const packagesRef = useRef<HTMLDivElement>(null);

  // Detect mobile device
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
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    const foundService = INDIVIDUAL_SERVICES.find(s => s.id.toString() === serviceId);
    setService(foundService || null);
  }, [serviceId]);

  const handleContact = () => {
    if (!service) return;
    const message = getWhatsAppMessage('service', service.title);
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handlePayment = () => {
    if (!service) return;
    
    // Check if payment is authorized
    const payParam = searchParams.get('pay');
    if (payParam === 'enabled') {
      navigate(`/checkout/seguro?serviceId=${service.id}&serviceTitle=${encodeURIComponent(service.title)}&serviceCategory=${encodeURIComponent(service.category)}&project=${service.id}`);
    } else {
      // If not authorized, redirect to contact
      handleContact();
    }
  };

  const handleBenefitsNext = () => {
    if (!service) return;
    setBenefitsSlide((prev) => Math.min(prev + 1, Math.ceil(service.benefits.slice(0, 6).length / benefitsPerView) - 1));
  };

  const handleBenefitsPrev = () => {
    setBenefitsSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleBenefitsDotClick = (index: number) => {
    setBenefitsSlide(index);
  };

  const scrollToPackages = () => {
    packagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRequestQuote = (packageName: string, price: number) => {
    const extras = selectedExtras.map(e => `\n- ${e}`).join('');
    const message = `Olá! Gostaria de pedir um orçamento para Produção Audiovisual.\n\nPacote: ${packageName}\nValor base: ${price.toLocaleString('pt-MZ')} MZN${selectedExtras.length > 0 ? `\nAdicionais:${extras}` : ''}\n\nPodem entrar em contacto para alinharmos os detalhes?`;
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const toggleExtra = (extra: string) => {
    setSelectedExtras(prev => 
      prev.includes(extra) 
        ? prev.filter(e => e !== extra)
        : [...prev, extra]
    );
  };

  // ========================================
  // SISTEMA DE AUTORIZAÇÃO DE PAGAMENTO
  // ========================================
  // Todos os hooks DEVEM estar antes de qualquer return antecipado
  // para evitar o erro "Rendered more hooks than during the previous render"
  
  const authorizationToken = searchParams.get('token');
  const payParam = searchParams.get('pay');
  const tokenServiceId = searchParams.get('serviceId');
  const tokenPrice = searchParams.get('price');
  const tokenExpiry = searchParams.get('expires');
  
  // Verificar se o token é válido (não expirado)
  const isTokenValid = useMemo(() => {
    if (!authorizationToken) return false;
    if (!tokenExpiry) return true; // Sem data de expiração = válido
    const expiryDate = new Date(tokenExpiry);
    return expiryDate > new Date();
  }, [authorizationToken, tokenExpiry]);
  
  // Verificar se o serviço corresponde ao token
  const isServiceMatch = useMemo(() => {
    if (!authorizationToken) return false;
    if (!tokenServiceId) return true; // Sem ID específico = qualquer serviço
    return tokenServiceId === serviceId;
  }, [authorizationToken, tokenServiceId, serviceId]);
  
  // Autorização válida
  const hasAuthorization = (payParam === 'enabled' || !!authorizationToken) && isTokenValid && isServiceMatch;
  
  // Preço acordado (do token ou fallback)
  const agreedPrice = tokenPrice ? parseInt(tokenPrice, 10) : 0;
  
  // Tipo de pagamento
  const paymentType = searchParams.get('paymentType') as 'entry-50' | 'full' | 'final-50' | 'installment' || 'entry-50';
  
  // Status do pagamento (validado externamente)
  const paymentStatusParam = searchParams.get('status') as 'pending' | 'paid' | 'started' || 'pending';

  // Check payment authorization (legacy - mantido para compatibilidade)
  const isPaymentAuthorized = hasAuthorization;

  // Check payment status for Project Status section
  // Values: 'entry-50' | 'full' | 'final'
  const paymentStatus = searchParams.get('paid');
  const hasPayment = !!paymentStatus;
  const paymentAmount = searchParams.get('amount');
  const paymentDate = searchParams.get('date');
  const projectId = searchParams.get('projectId') || searchParams.get('project');

  // Determine current project stage based on payment status
  const getProjectStage = () => {
    if (paymentStatus === 'entry-50') return 2; // Pagamento Recebido (entrada)
    if (paymentStatus === 'full') return 2; // Pagamento Recebido (completo)
    if (paymentStatus === 'final') return 5; // Entrega Final
    return 1; // Acordo Confirmado
  };

  const currentStage = getProjectStage();

  // Project stages for timeline
  const projectStages = [
    { id: 1, title: 'Acordo Confirmado', description: 'Proposta aceite', icon: <Handshake className="w-4 h-4" /> },
    { id: 2, title: 'Pagamento Recebido', description: 'Pagamento confirmado', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 3, title: 'Em Desenvolvimento', description: 'Equipa trabalhando', icon: <Rocket className="w-4 h-4" /> },
    { id: 4, title: 'Em Revisão', description: 'Aguardando aprovação', icon: <Eye className="w-4 h-4" /> },
    { id: 5, title: 'Entrega Final', description: 'Projeto concluído', icon: <Package className="w-4 h-4" /> }
  ];

  // Pacotes de Produção Audiovisual
  const audiovisualPackages = [
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

  // Derivar variáveis de categoria do serviço (após service estar disponível)
  const isAudiovisual = service?.category === 'Produção Audiovisual';
  const isImportacao = service?.category === 'Importação';
  const isGSM = service?.category === 'Assistência GSM';
  const isDesignGrafico = service?.category === 'Design Gráfico';
  const isWebsites = service?.category === 'Desenvolvimento Web';
  const isMarketing = service?.category === 'Marketing Digital';

  // Retorno antecipado DEPOIS de todos os hooks
  if (!service) {
    return (
      <div className="min-h-screen bg-background relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 via-primary/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <Header />
        <div className="container relative z-10 mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-[48px] p-8 shadow-xl">
            <h1 className="text-2xl font-bold mb-4 gradient-text">Serviço não encontrado</h1>
            <Button
              onClick={() => navigate('/')}
              className="w-full h-12 rounded-[24px] font-semibold text-primary bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 hover:from-primary/20 hover:to-accent/20 hover:text-white hover:bg-gradient-to-r hover:from-primary hover:to-accent transition-all duration-400 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Voltar ao Início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/8 via-cyan-400/6 to-purple-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tr from-emerald-500/8 via-teal-400/6 to-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-gradient-to-r from-pink-500/6 to-rose-400/8 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-white/3 via-transparent to-transparent rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="container relative z-10 mx-auto px-4 pt-20 pb-6 max-w-5xl">
        {/* Service Content */}

        {/* GSM Service - New Modern Liquid Glass Design */}
        {isGSM ? (
          <GSMServicePage />
        ) : isDesignGrafico ? (
          // Design Gráfico Hero - Special Visual - Mobile First Responsive
          <div className="tech-card overflow-hidden mb-8 sm:mb-12 lg:mb-20 rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] shadow-xl border border-primary/20 relative">
            {/* Creative Background with Brand Colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 via-brand-dark/10 to-brand-yellow/20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
            </div>
            
            {/* Bento Grid Layout - Mobile First */}
            <div className="relative p-4 sm:p-6 lg:p-8">
              {/* Mobile Bento Grid (< 640px) - UX Mega Ultra Otimizado */}
              <div className="sm:hidden space-y-6">
                {/* Title Card - Full Width */}
                <div className="bg-brand-dark/95 backdrop-blur-lg rounded-[2rem] p-7 border-2 border-white/30 animate-fade-in shadow-2xl">
                  <h1 className="text-[1.75rem] font-extrabold text-white mb-3 leading-tight">
                    <span className="bg-gradient-to-r from-brand-green via-brand-bright to-brand-yellow bg-clip-text text-transparent drop-shadow-lg">
                      Design Gráfico
                    </span>
                  </h1>
                  <p className="text-base text-white/95 leading-relaxed font-medium">
                    Criamos a identidade visual da sua marca com criatividade e impacto
                  </p>
                </div>
                
                {/* Bento Grid 2x3 - UX Mobile Mega Ultra Otimizado */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Card 1 - Logo */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-primary/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-primary hover:shadow-primary/30 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.3)]"
                    style={{ animationDelay: '0.1s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-primary to-primary-darker rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Palette className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Logotipos</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Identidade</span>
                  </div>
                  
                  {/* Card 2 - Cartão */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-dark/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-dark hover:shadow-brand-dark/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-dark),0.3)]"
                    style={{ animationDelay: '0.15s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-dark to-brand-dark rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <CreditCard className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Cartões</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Com QR</span>
                  </div>
                  
                  {/* Card 3 - Redes Sociais */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-yellow/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-yellow hover:shadow-brand-yellow/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-yellow),0.3)]"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-yellow to-accent-light rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Instagram className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Social Media</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Posts</span>
                  </div>
                  
                  {/* Card 4 - Banners */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-green/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-green hover:shadow-brand-green/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-green),0.3)]"
                    style={{ animationDelay: '0.25s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-green to-brand-green rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <FileImage className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Banners</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Flyers</span>
                  </div>
                  
                  {/* Card 5 - Publicidade Ads */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-primary/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-primary hover:shadow-primary/30 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.3)]"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-primary to-primary-darker rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Megaphone className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Ads</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Publicidade</span>
                  </div>
                  
                  {/* Card 6 - Motion Design */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-yellow/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-yellow hover:shadow-brand-yellow/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-yellow),0.3)]"
                    style={{ animationDelay: '0.35s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-yellow to-accent-light rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Play className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Motion</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Vídeo</span>
                  </div>
                </div>
                
                {/* CTA Button - Full Width */}
                <Button
                  onClick={() => document.getElementById('o-que-criamos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full rounded-[1.75rem] py-6 px-10 font-extrabold transition-all duration-150 ease-out bg-gradient-to-r from-primary to-primary-darker hover:from-[primary-dark] hover:to-primary-darker text-white shadow-2xl hover:shadow-primary/40 active:scale-[0.92] active:shadow-lg h-[4.5rem] text-xl relative overflow-hidden group animate-fade-in touch-manipulation will-change-transform"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <svg viewBox="0 0 24 24" className="w-7 h-7 mr-3 relative z-10 group-hover:scale-110 transition-transform duration-150" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor" className="group-hover:animate-pulse"/>
                  </svg>
                  <span className="relative z-10 tracking-tight">Ver o que criamos</span>
                </Button>
              </div>

              {/* Desktop Bento Grid (>= 640px) */}
              <div className="hidden sm:grid sm:grid-cols-4 sm:gap-4 lg:gap-6">
                {/* Left Column - Logo Card (spans 2 rows) */}
                <div className="sm:row-span-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 lg:p-8 flex flex-col items-center justify-center border border-primary/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary to-primary-darker rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Palette className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <span className="text-base lg:text-lg font-bold text-gray-800 text-center">Logotipos</span>
                  <span className="text-sm text-gray-500 mt-1">Identidade visual</span>
                </div>
                
                {/* Top Row - Cartão */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-dark/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-dark to-brand-dark rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CreditCard className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Cartões</span>
                  <span className="text-xs text-gray-500 mt-0.5">Com QR</span>
                </div>
                
                {/* Top Row - Social Media */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-yellow/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-yellow to-accent-light rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Instagram className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Social</span>
                  <span className="text-xs text-gray-500 mt-0.5">Posts</span>
                </div>
                
                {/* Top Row - Banners */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-green/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-green to-brand-green rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileImage className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Banners</span>
                  <span className="text-xs text-gray-500 mt-0.5">Flyers</span>
                </div>
                
                {/* Bottom Row - Title Card (spans 2 columns) */}
                <div className="sm:col-span-2 bg-brand-dark/90 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 flex flex-col items-center justify-center">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight text-center">
                    <span className="bg-gradient-to-r from-primary via-brand-green to-brand-yellow bg-clip-text text-transparent">
                      Design Gráfico
                    </span>
                  </h1>
                  <p className="text-sm lg:text-base text-white/90 leading-relaxed text-center">
                    Criamos a identidade visual da sua marca com criatividade e impacto
                  </p>
                </div>
                
                {/* Bottom Row - Ads */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-primary/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-primary-darker rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Megaphone className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Ads</span>
                  <span className="text-xs text-gray-500 mt-0.5">Publicidade</span>
                </div>
                
                {/* Bottom Row - Motion */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-yellow/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-yellow to-accent-light rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Play className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Motion</span>
                  <span className="text-xs text-gray-500 mt-0.5">Vídeo</span>
                </div>
              </div>
              
              {/* CTA Button - Desktop (>= 640px) */}
              <div className="hidden sm:block mt-4 lg:mt-6">
                <Button
                  onClick={() => document.getElementById('o-que-criamos')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full rounded-2xl py-3 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-primary-darker hover:from-[primary-dark] hover:to-primary-darker text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] h-12 lg:h-14 text-base lg:text-lg relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 lg:w-6 lg:h-6 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor" className="group-hover:animate-pulse"/>
                  </svg>
                  <span className="relative z-10">Ver o que criamos</span>
                </Button>
              </div>
            </div>
          </div>
        ) : isWebsites ? (
          // Websites Hero - Special Visual - Mobile First Responsive
          <div className="tech-card overflow-hidden mb-8 sm:mb-12 lg:mb-20 rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] shadow-xl border border-blue-500/20 relative">
            {/* Tech Background with Brand Colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 via-brand-dark/10 to-primary/20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
            </div>
            
            {/* Bento Grid Layout - Mobile First */}
            <div className="relative p-4 sm:p-6 lg:p-8">
              {/* Mobile Bento Grid (< 640px) - UX Mega Ultra Otimizado */}
              <div className="sm:hidden space-y-6">
                {/* Title Card - Full Width */}
                <div className="bg-brand-dark/95 backdrop-blur-lg rounded-[2rem] p-7 border-2 border-white/30 animate-fade-in shadow-2xl">
                  <h1 className="text-[1.75rem] font-extrabold text-white mb-3 leading-tight">
                    <span className="bg-gradient-to-r from-brand-green via-primary to-brand-yellow bg-clip-text text-transparent drop-shadow-lg">
                      Criação de Sites
                    </span>
                  </h1>
                  <p className="text-base text-white/95 leading-relaxed font-medium">
                    Sites profissionais, rápidos e modernos para sua empresa brilhar online
                  </p>
                </div>
                
                {/* Bento Grid 2x3 - UX Mobile Mega Ultra Otimizado */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Card 1 - Institucional */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-primary/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-primary hover:shadow-primary/30 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.3)]"
                    style={{ animationDelay: '0.1s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-primary to-primary-darker rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Building className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Institucional</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Empresa</span>
                  </div>
                  
                  {/* Card 2 - Landing Page */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-green/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-green hover:shadow-brand-green/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-green),0.3)]"
                    style={{ animationDelay: '0.15s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-green to-primary rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Layout className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Landing</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Page</span>
                  </div>
                  
                  {/* Card 3 - Responsivo */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-bright/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-bright hover:shadow-brand-bright/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-bright),0.3)]"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-bright to-brand-green rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Smartphone className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">100%</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Responsivo</span>
                  </div>
                  
                  {/* Card 4 - WhatsApp */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-primary/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-primary hover:shadow-primary/30 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.3)]"
                    style={{ animationDelay: '0.25s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-primary to-brand-green rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <MessageCircle className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">WhatsApp</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Integrado</span>
                  </div>
                  
                  {/* Card 5 - SEO */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-yellow/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-yellow hover:shadow-brand-yellow/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-yellow),0.3)]"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-yellow to-accent-light rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Search className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">SEO</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Otimizado</span>
                  </div>
                  
                  {/* Card 6 - Velocidade */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-accent/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-accent hover:shadow-accent/30 hover:shadow-[0_0_30px_rgba(var(--color-accent),0.3)]"
                    style={{ animationDelay: '0.35s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-accent to-brand-yellow rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Zap className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Rápido</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Veloz</span>
                  </div>
                </div>
                
                {/* CTA Button - Full Width */}
                <Button
                  onClick={() => document.getElementById('o-que-inclui')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full rounded-[1.75rem] py-6 px-10 font-extrabold transition-all duration-150 ease-out bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-2xl hover:shadow-primary/40 active:scale-[0.92] active:shadow-lg h-[4.5rem] text-xl relative overflow-hidden group animate-fade-in touch-manipulation will-change-transform"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <svg viewBox="0 0 24 24" className="w-7 h-7 mr-3 relative z-10 group-hover:scale-110 transition-transform duration-150" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor" className="group-hover:animate-pulse"/>
                  </svg>
                  <span className="relative z-10 tracking-tight">Ver o que inclui</span>
                </Button>
              </div>

              {/* Desktop Bento Grid (>= 640px) */}
              <div className="hidden sm:grid sm:grid-cols-4 sm:gap-4 lg:gap-6">
                {/* Left Column - Institucional Card (spans 2 rows) */}
                <div className="sm:row-span-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 lg:p-8 flex flex-col items-center justify-center border border-primary/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary to-primary-darker rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Building className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <span className="text-base lg:text-lg font-bold text-gray-800 text-center">Site Institucional</span>
                  <span className="text-sm text-gray-500 mt-1">Página da empresa</span>
                </div>
                
                {/* Top Row - Landing Page */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-green/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-green to-primary rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Layout className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Landing Page</span>
                  <span className="text-xs text-gray-500 mt-0.5">Conversão</span>
                </div>
                
                {/* Top Row - Responsivo */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-bright/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-bright to-brand-green rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Smartphone className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Responsivo</span>
                  <span className="text-xs text-gray-500 mt-0.5">Mobile</span>
                </div>
                
                {/* Top Row - WhatsApp */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-primary/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-brand-green rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">WhatsApp</span>
                  <span className="text-xs text-gray-500 mt-0.5">Integrado</span>
                </div>
                
                {/* Bottom Row - Title Card (spans 2 columns) */}
                <div className="sm:col-span-2 bg-brand-dark/90 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 flex flex-col items-center justify-center">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight text-center">
                    <span className="bg-gradient-to-r from-brand-green via-primary to-brand-yellow bg-clip-text text-transparent">
                      Criação de Sites
                    </span>
                  </h1>
                  <p className="text-sm lg:text-base text-white/90 leading-relaxed text-center">
                    Sites profissionais, rápidos e modernos para sua empresa brilhar online
                  </p>
                </div>
                
                {/* Bottom Row - SEO */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-yellow/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-yellow to-accent-light rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Search className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">SEO</span>
                  <span className="text-xs text-gray-500 mt-0.5">Otimizado</span>
                </div>
                
                {/* Bottom Row - Velocidade */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-accent/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-accent to-brand-yellow rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Veloz</span>
                  <span className="text-xs text-gray-500 mt-0.5">Rápido</span>
                </div>
              </div>
              
              {/* CTA Button - Desktop (>= 640px) */}
              <div className="hidden sm:block mt-4 lg:mt-6">
                <Button
                  onClick={() => document.getElementById('o-que-inclui')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full rounded-2xl py-3 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] h-12 lg:h-14 text-base lg:text-lg relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 lg:w-6 lg:h-6 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor" className="group-hover:animate-pulse"/>
                  </svg>
                  <span className="relative z-10">Ver o que inclui</span>
                </Button>
              </div>
            </div>
          </div>
        ) : isAudiovisual ? (
          // Audiovisual Hero - Special Visual - Mobile First Responsive
          <div className="tech-card overflow-hidden mb-8 sm:mb-12 lg:mb-20 rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] shadow-xl border border-primary/20 relative">
            {/* Audiovisual Background with Brand Colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 via-brand-dark/10 to-brand-yellow/20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
            </div>
            
            {/* Bento Grid Layout - Mobile First */}
            <div className="relative p-4 sm:p-6 lg:p-8">
              {/* Mobile Bento Grid (< 640px) - UX Mega Ultra Otimizado */}
              <div className="sm:hidden space-y-6">
                {/* Title Card - Full Width */}
                <div className="bg-brand-dark/95 backdrop-blur-lg rounded-[2rem] p-7 border-2 border-white/30 animate-fade-in shadow-2xl">
                  <h1 className="text-[1.75rem] font-extrabold text-white mb-3 leading-tight">
                    <span className="bg-gradient-to-r from-brand-green via-primary to-brand-yellow bg-clip-text text-transparent drop-shadow-lg">
                      Produção Audiovisual
                    </span>
                  </h1>
                  <p className="text-base text-white/95 leading-relaxed font-medium">
                    Cobertura completa de eventos com filmagem, fotografia e edição premium
                  </p>
                </div>
                
                {/* Bento Grid 2x3 - UX Mobile Mega Ultra Otimizado */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Card 1 - Video */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-primary/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-primary hover:shadow-primary/30 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.3)]"
                    style={{ animationDelay: '0.1s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-primary to-primary-darker rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Video className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Filmagem</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Vídeo</span>
                  </div>
                  
                  {/* Card 2 - Camera */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-yellow/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-yellow hover:shadow-brand-yellow/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-yellow),0.3)]"
                    style={{ animationDelay: '0.15s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-yellow to-accent-light rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Camera className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Foto</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Sessão</span>
                  </div>
                  
                  {/* Card 3 - Film */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-green/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-green hover:shadow-brand-green/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-green),0.3)]"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-green to-primary rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Film className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Edição</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Premium</span>
                  </div>
                  
                  {/* Card 4 - Drone */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-bright/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-bright hover:shadow-brand-bright/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-bright),0.3)]"
                    style={{ animationDelay: '0.25s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-bright to-brand-green rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Mountain className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Drone</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Aéreo</span>
                  </div>
                  
                  {/* Card 5 - Fogo */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-yellow/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-yellow hover:shadow-brand-yellow/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-yellow),0.3)]"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-yellow to-accent-light rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Zap className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Fogo</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Artifício</span>
                  </div>
                  
                  {/* Card 6 - Fumaça */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-primary/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-primary hover:shadow-primary/30 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.3)]"
                    style={{ animationDelay: '0.35s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-primary to-brand-green rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Sparkle className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Fumaça</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Bolas</span>
                  </div>
                </div>
                
                {/* CTA Button - Full Width */}
                <Button
                  onClick={() => document.getElementById('pacotes-audiovisual')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full rounded-[1.75rem] py-6 px-10 font-extrabold transition-all duration-150 ease-out bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-2xl hover:shadow-primary/40 active:scale-[0.92] active:shadow-lg h-[4.5rem] text-xl relative overflow-hidden group animate-fade-in touch-manipulation will-change-transform"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <Package className="w-7 h-7 mr-3 relative z-10" />
                  <span className="relative z-10 tracking-tight">Ver Pacotes</span>
                </Button>
              </div>

              {/* Desktop Bento Grid (>= 640px) */}
              <div className="hidden sm:grid sm:grid-cols-4 sm:gap-4 lg:gap-6">
                {/* Left Column - Video Card (spans 2 rows) */}
                <div className="sm:row-span-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 lg:p-8 flex flex-col items-center justify-center border border-primary/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary to-primary-darker rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Video className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <span className="text-base lg:text-lg font-bold text-gray-800 text-center">Filmagem Profissional</span>
                  <span className="text-sm text-gray-500 mt-1">Cobertura completa</span>
                </div>
                
                {/* Top Row - Camera */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-yellow/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-yellow to-accent-light rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Camera className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Fotografia</span>
                  <span className="text-xs text-gray-500 mt-0.5">Sessão</span>
                </div>
                
                {/* Top Row - Film */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-green/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-green to-primary rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Film className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Edição</span>
                  <span className="text-xs text-gray-500 mt-0.5">Premium</span>
                </div>
                
                {/* Top Row - Drone */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-bright/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-bright to-brand-green rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Mountain className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Drone</span>
                  <span className="text-xs text-gray-500 mt-0.5">Aéreo</span>
                </div>
                
                {/* Bottom Row - Title Card (spans 2 columns) */}
                <div className="sm:col-span-2 bg-brand-dark/90 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 flex flex-col items-center justify-center">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight text-center">
                    <span className="bg-gradient-to-r from-brand-green via-primary to-brand-yellow bg-clip-text text-transparent">
                      Produção Audiovisual
                    </span>
                  </h1>
                  <p className="text-sm lg:text-base text-white/90 leading-relaxed text-center">
                    Cobertura completa de eventos com filmagem, fotografia e edição premium
                  </p>
                </div>
                
                {/* Bottom Row - Fogo */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-yellow/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-yellow to-accent-light rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Fogo</span>
                  <span className="text-xs text-gray-500 mt-0.5">Artifício</span>
                </div>
                
                {/* Bottom Row - Fumaça */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-primary/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-brand-green rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Sparkle className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Fumaça</span>
                  <span className="text-xs text-gray-500 mt-0.5">Bolas</span>
                </div>
              </div>
              
              {/* CTA Button - Desktop (>= 640px) */}
              <div className="hidden sm:block mt-4 lg:mt-6">
                <Button
                  onClick={() => document.getElementById('pacotes-audiovisual')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full rounded-2xl py-3 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] h-12 lg:h-14 text-base lg:text-lg relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <Package className="w-5 h-5 lg:w-6 lg:h-6 mr-2 relative z-10" />
                  <span className="relative z-10">Ver Pacotes</span>
                </Button>
              </div>
            </div>
          </div>
        ) : isMarketing ? (
          // Marketing Digital Hero - Special Visual - Mobile First Responsive
          <div className="tech-card overflow-hidden mb-8 sm:mb-12 lg:mb-20 rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] shadow-xl border border-brand-yellow/20 relative">
            {/* Marketing Background with Brand Colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-yellow/20 via-brand-dark/10 to-primary/20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
            </div>
            
            {/* Bento Grid Layout - Mobile First */}
            <div className="relative p-4 sm:p-6 lg:p-8">
              {/* Mobile Bento Grid (< 640px) - UX Mega Ultra Otimizado */}
              <div className="sm:hidden space-y-6">
                {/* Title Card - Full Width */}
                <div className="bg-brand-dark/95 backdrop-blur-lg rounded-[2rem] p-7 border-2 border-white/30 animate-fade-in shadow-2xl">
                  <h1 className="text-[1.75rem] font-extrabold text-white mb-3 leading-tight">
                    <span className="bg-gradient-to-r from-brand-yellow via-accent-light to-primary bg-clip-text text-transparent drop-shadow-lg">
                      Marketing Digital
                    </span>
                  </h1>
                  <p className="text-base text-white/95 leading-relaxed font-medium">
                    Estratégias que atraem clientes reais para seu negócio todos os dias
                  </p>
                </div>
                
                {/* Bento Grid 2x3 - UX Mobile Mega Ultra Otimizado */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Card 1 - Redes Sociais */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-yellow/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-yellow hover:shadow-brand-yellow/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-yellow),0.3)]"
                    style={{ animationDelay: '0.1s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-yellow to-accent-light rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Instagram className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Redes</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Sociais</span>
                  </div>
                  
                  {/* Card 2 - Conteúdo */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-primary/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-primary hover:shadow-primary/30 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.3)]"
                    style={{ animationDelay: '0.15s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-primary to-primary-darker rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <PenTool className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Conteúdo</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Criativo</span>
                  </div>
                  
                  {/* Card 3 - Anúncios */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-green/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-green hover:shadow-brand-green/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-green),0.3)]"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-green to-primary rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Megaphone className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Anúncios</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Pagos</span>
                  </div>
                  
                  {/* Card 4 - Estratégia */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-bright/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-bright hover:shadow-brand-bright/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-bright),0.3)]"
                    style={{ animationDelay: '0.25s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-bright to-brand-green rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Target className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Estratégia</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Digital</span>
                  </div>
                  
                  {/* Card 5 - Relatórios */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-dark/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-dark hover:shadow-brand-dark/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-dark),0.3)]"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-dark to-brand-dark rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <BarChart3 className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Relatórios</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Análise</span>
                  </div>
                  
                  {/* Card 6 - Clientes */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-accent/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-accent hover:shadow-accent/30 hover:shadow-[0_0_30px_rgba(var(--color-accent),0.3)]"
                    style={{ animationDelay: '0.35s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-accent to-brand-yellow rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Users className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Clientes</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Reais</span>
                  </div>
                </div>
                
                {/* CTA Button - Full Width */}
                <Button
                  onClick={() => document.getElementById('o-que-inclui-marketing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full rounded-[1.75rem] py-6 px-10 font-extrabold transition-all duration-150 ease-out bg-gradient-to-r from-brand-yellow to-primary hover:from-accent-light hover:to-primary-darker text-white shadow-2xl hover:shadow-brand-yellow/40 active:scale-[0.92] active:shadow-lg h-[4.5rem] text-xl relative overflow-hidden group animate-fade-in touch-manipulation will-change-transform"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <svg viewBox="0 0 24 24" className="w-7 h-7 mr-3 relative z-10 group-hover:scale-110 transition-transform duration-150" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor" className="group-hover:animate-pulse"/>
                  </svg>
                  <span className="relative z-10 tracking-tight">Ver o que inclui</span>
                </Button>
              </div>

              {/* Desktop Bento Grid (>= 640px) */}
              <div className="hidden sm:grid sm:grid-cols-4 sm:gap-4 lg:gap-6">
                {/* Left Column - Redes Sociais Card (spans 2 rows) */}
                <div className="sm:row-span-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 lg:p-8 flex flex-col items-center justify-center border border-brand-yellow/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-brand-yellow to-accent-light rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Instagram className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <span className="text-base lg:text-lg font-bold text-gray-800 text-center">Gestão de Redes</span>
                  <span className="text-sm text-gray-500 mt-1">Sociais completa</span>
                </div>
                
                {/* Top Row - Conteúdo */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-primary/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-primary to-primary-darker rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <PenTool className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Conteúdo</span>
                  <span className="text-xs text-gray-500 mt-0.5">Criativo</span>
                </div>
                
                {/* Top Row - Anúncios */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-green/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-green to-primary rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Megaphone className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Anúncios</span>
                  <span className="text-xs text-gray-500 mt-0.5">Pagos</span>
                </div>
                
                {/* Top Row - Estratégia */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-bright/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-bright to-brand-green rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Estratégia</span>
                  <span className="text-xs text-gray-500 mt-0.5">Digital</span>
                </div>
                
                {/* Bottom Row - Title Card (spans 2 columns) */}
                <div className="sm:col-span-2 bg-brand-dark/90 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 flex flex-col items-center justify-center">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight text-center">
                    <span className="bg-gradient-to-r from-brand-yellow via-accent-light to-primary bg-clip-text text-transparent">
                      Marketing Digital
                    </span>
                  </h1>
                  <p className="text-sm lg:text-base text-white/90 leading-relaxed text-center">
                    Estratégias que atraem clientes reais para seu negócio todos os dias
                  </p>
                </div>
                
                {/* Bottom Row - Relatórios */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-dark/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-dark to-brand-dark rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Relatórios</span>
                  <span className="text-xs text-gray-500 mt-0.5">Análise</span>
                </div>
                
                {/* Bottom Row - Clientes */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-accent/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-accent to-brand-yellow rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Clientes</span>
                  <span className="text-xs text-gray-500 mt-0.5">Reais</span>
                </div>
              </div>
              
              {/* CTA Button - Desktop (>= 640px) */}
              <div className="hidden sm:block mt-4 lg:mt-6">
                <Button
                  onClick={() => document.getElementById('o-que-inclui-marketing')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full rounded-2xl py-3 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-brand-yellow to-primary hover:from-accent-light hover:to-primary-darker text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] h-12 lg:h-14 text-base lg:text-lg relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 lg:w-6 lg:h-6 mr-2 relative z-10 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="1" fill="currentColor" className="group-hover:animate-pulse"/>
                  </svg>
                  <span className="relative z-10">Ver o que inclui</span>
                </Button>
              </div>
            </div>
          </div>
        ) : isImportacao ? (
          // Importação Assistida Hero - Special Visual - Mobile First - Trust Focus
          <div className="tech-card overflow-hidden mb-8 sm:mb-12 lg:mb-20 rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] shadow-xl border border-primary/20 relative">
            {/* Trust Background with Brand Colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-brand-dark/10 to-brand-yellow/15">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
            </div>
            
            {/* Bento Grid Layout - Mobile First */}
            <div className="relative p-4 sm:p-6 lg:p-8">
              {/* Mobile Bento Grid (< 640px) - UX Mega Ultra Otimizado */}
              <div className="sm:hidden space-y-6">
                {/* Title Card - Full Width */}
                <div className="bg-brand-dark/95 backdrop-blur-lg rounded-[2rem] p-7 border-2 border-white/30 animate-fade-in shadow-2xl">
                  <h1 className="text-[1.75rem] font-extrabold text-white mb-3 leading-tight">
                    <span className="bg-gradient-to-r from-primary via-brand-bright to-brand-yellow bg-clip-text text-transparent drop-shadow-lg">
                      Importação Assistida
                    </span>
                  </h1>
                  <p className="text-base text-white/95 leading-relaxed font-medium">
                    Acompanhamento humano e seguro da sua importação internacional até à porta de casa
                  </p>
                </div>
                
                {/* Trust Indicators - 2x2 Grid - UX Mobile Mega Ultra Otimizado */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Card 1 - Seguro */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-primary/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-primary hover:shadow-primary/30 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.3)]"
                    style={{ animationDelay: '0.1s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-primary to-primary-darker rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <ShieldCheck className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">100%</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Seguro</span>
                  </div>
                  
                  {/* Card 2 - Acompanhamento */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-green/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-green hover:shadow-brand-green/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-green),0.3)]"
                    style={{ animationDelay: '0.15s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-green to-primary rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Eye className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Tracking</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Privado</span>
                  </div>
                  
                  {/* Card 3 - Global */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-yellow/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-yellow hover:shadow-brand-yellow/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-yellow),0.3)]"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-yellow to-accent-light rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Globe className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Global</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">China, EUA</span>
                  </div>
                  
                  {/* Card 4 - Suporte */}
                  <div
                    className="bg-white/98 backdrop-blur-2xl rounded-[1.75rem] shadow-2xl p-7 flex flex-col items-center justify-center aspect-square border-[3px] border-brand-bright/50 transform transition-all duration-150 ease-out active:scale-[0.92] active:shadow-lg active:brightness-95 cursor-pointer animate-fade-in group touch-manipulation will-change-transform hover:border-brand-bright hover:shadow-brand-bright/30 hover:shadow-[0_0_30px_rgba(var(--color-brand-bright),0.3)]"
                    style={{ animationDelay: '0.25s' }}
                  >
                    <div className="w-[5.5rem] h-[5.5rem] bg-gradient-to-br from-brand-bright to-brand-green rounded-2xl flex items-center justify-center mb-5 shadow-2xl group-hover:scale-115 group-active:scale-90 transition-transform duration-150 ease-out will-change-transform">
                      <Headphones className="w-11 h-11 text-white drop-shadow-lg" />
                    </div>
                    <span className="text-lg font-extrabold text-gray-900 text-center tracking-tight">Suporte</span>
                    <span className="text-base text-gray-600 mt-1.5 font-medium">Humano</span>
                  </div>
                </div>
                
                {/* CTA Button - Full Width */}
                <Button
                  onClick={() => document.getElementById('como-funciona-importacao')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full rounded-[1.75rem] py-6 px-10 font-extrabold transition-all duration-150 ease-out bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-2xl hover:shadow-primary/40 active:scale-[0.92] active:shadow-lg h-[4.5rem] text-xl relative overflow-hidden group animate-fade-in touch-manipulation will-change-transform"
                  style={{ animationDelay: '0.3s' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <ClipboardCheck className="w-7 h-7 mr-3 relative z-10" />
                  <span className="relative z-10 tracking-tight">Solicitar Consulta</span>
                </Button>
              </div>

              {/* Desktop Bento Grid (>= 640px) */}
              <div className="hidden sm:grid sm:grid-cols-4 sm:gap-4 lg:gap-6">
                {/* Left Column - Seguro Card (spans 2 rows) */}
                <div className="sm:row-span-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-6 lg:p-8 flex flex-col items-center justify-center border border-primary/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary to-primary-darker rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ShieldCheck className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                  </div>
                  <span className="text-base lg:text-lg font-bold text-gray-800 text-center">100% Seguro</span>
                  <span className="text-sm text-gray-500 mt-1">Acompanhamento total</span>
                </div>
                
                {/* Top Row - Tracking */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-green/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-green to-primary rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Eye className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Tracking</span>
                  <span className="text-xs text-gray-500 mt-0.5">Privado</span>
                </div>
                
                {/* Top Row - Global */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-yellow/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-yellow to-accent-light rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Globe className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Global</span>
                  <span className="text-xs text-gray-500 mt-0.5">China, EUA</span>
                </div>
                
                {/* Top Row - Suporte */}
                <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-5 lg:p-6 flex flex-col items-center justify-center border border-brand-bright/30 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                  <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-brand-bright to-brand-green rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Headphones className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <span className="text-sm lg:text-base font-bold text-gray-800 text-center">Suporte</span>
                  <span className="text-xs text-gray-500 mt-0.5">Humano</span>
                </div>
                
                {/* Bottom Row - Title Card (spans 3 columns) */}
                <div className="sm:col-span-3 bg-brand-dark/90 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 flex flex-col items-center justify-center">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight text-center">
                    <span className="bg-gradient-to-r from-primary via-brand-green to-brand-yellow bg-clip-text text-transparent">
                      Importação Assistida
                    </span>
                  </h1>
                  <p className="text-sm lg:text-base text-white/90 leading-relaxed text-center">
                    Acompanhamento humano e seguro da sua importação internacional até à porta de casa
                  </p>
                </div>
              </div>
              
              {/* CTA Button - Desktop (>= 640px) */}
              <div className="hidden sm:block mt-4 lg:mt-6">
                <Button
                  onClick={() => document.getElementById('como-funciona-importacao')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full rounded-2xl py-3 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] h-12 lg:h-14 text-base lg:text-lg relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  <ClipboardCheck className="w-5 h-5 lg:w-6 lg:h-6 mr-2 relative z-10" />
                  <span className="relative z-10">Solicitar Consulta</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="tech-card overflow-hidden mb-16 lg:mb-20 rounded-[48px] p-[40px] shadow-xl border border-white/10">
            <div className="relative h-64 lg:h-80 overflow-hidden rounded-[48px]">
              <img
                src={service.image}
                alt={service.title}
                className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-105 opacity-100' : 'scale-110 opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

              <div className="absolute bottom-4 left-6 right-6">
                <div className="space-y-4">
                  <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                      {isAudiovisual
                        ? 'Produção Audiovisual Profissional'
                        : isImportacao
                          ? 'Importação Internacional Assistida'
                          : service.category === 'Marketing Digital'
                            ? 'Marketing que atrai clientes todos os dias'
                            : service.title}
                    </h1>
                    <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
                      {isAudiovisual
                        ? 'Cobertura completa de eventos com filmagem, fotografia e edição premium.'
                        : isImportacao
                          ? 'Serviço humano especializado em importação internacional com acompanhamento privado até a chegada do produto.'
                          : service.category === 'Marketing Digital'
                            ? 'Estratégias que fazem seu negócio crescer de verdade'
                            : service.shortDescription}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    {isAudiovisual ? (
                      <>
                        <Button
                          onClick={scrollToPackages}
                          className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-emerald-600 hover:from-[primary-dark] hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-14 text-lg relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                          <Package className="w-5 h-5 mr-2 relative z-10" />
                          <span className="relative z-10">Ver Pacotes</span>
                        </Button>
                        <Button
                          onClick={handleContact}
                          className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-14 text-lg relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                          <MessageCircle className="w-5 h-5 mr-2 relative z-10" />
                          <span className="relative z-10">Falar no WhatsApp</span>
                        </Button>
                      </>
                    ) : isImportacao ? (
                      <>
                        <Button
                          onClick={handleContact}
                          className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-emerald-600 hover:from-[primary-dark] hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-14 text-lg relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                          <ClipboardCheck className="w-5 h-5 mr-2 relative z-10" />
                          <span className="relative z-10">Solicitar Consulta</span>
                        </Button>
                        <Button
                          onClick={handleContact}
                          className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-14 text-lg relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                          <MessageCircle className="w-5 h-5 mr-2 relative z-10" />
                          <span className="relative z-10">Falar no WhatsApp</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={handleContact}
                        className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-emerald-600 hover:from-[primary-dark] hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-14 text-lg relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                        <MessageCircle className="w-5 h-5 mr-2 relative z-10" />
                        <span className="relative z-10">FALAR COM A TCHOVA</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Project Status Section - Only for clients with confirmed payment */}
        {hasPayment && paymentStatus && (
          <ProjectStatus
            serviceTitle={service.title}
            paymentStatus={paymentStatus as 'entry-50' | 'full' | 'final'}
            paymentAmount={paymentAmount || undefined}
            projectId={projectId || undefined}
            onContact={handleContact}
            onPayment={handlePayment}
          />
        )}



        {/* Design Gráfico Section - Mobile First */}
        {isDesignGrafico && (
          <>
            {/* Sobre o Serviço - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-dark/20 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <Lightbulb className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-brand-yellow mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-brand-yellow to-accent-light bg-clip-text text-transparent font-black">Sobre o Serviço</span>
              </h2>
              
              <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  O <strong className="text-foreground">Design Gráfico</strong> cria a <strong className="text-foreground">identidade visual</strong> da sua marca.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Transmite <strong className="text-foreground">profissionalismo</strong>, <strong className="text-foreground">confiança</strong> e <strong className="text-foreground">reconhecimento</strong> no mercado.
                </p>
              </div>
            </div>

            {/* O que Criamos - Mobile First */}
            <div id="o-que-criamos" className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl scroll-mt-20 sm:scroll-mt-24">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent font-black">O que Criamos</span>
              </h2>
              
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {[
                  {
                    name: 'Logotipos',
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 17l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                    gradient: 'from-primary to-primary-darker',
                    color: 'from-primary/20 to-primary-darker/20 border-primary/30'
                  },
                  {
                    name: 'Banners, cartazes, flyers',
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    ),
                    gradient: 'from-brand-green to-brand-green',
                    color: 'from-brand-green/20 to-brand-green/20 border-brand-green/30'
                  },
                  {
                    name: 'Posts para redes sociais',
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    ),
                    gradient: 'from-brand-yellow to-accent-light',
                    color: 'from-brand-yellow/20 to-accent-light/20 border-brand-yellow/30'
                  },
                  {
                    name: 'Cartões de visita com QR',
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                        <rect x="5" y="14" width="4" height="4" rx="0.5"/>
                        <rect x="11" y="14" width="2" height="2"/>
                        <rect x="15" y="14" width="2" height="2"/>
                        <rect x="11" y="16.5" width="2" height="2"/>
                      </svg>
                    ),
                    gradient: 'from-brand-dark to-brand-dark',
                    color: 'from-brand-dark/20 to-brand-dark/20 border-brand-dark/30'
                  },
                  {
                    name: 'Identidade visual completa',
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 16v-4"/>
                        <path d="M12 8h.01"/>
                        <path d="M8 12h8"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    ),
                    gradient: 'from-primary to-primary-darker',
                    color: 'from-primary/20 to-primary-darker/20 border-primary/30'
                  },
                  {
                    name: 'Materiais impressos (vinil, roll-up, t-shirts)',
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
                      </svg>
                    ),
                    gradient: 'from-brand-yellow to-accent-light',
                    color: 'from-brand-yellow/20 to-accent-light/20 border-brand-yellow/30'
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`group bg-gradient-to-br ${item.color} backdrop-blur-lg rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] p-4 sm:p-5 lg:p-6 border hover:scale-[1.02] transition-all duration-500`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-white`}>
                        {item.icon}
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm lg:text-base leading-tight text-foreground">{item.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Como Funciona o Processo - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-yellow/20 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <ClipboardList className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-brand-yellow mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-brand-yellow to-accent-light bg-clip-text text-transparent font-black">Como Funciona</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  { step: 1, title: 'Cliente fala com a Tchova no WhatsApp', description: 'Entre em contacto pelo WhatsApp para iniciarmos' },
                  { step: 2, title: 'Envia referências', description: 'Compartilhe referências e ideias para o projeto' },
                  { step: 3, title: 'Recebe proposta + orçamento', description: 'Apresentamos uma proposta personalizada com valores' },
                  { step: 4, title: 'Aprova e paga 50%', description: 'Aprova o orçamento e efetua 50% para iniciar' },
                  { step: 5, title: 'Desenvolvimento do design', description: 'Nossa equipe cria o design com base nas suas necessidades' },
                  { step: 6, title: 'Aprovação final', description: 'Revisão e aprovação do resultado final' },
                  { step: 7, title: 'Entrega dos arquivos', description: 'Recebe todos os arquivos em alta resolução' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-6 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-gradient-to-r from-primary/10 via-brand-green/5 to-transparent backdrop-blur-lg border border-primary/20 hover:border-primary/40 transition-all duration-500"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary to-primary-darker text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base lg:text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 text-primary dark:text-primary">{item.title}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagamento - Botão Inteligente - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 text-center">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent font-black">
                  💳 Pagamento
                </span>
              </h2>
              
              {/* Info sobre o fluxo de pagamento */}
              <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-blue-200/30 mb-4 sm:mb-6 lg:mb-8 text-center">
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                  <strong>Fluxo de pagamento:</strong>
                </p>
                <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8">
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">50%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Para iniciar</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-600">50%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Na entrega</p>
                  </div>
                </div>
              </div>

              {/* Métodos de Pagamento */}
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-center mb-3 sm:mb-4 text-muted-foreground">Métodos:</h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Carteira Local</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Cartão</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">PayPal</span>
              </div>
              
              {!isPaymentAuthorized ? (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-amber-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <LockKeyhole className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-amber-600 dark:text-amber-400 text-center">Pagamento autorizado após conversa no WhatsApp</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mb-4 sm:mb-6">
                      Para liberar o pagamento, fale primeiro com a Tchova.
                    </p>
                    <Button
                      onClick={handleContact}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-emerald-600 hover:from-[primary-dark] hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Falar com a Tchova</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-green-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-green-600 dark:text-green-400">Pagamento Autorizado</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">
                      Pagamento autorizado pela Tchova Digital
                    </p>
                    <Button
                      onClick={handlePayment}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-emerald-600 hover:from-[primary-dark] hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Efetuar Pagamento do Projeto</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Final - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-primary/5 via-emerald-500/5 to-green-500/5 border border-primary/20 shadow-2xl">
              <div className="bg-gradient-to-r from-primary/15 to-emerald-600/15 p-4 xs:p-6 sm:p-8 lg:p-12 border-b border-white/20">
                <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-4xl font-black text-foreground text-center mb-2 sm:mb-4 lg:mb-6">
                  {!isPaymentAuthorized ? 'Pronto para começar sua identidade visual?' : 'Seu projeto está a caminho!'}
                </h2>
                {!isPaymentAuthorized && (
                  <p className="text-muted-foreground text-center text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
                    Fale com a Tchova para discutir seu projeto e receber um orçamento personalizado.
                  </p>
                )}
              </div>

              <div className="p-4 xs:p-6 sm:p-8 lg:p-12 space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <Button
                    onClick={handleContact}
                    className="rounded-[20px] sm:rounded-[24px] py-2 px-4 sm:px-6 font-bold transition-all duration-400 h-12 sm:h-14 lg:h-20 bg-gradient-to-r from-primary via-emerald-500 to-green-500 hover:from-[primary-dark] hover:to-emerald-600 text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] text-sm sm:text-base lg:text-xl relative overflow-hidden group border-2 border-white/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <span className="relative z-10">Falar com a Tchova no WhatsApp</span>
                  </Button>
                </div>

                {!isPaymentAuthorized && (
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                      <span className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                        O pagamento só é liberado após a conversa.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Websites Section - Mobile First */}
        {isWebsites && (
          <>
            {/* Sobre o Serviço - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <Lightbulb className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-brand-yellow mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-brand-green to-primary bg-clip-text text-transparent font-black">Sobre o Serviço</span>
              </h2>
              
              <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Criamos <strong className="text-foreground">sites profissionais, rápidos e modernos</strong> para empresas que querem presença digital forte e confiável.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Um site bem feito transmite <strong className="text-foreground">credibilidade</strong> e ajuda a <strong className="text-foreground">converter visitantes em clientes</strong>.
                </p>
              </div>
            </div>

            {/* O que Inclui - Mobile First */}
            <div id="o-que-inclui" className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl scroll-mt-20 sm:scroll-mt-24">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent font-black">O que Inclui</span>
              </h2>
              
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {[
                  {
                    name: 'Site institucional ou landing page',
                    icon: <Layout className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-primary to-primary-darker',
                    color: 'from-primary/20 to-primary-darker/20 border-primary/30'
                  },
                  {
                    name: 'Design moderno e responsivo',
                    icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-brand-bright to-brand-green',
                    color: 'from-brand-bright/20 to-brand-green/20 border-brand-bright/30'
                  },
                  {
                    name: 'Integração WhatsApp',
                    icon: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-primary to-brand-green',
                    color: 'from-primary/20 to-brand-green/20 border-primary/30'
                  },
                  {
                    name: 'Formulários de contacto',
                    icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-brand-green to-primary',
                    color: 'from-brand-green/20 to-primary/20 border-brand-green/30'
                  },
                  {
                    name: 'SEO básico',
                    icon: <Search className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-brand-yellow to-accent-light',
                    color: 'from-brand-yellow/20 to-accent-light/20 border-brand-yellow/30'
                  },
                  {
                    name: 'Otimização de velocidade',
                    icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-accent to-brand-yellow',
                    color: 'from-accent/20 to-brand-yellow/20 border-accent/30'
                  },
                  {
                    name: 'Hospedagem e domínio (opcional)',
                    icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-brand-dark to-brand-dark',
                    color: 'from-brand-dark/20 to-brand-dark/20 border-brand-dark/30'
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`group bg-gradient-to-br ${item.color} backdrop-blur-lg rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] p-4 sm:p-5 lg:p-6 border hover:scale-[1.02] transition-all duration-500`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-white`}>
                        {item.icon}
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm lg:text-base leading-tight text-foreground">{item.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Como Funciona o Processo - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-yellow/20 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <ClipboardList className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-brand-yellow mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-brand-yellow to-accent-light bg-clip-text text-transparent font-black">Processo</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  { step: 1, title: 'Cliente fala com a Tchova', description: 'Entre em contacto pelo WhatsApp para iniciarmos' },
                  { step: 2, title: 'Define tipo de site', description: 'Institucional, landing page, ou outro formato' },
                  { step: 3, title: 'Recebe orçamento', description: 'Proposta personalizada com valores e prazos' },
                  { step: 4, title: 'Paga 50%', description: 'Aprova o orçamento e efetua 50% para iniciar' },
                  { step: 5, title: 'Início do desenvolvimento', description: 'Nossa equipe começa a criar seu site' },
                  { step: 6, title: 'Aprovação', description: 'Você revisa e aprova o resultado final' },
                  { step: 7, title: 'Publicação', description: 'Site publicado e pronto para receber visitantes' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-6 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-gradient-to-r from-primary/10 via-brand-green/5 to-transparent backdrop-blur-lg border border-primary/20 hover:border-primary/40 transition-all duration-500"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary to-brand-green text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base lg:text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 text-primary dark:text-primary">{item.title}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagamento - Botão Inteligente - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 text-center">
                <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent font-black">
                  💳 Pagamento
                </span>
              </h2>
              
              {/* Info sobre o fluxo de pagamento */}
              <div className="bg-gradient-to-r from-primary/10 via-brand-green/5 to-transparent backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-primary/30 mb-4 sm:mb-6 lg:mb-8 text-center">
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                  <strong>Fluxo de pagamento:</strong>
                </p>
                <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8">
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">50%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Para iniciar</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-green">50%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Na publicação</p>
                  </div>
                </div>
              </div>

              {/* Métodos de Pagamento */}
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-center mb-3 sm:mb-4 text-muted-foreground">Métodos:</h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Carteira Local</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Cartão</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">PayPal</span>
              </div>
              
              {!isPaymentAuthorized ? (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-amber-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <LockKeyhole className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-amber-600 dark:text-amber-400 text-center">Pagamento autorizado após conversa no WhatsApp</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mb-4 sm:mb-6">
                      Para liberar o pagamento, fale primeiro com a Tchova.
                    </p>
                    <Button
                      onClick={handleContact}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Falar com a Tchova</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-green-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-green-600 dark:text-green-400">Pagamento Autorizado</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">
                      Pagamento autorizado pela Tchova Digital
                    </p>
                    <Button
                      onClick={handlePayment}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Efetuar Pagamento do Projeto</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Final - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-primary/5 via-brand-green/5 to-brand-yellow/5 border border-primary/20 shadow-2xl">
              <div className="bg-gradient-to-r from-primary/15 to-brand-green/15 p-4 xs:p-6 sm:p-8 lg:p-12 border-b border-white/20">
                <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-4xl font-black text-foreground text-center mb-2 sm:mb-4 lg:mb-6">
                  {!isPaymentAuthorized ? 'Pronto para ter seu site profissional?' : 'Seu site está a caminho!'}
                </h2>
                {!isPaymentAuthorized && (
                  <p className="text-muted-foreground text-center text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
                    Fale com a Tchova para discutir seu projeto e receber um orçamento personalizado.
                  </p>
                )}
              </div>

              <div className="p-4 xs:p-6 sm:p-8 lg:p-12 space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <Button
                    onClick={handleContact}
                    className="rounded-[20px] sm:rounded-[24px] py-2 px-4 sm:px-6 font-bold transition-all duration-400 h-12 sm:h-14 lg:h-20 bg-gradient-to-r from-primary via-brand-green to-brand-yellow hover:from-primary-darker hover:to-brand-yellow text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] text-sm sm:text-base lg:text-xl relative overflow-hidden group border-2 border-white/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2 sm:mr-3 relative z-10" />
                    <span className="relative z-10">Falar com a Tchova no WhatsApp</span>
                  </Button>
                </div>

                {!isPaymentAuthorized && (
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                      <span className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                        O pagamento só é liberado após a conversa.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Marketing Digital Section - Mobile First */}
        {isMarketing && (
          <>
            {/* Sobre o Serviço - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-yellow/20 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <Lightbulb className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-brand-yellow mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-brand-yellow to-accent-light bg-clip-text text-transparent font-black">Sobre o Serviço</span>
              </h2>
              
              <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Gestão profissional de redes sociais e anúncios</strong> para atrair clientes reais para seu negócio.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Estratégias personalizadas que <strong className="text-foreground">aumentam sua visibilidade</strong> e <strong className="text-foreground">geram resultados consistentes</strong>.
                </p>
              </div>
            </div>

            {/* O que Inclui - Mobile First */}
            <div id="o-que-inclui-marketing" className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-yellow/20 shadow-2xl scroll-mt-20 sm:scroll-mt-24">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <span className="bg-gradient-to-r from-brand-yellow to-primary bg-clip-text text-transparent font-black">O que Inclui</span>
              </h2>
              
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {[
                  {
                    name: 'Gestão de redes sociais',
                    icon: <Instagram className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-brand-yellow to-accent-light',
                    color: 'from-brand-yellow/20 to-accent-light/20 border-brand-yellow/30'
                  },
                  {
                    name: 'Criação de conteúdo',
                    icon: <PenTool className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-primary to-primary-darker',
                    color: 'from-primary/20 to-primary-darker/20 border-primary/30'
                  },
                  {
                    name: 'Anúncios pagos',
                    icon: <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-brand-green to-primary',
                    color: 'from-brand-green/20 to-primary/20 border-brand-green/30'
                  },
                  {
                    name: 'Estratégia digital',
                    icon: <Target className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-brand-bright to-brand-green',
                    color: 'from-brand-bright/20 to-brand-green/20 border-brand-bright/30'
                  },
                  {
                    name: 'Relatórios de desempenho',
                    icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" />,
                    gradient: 'from-brand-dark to-brand-dark',
                    color: 'from-brand-dark/20 to-brand-dark/20 border-brand-dark/30'
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`group bg-gradient-to-br ${item.color} backdrop-blur-lg rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] p-4 sm:p-5 lg:p-6 border hover:scale-[1.02] transition-all duration-500`}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-white`}>
                        {item.icon}
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm lg:text-base leading-tight text-foreground">{item.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Como Funciona o Processo - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <ClipboardList className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-brand-yellow mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-brand-yellow to-primary bg-clip-text text-transparent font-black">Processo</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  { step: 1, title: 'Consulta', description: 'Cliente fala com a Tchova sobre seus objetivos' },
                  { step: 2, title: 'Estratégia', description: 'Criamos uma estratégia personalizada para seu negócio' },
                  { step: 3, title: 'Orçamento', description: 'Apresentamos proposta com valores e prazos' },
                  { step: 4, title: 'Pagamento 50%', description: 'Aprova o orçamento e efetua 50% para iniciar' },
                  { step: 5, title: 'Execução', description: 'Implementamos a estratégia e criamos conteúdo' },
                  { step: 6, title: 'Relatórios', description: 'Recebe relatórios de desempenho regulares' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-6 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-gradient-to-r from-brand-yellow/10 via-primary/5 to-transparent backdrop-blur-lg border border-brand-yellow/20 hover:border-brand-yellow/40 transition-all duration-500"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-brand-yellow to-primary text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base lg:text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 text-brand-yellow dark:text-brand-yellow">{item.title}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagamento - Botão Inteligente - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 text-center">
                <span className="bg-gradient-to-r from-brand-yellow to-primary bg-clip-text text-transparent font-black">
                  💳 Pagamento
                </span>
              </h2>
              
              {/* Info sobre o fluxo de pagamento */}
              <div className="bg-gradient-to-r from-brand-yellow/10 via-primary/5 to-transparent backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-brand-yellow/30 mb-4 sm:mb-6 lg:mb-8 text-center">
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                  <strong>Fluxo de pagamento:</strong>
                </p>
                <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8">
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-brand-yellow/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-yellow">50%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Para iniciar</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">50%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Mensal</p>
                  </div>
                </div>
              </div>

              {/* Métodos de Pagamento */}
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-center mb-3 sm:mb-4 text-muted-foreground">Métodos:</h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Carteira Local</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Cartão</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">PayPal</span>
              </div>
              
              {!isPaymentAuthorized ? (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-amber-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <LockKeyhole className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-amber-600 dark:text-amber-400 text-center">Pagamento autorizado após conversa no WhatsApp</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mb-4 sm:mb-6">
                      Para liberar o pagamento, fale primeiro com a Tchova.
                    </p>
                    <Button
                      onClick={handleContact}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-brand-yellow to-primary hover:from-accent-light hover:to-primary-darker text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Falar com a Tchova</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-green-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-green-600 dark:text-green-400">Pagamento Autorizado</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">
                      Pagamento autorizado pela Tchova Digital
                    </p>
                    <Button
                      onClick={handlePayment}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-brand-yellow to-primary hover:from-accent-light hover:to-primary-darker text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Efetuar Pagamento do Projeto</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Final - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-brand-yellow/5 via-primary/5 to-brand-green/5 border border-brand-yellow/20 shadow-2xl">
              <div className="bg-gradient-to-r from-brand-yellow/15 to-primary/15 p-4 xs:p-6 sm:p-8 lg:p-12 border-b border-white/20">
                <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-4xl font-black text-foreground text-center mb-2 sm:mb-4 lg:mb-6">
                  {!isPaymentAuthorized ? 'Pronto para atrair mais clientes?' : 'Sua estratégia está a caminho!'}
                </h2>
                {!isPaymentAuthorized && (
                  <p className="text-muted-foreground text-center text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
                    Fale com a Tchova para discutir sua estratégia de marketing e receber um orçamento personalizado.
                  </p>
                )}
              </div>

              <div className="p-4 xs:p-6 sm:p-8 lg:p-12 space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <Button
                    onClick={handleContact}
                    className="rounded-[20px] sm:rounded-[24px] py-2 px-4 sm:px-6 font-bold transition-all duration-400 h-12 sm:h-14 lg:h-20 bg-gradient-to-r from-brand-yellow via-primary to-brand-green hover:from-accent-light hover:to-brand-green text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] text-sm sm:text-base lg:text-xl relative overflow-hidden group border-2 border-white/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2 sm:mr-3 relative z-10" />
                    <span className="relative z-10">Falar com a Tchova</span>
                  </Button>
                </div>

                {!isPaymentAuthorized && (
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                      <span className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                        O pagamento só é liberado após a conversa.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Audiovisual Section - Mobile First */}
        {isAudiovisual && (
          <>
            {/* Sobre o Serviço - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <Lightbulb className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-brand-yellow mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-brand-green to-primary bg-clip-text text-transparent font-black">Sobre o Serviço</span>
              </h2>
              
              <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Cobertura profissional de eventos</strong> com filmagem, fotografia e edição de alta qualidade.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Registe os <strong className="text-foreground">momentos especiais</strong> com qualidade cinematográfica e entrega em USB.
                </p>
              </div>
            </div>

            {/* Pacotes - Mobile First */}
            <div id="pacotes-audiovisual" className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl scroll-mt-20 sm:scroll-mt-24">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <Package className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-primary mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent font-black">Pacotes</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {audiovisualPackages.map((pkg, index) => (
                  <div
                    key={index}
                    className={`group relative bg-gradient-to-br from-primary/10 via-brand-green/5 to-transparent backdrop-blur-lg rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 border ${pkg.popular ? 'border-primary/50 ring-2 ring-primary/30' : 'border-primary/20'} hover:border-primary/40 transition-all duration-500 hover:scale-[1.02]`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-primary to-brand-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-brand-green rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300 text-white">
                        {pkg.icon}
                      </div>
                      <h3 className="font-bold text-base sm:text-lg text-foreground mb-1">{pkg.name}</h3>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
                          {pkg.price.toLocaleString('pt-MZ')}
                        </span>
                        <span className="text-sm text-muted-foreground">MZN</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2 mb-4">
                      {pkg.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center text-xs sm:text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      onClick={() => handleRequestQuote(pkg.name, pkg.price)}
                      className={`w-full rounded-xl py-2 px-4 font-bold transition-all duration-400 h-10 sm:h-12 text-sm ${pkg.popular ? 'bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-lg hover:shadow-xl' : 'bg-white/10 hover:bg-white/20 text-foreground border border-primary/30'}`}
                    >
                      Solicitar
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Extras - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-yellow/20 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <Plus className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-brand-yellow mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-brand-yellow to-accent-light bg-clip-text text-transparent font-black">Extras</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {audiovisualExtras.map((extra, index) => (
                  <div
                    key={index}
                    onClick={() => toggleExtra(extra.name)}
                    className={`group cursor-pointer bg-gradient-to-br from-brand-yellow/10 via-primary/5 to-transparent backdrop-blur-lg rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 border ${selectedExtras.includes(extra.name) ? 'border-brand-yellow/50 ring-2 ring-brand-yellow/30' : 'border-brand-yellow/20'} hover:border-brand-yellow/40 transition-all duration-500 hover:scale-[1.02]`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-brand-yellow to-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-white">
                          {extra.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base text-foreground">{extra.name}</h3>
                          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-brand-yellow to-primary bg-clip-text text-transparent">
                            +{extra.price.toLocaleString('pt-MZ')} MZN
                          </span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${selectedExtras.includes(extra.name) ? 'bg-brand-yellow border-brand-yellow' : 'border-brand-yellow/30'}`}>
                        {selectedExtras.includes(extra.name) && <CheckCircle className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Processo - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <ClipboardList className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-primary mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent font-black">Processo</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  { step: 1, title: 'Contato', description: 'Cliente entra em contacto pelo WhatsApp' },
                  { step: 2, title: 'Definição do evento', description: 'Alinhamos detalhes do evento e necessidades' },
                  { step: 3, title: 'Orçamento', description: 'Apresentamos proposta personalizada' },
                  { step: 4, title: 'Pagamento', description: 'Confirmação mediante pagamento' },
                  { step: 5, title: 'Cobertura', description: 'Filmagem e fotografia no evento' },
                  { step: 6, title: 'Entrega', description: 'Recebe os arquivos editados em USB' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-6 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-gradient-to-r from-primary/10 via-brand-green/5 to-transparent backdrop-blur-lg border border-primary/20 hover:border-primary/40 transition-all duration-500"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary to-brand-green text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base lg:text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 text-primary dark:text-primary">{item.title}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagamento - Botão Inteligente - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 text-center">
                <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent font-black">
                  💳 Pagamento
                </span>
              </h2>
              
              {/* Info sobre o fluxo de pagamento */}
              <div className="bg-gradient-to-r from-primary/10 via-brand-green/5 to-transparent backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-primary/30 mb-4 sm:mb-6 lg:mb-8 text-center">
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                  <strong>Pagamento após conversa e autorização</strong>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  O valor é definido conforme o pacote escolhido e extras selecionados.
                </p>
              </div>

              {/* Métodos de Pagamento */}
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-center mb-3 sm:mb-4 text-muted-foreground">Métodos:</h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Carteira Local</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Cartão</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">PayPal</span>
              </div>
              
              {!isPaymentAuthorized ? (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-amber-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <LockKeyhole className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-amber-600 dark:text-amber-400 text-center">Pagamento autorizado após conversa no WhatsApp</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mb-4 sm:mb-6">
                      Para liberar o pagamento, fale primeiro com a Tchova.
                    </p>
                    <Button
                      onClick={handleContact}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Falar com a Tchova</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-green-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-green-600 dark:text-green-400">Pagamento Autorizado</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">
                      Pagamento autorizado pela Tchova Digital
                    </p>
                    <Button
                      onClick={handlePayment}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Efetuar Pagamento do Pacote</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Final - Mobile First */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-primary/5 via-brand-green/5 to-brand-yellow/5 border border-primary/20 shadow-2xl">
              <div className="bg-gradient-to-r from-primary/15 to-brand-green/15 p-4 xs:p-6 sm:p-8 lg:p-12 border-b border-white/20">
                <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-4xl font-black text-foreground text-center mb-2 sm:mb-4 lg:mb-6">
                  {!isPaymentAuthorized ? 'Pronto para registar seu evento?' : 'Seu evento será memorável!'}
                </h2>
                {!isPaymentAuthorized && (
                  <p className="text-muted-foreground text-center text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
                    Fale com a Tchova para escolher o pacote ideal para seu evento.
                  </p>
                )}
              </div>

              <div className="p-4 xs:p-6 sm:p-8 lg:p-12 space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <Button
                    onClick={handleContact}
                    className="rounded-[20px] sm:rounded-[24px] py-2 px-4 sm:px-6 font-bold transition-all duration-400 h-12 sm:h-14 lg:h-20 bg-gradient-to-r from-primary via-brand-green to-brand-yellow hover:from-primary-darker hover:to-brand-yellow text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] text-sm sm:text-base lg:text-xl relative overflow-hidden group border-2 border-white/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2 sm:mr-3 relative z-10" />
                    <span className="relative z-10">Falar com a Tchova</span>
                  </Button>
                </div>

                {!isPaymentAuthorized && (
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <LockKeyhole className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                      <span className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                        O pagamento só é liberado após a conversa.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Importação Assistida Section - Mobile First - Trust Focus */}
        {isImportacao && (
          <>
            {/* Sobre o Serviço - Trust Focus */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <ShieldCheck className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-primary mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent font-black">Sobre o Serviço</span>
              </h2>
              
              <div className="max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Serviço <strong className="text-foreground">100% seguro</strong> de importação internacional com <strong className="text-foreground">acompanhamento humano</strong> dedicado.
                </p>
                <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                  Da <strong className="text-foreground">China, EUA e outros países</strong> até à porta de sua casa, com rastreamento privado e suporte personalizado.
                </p>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-3 sm:p-4 text-center border border-primary/20">
                  <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-primary mx-auto mb-2" />
                  <span className="text-xs sm:text-sm font-bold text-foreground">100% Seguro</span>
                </div>
                <div className="bg-gradient-to-br from-brand-green/10 to-brand-green/5 rounded-2xl p-3 sm:p-4 text-center border border-brand-green/20">
                  <Headphones className="w-6 h-6 sm:w-8 sm:h-8 text-brand-green mx-auto mb-2" />
                  <span className="text-xs sm:text-sm font-bold text-foreground">Suporte Humano</span>
                </div>
                <div className="bg-gradient-to-br from-brand-yellow/10 to-brand-yellow/5 rounded-2xl p-3 sm:p-4 text-center border border-brand-yellow/20">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-brand-yellow mx-auto mb-2" />
                  <span className="text-xs sm:text-sm font-bold text-foreground">Global</span>
                </div>
              </div>
            </div>

            {/* Como Funciona - 5 Etapas - Mobile First */}
            <div id="como-funciona-importacao" className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-yellow/20 shadow-2xl scroll-mt-20 sm:scroll-mt-24">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <ClipboardList className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-brand-yellow mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-brand-yellow to-accent-light bg-clip-text text-transparent font-black">Como Funciona</span>
              </h2>
              
              <div className="space-y-3 sm:space-y-4">
                {[
                  { step: 1, title: 'Consulta', description: 'Fale connosco sobre o produto que deseja importar', icon: <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" /> },
                  { step: 2, title: 'Análise', description: 'Analisamos fornecedores, custos e viabilidade', icon: <Search className="w-5 h-5 sm:w-6 sm:h-6" /> },
                  { step: 3, title: 'Proposta', description: 'Recebe uma proposta detalhada com valores e prazos', icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" /> },
                  { step: 4, title: 'Confirmação', description: 'Aprova a proposta e efetua o pagamento', icon: <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /> },
                  { step: 5, title: 'Ativação', description: 'Iniciamos a importação com acompanhamento privado', icon: <Rocket className="w-5 h-5 sm:w-6 sm:h-6" /> }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-6 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-gradient-to-r from-primary/10 via-brand-green/5 to-transparent backdrop-blur-lg border border-primary/20 hover:border-primary/40 transition-all duration-500"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary to-brand-green text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base lg:text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 text-primary dark:text-primary">{item.title}</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sistema Privado - Demo Visual */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-green/20 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                <LockKeyhole className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-brand-green mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                <span className="bg-gradient-to-r from-brand-green to-primary bg-clip-text text-transparent font-black">Sistema Privado de Acompanhamento</span>
              </h2>
              
              <p className="text-sm sm:text-base text-muted-foreground text-center mb-6 sm:mb-8">
                Após ativação, terá acesso a um painel privado para acompanhar sua importação em tempo real.
              </p>

              {/* Demo Visual do Painel */}
              <div className="bg-brand-dark/90 backdrop-blur-md rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-white/20 shadow-2xl">
                {/* Header do Painel */}
                <div className="flex items-center justify-between mb-4 sm:mb-6 pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-brand-green rounded-lg flex items-center justify-center">
                      <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm sm:text-base">Painel de Importação</h4>
                      <p className="text-white/60 text-xs">ID: #IMP-2024-001</p>
                    </div>
                  </div>
                  <div className="px-2 sm:px-3 py-1 bg-brand-yellow/20 rounded-full">
                    <span className="text-brand-yellow text-xs font-bold">Em Trânsito</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex justify-between text-xs text-white/60 mb-2">
                    <span>Progresso</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2 sm:h-3 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-primary to-brand-green rounded-full transition-all duration-1000"></div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-3 sm:space-y-4">
                  {[
                    { status: 'completed', title: 'Pedido Confirmado', date: '15 Jan 2024', icon: <CheckCircle className="w-4 h-4" /> },
                    { status: 'completed', title: 'Pagamento Aprovado', date: '16 Jan 2024', icon: <CheckCircle className="w-4 h-4" /> },
                    { status: 'completed', title: 'Enviado pela Transportadora', date: '18 Jan 2024', icon: <CheckCircle className="w-4 h-4" /> },
                    { status: 'current', title: 'Em Trânsito Internacional', date: 'Em andamento', icon: <Truck className="w-4 h-4" /> },
                    { status: 'pending', title: 'Desembaraço Aduaneiro', date: 'Aguardando', icon: <Clock className="w-4 h-4" /> },
                    { status: 'pending', title: 'Entrega Final', date: 'Previsto: 25 Jan', icon: <MapPin className="w-4 h-4" /> }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.status === 'completed' ? 'bg-primary text-white' :
                        item.status === 'current' ? 'bg-brand-yellow text-white animate-pulse' :
                        'bg-white/10 text-white/40'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h5 className={`text-sm sm:text-base font-medium ${
                          item.status === 'completed' ? 'text-white' :
                          item.status === 'current' ? 'text-brand-yellow' :
                          'text-white/40'
                        }`}>{item.title}</h5>
                        <p className="text-xs text-white/40">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer do Painel */}
                <div className="mt-6 sm:mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Headphones className="w-4 h-4 text-brand-green" />
                    <span className="text-xs text-white/60">Suporte disponível</span>
                  </div>
                  <div className="text-xs text-white/40">
                    Última atualização: há 2 horas
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground text-center mt-4 sm:mt-6 italic">
                * Imagem ilustrativa. O painel real será disponibilizado após ativação do serviço.
              </p>
            </div>

            {/* Pagamento - Só após proposta aprovada */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 text-center">
                <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent font-black">
                  💳 Pagamento
                </span>
              </h2>
              
              {/* Info sobre o fluxo de pagamento */}
              <div className="bg-gradient-to-r from-primary/10 via-brand-green/5 to-transparent backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-primary/30 mb-4 sm:mb-6 lg:mb-8 text-center">
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                  <strong>O pagamento é efetuado apenas após aprovação da proposta.</strong>
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Receba a proposta, analise e só pague se estiver de acordo.
                </p>
              </div>

              {/* Métodos de Pagamento */}
              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-center mb-3 sm:mb-4 text-muted-foreground">Métodos:</h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Carteira Local</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Cartão</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">PayPal</span>
              </div>
              
              {!isPaymentAuthorized ? (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-amber-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <LockKeyhole className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-amber-600 dark:text-amber-400 text-center">Pagamento autorizado após proposta aprovada</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mb-4 sm:mb-6">
                      Para iniciar, solicite uma consulta e receba sua proposta.
                    </p>
                    <Button
                      onClick={handleContact}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Solicitar Consulta</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-green-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-green-600 dark:text-green-400">Pagamento Autorizado</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">
                      Pagamento autorizado pela Tchova Digital
                    </p>
                    <Button
                      onClick={handlePayment}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Efetuar Pagamento da Importação</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Final */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-primary/5 via-brand-green/5 to-brand-yellow/5 border border-primary/20 shadow-2xl">
              <div className="bg-gradient-to-r from-primary/15 to-brand-green/15 p-4 xs:p-6 sm:p-8 lg:p-12 border-b border-white/20">
                <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-4xl font-black text-foreground text-center mb-2 sm:mb-4 lg:mb-6">
                  {!isPaymentAuthorized ? 'Pronto para importar com segurança?' : 'Sua importação está a caminho!'}
                </h2>
                {!isPaymentAuthorized && (
                  <p className="text-muted-foreground text-center text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
                    Fale com a Tchova para receber uma proposta personalizada e importar com total segurança.
                  </p>
                )}
              </div>

              <div className="p-4 xs:p-6 sm:p-8 lg:p-12 space-y-4 sm:space-y-6 lg:space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  <Button
                    onClick={handleContact}
                    className="rounded-[20px] sm:rounded-[24px] py-2 px-4 sm:px-6 font-bold transition-all duration-400 h-12 sm:h-14 lg:h-20 bg-gradient-to-r from-primary via-brand-green to-brand-yellow hover:from-primary-darker hover:to-brand-yellow text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] text-sm sm:text-base lg:text-xl relative overflow-hidden group border-2 border-white/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <ClipboardCheck className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2 sm:mr-3 relative z-10" />
                    <span className="relative z-10">Solicitar Consulta</span>
                  </Button>
                  <Button
                    onClick={handleContact}
                    className="rounded-[20px] sm:rounded-[24px] py-2 px-4 sm:px-6 font-bold transition-all duration-400 h-12 sm:h-14 lg:h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] text-sm sm:text-base lg:text-xl relative overflow-hidden group border-2 border-white/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2 sm:mr-3 relative z-10" />
                    <span className="relative z-10">Falar no WhatsApp</span>
                  </Button>
                </div>

                {!isPaymentAuthorized && (
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      <span className="text-muted-foreground text-xs sm:text-sm lg:text-base">
                        Pagamento 100% seguro após aprovação da proposta.
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Other Services Content */}
        {!isGSM && !isDesignGrafico && !isWebsites && !isMarketing && !isAudiovisual && !isImportacao && (
          <>
            <div className="liquid-card rounded-[48px] p-8 lg:p-12 mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 shadow-2xl">
              <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-8 lg:mb-12 flex items-center">
                <Lightbulb className="text-4xl lg:text-6xl text-amber-500 mr-3 lg:mr-4" />
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-black">
                  {service.category === 'Design Gráfico' && 'O Que É Design Gráfico'}
                  {service.category === 'Desenvolvimento Web' && 'O Que É Desenvolvimento Web'}
                  {service.category === 'Marketing Digital' && 'O Que É Marketing Digital'}
                  {service.category === 'Produção Audiovisual' && 'Sobre o Serviço'}
                  {service.category === 'Importação' && 'O Que É Importação'}
                </span>
              </h2>

              <div className="max-w-4xl mx-auto text-center">
                <div className="space-y-6">
                  {service.category === 'Design Gráfico' && (
                    <div className="space-y-4">
                      <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                        Design gráfico é a criação de elementos visuais que representam sua marca. 
                        É o que faz seu negócio ser reconhecido e lembrado pelos clientes.
                      </p>
                      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                        Um bom design transmite confiança, profissionalismo e ajuda você a se destacar da concorrência.
                      </p>
                      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                        Usamos cores, formas e textos que refletem a personalidade do seu negócio.
                      </p>
                    </div>
                  )}

                  {service.category === 'Desenvolvimento Web' && (
                    <div className="space-y-4">
                      <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                        Um site profissional é a cara do seu negócio na internet. É onde clientes potenciais conhecem sua empresa, confiam e fazem contato.
                      </p>
                      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                        Não basta ter um site bonito. Ele precisa funcionar bem, carregar rápido e ajudar você a converter visitantes em clientes.
                      </p>
                      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                        Criamos sites sob medida, pensando no seu público e nos seus objetivos de negócio.
                      </p>
                    </div>
                  )}

                  {service.category === 'Marketing Digital' && (
                    <div className="space-y-4">
                      <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                        Marketing digital não é fórmula mágica. É um processo contínuo de estratégia, execução e análise.
                      </p>
                      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                        Cada negócio é único. Por isso, não trabalhamos com planos genéricos. Primeiro entendemos seus objetivos, depois criamos uma estratégia sob medida.
                      </p>
                      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                        O que oferecemos é experiência e dedicação para fazer seu investimento em marketing dar resultados reais.
                      </p>
                    </div>
                  )}

                  {service.category === 'Produção Audiovisual' && (
                    <div className="space-y-4">
                      <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                        Cobertura profissional completa de eventos com filmagem em alta definição, fotografia e edição premium. Pacotes estruturados para diferentes necessidades e orçamentos.
                      </p>
                      <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                        8 recursos incluídos. Entrega: 10-15 dias úteis após o evento.
                      </p>
                    </div>
                  )}

                  {service.category === 'Importação' && (
                    <div className="space-y-6">
                      <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                        Este serviço funciona por consulta. Após análise e confirmação, o pagamento é realizado pela TchovaDigital e a importação é acompanhada num sistema privado até a chegada do produto.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-6">
                        <div className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent backdrop-blur-lg rounded-[24px] p-6 border border-blue-200/30">
                          <div className="flex items-center space-x-3 mb-3">
                            <CheckCircle2 className="w-6 h-6 text-blue-500" />
                            <span className="font-bold text-blue-600 dark:text-blue-400">5 Recursos Incluídos</span>
                          </div>
                          <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>• Análise de produto e fornecedor</li>
                            <li>• Negociação internacional</li>
                            <li>• Documentação aduaneira</li>
                            <li>• Transporte e logística</li>
                            <li>• Acompanhamento privado</li>
                          </ul>
                        </div>
                        <div className="bg-gradient-to-br from-green-500/10 via-green-400/5 to-transparent backdrop-blur-lg rounded-[24px] p-6 border border-green-200/30">
                          <div className="flex items-center space-x-3 mb-3">
                            <Clock className="w-6 h-6 text-green-500" />
                            <span className="font-bold text-green-600 dark:text-green-400">Entrega: 7–14 dias úteis</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Prazo médio de entrega após confirmação do pagamento e liberação aduaneira.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rest of the existing content for other services... */}
          </>
        )}
      </main>
    </div>
  );
};

export default ServiceDetails;
