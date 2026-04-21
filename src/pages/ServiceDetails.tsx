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
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  const serviceId = searchParams.get('id');
  const service = INDIVIDUAL_SERVICES.find(s => s.id.toString() === serviceId) || null;

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
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      } else {
        gsap.from(section, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }
    });

    // Handle GSAP cleanup for scroll triggers not strictly bound by standard timeline
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };

  }, { dependencies: [serviceId], scope: mainRef });

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
    <div ref={mainRef} className="min-h-screen bg-background relative pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-blue-500/8 via-cyan-400/6 to-purple-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-gradient-to-tr from-emerald-500/8 via-teal-400/6 to-blue-500/8 rounded-full blur-3xl" />
      </div>

      {!isGSM && <Header />}

      <main className={isGSM ? "container relative z-10 mx-auto px-0 pb-6" : "container relative z-10 mx-auto px-4 pt-20 pb-6 max-w-5xl"}>
        {isGSM ? (
          <GSMServicePage />
        ) : heroData ? (
          <>
            {/* HERO SECTION CINEMÁTICA */}
            <div ref={headerSectionRef} className="relative overflow-hidden mb-16 rounded-[40px] sm:rounded-[56px] shadow-2xl border border-white/10 group min-h-[50vh] flex items-center justify-center">
              {/* Background Layers */}
              <div className="absolute inset-0 bg-black/60 z-10" />
              <div className="absolute inset-0 bg-gradient-to-br dark:from-brand-green/20 dark:to-brand-yellow/10 from-emerald-500/10 to-teal-500/10 z-0" />
              
              {/* Mesh Gradient Effect */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-20 p-8 sm:p-16 lg:p-24 text-center w-full">
                <Badge variant="outline" className="mb-8 px-6 py-2 border-primary/40 text-primary bg-primary/5 uppercase tracking-[0.3em] text-[10px] font-black rounded-full backdrop-blur-md">
                  Ecossistema de Elite
                </Badge>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black dark:text-white text-slate-900 mb-8 leading-[0.95] tracking-tighter">
                  <span className="block opacity-50 text-3xl md:text-4xl lg:text-5xl mb-2 uppercase">Solução em</span>
                  <span className="bg-gradient-to-r dark:from-brand-green dark:via-brand-bright dark:to-brand-yellow from-emerald-600 via-green-600 to-emerald-700 bg-clip-text text-transparent uppercase">
                    {heroData?.title || service?.title}
                  </span>
                </h1>
                
                <div className="w-24 h-1.5 bg-primary mx-auto mb-8 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
                
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium leading-relaxed">
                  {heroData?.heroDescription || service?.description}
                </p>
              </div>
            </div>

            <div className="space-y-24">
              
              {/* O FATOR DIFERENCIAL - BENTO GRID LAYOUT */}
              {heroData?.heroCards && heroData.heroCards.length > 0 && (
                <div className="scroll-section">
                  <div className="flex flex-col items-center gap-4 mb-16 justify-center text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-2">
                       <Rocket className="w-8 h-8 text-primary animate-bounce-slow" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-slate-900 tracking-tighter uppercase">
                      O Fator <span className="text-primary">Diferencial</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">Os elementos-chave que elevam esta solução ao estatuto de elite digital.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 min-h-[500px]">
                    {heroData.heroCards.map((card: any, i: number) => (
                      <div 
                        key={i} 
                        className={`stagger-card ${
                          card.spans === 2 
                            ? "md:col-span-2 md:row-span-2" 
                            : "md:col-span-2 lg:col-span-1"
                        }`}
                      >
                        <InteractiveServiceCard {...card} featured={card.spans === 2} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ARSENAL TÁTICO / INCLUDES */}
              {(heroData as any).includes && (heroData as any).includes.length > 0 && (
                <div className="scroll-section">
                  <div className="flex flex-col items-center gap-3 mb-10 justify-center text-center">
                    <Package className="w-8 h-8 text-brand-yellow" />
                    <h2 className="text-3xl md:text-4xl font-black dark:text-white text-slate-900 tracking-tight">Arsenal Tático</h2>
                    <p className="text-muted-foreground font-medium">Tecnologias e metodologias exclusivas inclusas neste serviço.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(heroData as any).includes.map((item: any) => (
                      <div key={item.name} className={`stagger-card group bg-gradient-to-br ${item.color} backdrop-blur-lg rounded-3xl p-8 border dark:border-white/5 border-slate-200 dark:hover:border-white/20 hover:border-slate-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}>
                        <div className="flex flex-col gap-4">
                          <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg text-white`}>{item.icon}</div>
                          <h3 className="font-bold text-lg text-foreground leading-tight">{item.name}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ATIVAÇÃO TCHOVA - TIMELINE VISUAL */}
              {heroData?.process && heroData.process.length > 0 && (
                <div className="scroll-section max-w-4xl mx-auto relative">
                  <div className="flex flex-col items-center gap-4 mb-16 justify-center text-center">
                    <div className="w-16 h-16 bg-brand-yellow/10 rounded-[2rem] flex items-center justify-center mb-2">
                       <Timer className="w-8 h-8 text-brand-yellow" />
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black dark:text-white text-slate-900 tracking-tighter uppercase">
                      Ativação <span className="text-brand-yellow">Tchova</span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl">A jornada da visão à realidade na velocidade da luz.</p>
                  </div>

                  <div className="relative space-y-12">
                    {/* Vertical Timeline line */}
                    <div className="absolute left-[2.75rem] top-10 bottom-10 w-1 bg-gradient-to-b from-primary via-brand-yellow to-brand-green opacity-20 hidden sm:block" />

                    {heroData.process.map((item: any, i: number) => (
                      <div key={item.title} className="stagger-card flex flex-col sm:flex-row items-center sm:items-start gap-8 p-10 rounded-[40px] dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-200 hover:border-primary/30 transition-all duration-500 group relative z-10">
                        <div className="w-24 h-24 sm:w-20 sm:h-20 bg-gradient-to-br from-primary to-brand-green text-white rounded-3xl flex items-center justify-center font-black text-3xl sm:text-2xl flex-shrink-0 shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                          {item.step}
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="font-black text-3xl mb-4 text-primary tracking-tight uppercase">{item.title}</h3>
                          <p className="text-muted-foreground text-xl leading-relaxed font-medium">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AUDIOVISUAL SPECIAL PACKAGES */}
              {isAudiovisual && (
                <div className="scroll-section border-t dark:border-white/10 border-slate-200 pt-16 mt-16">
                  <div className="flex flex-col items-center gap-3 mb-12 justify-center text-center">
                    <Package className="w-8 h-8 text-primary" />
                    <h2 className="text-3xl md:text-4xl font-black dark:text-white text-slate-900 tracking-tight">Pacotes Especiais</h2>
                    <p className="text-muted-foreground font-medium">Soluções modulares para cada nível de impacto.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {AUDIO_PACKAGES.map((pkg: any) => (
                      <div key={pkg.name} className={`stagger-card group relative dark:bg-white/5 bg-slate-50 backdrop-blur-xl rounded-[32px] p-8 border ${pkg.popular ? 'border-primary shadow-[0_0_30px_rgba(34,197,94,0.15)] ring-1 ring-primary/20' : 'border-slate-200 dark:border-white/10'} hover:scale-[1.03] transition-all duration-500 flex flex-col h-full`}>
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

            <div ref={nextEvolRef} className="mt-12 dark:bg-white/5 bg-slate-50 backdrop-blur-xl border dark:border-white/10 border-slate-200 rounded-[48px] p-8 sm:p-14 relative overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 blur-3xl rounded-full -mr-20 -mt-20 group-hover:bg-primary/20 transition-colors duration-700 pointer-events-none" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-14">
                <div className="flex-1 space-y-5">
                  <Badge variant="outline" className="px-5 py-2 border-primary/30 text-primary bg-primary/5 uppercase tracking-widest text-xs font-bold rounded-full">A Jornada do Império</Badge>
                  <h2 className="text-4xl sm:text-5xl font-black dark:text-white text-slate-900 leading-tight">Próxima Evolução: <span className="gradient-text">{heroData.nextStep?.title}</span></h2>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">{heroData.nextStep?.logic}</p>
                  <Button onClick={() => { navigate(`/service-details?id=${heroData.nextStep?.id}`); window.scrollTo(0, 0); }} variant="ghost" className="group/btn pl-0 hover:bg-transparent text-primary hover:text-primary/80 font-bold flex items-center gap-2 text-lg">Explorar esta solução <CheckCircle2 className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform duration-300" /></Button>
                </div>
                <div className="w-full md:w-auto flex-shrink-0 text-center space-y-3 p-8 rounded-[40px] bg-gradient-to-br from-primary/10 to-brand-green/10 border dark:border-white/10 border-slate-200 shadow-xl">
                  <div className="text-6xl font-black gradient-text">20x</div>
                  <div className="text-xs uppercase font-bold text-slate-500 dark:text-white/60 tracking-widest">Hyper-Velocity</div>
                  <p className="text-xs text-muted-foreground max-w-[140px] mx-auto">Engenharia acelerada via IA + Elite Humana</p>
                </div>
              </div>
            </div>

            <div ref={ctaSectionRef} className="mt-20 mb-10 text-center">
              <div className="relative inline-block group">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary via-brand-green to-primary rounded-[2rem] blur-lg opacity-30 group-hover:opacity-100 transition duration-1000 animate-gradient-x pointer-events-none"></div>
                {!isPaymentAuthorized ? (
                  <Button onClick={() => setContactModalOpen(true)} className="relative rounded-[2rem] py-8 px-14 font-black transition-all duration-300 h-20 bg-primary hover:bg-primary/90 text-white shadow-2xl transform hover:scale-[1.03] text-2xl group border border-white/20 uppercase tracking-tighter">
                    <Rocket className="w-8 h-8 mr-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />Bora fazer acontecer
                  </Button>
                ) : (
                  <Button onClick={handlePayment} className="relative rounded-[2rem] py-8 px-14 font-black transition-all duration-300 h-20 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-2xl transform hover:scale-[1.03] text-2xl group border border-white/20 uppercase tracking-tighter">
                    <ShieldCheck className="w-8 h-8 mr-4 group-hover:scale-110 transition-transform" />Efetuar Pagamento
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
