import { useCallback, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isLowEnd } from '@/hooks/useLowEnd';


gsap.registerPlugin(ScrollTrigger);


const ECOSYSTEM_ITEMS = [
  { label: 'IDENTIDADE VISUAL', desc: 'Posicionamento visual que justifica preços premium.' },
  { label: 'WEBSITES', desc: 'Canal de vendas que opera 24h sem depender de ti.' },
  { label: 'MARKETING', desc: 'Motor de aquisição que enche o teu pipeline de clientes.' },
  { label: 'AUDIOVISUAL', desc: 'Conteúdo que constrói autoridade e retém atenção.' },
  { label: 'GSM RENTAL', desc: 'Infraestrutura técnica profissional sob demanda.' },
];

const About = () => {
  const containerRef = useRef<HTMLElement>(null);
  const ecosystemRef = useRef<HTMLDivElement>(null);
  const aboutVideoRef = useRef<HTMLVideoElement>(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Pause video when not visible
  useEffect(() => {
    const video = aboutVideoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    if (isLowEnd) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 768px)', () => {
      // Ecosystem items reveal
      if (ecosystemRef.current) {
        gsap.from(ecosystemRef.current.children, {
          scale: 0.5,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: ecosystemRef.current,
            start: 'top 85%',
          }
        });
      }
    });
  }, { scope: containerRef });

  const handleCTA = useCallback(() => {
    window.dispatchEvent(new CustomEvent('open-contact-modal', {
      detail: { 
        serviceType: 'general-consultation', 
        serviceData: { title: 'Consultoria de Escala', type: 'consultation', requiresLogin: false } 
      }
    }));
  }, []);

  return (
    <section id="about" ref={containerRef} className="py-12 md:py-24 relative overflow-hidden bg-background border-t border-white/[0.04]">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '64px 64px' 
          }} 
        />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] bg-primary/[0.04] md:bg-primary/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-brand-green/[0.03] md:bg-brand-green/8 rounded-full blur-[160px]" />
        </div>
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          <div className="absolute top-0 left-[80%] w-px h-full bg-gradient-to-b from-transparent via-brand-green/20 to-transparent" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {/* Grid: Video+Reality Cards (Left) | Ecosystem (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch relative z-10">
          
          {/* Card 1: Market Reality Showcase + CTA */}
          <div className="lg:col-span-8 relative rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl min-h-[350px] lg:min-h-[360px] flex flex-col justify-center p-6 md:p-8 lg:p-12">
            {/* Video Background */}
            <div className="absolute inset-0 bg-black pointer-events-none">
              <video 
                ref={aboutVideoRef}
                src="https://res.cloudinary.com/dwlfwnbt0/video/upload/v1779279363/robo_gunk64.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                preload="auto"
                poster="https://res.cloudinary.com/dwlfwnbt0/video/upload/v1779279363/robo_gunk64.jpg"
                className="w-full h-full object-cover object-[center_15%] transition-transform duration-[2s] group-hover:scale-103" 
              />
            </div>

            {/* Headline */}
            <div className="relative z-10">
              <h2 className="text-[28px] md:text-[40px] lg:text-[48px] font-black text-white uppercase tracking-tighter leading-[1.05] max-w-[600px]">
                TUDO <br className="md:hidden" /> LIGADO. <br />
                <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green italic pr-4 lg:pr-6">
                  NUM SÓ <br className="md:hidden" /> LUGAR.
                </span>
              </h2>
              <p className="text-[14px] md:text-[16px] text-white/50 font-light mt-4 max-w-[450px] md:max-w-[560px] leading-relaxed">
                Somos o ecossistema digital <br className="md:hidden" />
                completo para posicionar <br className="hidden md:inline" />
                a <br className="md:hidden" />
                tua marca, atrair clientes <br className="md:hidden" />
                qualificados <br className="hidden md:inline" />
                e multiplicar <br className="md:hidden" />
                os teus resultados.
              </p>
            </div>
          </div>

          {/* Card 2: Ecosystem Panel */}
          <div className="lg:col-span-4 bg-card border border-white/10 rounded-[2rem] p-6 md:p-8 lg:px-10 lg:py-8 shadow-2xl flex flex-col justify-center">
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary/70 mb-5">Ecossistema</div>

            <div ref={ecosystemRef} className="flex flex-col w-full">
              {ECOSYSTEM_ITEMS.map((item, i) => (
                <div key={i} className={`border-t border-white/5 py-3.5 ${i === 0 ? 'border-0 pt-0' : ''} ${i === ECOSYSTEM_ITEMS.length - 1 ? 'pb-0' : ''}`}>
                  <div className="text-sm md:text-base uppercase tracking-widest text-white font-bold mb-0.5">{item.label}</div>
                  <div className="text-[13px] md:text-sm text-primary/90 font-medium">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;
