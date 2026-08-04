import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isLowEnd } from '@/hooks/useLowEnd';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "Qual é a diferença entre a Tchova e uma agência tradicional?",
    answer: "Uma agência comum entrega peças soltas: faz um logotipo hoje, um post amanhã, um site sem ligação. Na Tchova, nós criamos tudo de forma integrada: a tua imagem, o teu site e os teus anúncios trabalham juntos como uma única engrenagem para trazer resultados reais para a tua empresa."
  },
  {
    question: "Como funcionam os pagamentos?",
    answer: "Trabalhamos com os métodos mais convenientes do mercado nacional: M-Pesa, e-Mola e transferência bancária (MZN). Emitimos a respetiva fatura para tua contabilidade."
  },
  {
    question: "Apenas atendem clientes em Maputo?",
    answer: "Não. A nossa estrutura é 100% remota e digital. Trabalhamos com marcas de todo o Moçambique, garantindo a mesma qualidade e velocidade de resposta em qualquer província."
  },
  {
    question: "Quanto tempo demora a ver o meu projeto pronto?",
    answer: "Depende da complexidade. O pacote mais simples ('Marcar Presença') fica pronto entre 3 a 5 dias úteis. Projetos de estruturação maiores têm cronogramas partilhados desde o primeiro dia."
  },
  {
    question: "Posso começar com um plano menor e subir depois?",
    answer: "Com certeza. Aliás, recomendamos essa abordagem. Começa onde estás hoje, estabelece a tua base e faz upgrade connosco à medida que ganhas mais tração e procura."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const containerRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (isLowEnd) return;
    
    // Refresh ScrollTrigger after lazy component mounts
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      gsap.fromTo('.faq-header', 
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
        }
      );

      if (listRef.current?.children) {
        gsap.fromTo(listRef.current.children,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: listRef.current, start: 'top 85%' }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="faq" className="py-12 md:py-16 lg:py-20 bg-background border-t border-white/[0.04] scroll-mt-6">
      <div className="container mx-auto px-4 md:px-6 lg:px-12 max-w-4xl">
        <div className="faq-header text-center mb-8 md:mb-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3 backdrop-blur-md">
            <span className="text-fluid-sm font-bold text-primary uppercase tracking-widest font-nunito">Dúvidas Frequentes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 tracking-tighter text-white uppercase font-nunito">
            AINDA TENS <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green font-nunito">DÚVIDAS?</span>
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm md:text-base font-normal leading-relaxed font-nunito max-w-2xl">
            Respostas claras e diretas. Sem letras miúdas.
          </p>
        </div>

        <div ref={listRef} className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index}
                className={`border rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'bg-white/[0.04] backdrop-blur-xl border-primary/30 shadow-[0_0_25px_-10px_rgba(34,197,94,0.15)]' 
                    : 'bg-card/40 border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  className="w-full text-left px-4 py-4 md:px-6 md:py-5 flex items-center justify-between gap-3 md:gap-4 font-nunito"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className={`font-bold text-sm sm:text-base md:text-lg transition-colors ${isOpen ? 'text-primary' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'bg-primary/20 text-primary rotate-180' : 'bg-white/5 text-muted-foreground'
                  }`}>
                    <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  </div>
                </button>
                
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out font-nunito"
                  style={{ maxHeight: isOpen ? '400px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                  <div className="px-4 pb-4 pt-1 md:px-6 md:pb-6 md:pt-2 text-zinc-300 text-xs sm:text-sm md:text-base leading-relaxed border-t border-white/[0.04]">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
