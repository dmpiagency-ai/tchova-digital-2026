// ============================================
// IMPORTAÇÃO PORTAL - TCHOVA DIGITAL
// Painel de Importação & Logística
// ============================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { AnimatedLogo } from '@/components/AnimatedLogo';
import {
  Globe, ShieldCheck, Package, Truck, MapPin, Clock,
  ChevronRight, Home, MessageCircle, CheckCircle2,
  LayoutDashboard, Layers, Search, DollarSign,
  Ship, Plane, FileText
} from 'lucide-react';
import { MobileTopNav } from './MobileTopNav';

const ImportacaoPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'overview' | 'tracking' | 'request'>('overview');
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const modules = containerRef.current?.querySelectorAll('.imp-module');
    if (modules) {
      gsap.fromTo(modules, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' });
    }
  }, { scope: containerRef, dependencies: [activeView] });

  const sidebarItems = [
    { id: 'overview', icon: LayoutDashboard, label: 'Visão Geral', description: 'Como funciona' },
    { id: 'tracking', icon: MapPin, label: 'Rastreio', description: 'Minha Encomenda' },
    { id: 'request', icon: Package, label: 'Solicitar', description: 'Nova Importação' },
  ];

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r dark:border-white/5 border-slate-100 dark:bg-zinc-950/80 bg-white backdrop-blur-xl">
        <div className="h-20 flex items-center px-6 border-b dark:border-white/5 border-slate-100">
          <div className="flex items-center gap-3">
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

        {/* OVERVIEW VIEW */}
        {activeView === 'overview' && (
          <div className="p-4 lg:p-6 lg:max-w-6xl mx-auto flex flex-col gap-3 h-full">
            {/* Hero + Stats Row */}
            <div className="flex flex-col lg:flex-row gap-3 flex-none">
              <div className="imp-module relative overflow-hidden rounded-2xl p-5 sm:p-6 dark:bg-zinc-900 bg-primary text-white shadow-xl flex-1 min-w-0">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none mb-1">IMPORTAÇÃO<br />SEM <span className="text-white/40">STRESS</span></h2>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60">Do fornecedor à tua porta com risco zero</p>
                </div>
              </div>

              {/* Stats Inline */}
              <div className="grid grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 gap-2 flex-none lg:w-[260px]">
                {[
                  { label: 'Encomendas', value: '850+', icon: Package },
                  { label: 'Países', value: '12', icon: Globe },
                  { label: 'Tempo Médio', value: '21d', icon: Clock },
                  { label: 'Segurança', value: '100%', icon: ShieldCheck },
                ].map((stat, i) => (
                  <div key={i} className="imp-module p-3 rounded-xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-md text-center flex flex-col items-center justify-center gap-0.5">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <div className="text-base sm:text-lg font-black tracking-tighter">{stat.value}</div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Process Steps - Horizontal */}
            <div className="imp-module p-4 sm:p-5 rounded-2xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-lg flex-1 flex flex-col min-h-0">
              <h3 className="text-sm sm:text-base font-black uppercase tracking-tighter mb-3">COMO FUNCIONA</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1 content-start">
                {[
                  { step: '01', title: 'Encomenda', desc: 'Diz-nos o que precisas', icon: Search },
                  { step: '02', title: 'Cotação', desc: 'Preço total em MZN', icon: DollarSign },
                  { step: '03', title: 'Transporte', desc: 'Aérea ou marítima', icon: Ship },
                  { step: '04', title: 'Entrega', desc: 'Porta-a-porta', icon: Truck },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-2.5 p-3 sm:p-4 rounded-xl dark:bg-white/5 bg-slate-50">
                    <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <step.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-mono font-black text-primary">{step.step}</span>
                        <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight">{step.title}</h4>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-bold">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRACKING VIEW */}
        {activeView === 'tracking' && (
          <div className="p-4 lg:p-6 max-w-3xl mx-auto space-y-6 flex flex-col h-full justify-center">
            <div className="imp-module text-center space-y-1">
              <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">RASTREAR <span className="text-primary tracking-normal">ENCOMENDA</span></h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Acompanhe a sua importação</p>
            </div>

            <div className="imp-module p-6 sm:p-8 rounded-3xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-xl space-y-6">
              <div className="space-y-3 text-center">
                <label className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Código de Rastreio</label>
                <input
                  type="text"
                  placeholder="TCH-000000"
                  className="w-full bg-zinc-100 dark:bg-zinc-950 border-none h-16 sm:h-20 rounded-2xl text-center text-xl sm:text-2xl font-black tracking-tighter placeholder:opacity-20 focus:ring-2 focus:ring-primary/50 transition-all font-mono uppercase"
                />
              </div>

              <button className="w-full h-14 sm:h-16 bg-primary text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] shadow-lg shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all flex items-center justify-center gap-2">
                <Search className="w-4 h-4" />
                Rastrear Agora
              </button>

              {/* Example tracking */}
              <div className="pt-6 border-t dark:border-white/5 border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-4 text-center">Exemplo de Rastreio</p>
                <div className="space-y-3">
                  {[
                    { status: 'complete', label: 'Encomenda Confirmada', date: '02 Mai 2026' },
                    { status: 'complete', label: 'Em Trânsito (China → MZ)', date: '08 Mai 2026' },
                    { status: 'active', label: 'Desalfandegamento', date: '18 Mai 2026' },
                    { status: 'pending', label: 'Entrega Final', date: 'Previsto: 22 Mai' },
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === 'complete' ? 'bg-primary text-white' : step.status === 'active' ? 'bg-brand-yellow text-black animate-pulse' : 'dark:bg-zinc-800 bg-slate-100 text-zinc-400'
                      }`}>
                        {step.status === 'complete' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-black uppercase tracking-tight">{step.label}</p>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REQUEST VIEW */}
        {activeView === 'request' && (
          <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6 flex flex-col h-full justify-center">
            <div className="imp-module text-center space-y-1">
              <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">NOVA <span className="text-primary tracking-normal">IMPORTAÇÃO</span></h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Diz-nos o que precisas</p>
            </div>

            <div className="imp-module p-6 rounded-3xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-xl space-y-6">
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">Origem?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'China', icon: Globe },
                    { label: 'EUA', icon: Globe },
                    { label: 'Dubai', icon: Plane },
                    { label: 'Outro País', icon: MapPin },
                  ].map((opt, i) => (
                    <button key={i} className="p-4 rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-100 text-left hover:border-primary/30 hover:bg-primary/5 transition-all group">
                      <opt.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/258849071180?text=${encodeURIComponent('Olá! Quero importar produtos. Podem ajudar com sourcing e logística?')}`}
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

export default ImportacaoPortal;
