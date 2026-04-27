import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import VerificationModal from '@/components/VerificationModal';
import { GSMServicePage } from '@/components/gsm';
import { INDIVIDUAL_SERVICES, getWhatsAppMessage } from '@/config/pricing';
import { env } from '@/config/env';
import { useAuth } from '@/contexts/AuthContext';
import { isActionVerified, markActionVerified } from '@/utils/verificationCode';
import { 
  servicesData, 
  audiovisualPackages as AUDIO_PACKAGES
} from '@/constants/servicesData';
import { InteractiveServiceCard } from '@/components/InteractiveServiceCard';
import { InteractiveContactModal } from '@/components/InteractiveContactModal';
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";
import { ServiceVisual } from '@/components/ServiceVisual';

import {
  Package,
  Timer,
  Rocket,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ServiceDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { validateClientToken } = useAuth();
  
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationProjectId, setVerificationProjectId] = useState('');
  const [verificationPhoneNumber, setVerificationPhoneNumber] = useState('');
  const [isContactModalOpen, setContactModalOpen] = useState(false);
  const [pendingCheckoutUrl, setPendingCheckoutUrl] = useState<string | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const headerSectionRef = useRef<HTMLDivElement>(null);
  const nextEvolRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  const bentoGridRef = useRef<HTMLDivElement>(null);

  const serviceId = searchParams.get('id');
  const service = INDIVIDUAL_SERVICES.find(s => s.id.toString() === serviceId) || null;

  const isAudiovisual = service?.category === 'Produção Audiovisual';
  const isGSM = service?.category === 'Assistência GSM';
  const isDesignGrafico = service?.category === 'Design Gráfico';
  const isWebsites = service?.category === 'Desenvolvimento Web';
  const isMarketing = service?.category === 'Marketing Digital';
  const isImportacao = service?.category === 'Importação';
  
  const serviceKey = isDesignGrafico ? 'design' : 
                     isWebsites ? 'websites' : 
                     isMarketing ? 'marketing' : 
                     isAudiovisual ? 'audiovisual' : 
                     isImportacao ? 'importacao' :
                     null;
  
  const heroData = serviceKey ? servicesData[serviceKey as keyof typeof servicesData] : null;

  useGSAP(() => {
    if (!service || !mainRef.current || !heroData) return;

    // 1. Initial Page Entrance
    const tl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });
    
    if (headerSectionRef.current) tl.from(headerSectionRef.current, { y: 30, opacity: 0 });
    if (nextEvolRef.current) tl.from(nextEvolRef.current, { y: 30, opacity: 0 }, "-=0.5");
    if (ctaSectionRef.current) tl.from(ctaSectionRef.current, { scale: 0.95, opacity: 0 }, "-=0.4");

    // 2. ScrollTrigger for sequential sections
    const sections = gsap.utils.toArray('.scroll-section');
    sections.forEach((section: any) => {
      const cards = section.querySelectorAll('.stagger-card');
      
      if (cards.length > 0) {
        gsap.from(cards, {
          y: window.innerWidth < 768 ? 5 : 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: window.innerWidth < 768 ? 'top bottom' : 'top 92%',
            toggleActions: 'play none none none'
          }
        });
      } else {
        gsap.from(section, {
          y: window.innerWidth < 768 ? 5 : 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: window.innerWidth < 768 ? 'top bottom' : 'top 92%',
            toggleActions: 'play none none none'
          }
        });
      }
    });

    // Safety check for staggered elements in bento grid
    if (bentoGridRef.current) {
      const gridItems = bentoGridRef.current.querySelectorAll('.bento-item');
      if (gridItems.length > 0) {
        gsap.from(gridItems, {
          y: window.innerWidth < 768 ? 10 : 50,
          opacity: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bentoGridRef.current,
            start: window.innerWidth < 768 ? "top bottom" : "top 80%",
          }
        });
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };

  }, { dependencies: [serviceId, !!heroData], scope: mainRef });

  const handleContact = () => {
    if (!service) return;
    const message = getWhatsAppMessage('service', service.title);
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleRequestQuote = (packageName: string, price: number) => {
    const message = `Olá! Gostaria de pedir um orçamento para Produção Audiovisual.\n\nPacote: ${packageName}\nValor base: ${price.toLocaleString('pt-MZ')} MZN\n\nPodem entrar em contacto para alinharmos os detalhes?`;
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // ========================================
  // SISTEMA DE AUTORIZAÇÃO DE PAGAMENTO
  // ========================================
  const authorizationToken = searchParams.get('token');
  const payParam = searchParams.get('pay');
  const tokenServiceId = searchParams.get('serviceId');
  const tokenPrice = searchParams.get('price');
  const tokenExpiry = searchParams.get('expires');
  
  const isTokenValid = authorizationToken && (!tokenExpiry || new Date(tokenExpiry) > new Date());
  const isServiceMatch = !authorizationToken || !tokenServiceId || tokenServiceId === serviceId;
  const hasAuthorization = (payParam === 'enabled' || !!authorizationToken) && isTokenValid && isServiceMatch;
  const paymentType = (searchParams.get('paymentType') as 'entry-50' | 'full' | 'final-50' | 'installment') || 'entry-50';
  const isPaymentAuthorized = hasAuthorization;

  const handlePayment = async () => {
    if (!service) return;
    if (!hasAuthorization || !authorizationToken) {
      handleContact();
      return;
    }

    const actionId = 'approve_milestone';

    try {
      const result = await validateClientToken(authorizationToken);
      if (!result.valid || !result.project) {
        handleContact();
        return;
      }

      const parsedTokenPrice = tokenPrice ? parseInt(tokenPrice, 10) : NaN;
      const shouldIncludePrice = Number.isFinite(parsedTokenPrice) && parsedTokenPrice > 0;
      const priceParam = shouldIncludePrice ? `&price=${parsedTokenPrice}` : '';
      const checkoutUrl = `/checkout/seguro?serviceId=${service.id}&serviceTitle=${encodeURIComponent(service.title)}&serviceCategory=${encodeURIComponent(service.category)}&project=${encodeURIComponent(result.project.id)}&paymentType=${encodeURIComponent(paymentType)}${priceParam}`;

      if (isActionVerified(actionId)) {
        navigate(checkoutUrl);
        return;
      }

      setPendingCheckoutUrl(checkoutUrl);
      setVerificationProjectId(result.project.id);
      setVerificationPhoneNumber(result.project.clientPhone);
      setVerificationOpen(true);
    } catch (err) {
      console.error('Payment authorization/verification error:', err);
      handleContact();
    }
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-background relative">
        <Header />
        <div className="container relative z-10 mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-[48px] p-8 shadow-xl">
            <h1 className="text-2xl font-bold mb-4 gradient-text">Serviço não encontrado</h1>
            <Button onClick={() => navigate('/')} className="w-full h-12 rounded-[24px] font-semibold">Voltar ao Início</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={mainRef} className="min-h-screen bg-background relative pb-10 sm:pb-20 overflow-x-hidden">
      {/* Cinematic Background Atmosphere & Grain */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[100vw] h-[100vh] bg-[radial-gradient(circle_at_70%_20%,rgba(34,197,94,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/10 via-cyan-400/8 to-purple-500/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 via-teal-400/8 to-blue-500/10 rounded-full blur-[120px] opacity-50" />
        
        {/* Subtle Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      </div>

      {!isGSM && <Header />}

      <main className={isGSM ? "container relative z-10 mx-auto px-0 pb-6" : "container relative z-10 mx-auto px-4 pt-24 sm:pt-20 pb-6 max-w-7xl"}>
        {isGSM ? (
          <GSMServicePage />
        ) : heroData ? (
          <>
            {/* HERO SECTION MONUMENTAL — TWO COLUMNS ON DESKTOP */}
            <div ref={headerSectionRef} className="relative mb-20 sm:mb-32 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 min-h-[70vh]">
              
              {/* Left Column: Monumental Content */}
              <div className="flex-1 text-center lg:text-left z-20">
                <Badge variant="outline" className="mb-6 px-5 py-2 border-primary/30 text-primary bg-primary/10 uppercase tracking-[0.3em] text-[10px] font-black rounded-full backdrop-blur-md">
                  Ecossistema de Elite
                </Badge>
                
                <h1 className="text-5xl md:text-8xl lg:text-[110px] font-black dark:text-white text-slate-900 mb-8 leading-[0.85] tracking-tighter">
                  <span className="block opacity-30 text-xl sm:text-4xl lg:text-5xl mb-2 uppercase tracking-widest font-bold">Solução em</span>
                  <span className="bg-gradient-to-r dark:from-brand-green dark:via-brand-bright dark:to-brand-yellow from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent uppercase inline-block filter drop-shadow-sm">
                    {heroData?.title || service?.title}
                  </span>
                </h1>
                
                <div className="hidden lg:block w-32 h-2 bg-gradient-to-r from-primary to-transparent mb-10 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)]" />
                
                <p className="text-lg sm:text-2xl text-foreground/90 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed mb-10 px-2 sm:px-0 drop-shadow-sm">
                  {heroData?.heroDescription || service?.description}
                </p>

                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Button onClick={() => setContactModalOpen(true)} className="rounded-full px-8 py-7 bg-primary text-white font-black text-lg hover:scale-105 transition-all shadow-[0_20px_50px_rgba(34,197,94,0.3)] uppercase tracking-tighter">
                    Acionar Especialista
                  </Button>
                  <Button variant="outline" className="rounded-full px-8 py-7 border-white/20 text-white font-bold text-lg hover:bg-white/5 transition-all backdrop-blur-sm">
                    Ver Arsenal
                  </Button>
                </div>
              </div>

              {/* Right Column: Dynamic Visual Illustration */}
              <div className="flex-1 relative w-full lg:w-auto h-[400px] lg:h-[600px] flex items-center justify-center">
                {/* Visual Anchor */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.2)_0%,transparent_70%)] opacity-60 animate-pulse" />
                
                {/* The Dynamic Module */}
                <ServiceVisual 
                  type={serviceKey || ''} 
                  className="scale-110 lg:scale-[1.6] drop-shadow-[0_0_80px_rgba(34,197,94,0.25)]"
                />

                {/* Floating Tech Badges (Emotion/Context) */}
                <div className="absolute top-10 right-0 bg-white/5 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-2xl animate-float pointer-events-none hidden sm:block">
                  <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">Performance</div>
                  <div className="text-3xl font-black text-white leading-none tracking-tighter">20<span className="text-primary">x</span></div>
                </div>
              </div>

            </div>

            <div className="space-y-6 sm:space-y-24">
              
              {/* O FATOR DIFERENCIAL — MONUMENTAL GRID LAYOUT */}
              {heroData?.heroCards && heroData.heroCards.length > 0 && (
                <div className="scroll-section" ref={bentoGridRef}>
                  <div className="flex flex-col items-center gap-6 mb-16 sm:mb-24 justify-center text-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-2 border border-primary/20 backdrop-blur-xl">
                       <Rocket className="w-10 h-10 text-primary animate-bounce-slow" />
                    </div>
                    <h2 className="text-5xl md:text-7xl lg:text-9xl font-black dark:text-white text-slate-900 tracking-tighter uppercase leading-[0.85]">
                      O Fator <br/><span className="text-primary italic">Diferencial</span>
                    </h2>
                    <p className="text-foreground/80 text-xl max-w-2xl font-medium px-4 leading-relaxed">Engenharia de elite para quem não aceita o comum. Cada detalhe é um multiplicador de resultados extraordinários.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
                    {heroData.heroCards.map((card: any, i: number) => (
                      <div 
                        key={i} 
                        className={`bento-item ${
                          card.spans === 2 
                            ? "md:col-span-2 lg:col-span-6 lg:row-span-2" 
                            : "md:col-span-1 lg:col-span-3"
                        }`}
                      >
                        <InteractiveServiceCard {...card} featured={card.spans === 2} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ARSENAL TÁTICO — ELITE SPEC SHEET */}
              {(heroData as any).includes && (heroData as any).includes.length > 0 && (
                <div className="scroll-section">
                  <div className="flex flex-col items-center lg:items-start gap-4 mb-10 sm:mb-16">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-1 bg-primary rounded-full" />
                      <h2 className="text-3xl md:text-5xl font-black dark:text-white text-slate-900 tracking-tighter uppercase">Arsenal <span className="text-primary">Tático</span></h2>
                    </div>
                    <p className="text-muted-foreground text-lg lg:text-left text-center max-w-2xl font-medium">Especificações técnicas e componentes de elite integrados à sua solução.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-xl">
                    {(heroData as any).includes.map((item: any, idx: number) => (
                      <div key={item.name} className="stagger-card group relative p-6 sm:p-10 bg-black/20 hover:bg-white/[0.03] transition-all duration-500 border-b lg:border-b-0 lg:border-r border-white/5 last:border-0">
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                          <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${item.gradient} rounded-2xl flex items-center justify-center shadow-2xl text-white transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                            {item.icon}
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-primary uppercase tracking-[0.3em]">Module_0{idx + 1}</span>
                              <Badge variant="outline" className="border-white/10 text-[10px] opacity-50">Active_Status</Badge>
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{item.name}</h3>
                            <div className="h-px w-12 bg-primary/30 group-hover:w-full transition-all duration-700" />
                            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base font-medium">
                              Integração de alta performance focada em resultados escaláveis e arquitetura de ponta.
                            </p>
                            <div className="flex gap-2 pt-2">
                              {['High-End', 'Proprietary', 'AI-Ready'].map(tag => (
                                <span key={tag} className="text-[9px] font-mono py-1 px-2 border border-white/5 rounded-md opacity-40 uppercase">{tag}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ATIVAÇÃO TCHOVA — ELITE JOURNEY */}
              {heroData?.process && heroData.process.length > 0 && (
                <div className="scroll-section max-w-5xl mx-auto relative px-4 sm:px-0">
                  <div className="flex flex-col items-center gap-4 mb-16 sm:mb-24 justify-center text-center">
                    <Badge variant="outline" className="px-4 py-1 border-brand-yellow/30 text-brand-yellow bg-brand-yellow/5 uppercase tracking-[0.2em] text-[9px] font-bold rounded-full">Protocolo de Execução</Badge>
                    <h2 className="text-4xl md:text-7xl font-black dark:text-white text-slate-900 tracking-tighter uppercase leading-none">
                      Ativação <span className="text-brand-yellow">Tchova</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl font-medium">Da concepção ao domínio de mercado: o fluxo de alta densidade.</p>
                  </div>

                  <div className="relative space-y-12 sm:space-y-0">
                    {/* Visual Journey Line — Gradient Connection */}
                    <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-primary via-brand-yellow to-brand-green opacity-20 hidden sm:block -translate-x-1/2" />

                    {heroData.process.map((item: any, i: number) => (
                      <div key={item.title} className={`stagger-card flex flex-col sm:flex-row items-center gap-8 sm:gap-0 relative ${i % 2 === 0 ? 'sm:flex-row-reverse' : ''} mb-20 last:mb-0`}>
                        
                        {/* Content Side */}
                        <div className="flex-1 w-full sm:w-auto">
                          <div className={`p-8 sm:p-10 rounded-[40px] dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200 hover:border-primary/40 transition-all duration-500 group shadow-xl ${i % 2 === 0 ? 'sm:ml-12 lg:ml-20' : 'sm:mr-12 lg:mr-20'}`}>
                            <div className="flex items-center gap-4 mb-4">
                              <span className="text-xs font-mono text-primary/50 tracking-widest uppercase">Phase_0{item.step}</span>
                              <div className="h-px flex-1 bg-white/5" />
                            </div>
                            <h3 className="text-2xl sm:text-4xl font-black text-white mb-4 tracking-tight uppercase group-hover:text-primary transition-colors">{item.title}</h3>
                            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed font-medium">{item.description}</p>
                          </div>
                        </div>

                        {/* Central Tech Node */}
                        <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center z-20">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black border-4 border-white/10 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.2)] group">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="relative z-10 font-black text-2xl text-white">{item.step}</span>
                          </div>
                        </div>

                        {/* Spacer for layout symmetry */}
                        <div className="hidden sm:block flex-1" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AUDIOVISUAL SPECIAL PACKAGES */}
              {isAudiovisual && (
                <div className="scroll-section border-t dark:border-white/10 border-slate-200 pt-16 mt-16">
                  <div className="flex flex-col items-center gap-3 mb-4 sm:mb-12 justify-center text-center">
                    <Package className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl md:text-4xl font-black dark:text-white text-slate-900 tracking-tight">Pacotes Especiais</h2>
                    <p className="text-muted-foreground font-medium">Soluções modulares para cada nível de impacto.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {AUDIO_PACKAGES.map((pkg: any) => (
                      <div key={pkg.name} className={`stagger-card group relative dark:bg-white/5 bg-slate-50 backdrop-blur-xl rounded-[32px] p-8 border ${pkg.popular ? 'border-primary shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-1 ring-primary/20' : 'border-slate-200 dark:border-white/10'} hover:scale-[1.03] flex flex-col h-full`}>
                        <div className="text-center mb-8 flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-primary to-brand-green rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl text-white transform group-hover:-translate-y-2 group-hover:shadow-[0_10px_20px_rgba(34,197,94,0.3)] transition-all duration-500">{pkg.icon}</div>
                          <h3 className="font-bold text-xl dark:text-white text-slate-900 mb-2">{pkg.name}</h3>
                          <div className="flex items-baseline justify-center gap-1"><span className="text-4xl font-black dark:text-white text-slate-900">{pkg.price.toLocaleString('pt-MZ')}</span><span className="text-sm font-medium text-muted-foreground">MZN</span></div>
                        </div>
                        <ul className="space-y-4 mb-8 flex-grow">
                          {pkg.features.map((f: string, fi: number) => (
                            <li key={fi} className="flex items-start text-sm text-foreground/80 font-medium">
                              <CheckCircle2 className="w-5 h-5 text-brand-green mr-3 mt-0.5 flex-shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto">
                          <Button onClick={() => handleRequestQuote(pkg.name, pkg.price)} className="w-full rounded-2xl py-7 font-black text-lg dark:bg-white/10 bg-slate-200 text-slate-900 dark:text-white hover:text-white hover:bg-primary transition-all duration-300 border border-transparent hover:border-primary/50 shadow-lg">Solicitar</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* NEXT EVOLUTION — ELITE COMMAND CENTER */}
            <div ref={nextEvolRef} className="scroll-section mt-12 sm:mt-32 dark:bg-white/[0.02] bg-slate-50 backdrop-blur-3xl border dark:border-white/10 border-slate-200 rounded-[56px] p-8 sm:p-20 relative overflow-hidden group shadow-[0_50px_100px_rgba(0,0,0,0.4)]">
              {/* Technical Atmosphere */}
              <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -mr-40 -mt-40 group-hover:bg-primary/15 transition-colors duration-700 pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-yellow/5 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                <div className="flex-1 space-y-8 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-4">
                    <Badge variant="outline" className="px-5 py-2 border-primary/30 text-primary bg-primary/5 uppercase tracking-[0.3em] text-[10px] font-black rounded-full">Evolution_Link</Badge>
                    <div className="h-px w-12 bg-white/10 hidden sm:block" />
                  </div>
                  
                  <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black dark:text-white text-slate-900 leading-[0.9] tracking-tighter uppercase">
                    Próxima Evolução: <br/>
                    <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent italic">
                      {heroData.nextStep?.title}
                    </span>
                  </h2>
                  
                  <p className="text-muted-foreground text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                    {heroData.nextStep?.logic}
                  </p>
                  
                  <Button 
                    onClick={() => { navigate(`/service-details?id=${heroData.nextStep?.id}`); window.scrollTo(0, 0); }} 
                    variant="ghost" 
                    className="group/btn pl-0 hover:bg-transparent text-primary hover:text-white font-black flex items-center justify-center lg:justify-start gap-3 text-xl uppercase tracking-tighter transition-all"
                  >
                    Ativar Protocolo <CheckCircle2 className="w-8 h-8 group-hover/btn:translate-x-2 transition-transform duration-300" />
                  </Button>
                </div>

                {/* Hyper-Velocity Data Module */}
                <div className="w-full lg:w-[320px] flex-shrink-0 text-center space-y-4 p-10 rounded-[48px] bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-xl relative group-hover:scale-105 transition-transform duration-500">
                  <div className="absolute inset-0 bg-primary/5 rounded-[48px] animate-pulse" />
                  <div className="relative z-10">
                    <div className="text-7xl font-black text-white tracking-tighter mb-1">20<span className="text-primary">x</span></div>
                    <div className="text-[10px] uppercase font-black text-primary tracking-[0.4em] mb-4">Hyper-Velocity</div>
                    <div className="h-px w-full bg-white/10 mb-4" />
                    <p className="text-xs text-muted-foreground leading-relaxed uppercase tracking-widest font-bold">IA-Accelerated Engineering</p>
                  </div>
                </div>
              </div>
            </div>

            <div ref={ctaSectionRef} className="mt-12 sm:mt-20 mb-10 text-center">
              <div className="relative inline-block group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary via-brand-green to-primary rounded-[2rem] blur-lg opacity-30 group-hover:opacity-100 transition duration-1000 animate-gradient-x pointer-events-none"></div>
                {!isPaymentAuthorized ? (
                  <Button onClick={() => setContactModalOpen(true)} className="relative w-full sm:w-auto rounded-[2rem] py-3 sm:py-8 px-6 sm:px-14 font-black transition-all duration-300 h-14 sm:h-20 bg-primary hover:bg-primary/90 text-white shadow-2xl transform hover:scale-[1.03] text-base sm:text-2xl group border border-white/20 uppercase tracking-tighter">
                    <Rocket className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />Bora fazer acontecer
                  </Button>
                ) : (
                  <Button onClick={handlePayment} className="relative w-full sm:w-auto rounded-[2rem] py-3 sm:py-8 px-6 sm:px-14 font-black transition-all duration-300 h-14 sm:h-20 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-2xl transform hover:scale-[1.03] text-base sm:text-2xl group border border-white/20 uppercase tracking-tighter">
                    <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 group-hover:scale-110 transition-transform" />Efetuar Pagamento
                  </Button>
                )}
              </div>
              <p className="mt-8 text-muted-foreground font-semibold flex items-center justify-center gap-2 text-lg"><CheckCircle2 className="w-6 h-6 text-brand-green" />Entrega Excecional Garantida</p>
            </div>
          </>
        ) : null}
      </main>

      <InteractiveContactModal isOpen={isContactModalOpen} onClose={() => setContactModalOpen(false)} serviceName={heroData ? heroData.title : 'o serviço'} />

      <VerificationModal
        isOpen={verificationOpen}
        onClose={() => { setVerificationOpen(false); setPendingCheckoutUrl(null); }}
        onSuccess={() => { markActionVerified('approve_milestone'); if (pendingCheckoutUrl) navigate(pendingCheckoutUrl); }}
        projectId={verificationProjectId}
        phoneNumber={verificationPhoneNumber}
        actionDescription="Confirme para prosseguir com o pagamento"
      />
    </div>
  );
};

export default ServiceDetails;
