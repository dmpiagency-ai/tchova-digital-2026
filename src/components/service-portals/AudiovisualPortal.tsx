// ============================================
// AUDIOVISUAL PORTAL - TCHOVA DIGITAL
// Painel de Produção Audiovisual
// ============================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { AnimatedLogo } from '@/components/AnimatedLogo';
import {
  Video, Camera, Film, Mountain, Zap, Sparkle, Star,
  ChevronRight, Home, MessageCircle, CheckCircle2,
  LayoutDashboard, Layers, Play, Image
} from 'lucide-react';
import { MobileTopNav } from './MobileTopNav';
import {
  audiovisualPackages as AUDIO_PACKAGES
} from '@/constants/servicesData';
import { env } from '@/config/env';

const AudiovisualPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'services' | 'packages' | 'request'>('services');
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const modules = containerRef.current?.querySelectorAll('.av-module');
    if (modules) {
      gsap.fromTo(modules, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' });
    }
  }, { scope: containerRef, dependencies: [activeView] });

  const sidebarItems = [
    { id: 'services', icon: Video, label: 'Serviços', description: 'O que fazemos' },
    { id: 'packages', icon: Layers, label: 'Pacotes', description: 'Preços' },
    { id: 'request', icon: Camera, label: 'Solicitar', description: 'Novo Projeto' },
  ];

  const handleWhatsApp = (pkgName?: string, pkgPrice?: number) => {
    const msg = pkgName 
      ? `Olá! Quero solicitar o pacote "${pkgName}" (${pkgPrice?.toLocaleString('pt-MZ')} MZN) de Produção Audiovisual.`
      : 'Olá! Quero solicitar um serviço de Produção Audiovisual. Podem ajudar?';
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r dark:border-white/5 border-slate-100 dark:bg-zinc-950/80 bg-white backdrop-blur-xl">
        <div className="h-20 flex items-center px-6 border-b dark:border-white/5 border-slate-100">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1">
              <AnimatedLogo className="h-8 w-auto" />
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto no-scrollbar">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 transform active:scale-95 border ${
                  isActive 
                    ? 'bg-primary/10 border-primary/30 text-white shadow-[0_0_20px_rgba(34,197,94,0.1)] backdrop-blur-xl' 
                    : 'dark:border-transparent dark:text-zinc-500 text-slate-500 dark:hover:bg-white/5 hover:bg-slate-50 dark:hover:text-white hover:text-slate-900'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors duration-300 ${isActive ? 'bg-primary/20 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-transparent'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]' : ''}`} />
                </div>
                <div className="text-left flex-1">
                  <span className="font-black uppercase tracking-widest text-[10px] block">{item.label}</span>
                  <span className={`text-[9px] font-bold ${isActive ? 'text-white/60' : 'text-zinc-600'}`}>{item.description}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-primary drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t dark:border-white/5 border-slate-100">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl dark:bg-zinc-900/50 bg-slate-50 border dark:border-white/5 border-slate-100 dark:text-zinc-400 text-slate-500 dark:hover:text-white hover:text-slate-900 transition-all">
            <Home className="w-4 h-4" />
            <span className="font-black uppercase tracking-widest text-[9px]">Voltar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <div className="lg:hidden flex-none z-50 dark:bg-zinc-950 bg-white border-b dark:border-white/5 border-slate-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-center">
              <AnimatedLogo className="h-6 w-auto" />
            </div>
            <button onClick={() => navigate('/')} className="p-2 rounded-lg dark:bg-white/5 bg-slate-100"><Home className="w-4 h-4" /></button>
          </div>
          <MobileTopNav items={sidebarItems} activeView={activeView} setActiveView={setActiveView} />
        </div>

        {/* Scrollable Workspace */}
        <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar pb-24 lg:pb-0">

        {/* SERVICES VIEW */}
        {activeView === 'services' && (
          <div className="p-4 lg:p-6 lg:max-w-6xl mx-auto space-y-4">
            <div className="av-module relative overflow-hidden rounded-3xl sm:rounded-[2rem] p-6 sm:p-8 dark:bg-zinc-900 bg-primary text-white shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 space-y-2">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">CONTEÚDO QUE<br />GERA <span className="text-white/40">DESEJO</span></h2>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60">Produção audiovisual de cinema para a sua marca</p>
              </div>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                { title: 'Vídeo Publicitário', desc: 'Spots de alta conversão', icon: Video, gradient: 'from-primary to-brand-green' },
                { title: 'Fotografia 4K', desc: 'Ensaios profissionais de produto', icon: Camera, gradient: 'from-brand-yellow to-orange-500' },
                { title: 'Cobertura de Eventos', desc: 'Multi-câmera e edição cine', icon: Film, gradient: 'from-purple-500 to-pink-500' },
                { title: 'Imagens Aéreas', desc: 'Drone para perspectivas únicas', icon: Mountain, gradient: 'from-blue-500 to-cyan-500' },
                { title: 'Motion Graphics', desc: 'Animações e efeitos visuais', icon: Sparkle, gradient: 'from-rose-500 to-red-500' },
                { title: 'Efeitos Especiais', desc: 'Fogo, fumaça e fx de cinema', icon: Zap, gradient: 'from-brand-yellow to-amber-600' },
              ].map((service, i) => (
                <div key={i} className="av-module group p-4 sm:p-5 rounded-2xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base font-black uppercase tracking-tight mb-1">{service.title}</h3>
                  <p className="text-[10px] text-zinc-500 font-bold leading-tight">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PACKAGES VIEW */}
        {activeView === 'packages' && (
          <div className="p-4 lg:p-6 lg:max-w-6xl mx-auto flex flex-col gap-3 h-full">
            <div className="av-module flex-none">
              <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter leading-none mb-1">PACOTES <span className="text-primary tracking-normal">ESPECIAIS</span></h2>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400">Escolha o seu nível de produção</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 flex-1 content-start">
              {AUDIO_PACKAGES.map((pkg: any, i: number) => (
                <div key={i} className={`av-module flex flex-col p-3 sm:p-4 rounded-2xl dark:bg-zinc-900/50 bg-white border shadow-lg transition-all hover:shadow-xl ${pkg.popular ? 'border-primary ring-1 ring-primary/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'dark:border-white/5 border-slate-100'}`}>
                  {pkg.popular && (
                    <span className="inline-block self-start px-2 py-0.5 bg-primary text-white text-[7px] font-black uppercase tracking-widest rounded-full mb-2">Popular</span>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary flex-shrink-0">{pkg.icon}</div>
                    <h3 className="text-sm font-black uppercase tracking-tight leading-tight">{pkg.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-3">
                    {pkg.price > 0 ? (
                      <>
                        <span className="text-xl sm:text-2xl font-black">{pkg.price.toLocaleString('pt-MZ')}</span>
                        <span className="text-[9px] font-black text-zinc-400 uppercase">MZN</span>
                      </>
                    ) : (
                      <span className="text-base font-black text-primary">Sob Consulta</span>
                    )}
                  </div>

                  <ul className="space-y-1.5 mb-3 flex-grow">
                    {pkg.features.slice(0, 4).map((f: string, fi: number) => (
                      <li key={fi} className="flex items-start gap-1.5 text-[10px] sm:text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="font-bold leading-tight text-zinc-700 dark:text-zinc-300">{f}</span>
                      </li>
                    ))}
                    {pkg.features.length > 4 && (
                      <li className="text-[8px] font-black text-zinc-500 uppercase tracking-widest pl-4">+{pkg.features.length - 4} mais</li>
                    )}
                  </ul>

                  <button
                    onClick={() => handleWhatsApp(pkg.name, pkg.price)}
                    className={`w-full py-2.5 sm:py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 mt-auto ${
                      pkg.popular 
                        ? 'bg-primary text-white shadow-md shadow-primary/20 hover:shadow-primary/30' 
                        : 'dark:bg-white/10 bg-slate-100 dark:text-white text-slate-900 hover:bg-primary hover:text-white'
                    }`}
                  >
                    Solicitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REQUEST VIEW */}
        {activeView === 'request' && (
          <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6 flex flex-col h-full justify-center">
            <div className="av-module text-center space-y-1">
              <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">SOLICITAR <span className="text-primary tracking-normal">PRODUÇÃO</span></h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Orçamento personalizado em 30 min</p>
            </div>

            <div className="av-module p-6 rounded-3xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-xl space-y-6">
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Tipo de produção?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Evento', icon: Film },
                    { label: 'Publicidade', icon: Video },
                    { label: 'Fotografia', icon: Camera },
                    { label: 'Drone', icon: Mountain },
                  ].map((opt, i) => (
                    <button key={i} className="p-4 rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-100 text-left hover:border-primary/30 hover:bg-primary/5 transition-all group">
                      <opt.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Quero solicitar um serviço de Produção Audiovisual. Podem ajudar?')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative overflow-hidden block w-full py-5 bg-gradient-to-r from-primary to-brand-green text-white rounded-[1.5rem] text-center font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-500 group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <div className="relative z-10 flex items-center justify-center gap-2">
                  <MessageCircle className="w-5 h-5 animate-pulse" />
                  Falar com Especialista
                </div>
              </a>
              <p className="text-center text-[8px] font-black uppercase tracking-widest text-zinc-500">Sem compromisso</p>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default AudiovisualPortal;
