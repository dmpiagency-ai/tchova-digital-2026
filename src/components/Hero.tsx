import { MessageCircle, Sparkles, Zap, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import { env } from '@/config/env';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsLoaded(true);
    
    // Hide scroll indicator after 3 seconds
    const timer = setTimeout(() => setShowScrollIndicator(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Detect desktop viewport and reduced motion preference
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(media.matches);
    onChange();

    if (media.addEventListener) {
      media.addEventListener('change', onChange);
    } else {
      // Safari fallback
      media.addListener(onChange);
    }

    return () => {
      window.removeEventListener('resize', checkDesktop);
      if (media.removeEventListener) {
        media.removeEventListener('change', onChange);
      } else {
        media.removeListener(onChange);
      }
    };
  }, []);


  // Parallax scroll effect for background (desktop only, respects reduced-motion)
  useEffect(() => {
    if (!isDesktop || prefersReducedMotion) return;

    let ticking = false;
    const parallax = document.querySelector('.parallax-bg') as HTMLElement;

    const update = () => {
      ticking = false;
      const scrolled = window.pageYOffset;
      if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll as EventListener);
    };
  }, [isDesktop, prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-[85vh] sm:min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden py-4 sm:py-6 lg:py-12"
    >
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dwlfwnbt0/image/upload/v1764162732/bg-site_l56chg_2048x1148_dzunhj.jpg)'
          }}
        />

        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      </div>

      {/* Subtle gradient effects only */}
      <div className="absolute inset-0 transition-all duration-1000 ease-out" style={{
        backgroundImage: `radial-gradient(circle at 25% 25%, hsla(var(--primary) / ${isLoaded ? '0.1' : '0'}) 0%, transparent 50%),
                         radial-gradient(circle at 75% 75%, hsla(var(--accent) / ${isLoaded ? '0.08' : '0'}) 0%, transparent 50%)`
      }} />

      {/* Enhanced Floating particles with staggered animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute ${isLoaded ? 'animate-float' : 'opacity-0'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          >
            <Sparkles className={`w-3 h-3 sm:w-4 sm:h-4 text-primary/40 hover:text-primary/60 transition-colors duration-300`} />
          </div>
        ))}
      </div>

      {/* Enhanced Glassmorphism container */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className={`max-w-5xl mx-auto space-y-3 sm:space-y-4 lg:space-y-6 transition-all duration-1000 ${isLoaded ? 'animate-fade-up opacity-100' : 'opacity-0 translate-y-10'}`}>

           {/* Enhanced Typographic hierarchy */}
           <div className="space-y-4 sm:space-y-6">
             <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
               <span className="block mb-2 sm:mb-3 drop-shadow-lg">
                 <span className="gradient-text">Criatividade que Vende</span>
               </span>
               <span className="block drop-shadow-lg">
                 <span className="text-yellow-300 dark:text-yellow-400 font-extrabold">Tecnologia que </span>
                 <span className="text-yellow-300 dark:text-yellow-400 font-extrabold">Resolve</span>
               </span>
             </h1>
           </div>

           <p className={`text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl text-yellow-100 dark:text-yellow-200 font-medium leading-relaxed max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto drop-shadow-lg transition-all duration-700 delay-500 ${isLoaded ? 'animate-fade-up opacity-100' : 'opacity-0 translate-y-10'}`}>
             Tudo no Mesmo Lugar, Sem Complicação. <span className="text-yellow-200 dark:text-yellow-300 font-semibold">Do Design Top ao Suporte que Resolve Tudo.</span>
           </p>

           {/* Enhanced CTA Buttons with Original Effects */}
           <div className={`flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 transition-all duration-700 delay-300 ${isLoaded ? 'animate-fade-up opacity-100' : 'opacity-0 translate-y-10'}`}>

             <Button
               size="lg"
               className="modern-cta-button button-enhanced bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-green-600 hover:border-green-600 font-bold px-3 sm:px-4 md:px-6 lg:px-8 xl:px-9 py-2.5 sm:py-3 md:py-4 lg:py-4 xl:py-5 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl hover-lift transition-all duration-300 w-full sm:w-auto relative overflow-hidden group hover:scale-105 hover:shadow-2xl active:bg-green-700 active:border-green-700"
               onClick={(e) => {
                 // Enhanced ripple effect
                 const button = e.currentTarget;
                 const ripple = document.createElement('span');
                 const rect = button.getBoundingClientRect();
                 const size = Math.max(rect.width, rect.height);
                 const x = e.clientX - rect.left - size / 2;
                 const y = e.clientY - rect.top - size / 2;

                 ripple.style.width = ripple.style.height = size + 'px';
                 ripple.style.left = x + 'px';
                 ripple.style.top = y + 'px';
                 ripple.classList.add('ripple');

                 button.appendChild(ripple);

                 setTimeout(() => {
                   ripple.remove();
                   document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
                 }, 300);
               }}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
               <Zap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 mr-1.5 sm:mr-2 text-green-400 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 relative z-10 drop-shadow-sm flex-shrink-0" />
               <span className="relative z-10 font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl tracking-wide text-green-400 group-hover:text-white drop-shadow-sm truncate">VER O QUE FAZEMOS</span>
             </Button>

             <Button
               variant="outline"
               size="lg"
               className="modern-cta-button button-enhanced bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-yellow-400 hover:text-yellow-900 hover:border-yellow-400 font-bold px-3 sm:px-4 md:px-6 lg:px-8 xl:px-9 py-2.5 sm:py-3 md:py-4 lg:py-4 xl:py-5 rounded-lg sm:rounded-xl text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl hover-lift transition-all duration-500 w-full sm:w-auto relative overflow-hidden group shadow-[0_8px_32px_rgba(34,197,94,0.15)] hover:shadow-[0_12px_40px_rgba(251,191,36,0.25)] hover:scale-105 active:bg-yellow-500 active:text-yellow-900 active:border-yellow-500"
               onClick={(e) => {
                 // Enhanced ripple effect for WhatsApp button
                 const button = e.currentTarget;
                 const ripple = document.createElement('span');
                 const rect = button.getBoundingClientRect();
                 const size = Math.max(rect.width, rect.height);
                 const x = e.clientX - rect.left - size / 2;
                 const y = e.clientY - rect.top - size / 2;

                 ripple.style.width = ripple.style.height = size + 'px';
                 ripple.style.left = x + 'px';
                 ripple.style.top = y + 'px';
                 ripple.classList.add('ripple');

                 button.appendChild(ripple);

                 setTimeout(() => {
                   ripple.remove();
                   const message = encodeURIComponent('Olá! Vi seu site e quero transformar meu negócio em digital. Podemos conversar sobre como a TchovaDigital pode ajudar?');
                   window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                 }, 300);
               }}
             >
               <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
               <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-6 xl:h-6 mr-1.5 sm:mr-2 text-yellow-400 group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 relative z-10 drop-shadow-sm flex-shrink-0" />
               <span className="relative z-10 font-bold text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl tracking-wide text-yellow-400 group-hover:text-white drop-shadow-sm truncate">VAMOS CONVERSAR</span>
             </Button>
           </div>

           {/* Trust Signals & Stats */}
           <div className={`space-y-4 transition-all duration-700 delay-1000 ${isLoaded ? 'animate-fade-up opacity-100' : 'opacity-0 translate-y-10'}`}>
             {/* Trust Badges */}
             <div className="flex justify-center items-center gap-3 sm:gap-4 flex-wrap">
               <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                 <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                 <span className="text-xs font-medium text-white">100% Seguro</span>
               </div>
               <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                 <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                 <span className="text-xs font-medium text-white">Suporte 24/7</span>
               </div>
               <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
                 <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                 <span className="text-xs font-medium text-white">Satisfação Garantida</span>
               </div>
             </div>

             {/* Enhanced Stats with counter animation */}
             <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-sm sm:max-w-lg mx-auto">
               {[
                 { number: '100+', label: 'Projetos', suffix: '', type: 'projects' },
                 { number: '50+', label: 'Clientes', suffix: '', type: 'clients' },
                 { number: '3+', label: 'Anos', suffix: '', type: 'years' }
               ].map((stat, index) => (
                 <div key={index} className="text-center p-2 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-300 hover:bg-primary/10 dark:hover:bg-primary/5 hover:scale-105 group cursor-pointer">
                   <div className="flex items-center justify-center mb-1 drop-shadow-md group-hover:scale-110 transition-transform duration-300">
                     {/* Liquid Glass Icons - Matching Text Colors */}
                     {stat.type === 'projects' && (
                       <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-600/20 backdrop-blur-sm border border-yellow-400/30 shadow-inner flex items-center justify-center mr-1">
                         <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-sm transform rotate-45 shadow-lg"></div>
                       </div>
                     )}
                     {stat.type === 'clients' && (
                       <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-600/20 backdrop-blur-sm border border-yellow-400/30 shadow-inner flex items-center justify-center mr-1">
                         <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-sm relative">
                           <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-gradient-to-r from-yellow-200 to-orange-300 rounded-full"></div>
                         </div>
                       </div>
                     )}
                     {stat.type === 'years' && (
                       <div className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-600/20 backdrop-blur-sm border border-yellow-400/30 shadow-inner flex items-center justify-center mr-1">
                         <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-sm transform rotate-45 relative">
                           <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 to-orange-300 rounded-sm opacity-60"></div>
                         </div>
                       </div>
                     )}
                     <span className="text-sm sm:text-base lg:text-lg font-bold text-yellow-300 dark:text-yellow-400">
                       {stat.number}
                     </span>
                   </div>
                   <div className="text-xs sm:text-sm text-yellow-100 dark:text-yellow-200 font-medium leading-tight drop-shadow-sm">
                     {stat.label}
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
      </div>

      {/* Enhanced Scroll indicator with better UX */}
      {showScrollIndicator && (
        <div className={`absolute bottom-4 xs:bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-700 ${isLoaded ? (prefersReducedMotion ? 'opacity-100' : 'animate-bounce opacity-100') : 'opacity-0'}`}>
          <button
            onClick={() => document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex flex-col items-center space-y-2 p-3 rounded-full hover:bg-white/10 transition-all duration-300"
            aria-label="Scroll to services"
          >
            <div className="w-5 h-8 xs:w-6 xs:h-10 border-2 border-primary/60 dark:border-primary/70 rounded-full flex justify-center p-1 group-hover:border-primary transition-colors duration-300">
              <div className="w-0.5 h-2 xs:h-3 bg-primary dark:bg-primary/90 rounded-full mt-1 xs:mt-2 animate-pulse" />
            </div>
            <span className="text-xs text-primary/60 dark:text-primary/70 group-hover:text-primary transition-colors duration-300">
              Rolar
            </span>
            <ArrowDown className="w-3 h-3 text-primary/60 dark:text-primary/70 animate-bounce" />
          </button>
        </div>
      )}
    </section>
  );
};

export default Hero;