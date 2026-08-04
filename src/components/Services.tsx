import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from '@/components/ui/carousel';
import { InteractiveContactModal } from './InteractiveContactModal';
import { TiltCard } from '@/components/ui/TiltCard';
import { env } from '@/config/env';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Layers, ChevronLeft, ChevronRight } from 'lucide-react';
import { ElitePulse, EliteNode, EliteCore, EliteMatrix, EliteVector, EliteRadar } from '@/components/ui/EliteIcons';
import { isLowEnd } from '@/hooks/useLowEnd';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Mobile Carousel Refs & State
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const [mobileSelectedIndex, setMobileSelectedIndex] = useState(0);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(true);

  useGSAP(() => {
    if (isLowEnd) return;
    const mm = gsap.matchMedia();

    // DESKTOP: 3D Entrance
    mm.add('(min-width: 1024px)', () => {
      gsap.from(headerRef.current, {
        y: 60, opacity: 0, rotateX: -15, transformPerspective: 800, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%' }
      });

      gsap.from(carouselRef.current, {
        y: 80, opacity: 0, rotateX: 10, transformPerspective: 1000, duration: 1.5, ease: 'power3.out',
        scrollTrigger: { trigger: carouselRef.current, start: 'top 80%' }
      });
    });

    // MOBILE & TABLET: 2D Entrance (Performance)
    // Disabled to prevent iOS Safari layout thrashing and disappearing elements
    mm.add('(max-width: 1023px)', () => {
      // Elements are fully visible immediately
    });
  }, { scope: sectionRef });

  const getServiceImage = useCallback((item: { id: number; }) => {
    const images: Record<number, string> = {
      1: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto/v1785149296/img_card_desgn_rdtifp.jpg',
      2: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto/v1785149294/img_card_site_hlm7hf.jpg',
      3: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto/v1785149298/img_making_card_ugn796.jpg',
      4: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto/v1785149290/img_card_audio_visual_bzdiq8.jpg',
      5: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto/v1772183388/renta-img-bg_guxaww.jpg',
      6: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png',
    };
    return images[item.id] || 'https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto/v1762746750/1762703395544_lhphsq.png';
  }, []);

  // Services with elite vectors — 4 distinct service areas
  const services = useMemo(() => [
    {
      id: 1,
      number: '01',
      title: 'BRANDING & IDENTIDADE',
      category: 'Direção Criativa',
      audience: 'Imagem de Prestígio',
      painPoint: 'Identidade visual forte que transmite credibilidade e justifica preços mais altos.',
      cta: 'Iniciar Diagnóstico',
      icon: EliteMatrix
    },
    {
      id: 2,
      number: '02',
      title: 'WEB & E-COMMERCE',
      category: 'Desenvolvimento',
      audience: 'Vendedor Digital 24/7',
      painPoint: 'Plataformas rápidas e autónomas que convertem visitantes em clientes.',
      cta: 'Iniciar Diagnóstico',
      icon: EliteVector
    },
    {
      id: 3,
      number: '03',
      title: 'MARKETING & PERFORMANCE',
      category: 'Aquisição de Clientes',
      audience: 'Tráfego Qualificado',
      painPoint: 'Anúncios diretos no Google e Meta para quem quer comprar de ti hoje.',
      cta: 'Iniciar Diagnóstico',
      icon: ElitePulse
    },
    {
      id: 4,
      number: '04',
      title: 'VÍDEO & FOTOGRAFIA',
      category: 'Produção Visual',
      audience: 'Retenção de Atenção',
      painPoint: 'Conteúdo visual de nível de cinema que para o scroll e gera desejo.',
      cta: 'Iniciar Diagnóstico',
      icon: EliteRadar
    },
  ], []);

  const handleMobileScroll = () => {
    const el = mobileCarouselRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftFade(scrollLeft > 8);
    setShowRightFade(scrollLeft < scrollWidth - clientWidth - 8);

    const cardWidth = clientWidth * 0.85;
    const index = Math.min(
      services.length - 1,
      Math.max(0, Math.round((scrollLeft + cardWidth * 0.3) / cardWidth))
    );
    setMobileSelectedIndex(index);
  };

  useEffect(() => {
    handleMobileScroll();
  }, []);

  const scrollPrevMobile = () => {
    if (!mobileCarouselRef.current) return;
    mobileCarouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollNextMobile = () => {
    if (!mobileCarouselRef.current) return;
    mobileCarouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const scrollToMobile = (index: number) => {
    if (!mobileCarouselRef.current) return;
    const cardWidth = mobileCarouselRef.current.clientWidth * 0.85;
    mobileCarouselRef.current.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
  };

  const handleServiceClick = useCallback((service: { id: number; title: string; category: string; }) => {
    navigate(`/servicos/${service.id}`);
  }, [navigate]);

  const handleCardKeyDown = useCallback((e: React.KeyboardEvent, service: { id: number; title: string; category: string; }) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleServiceClick(service);
    }
  }, [handleServiceClick]);

  const handleWhatsAppClick = useCallback(() => {
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços da TchovaDigital.');
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="w-full flex flex-col justify-center items-center relative overflow-hidden pt-10 sm:pt-12 lg:pt-14 pb-8 md:pb-12 lg:pb-16 bg-background border-t border-white/[0.04] scroll-mt-0"
    >
      {/* Elite Ecosystem Background (Softened) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* 1. Subtle Dot Matrix (Very Soft) */}
        <div 
          className="absolute inset-0 opacity-[0.04]" 
          style={{ 
            backgroundImage: `radial-gradient(rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px' 
          }} 
        />
        
        {/* 2. Dynamic Soft Glows */}
        <div className="absolute top-1/4 right-1/4 w-[300px] md:w-[700px] h-[300px] md:h-[700px] bg-brand-green/[0.04] md:bg-brand-green/10 rounded-full blur-[120px] md:blur-[180px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-primary/[0.03] md:bg-primary/8 rounded-full blur-[120px] md:blur-[180px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12 w-full flex flex-col justify-center">
        
        {/* Elite Header */}
        <div ref={headerRef} className="text-center mt-8 lg:mt-13 mb-0 relative flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-1 lg:mb-1.5 backdrop-blur-md">
            <Layers className="w-4 h-4 text-primary" />
            <span className="text-fluid-sm font-bold text-primary uppercase tracking-widest font-nunito">Serviços</span>
          </div>
          <h2 className="text-fluid-h2 font-bold mb-0 mt-0.5 lg:mt-1 tracking-tight text-white uppercase whitespace-nowrap font-nunito">
            ONDE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">ATACAMOS.</span>
          </h2>
        </div>

        {/* ─── MOBILE: Native Full-Bleed Carousel ─────────────────────────────────── */}
        <div className="md:hidden relative w-full mt-6">

          {/* Carousel counter & progress */}
          <div className="flex items-center justify-between mb-3 px-0.5">
            <span className="text-[10px] font-black tracking-[0.2em] text-primary uppercase">
              {services[mobileSelectedIndex]?.category}
            </span>
            <span className="text-[11px] font-bold text-white/35 tabular-nums font-mono">
              {String(mobileSelectedIndex + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
            </span>
          </div>

          <div className="h-[2px] bg-white/[0.06] rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-brand-green rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((mobileSelectedIndex + 1) / services.length) * 100}%` }}
            />
          </div>

          {/* Carousel Container */}
          <div className="relative -mx-6">
            {/* Visual Fade Left */}
            <div className={`absolute left-0 top-0 bottom-4 w-20 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showLeftFade ? 'opacity-100' : 'opacity-0'}`} />

            {/* Left Navigation Icon */}
            <button
              onClick={scrollPrevMobile}
              disabled={!showLeftFade}
              aria-label="Serviço anterior"
              className={`absolute left-4 top-1/2 -translate-y-1/2 -mt-2 z-20 flex items-center justify-center w-10 h-10 rounded-full border bg-background/90 backdrop-blur-md transition-all duration-200 no-min-size shadow-xl ${
                showLeftFade ? 'border-primary/40 text-primary active:scale-95 opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <ChevronLeft className="w-6 h-6 ml-[-2px]" />
            </button>

            {/* Visual Fade Right */}
            <div className={`absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none transition-opacity duration-300 ${showRightFade ? 'opacity-100' : 'opacity-0'}`} />

            {/* Right Navigation Icon */}
            <button
              onClick={scrollNextMobile}
              disabled={!showRightFade}
              aria-label="Próximo serviço"
              className={`absolute right-4 top-1/2 -translate-y-1/2 -mt-2 z-20 flex items-center justify-center w-10 h-10 rounded-full border bg-background/90 backdrop-blur-md transition-all duration-200 no-min-size shadow-xl ${
                showRightFade ? 'border-primary/40 text-primary active:scale-95 opacity-100 animate-pulse' : 'opacity-0 pointer-events-none'
              }`}
            >
              <ChevronRight className="w-6 h-6 ml-[2px]" />
            </button>

            {/* Native Scroll-Snap Container */}
            <div
              ref={mobileCarouselRef}
              onScroll={handleMobileScroll}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth pb-4 pt-1 px-6 relative z-0"
            >
              {services.map((item, index) => (
                <div
                  key={item.id}
                  className="flex-[0_0_85%] min-w-0 snap-center transition-all duration-300"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label={`Ver detalhes de ${item.title} — ${item.category}`}
                    className={`relative h-[340px] xs:h-[365px] w-full cursor-pointer group focus:outline-none rounded-[1.75rem] overflow-hidden border shadow-2xl active:scale-[0.98] transition-all duration-300 bg-[#0c0c0e] ${
                      index === mobileSelectedIndex
                        ? 'border-primary/40 opacity-100 scale-100 shadow-[0_0_30px_-10px_rgba(34,197,94,0.3)]'
                        : 'border-white/10 opacity-70 scale-[0.98]'
                    }`}
                    onClick={() => handleServiceClick(item)}
                    onKeyDown={(e) => handleCardKeyDown(e, item)}
                  >
                    {/* Clean Dark Glass Background */}
                    <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] bg-[#0c0c0e]">
                      <img 
                        src={getServiceImage(item)} 
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover z-1 opacity-90 transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-3/4 z-2 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/50 to-transparent pointer-events-none" />
                    </div>
                    
                    {/* Glowing Border Accent */}
                    <div className="absolute inset-0 border border-white/10 rounded-[1.75rem] pointer-events-none z-30" />

                    {/* Top Bar: Icon + CTA Button */}
                    <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
                      <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="px-3 py-1.5 rounded-full bg-primary/20 backdrop-blur-2xl border border-primary/40 text-white text-[9px] font-bold uppercase tracking-widest">
                        {item.cta}
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col justify-end z-40">
                      <div className="border-b border-white/10 pb-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white leading-snug mb-1.5 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-[9px] font-bold text-white/60 uppercase tracking-widest mb-1">
                        {item.audience}
                      </p>
                      <p className="text-xs text-zinc-300 leading-relaxed font-normal line-clamp-2">
                        {item.painPoint}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex items-center justify-center mt-4 px-0.5">
            <div className="flex items-center gap-2">
              {services.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToMobile(i)}
                  aria-label={`Ir para serviço ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ease-out no-min-size ${
                    i === mobileSelectedIndex
                      ? 'w-7 h-2 bg-primary shadow-[0_0_10px_rgba(34,197,94,0.7)]'
                      : 'w-2 h-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ─── DESKTOP: Liquid Glass Monolith Carousel ───────────────────────── */}
        <div ref={carouselRef} className="hidden md:block w-full px-1 md:px-4 max-w-7xl lg:max-w-[1350px] mx-auto -mt-1 lg:-mt-2">
          <Carousel
            slides={services.map((item) => (
              <TiltCard 
                key={item.id} 
                className="select-none p-0 overflow-visible rounded-[1.75rem] sm:rounded-[2rem] max-w-[350px] lg:max-w-[390px] xl:max-w-[440px] mx-auto" 
                maxTilt={6} 
                glowOpacity={0.35} 
                glowColor="rgba(34, 197, 94, 0.35)"
                style={{ width: '100%', margin: '0 auto', height: '100%' }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalhes de ${item.title} — ${item.category}`}
                  className="relative h-[340px] xs:h-[365px] sm:h-[385px] lg:h-[450px] xl:h-[490px] w-full cursor-pointer group focus:outline-none rounded-[1.75rem] sm:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl active:scale-[0.98] transition-all duration-300 gpu-accelerated bg-[#0c0c0e]"
                  onClick={() => handleServiceClick(item)}
                  onKeyDown={(e) => handleCardKeyDown(e, item)}
                >
                  {/* Clean Dark Glass Background */}
                  <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] bg-[#0c0c0e]">
                    {/* Service Image - Eager load with z-index */}
                    <img 
                      src={getServiceImage(item)} 
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover z-1 opacity-90 transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Soft Gradient Overlay for text legibility at bottom */}
                    <div className="absolute inset-x-0 bottom-0 h-3/4 z-2 bg-gradient-to-t from-[#0c0c0e] via-[#0c0c0e]/50 to-transparent pointer-events-none" />
                  </div>
                  
                  {/* Glowing Border Accent on Hover */}
                  <div className="absolute inset-0 border border-white/10 group-hover:border-primary/50 transition-colors duration-500 rounded-[1.75rem] sm:rounded-[2rem] pointer-events-none z-30" />

                  {/* Top Bar: Icon + CTA Button */}
                  <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 lg:top-5 lg:left-5 lg:right-5 z-30 flex items-center justify-between pointer-events-none">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 xl:w-12 xl:h-12 rounded-xl lg:rounded-2xl bg-white/10 backdrop-blur-xl border border-white/15 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary/20 group-hover:border-primary/40">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-white group-hover:text-primary transition-colors" />
                    </div>

                    <div className="pointer-events-auto opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-x-0 md:translate-x-4 md:group-hover:translate-x-0">
                      <div className="px-3 py-1.5 sm:px-4 sm:py-2 lg:px-4 lg:py-2 rounded-full bg-primary/20 md:bg-white/10 backdrop-blur-2xl border border-primary/40 md:border-white/20 text-white text-[9px] sm:text-[10px] lg:text-xs xl:text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                         {item.cta}
                       </div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7 flex flex-col justify-end z-40">
                    <div className="transform transition-all duration-500 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
                      {/* Category Badge */}
                      <div className="flex items-center justify-between mb-2 lg:mb-2 border-b border-white/10 pb-2">
                        <span className="text-[10px] sm:text-xs lg:text-xs xl:text-sm font-bold uppercase tracking-widest text-primary">
                          {item.category}
                        </span>
                      </div>
                      
                      <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-white leading-snug mb-1.5 lg:mb-2 tracking-tight">
                        {item.title}
                      </h3>
                      
                      {/* Details: Always visible on mobile, expandable on desktop hover */}
                      <div className="grid grid-rows-[1fr] md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-out opacity-100 md:opacity-0 md:group-hover:opacity-100">
                        <div className="overflow-hidden">
                          <div className="pt-1.5 lg:pt-2">
                            <p className="text-[9px] sm:text-[10px] lg:text-xs xl:text-sm font-bold text-white/60 uppercase tracking-widest mb-1">
                              {item.audience}
                            </p>
                            <p className="text-xs lg:text-sm xl:text-base text-zinc-300 md:text-zinc-400 leading-relaxed font-normal">
                              {item.painPoint}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </TiltCard>
            ))}
            options={{
              loop: true,
              align: 'center',
              containScroll: 'trimSnaps',
              slidesToScroll: 1,
              breakpoints: {
                '(min-width: 768px)': { slidesToScroll: 2, align: 'center' },
                '(min-width: 1024px)': { slidesToScroll: 3, align: 'center' }
              }
            }}
          />
        </div>

        {/* Magnetic Fluid CTA */}
        <div className="mt-6 lg:mt-7 text-center relative z-10 hidden md:block">
          <button
            onClick={handleWhatsAppClick}
            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
              <ElitePulse className="w-5 h-5 text-black group-hover:text-white transition-colors" />
              Falar com a Equipa
              <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </div>

      {/* Interactive Contact Modal */}
      <InteractiveContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        serviceName="os Nossos Serviços"
      />
    </section>
  );
};

export default Services;
