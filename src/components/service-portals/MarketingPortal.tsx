// ============================================
// MARKETING PORTAL - TCHOVA DIGITAL
// Campanhas & Redes Sociais - Interactive Onboard
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { ArrowLeft, MessageCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { env } from '@/config/env';

const problems = [
  "Poucas pessoas conhecem a minha empresa na minha cidade",
  "Faço publicações mas quase ninguém interage ou compra",
  "Gasto dinheiro a impulsionar posts mas não vejo retorno",
  "Tenho dificuldade em atrair novos clientes regularmente"
];

const packages = [
  { title: "Gestão de Redes Sociais", desc: "Conteúdo profissional e consistente para manter o público engajado." },
  { title: "Anúncios Patrocinados (Tráfego)", desc: "Campanhas direcionadas para pessoas que querem comprar de ti." },
  { title: "Perfil no Google Maps", desc: "Aparece quando as pessoas procuram os teus serviços na zona." },
  { title: "Crescimento Sustentável", desc: "Menos 'likes' vazios e mais mensagens reais no WhatsApp." }
];

const MarketingPortal = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);

  const handleNext = () => {
    setStep(s => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handlePrev = () => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProblemSelect = (prob: string) => {
    setSelectedProblem(prob);
    // Auto-advance after a brief delay for a premium feel
    setTimeout(() => {
      handleNext();
    }, 600);
  };

  const getWhatsAppLink = () => {
    const text = selectedProblem 
      ? `Olá! Gostaria de conversar sobre Marketing. O meu maior desafio atualmente é: "${selectedProblem}". Podem ajudar a trazer mais clientes?`
      : `Olá! Gostaria de conversar sobre o serviço de Marketing e Redes Sociais para a minha empresa. Podem ajudar?`;
    return `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white select-none font-sans flex flex-col relative overflow-x-hidden">
      {/* Sticky Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#030303]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <button 
            onClick={() => step === 1 ? navigate('/') : handlePrev()} 
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group text-sm font-semibold no-min-size"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{step === 1 ? 'Voltar' : 'Anterior'}</span>
          </button>
          <div className="h-6 md:h-8">
            <AnimatedLogo className="h-6 md:h-8 w-auto" />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 w-full bg-zinc-900">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center pt-20 pb-12 md:pt-28 md:pb-24 relative">
        {/* Animated Background Orbs for Friendly/Interactive Vibe */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
        
        <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10 overflow-hidden">
          <div className="relative w-full transition-all duration-500 ease-out">
            {/* STEP 1: Diagnóstico */}
            <div className={`w-full flex-shrink-0 px-1 transition-opacity duration-500 ${step === 1 ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
              <div className="text-center mb-6 md:mb-12">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-2 md:mb-4 block">Passo 1 de 3 • Diagnóstico</span>
                <h1 className="text-xl sm:text-2xl md:text-5xl font-black tracking-tight uppercase mb-2 md:mb-4">
                  Como estão as <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">vendas</span> online?
                </h1>
                <p className="text-xs sm:text-sm md:text-lg text-zinc-400 font-medium">Onde sentes que o teu negócio está a perder tração?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto">
                {problems.map((prob, i) => (
                  <button
                    key={i}
                    onClick={() => handleProblemSelect(prob)}
                    className={`p-4 sm:p-8 rounded-[1.5rem] md:rounded-[2rem] border text-left transition-all duration-300 group
                      ${selectedProblem === prob 
                        ? 'bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border-primary shadow-[0_0_30px_rgba(34,197,94,0.15)] scale-[1.01]' 
                        : 'bg-white/[0.02] backdrop-blur-xl border-white/10 hover:border-primary/30 hover:bg-white/[0.04] hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)]'}`}
                  >
                    <div className="flex justify-between items-center gap-3 md:gap-4">
                      <span className={`text-xs sm:text-sm md:text-base font-bold transition-colors ${selectedProblem === prob ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                        {prob}
                      </span>
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300
                        ${selectedProblem === prob ? 'bg-primary text-black scale-110' : 'bg-white/5 text-zinc-500 group-hover:bg-primary/20 group-hover:text-primary'}`}>
                        {selectedProblem === prob ? <CheckCircle2 className="w-3.5 h-3.5" /> : <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-primary" />}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Continuar button is hidden since we auto-advance, but keeping it for accessibility/fallback if needed, though auto-advance is better */}
              <div className={`mt-6 md:mt-10 flex justify-center transition-all duration-500 ${selectedProblem ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'} md:hidden`}>
                <span className="text-xs text-primary/70 font-medium animate-pulse">Avançando...</span>
              </div>
            </div>

            {/* STEP 2: Solução (Showcase Visual de Mini Case) */}
            <div className={`w-full flex-shrink-0 px-1 transition-opacity duration-500 ${step === 2 ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
              <div className="text-center mb-10 md:mb-14">
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-primary mb-2 md:mb-4 block">Passo 2 de 3 • Estúdio Visual & Cases</span>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight uppercase mb-2 md:mb-4">
                  A nossa abordagem na <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">prática</span>
                </h1>
                <p className="text-xs sm:text-sm md:text-lg text-zinc-400 font-medium max-w-2xl mx-auto">
                  Vê como criamos campanhas estratégicas de atração que enchem o teu WhatsApp de potenciais clientes.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-center">
                {/* Visual Showcase (Mockup) - Left Column */}
                <div className="lg:col-span-6 relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-square border border-white/10 group shadow-2xl">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                    style={{ backgroundImage: `url('https://res.cloudinary.com/dwlfwnbt0/image/upload/f_auto,q_auto,w_800/v1762747013/1762701812733_p93nsd.png')` }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  
                  {/* Glowing Metric Badge */}
                  <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-primary/30 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    <span className="block text-[9px] font-black text-primary uppercase tracking-widest mb-0.5">Impacto do Caso</span>
                    <span className="text-lg md:text-xl font-black text-white">+120 Novos Pacientes no 1º Mês</span>
                  </div>
                </div>

                {/* Case Info - Right Column */}
                <div className="lg:col-span-6 flex flex-col gap-5 text-left">
                  <div>
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-1 block">Estúdio de Marketing • Mini Case</span>
                    <h3 className="text-xl md:text-2xl font-black uppercase text-white tracking-tight">Caso Clínica Sorriso</h3>
                    <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-wider mt-0.5">Tráfego Pago & Captação Activa</p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <h4 className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">O Desafio</h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                        Investimento contínuo em posts patrocinados simples (botão impulsionar) sem qualquer atração de leads ou agendamentos reais na clínica.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <h4 className="text-[9px] font-black text-white/50 uppercase tracking-widest mb-1">A Solução</h4>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
                        Estruturação de campanhas de tráfego segmentadas para o público local de Maputo, com anúncios dinâmicos e funil otimizado para o WhatsApp.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <h4 className="text-[9px] font-black text-[#4ade80]/70 uppercase tracking-widest mb-1">O Impacto</h4>
                      <p className="text-xs sm:text-sm text-[#4ade80] leading-relaxed font-bold">
                        Redução do custo por contacto para metade e mais de 120 novos agendamentos mensais concretizados logo no primeiro mês.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <button 
                  onClick={handleNext}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-transform shadow-lg"
                >
                  Ver o Meu Pacote
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* STEP 3: Entrega e CTA */}
            <div className={`w-full flex-shrink-0 px-1 transition-opacity duration-500 ${step === 3 ? 'opacity-100 relative' : 'opacity-0 absolute pointer-events-none'}`}>
              <div className="text-center mb-12">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 block">Passo 3 de 3 • O Teu Pacote</span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight uppercase mb-4">
                  O que recebes no final.
                </h1>
              </div>

              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto mb-16">
                {packages.map((item, i) => (
                  <div key={i} className="p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300 shadow-xl flex items-center gap-4 sm:gap-6">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <span className="text-xl sm:text-2xl font-black text-primary">✓</span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black uppercase tracking-tighter mb-1 text-white">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-zinc-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="max-w-md mx-auto text-center bg-zinc-950/50 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50 pointer-events-none" />
                <h3 className="text-2xl font-black uppercase tracking-tight mb-3 relative z-10">Pronto para avançar?</h3>
                <p className="text-sm text-zinc-400 font-medium mb-8 relative z-10">
                  Conta-nos o teu cenário no WhatsApp e criamos um plano para trazer mais clientes. Sem compromisso.
                </p>
                <a 
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 inline-flex w-full items-center justify-center gap-3 px-8 py-5 rounded-full bg-gradient-to-r from-primary to-brand-green text-white font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)] font-sans"
                >
                  <MessageCircle className="w-5 h-5 animate-pulse" />
                  Falar com a Equipa
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketingPortal;
