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
    mm.add('(max-width: 1023px)', () => {
      gsap.from(headerRef.current, {
        y: 40, opacity: 0, duration: 1.0, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%' }
      });

      gsap.from(carouselRef.current, {
        y: 40, opacity: 0, duration: 1.2, ease: 'power3.out',
        scrollTrigger: { trigger: carouselRef.current, start: 'top 85%' }
      });
    });
  }, { scope: sectionRef });

  const getServiceImage = useCallback((item: { id: number; }) => {
    // Adding f_auto,q_auto to Cloudinary URLs for 10x faster loading
    const optimize = (url: string) => url.replace('/upload/', '/upload/f_auto,q_auto,w_800/');
    
    const images: Record<number, string> = {
      1: optimize('https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png'),
      2: optimize('https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png'),
      3: optimize('https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762747013/1762701812733_p93nsd.png'),
      4: optimize('https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755464/1762703721009_w7posw.png'),
      5: optimize('https://res.cloudinary.com/dwlfwnbt0/image/upload/v1772183388/renta-img-bg_guxaww.jpg'),
      6: optimize('https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png'),
    };
    return images[item.id] || optimize('https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762746750/1762703395544_lhphsq.png');
  }, []);

  // Services with elite vectors — 5 distinct service areas
  const services = useMemo(() => [
    {
      id: 1,
      number: '01',
      title: 'Design Gráfico',
      category: 'Área Criativa',
      audience: 'Para quem precisa de uma marca profissional',
      painPoint: 'A tua imagem não transmite confiança e os clientes passam ao lado.',
      icon: EliteMatrix
    },
    {
      id: 2,
      number: '02',
      title: 'Websites & Apps',
      category: 'Presença Digital',
      audience: 'Para quem quer vender e converter online',
      painPoint: 'Não tens site, ou tens um que ninguém encontra nem contacta.',
      icon: EliteVector
    },
    {
      id: 3,
      number: '03',
      title: 'Tráfego & Marketing',
      category: 'Vendas & Escala',
      audience: 'Para quem quer mais clientes todos os meses',
      painPoint: 'Gastas dinheiro em anúncios sem saber o que funciona.',
      icon: ElitePulse
    },
    {
      id: 4,
      number: '04',
      title: 'Audiovisual',
      category: 'Conteúdo & Mídia',
      audience: 'Para quem precisa de vídeo, motion e publicidade',
      painPoint: 'Postas conteúdo todos os dias mas ninguém para para ver.',
      icon: EliteRadar
    },
    {
      id: 5,
      number: '05',
      title: 'GSM Tech Rental',
      category: 'Painel de Aluguer GSM',
      audience: 'Para técnicos mobile que dependiam de boxes caras e cartões de crédito',
      painPoint: 'Antigamente precisavas de comprar boxes físicas, pagar licenças anuais e ter cartões internacionais. Hoje, alugas as melhores tools GSM de forma avulsa e pagas por M-Pesa.',
      icon: EliteNode
    },
  ], []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    const message = encodeURIComponent('Olá! Vi o site e gostaria de saber mais sobre os serviços da TchovaDigital.');
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="min-h-[100dvh] lg:min-h-screen w-full flex flex-col justify-center items-center relative overflow-hidden py-12 md:py-24 bg-[#030303] border-t border-white/[0.04]"
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

      <div className="container relative z-10 mx-auto px-6 lg:px-12 w-full">
        
        {/* Elite Header */}
        <div ref={headerRef} className="text-center mb-6 lg:mb-8 relative flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-fluid-sm backdrop-blur-md">
            <EliteRadar className="w-4 h-4 text-primary" />
            <span className="text-fluid-sm font-bold text-primary uppercase tracking-widest">Serviços Profissionais</span>
          </div>
          <h2 className="text-fluid-h2 font-black mb-fluid-sm tracking-tighter text-white uppercase">
            Do criativo ao técnico. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">Encontra o teu serviço.</span>
          </h2>
          <p className="text-fluid-p text-muted-foreground/70 font-light max-w-2xl">
            Design, web, tráfego, vídeo e aluguer de tools GSM. Tudo com equipa dedicada.
          </p>
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
                  className="relative h-[380px] lg:h-[420px] w-full cursor-pointer group focus:outline-none rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
                  onClick={() => handleServiceClick(item)}
                  onKeyDown={(e) => handleCardKeyDown(e, item)}
                >
                  {/* Background Image Setup */}
                  <div className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#0a0a0a]">
                    {/* Base Color Fallback (Based on service ID for variety) */}
                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${
                      item.id % 3 === 0 ? 'from-primary/40 to-black' : 
                      item.id % 2 === 0 ? 'from-brand-green/30 to-black' : 
                      'from-emerald-900/40 to-black'
                    }`} />
                    
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110 z-[2]"
                      style={{ 
                        backgroundImage: `url(${getServiceImage(item)})`,
                        backgroundColor: '#0a0a0a' 
                      }}
                    />

                    {/* Vertical Watermark Title (Elite Aesthetic) */}
                    <div className="absolute -right-20 top-1/2 -translate-y-1/2 rotate-90 origin-center z-[3] pointer-events-none opacity-[0.03] group-hover:opacity-[0.1] transition-all duration-700">
                      <span className="text-9xl font-black text-white tracking-tighter uppercase whitespace-nowrap">
                        {item.title}
                      </span>
                    </div>
                  </div>
                  
                  {/* Advanced Gradient Overlay (Liquid Glass base) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent group-hover:from-black/100 group-hover:via-black/70 transition-all duration-500 z-10" />
                  
                  {/* Glowing Border on Hover */}
                  <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 transition-colors duration-500 rounded-[2rem] pointer-events-none z-30" />

                  {/* Elite Icon Top Left */}
                  <div className="absolute top-6 left-6 z-30 w-12 h-12 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center transition-transform duration-500 group-hover:bg-primary/20">
                    <item.icon className="w-5 h-5 text-white group-hover:text-primary transition-colors" />
                  </div>

                  {/* Top Right "Ver Detalhes" Pill */}
                  <div className="absolute top-6 right-6 z-30 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
                    <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-2xl border border-white/20 text-white text-[10px] font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                      Aceder
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 flex flex-col justify-end h-full z-40">
                    <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                      {/* Number + Category */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[28px] font-black text-white/10 tracking-tighter leading-none">
                          {item.number}
                        </span>
                        <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-primary">
                          {item.category}
                        </span>
                      </div>
                      <h3 className="text-fluid-h3 font-black text-white leading-tight mb-1 tracking-tight drop-shadow-md">
                        {item.title}
                      </h3>
                      {/* Audience label — always visible */}
                      <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-1">
                        {item.audience}
                      </p>
                      <div className="h-0 opacity-0 group-hover:opacity-100 group-hover:h-auto group-hover:mt-3 transition-all duration-500 ease-out overflow-hidden">
                        <p className="text-fluid-p font-bold text-white/70 italic">
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
        <div className="mt-10 lg:mt-12 text-center relative z-10 hidden md:block">
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
          <p className="mt-6 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Respondemos no WhatsApp em menos de 30 minutos. Sem enrolação.
          </p>
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
