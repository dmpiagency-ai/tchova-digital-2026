import { useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

// Import our premium custom vectors
import { EliteMatrix, EliteNode } from '@/components/ui/EliteIcons';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal Header
    gsap.from('.manifesto-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });

    // Impactful Stats reveal
    if (statsRef.current) {
      gsap.from(statsRef.current.children, {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
        }
      });
    }
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
    <section id="about" ref={containerRef} className="py-12 md:py-24 relative overflow-hidden bg-[#030303] border-t border-white/[0.04]">
      {/* Elite Background Architecture */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 1. Cyber Grid Overlay (Softened) */}
        <div 
          className="absolute inset-0 opacity-[0.05]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)`,
            backgroundSize: '64px 64px' 
          }} 
        />
        
        {/* 2. Liquid Energy Blobs (Softened and Diffused) */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-15%] left-[-15%] w-[70%] h-[70%] bg-primary/[0.04] md:bg-primary/10 rounded-full blur-[180px]" />
          <div className="absolute bottom-[-15%] right-[-15%] w-[60%] h-[60%] bg-brand-green/[0.03] md:bg-brand-green/8 rounded-full blur-[160px]" />
        </div>

        {/* 3. Ambient Technical Lines (Subtle) */}
        <div className="absolute inset-0 overflow-hidden opacity-10">
          <div className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          <div className="absolute top-0 left-[80%] w-px h-full bg-gradient-to-b from-transparent via-brand-green/20 to-transparent" />
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        {/* Two Separate Cards in a Grid: Video/Manifesto Card (Left) & Stats Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-16 relative z-10">
          
          {/* Card 1: Cinematic Video & Manifesto Card (Left - Width Reduced) */}
          <div className="lg:col-span-8 relative rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl min-h-[350px] lg:min-h-[390px] flex flex-col justify-center p-6 pb-4 md:p-8 md:pb-6 lg:p-12 lg:pb-8">
            {/* Immersive Background Video inside Card 1 */}
            <div className="absolute inset-0 bg-black pointer-events-none">
              <video 
                src="https://res.cloudinary.com/dwlfwnbt0/video/upload/v1779279363/robo_gunk64.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover object-[center_15%] transition-transform duration-[2s] group-hover:scale-103" 
              />
              {/* Soft dark overlays for immersive contrast and premium aesthetic */}
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/15" />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
            </div>

            {/* Content inside Card 1 */}
            <div className="relative z-10 flex flex-col justify-center h-full">
              <div className="manifesto-title inline-flex self-start items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-md">
                <EliteMatrix className="w-4 h-4 text-primary" />
                <span className="text-xs tracking-widest font-bold text-primary uppercase">Sobre Nós</span>
              </div>
              {/* Mobile version */}
              <h2 className="manifesto-title text-[30px] font-black mb-5 tracking-tight text-white uppercase leading-[1.1] md:hidden">
                O teu negócio<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green italic pr-2">merece ser visto.</span>
              </h2>
              <p className="manifesto-title text-[15px] text-white/80 font-light leading-relaxed md:hidden">
                Do primeiro logo ao sistema completo — estamos contigo em cada passo.
              </p>
              {/* Desktop version */}
              <h2 className="manifesto-title hidden md:block text-[40px] lg:text-[48px] font-black mb-6 tracking-tight text-white uppercase leading-[1.1]">
                O teu negócio<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green italic pr-2">merece ser visto.</span>
              </h2>
              <p className="manifesto-title hidden md:block text-[17px] lg:text-[18px] text-white/80 font-light leading-relaxed max-w-[540px]">
                Do primeiro logo ao sistema completo — estamos contigo em cada passo.
              </p>
            </div>
          </div>

          {/* Card 2: Stats Card (Right - Frosted Glass Panel next to Video Card) */}
          <div className="lg:col-span-4 bg-[#0b0b0b] md:bg-black/40 md:backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 md:p-8 lg:p-10 shadow-2xl flex flex-col justify-center">
            <div ref={statsRef} className="flex flex-col gap-6 w-full justify-center">
              
              <div className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="text-left">
                  <div className="text-xs md:text-sm uppercase tracking-widest text-primary font-bold mb-1">Projectos Entregues</div>
                  <div className="text-[10px] md:text-xs text-white/40">Design, vídeos, sites e sistemas activos</div>
                </div>
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">100<span className="text-primary">+</span></div>
              </div>

              <div className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <div className="text-left">
                  <div className="text-xs md:text-sm uppercase tracking-widest text-primary font-bold mb-1">Clientes Activos</div>
                  <div className="text-[10px] md:text-xs text-white/40">Empresários que crescem connosco todos os meses</div>
                </div>
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">50<span className="text-primary">+</span></div>
              </div>

              <div className="flex items-center justify-between last:border-0 last:pb-0">
                <div className="text-left">
                  <div className="text-xs md:text-sm uppercase tracking-widest text-primary font-bold mb-1">Áreas de Serviço</div>
                  <div className="text-[10px] md:text-xs text-white/40">Design, Web, Marketing, Vídeo e GSM</div>
                </div>
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter">5<span className="text-primary">+</span></div>
              </div>

            </div>
          </div>

        </div>

        {/* Action Button Centered Under Grid */}
        <div className="flex justify-center mt-8 mb-16 relative z-30">
          <button 
            onClick={handleCTA}
            className="group relative inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 text-base md:text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105 shadow-2xl"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-300">
              <EliteNode className="w-5 h-5" />
              Conhecer a Nossa Filosofia
              <ArrowRight className="w-5 h-5 ml-1 -rotate-45 group-hover:rotate-0 transition-transform" />
            </span>
          </button>
        </div>

      {/* Visual Scene Separator (Full Width, No Card) */}
      <div className="w-full relative h-[35vh] md:h-[50vh] overflow-hidden mt-6 md:mt-4 pointer-events-none">
        <div className="absolute inset-0">
          <img 
            src="https://res.cloudinary.com/dwlfwnbt0/image/upload/v1779210902/servico_1_clkh5z.jpg" 
            alt="TchovaDigital Infraestrutura" 
            className="w-full h-full object-cover object-center opacity-90" 
          />
          {/* Comprehensive edge gradients to remove harsh cuts and blend perfectly */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#030303] via-transparent to-[#030303]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030303] via-transparent to-[#030303]" />
          
          {/* Stronger fades at the exact edges to hide any image borders */}
          <div className="absolute top-0 left-0 w-full h-24 md:h-32 bg-gradient-to-b from-[#030303] to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-[#030303] to-transparent" />
          <div className="absolute left-0 top-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#030303] to-transparent" />
          <div className="absolute right-0 top-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#030303] to-transparent" />

          <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
        </div>
      </div>


      </div>
    </section>
  );
};

export default About;
