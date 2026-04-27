import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from '@/components/ui/carousel';
import { InteractiveContactModal } from './InteractiveContactModal';
import { TiltCard } from '@/components/ui/TiltCard';
import { env } from '@/config/env';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { EliteRadar, ElitePulse, EliteNode, EliteCore, EliteMatrix, EliteVector } from '@/components/ui/EliteIcons';

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Entrance Animation for Header
    gsap.from(headerRef.current, {
      y: 40,
      opacity: 0,
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

  // Services with elite vectors
  const services = useMemo(() => [
    {
      id: 1,
      title: 'Marcas Premium',
      category: 'Branding',
      painPoint: 'Respeito Instantâneo',
      icon: EliteMatrix
    },
    {
      id: 2,
      title: 'Sites Velozes',
      category: 'Web',
      painPoint: 'Vendas no Automático',
      icon: EliteVector
    },
    {
      id: 3,
      title: 'Tráfego Pago',
      category: 'Performance',
      painPoint: 'Cofre Aberto (24/7)',
      icon: ElitePulse
    },
    {
      id: 4,
      title: 'Audiovisual Pro',
      category: 'Mídia',
      painPoint: 'Desejo Incontrolável',
      icon: EliteRadar
    },
    {
      id: 5,
      title: 'Importação',
      category: 'Logística',
      painPoint: 'Zero Burocracia',
      icon: EliteNode
    },
    {
      id: 6,
      title: 'Técnico GSM',
      category: 'Assistência',
      painPoint: 'Operação Inabalável',
      icon: EliteCore
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
      className="min-h-[100dvh] w-full flex flex-col justify-center items-center relative overflow-hidden py-20 bg-background/95 border-t border-white/5 perspective-1000"
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
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-brand-green/10 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-1/4 left-1/4 w-[800px] h-[800px] bg-primary/8 rounded-full blur-[180px] animate-pulse" style={{ animationDuration: '18s' }} />
      </div>

      <div className="container relative z-10 mx-auto px-4 w-full">
        
        {/* Elite Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16 relative flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-md">
            <EliteRadar className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Ecossistema 360°</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
            O Ecossistema que <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">Constrói Impérios.</span>
          </h2>
        </div>

        {/* Liquid Glass Monolith Carousel */}
        <div ref={carouselRef} className="w-full px-1 md:px-2 max-w-7xl mx-auto">
          <Carousel
            slides={services.map((item) => (
              <TiltCard 
                key={item.id} 
                className="select-none p-0 overflow-visible rounded-[2rem]" 
                maxTilt={8} 
                glowOpacity={0.4} 
                glowColor="rgba(34, 197, 94, 0.4)"
                style={{ maxWidth: '320px', margin: '0 auto', height: '100%' }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver detalhes de ${item.title} — ${item.category}`}
                  className="relative h-[480px] w-full cursor-pointer group focus:outline-none rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
                  onClick={() => handleServiceClick(item)}
                  onKeyDown={(e) => handleCardKeyDown(e, item)}
                >
                  {/* Background Image Setup */}
                  <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                      style={{ backgroundImage: `url(${getServiceImage(item)})` }}
                    />
                  </div>
                  
                  {/* Advanced Gradient Overlay (Liquid Glass base) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent group-hover:from-black/100 group-hover:via-black/70 transition-all duration-500" />
                  
                  {/* Glowing Border on Hover */}
                  <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-colors duration-500 rounded-[2rem] pointer-events-none" />

                  {/* Elite Icon Top Left */}
                  <div className="absolute top-6 left-6 z-20 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-transform duration-500 group-hover:bg-primary/20">
                    <item.icon className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                  </div>

                  {/* Top Right "Ver Detalhes" Pill */}
                  <div className="absolute top-6 right-6 z-20 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
                    <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                      Aceder
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col justify-end h-full">
                    <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                      <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-primary mb-3">
                        {item.category}
                      </span>
                      <h3 className="text-3xl font-black text-white leading-tight mb-2 tracking-tight drop-shadow-md">
                        {item.title}
                      </h3>
                      <div className="h-0 opacity-0 group-hover:opacity-100 group-hover:h-auto group-hover:mt-3 transition-all duration-500 ease-out overflow-hidden">
                        <p className="text-lg font-bold text-white/70 italic">
                          {item.painPoint}
                        </p>
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

        {/* Magnetic Fluid CTA */}
        <div className="mt-20 text-center relative z-10 hidden md:block">
          <button
            onClick={handleWhatsAppClick}
            className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
              <ElitePulse className="w-5 h-5 text-black group-hover:text-white transition-colors" />
              Acionar Especialista
              <ArrowRight className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
          <p className="mt-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
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
