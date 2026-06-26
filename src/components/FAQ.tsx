import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isLowEnd } from '@/hooks/useLowEnd';

gsap.registerPlugin(ScrollTrigger);

const faqs = [
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
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      gsap.from('.faq-header', {
        y: 30, opacity: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
      });

      if (listRef.current) {
        gsap.from(listRef.current.children, {
          x: -30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 75%' }
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-16 md:py-24 bg-background border-t border-white/[0.04]">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <div className="faq-header text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter text-white uppercase">
            Ainda tens <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">dúvidas?</span>
          </h2>
          <p className="text-muted-foreground text-lg font-light">
            Respostas claras e diretas. Sem letras miúdas.
          </p>
        </div>

        <div ref={listRef} className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index}
                className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                  isOpen ? 'bg-white/5 border-primary/30' : 'bg-transparent border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className={`font-bold text-lg ${isOpen ? 'text-primary' : 'text-white'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'bg-primary/20 text-primary rotate-180' : 'bg-white/5 text-muted-foreground'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                
                <div 
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{ maxHeight: isOpen ? '200px' : '0px', opacity: isOpen ? 1 : 0 }}
                >
                  <div className="px-6 pb-6 pt-2 text-muted-foreground leading-relaxed">
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
