import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';

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

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-background/95 dark:bg-background/80 backdrop-blur-lg">
      <div className="container px-4 mx-auto relative z-10">
        <div className="text-center mb-16 animate-on-scroll">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 font-semibold text-sm mb-6 border border-green-500/20">
            <Star className="w-4 h-4 fill-current" />
            Prova Social
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">O que dizem <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400">sobre nós</span></h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Não acredites apenas na nossa palavra. Vê como estamos a ajudar negócios autênticos em Moçambique a escalar no digital.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, i) => (
            <div 
              key={testimonial.id}
              className={`bg-card/50 dark:bg-card/30 backdrop-blur-sm border border-border/50 p-8 rounded-[2rem] relative group hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-green-500/10 card-3d animate-on-scroll delay-${i + 1}`}
              onMouseEnter={() => trackEvent({
                action: 'hover',
                category: 'testimonials',
                label: testimonial.name
              })}
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-green-500/10 group-hover:text-green-500/20 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, idx) => (
                  <Star key={idx} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-foreground/80 leading-relaxed mb-8 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full border-2 border-green-500/20 object-cover"
                />
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
      </div>
    </section>
  );
};

export default Testimonials;
