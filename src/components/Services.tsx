import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from '@/components/ui/carousel';
import { Eye, Rocket, MessageCircle } from 'lucide-react';
import { InteractiveContactModal } from './InteractiveContactModal';
import { TiltCard } from '@/components/ui/TiltCard';
import { env } from '@/config/env';
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapConfig";

const Services = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Entrance Animation for Header
    gsap.from(headerRef.current?.children || [], {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headerRef.current,
        start: 'top 85%',
      }
    });

    // 2. Entrance Animation for Carousel
    gsap.from(carouselRef.current, {
      y: 60,
      opacity: 0,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: carouselRef.current,
        start: 'top 80%',
      }
    });

    // 3. Floating Background Orbs - Infinite & Smooth
    const animateOrb = (ref: React.RefObject<HTMLDivElement>, x: number, y: number, duration: number) => {
      if (!ref.current) return;
      gsap.to(ref.current, {
        x: `+=${x}`,
        y: `+=${y}`,
        duration,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      });
    };

    animateOrb(orb1Ref, 40, -30, 8);
    animateOrb(orb2Ref, -50, 40, 10);
    animateOrb(orb3Ref, 30, 20, 12);

  }, { scope: sectionRef });

  const getServiceImage = useCallback((item: { id: number; }) => {
    const images: Record<number, string> = {
      1: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
      2: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png',
      3: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762747013/1762701812733_p93nsd.png',
      4: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755464/1762703721009_w7posw.png',
      5: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png',
      6: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1772183388/renta-img-bg_guxaww.jpg',
    };
    return images[item.id] || 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762746750/1762703395544_lhphsq.png';
  }, []);

  // Services with carousel
  const services = useMemo(() => [
    {
      id: 1,
      title: 'Marcas Premium',
      category: 'Branding',
      painPoint: 'Respeito Instantâneo'
    },
    {
      id: 2,
      title: 'Sites Velozes',
      category: 'Web',
      painPoint: 'Vendas no Automático'
    },
    {
      id: 3,
      title: 'Tráfego Pago',
      category: 'Performance',
      painPoint: 'Cofre Aberto (24/7)'
    },
    {
      id: 4,
      title: 'Audiovisual Pro',
      category: 'Mídia',
      painPoint: 'Desejo Incontrolável'
    },
    {
      id: 5,
      title: 'Importação',
      category: 'Logística',
      painPoint: 'Zero Burocracia'
    },
    {
      id: 6,
      title: 'Técnico GSM',
      category: 'Assistência',
      painPoint: 'Operação Inabalável'
    }
  ], []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleServiceClick = useCallback((service: { id: number; title: string; category: string; }) => {
    navigate(`/service-details?id=${service.id}&title=${encodeURIComponent(service.title)}&category=${encodeURIComponent(service.category)}`);
  }, [navigate]);

  const handleCardKeyDown = useCallback((e: React.KeyboardEvent, service: { id: number; title: string; category: string; }) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleServiceClick(service);
    }
  }, [handleServiceClick]);

  const handleWhatsAppClick = useCallback(() => {
    const message = encodeURIComponent('Olá! Vi o site e gostaria de saber mais sobre os serviços da TchovaDigital.');
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="min-h-[100dvh] w-full flex flex-col justify-start md:justify-center items-center relative overflow-hidden pt-24 pb-24 md:py-16 bg-background/95 dark:bg-background/80 backdrop-blur-[2px]"
    >
      {/* Background Orbs - subtle depth */}
      <div className="absolute inset-0 z-0">
        <div ref={orb1Ref} className="absolute top-1/4 right-1/4 w-80 h-80 bg-green-500/8 rounded-full blur-3xl" />
        <div ref={orb2Ref} className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-500/6 rounded-full blur-3xl" />
        <div ref={orb3Ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/4 rounded-full blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-3 md:px-4 w-full">
        {/* Impact Header */}
        <div ref={headerRef} className="text-center mb-3 md:mb-8 relative flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3">
            <Rocket className="w-3 h-3" />
            <span>Ecossistema 360°</span>
          </div>
          <h2 className="readable-heading">
            <span className="bg-gradient-to-r from-primary via-brand-green to-brand-yellow bg-clip-text text-transparent">
              O Ecossistema que<br />Constrói Impérios.
            </span>
          </h2>
        </div>

        {/* Visual-First Service Cards with Carousel */}
        <div ref={carouselRef} className="w-full px-1 md:px-2">
          <Carousel
            slides={services.map((item) => (
              <TiltCard key={item.id} className="select-none p-0 overflow-hidden rounded-3xl" maxTilt={10} glowOpacity={0.2} style={{ maxWidth: '300px', margin: '0 auto', height: '100%' }}>
                  <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalhes de ${item.title} — ${item.category}`}
                  className="card-3d relative h-[420px] md:h-[350px] lg:h-[400px] w-full cursor-pointer group touch-manipulation focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  onClick={() => handleServiceClick(item)}
                  onKeyDown={(e) => handleCardKeyDown(e, item)}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${getServiceImage(item)})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 group-hover:via-black/60 transition-colors duration-500" />
                  
                  {/* Content - Super Minimal & Bold */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col justify-end h-full">
                    <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                      <span className="inline-block px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-2">
                        {item.category}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                        {item.title}
                      </h3>
                    </div>
                    {/* Pain Point Reveal on Hover */}
                    <div className="absolute bottom-6 left-6 right-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                      <p className="text-lg font-bold text-green-400 drop-shadow-md">
                        {item.painPoint}
                      </p>
                    </div>
                  </div>

                  {/* Liquid Glass "Ver Detalhes" Button */}
                  <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleServiceClick(item);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                        bg-white/20 backdrop-blur-md border border-white/30 
                        text-white text-xs font-medium
                        hover:bg-white/30 hover:border-white/40
                        transition-all duration-200
                        shadow-lg shadow-black/20"
                      style={{
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver detalhes</span>
                    </button>
                  </div>

                  {/* Hover Indicator */}
                  <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
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
              slidesToScroll: isMobile ? 1 : 2,
              breakpoints: {
                '(min-width: 768px)': { slidesToScroll: 2, align: 'center' },
                '(min-width: 1024px)': { slidesToScroll: 3, align: 'center' }
              }
            }}
          />
        </div>

        {/* Single CTA */}
        <div className="text-center mt-6 relative z-10 hidden md:block">
          <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-px h-4 bg-gradient-to-b from-primary/50 to-transparent"></div>
          <button
            onClick={handleWhatsAppClick}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 shadow-xl shadow-green-500/20 text-white font-black rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 group w-full sm:w-auto text-base"
          >
            <div className="relative">
              <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform text-white drop-shadow-md" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-300 rounded-full animate-ping"></div>
            </div>
            <span>Falar com um Especialista no WhatsApp</span>
          </button>
          <p className="mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Sem burocracia. Resposta em até 30 minutos.
          </p>
        </div>
      </div>

      {/* Interactive Contact Modal */}
      <InteractiveContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        serviceName="os Serviços do Ecossistema"
      />
    </section>
  );
};

export default Services;

