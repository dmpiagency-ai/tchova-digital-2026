import React, { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EliteMatrix } from '@/components/ui/EliteIcons';

gsap.registerPlugin(ScrollTrigger);

const TESTIMONIALS = [
  {
    id: 1,
    name: 'João Macamo',
    company: 'Macamo Importações',
    role: 'CEO',
    content: 'A Tchova Digital mudou completamente o nosso jogo. Antes dependíamos apenas do boca-a-boca, hoje recebemos clientes via WhatsApp todos os dias através do nosso novo site. Profissionalismo puro!',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 2,
    name: 'Ana Bela',
    company: 'Bela Boutique',
    role: 'Fundadora',
    content: 'A identidade visual que criaram para a minha loja de roupa é o máximo. Conseguiram captar extamente a essência que eu queria. O suporte deles é maningue rápido e não complicam as coisas.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 3,
    name: 'Carlos Sitoe',
    company: 'Sitoe Tech',
    role: 'Gestor de Vendas',
    content: 'Ter um painel de gestão para as nossas reparações GSM facilitou-nos a vida. Agora os clientes conseguem acompanhar o estado das reparações. Valeu cada metical investido na plataforma.',
    rating: 5,
    avatar: 'https://i.pravatar.cc/150?img=12',
  }
];

export const Testimonials = () => {
  const { trackEvent } = useAnalytics();
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Reveal Header
    gsap.from('.test-header', {
      y: 40,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
      }
    });

    // 3D Staggered Reveal for Testimonials
    if (cardsRef.current) {
      gsap.from(cardsRef.current.children, {
        y: 60,
        opacity: 0,
        rotationX: -10,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 75%',
        }
      });
    }
  }, { scope: containerRef });

  return (
    <section id="testimonials" ref={containerRef} className="py-32 relative overflow-hidden bg-background/95 border-t border-white/5 perspective-1000">
      
      {/* Liquid Glass Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-green/10 rounded-full blur-[120px] mix-blend-screen translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container px-6 lg:px-12 mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="test-header inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-md">
            <EliteMatrix className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold text-primary uppercase tracking-widest">Prova Social</span>
          </div>
          <h2 className="test-header text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
            O que dizem <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">sobre nós</span>
          </h2>
          <p className="test-header text-lg md:text-xl text-muted-foreground/80 font-light leading-relaxed">
            Não acredites apenas na nossa palavra. Vê como estamos a ajudar negócios autênticos em Moçambique a escalar no digital.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-black/40 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl relative group hover:border-primary/40 transition-colors duration-500 shadow-2xl flex flex-col"
              onMouseEnter={() => trackEvent({
                action: 'hover',
                category: 'testimonials',
                label: testimonial.name
              })}
            >
              {/* Decorative Subtle Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none" />
              
              <Quote className="absolute top-8 right-8 w-12 h-12 text-white/5 group-hover:text-primary/10 transition-colors duration-500" />
              
              {/* Stars */}
              <div className="flex gap-1.5 mb-8">
                {[...Array(testimonial.rating)].map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 fill-brand-yellow text-brand-yellow drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-white/80 leading-loose mb-10 italic text-lg flex-grow">
                "{testimonial.content}"
              </p>

              {/* Profile Block */}
              <div className="flex items-center gap-5 mt-auto pt-6 border-t border-white/10">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-brand-green rounded-full blur opacity-0 group-hover:opacity-50 transition duration-500"></div>
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="relative w-14 h-14 rounded-full border border-white/20 object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg tracking-tight">{testimonial.name}</h4>
                  <p className="text-sm font-mono text-primary/80 uppercase tracking-wider">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
