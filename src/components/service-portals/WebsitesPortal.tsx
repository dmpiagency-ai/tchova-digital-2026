// ============================================
// WEBSITES PORTAL - TCHOVA DIGITAL
// Painel de Desenvolvimento Web
// ============================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { AnimatedLogo } from '@/components/AnimatedLogo';
import {
  Code2, Globe, Zap, Monitor, Smartphone, Layers,
  ChevronRight, Home, MessageCircle, Star,
  LayoutDashboard, ShoppingCart, Rocket, Search,
  Shield, Clock, CheckCircle2, ArrowUpRight
} from 'lucide-react';
import { MobileTopNav } from './MobileTopNav';

const WebsitesPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'showcase' | 'stack' | 'request'>('showcase');
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const modules = containerRef.current?.querySelectorAll('.web-module');
    if (modules) {
      gsap.fromTo(modules, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' });
    }
  }, { scope: containerRef, dependencies: [activeView] });

  const sidebarItems = [
    { id: 'showcase', icon: Monitor, label: 'Showcase', description: 'Projectos' },
    { id: 'stack', icon: Code2, label: 'Stack', description: 'Tecnologia' },
    { id: 'request', icon: Rocket, label: 'Solicitar', description: 'Novo Site' },
  ];

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r dark:border-white/5 border-slate-100 dark:bg-zinc-950/80 bg-white backdrop-blur-xl">
        <div className="h-20 flex items-center px-6 border-b dark:border-white/5 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <AnimatedLogo className="h-8 w-auto" showText={true} />
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
            <AnimatedLogo className="h-6 w-auto" showText={true} />
          </div>
            <button onClick={() => navigate('/')} className="p-2 rounded-lg dark:bg-white/5 bg-slate-100"><Home className="w-4 h-4" /></button>
          </div>
          <MobileTopNav items={sidebarItems} activeView={activeView} setActiveView={setActiveView} />
        </div>

        {/* Scrollable Workspace */}
        <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar pb-24 lg:pb-0">

        {/* SHOWCASE VIEW */}
        {activeView === 'showcase' && (
          <div className="p-4 lg:p-6 lg:max-w-6xl mx-auto w-full flex flex-col gap-3 h-full">
            {/* Hero + Stats Row */}
            <div className="flex flex-col lg:flex-row gap-3 flex-none">
              <div className="web-module relative overflow-hidden rounded-2xl p-5 sm:p-6 dark:bg-zinc-900 bg-primary text-white shadow-xl border dark:border-white/10 border-transparent flex-1 min-w-0">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none mb-1">SITES QUE<br />VENDEM <span className="text-white/40">24/7</span></h2>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60">Ecossistemas web de alta conversão</p>
                </div>
              </div>

              {/* Performance Scores - Inline */}
              <div className="grid grid-cols-4 lg:grid-cols-2 lg:grid-rows-2 gap-2 flex-none lg:w-[260px]">
                {[
                  { label: 'Performance', value: '100' },
                  { label: 'SEO', value: '100' },
                  { label: 'Acessibilidade', value: '98' },
                  { label: 'Best Practices', value: '100' },
                ].map((score, i) => (
                  <div key={i} className="web-module p-3 rounded-xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-md text-center flex flex-col items-center justify-center gap-1">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-primary flex items-center justify-center">
                      <span className="text-xs sm:text-sm font-black text-primary">{score.value}</span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400 leading-tight">{score.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Types - Horizontal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 content-start">
              {[
                { title: 'Landing Pages', desc: 'Alta conversão', icon: LayoutDashboard, features: ['Formulários Inteligentes', 'WhatsApp Integrado', 'SEO Optimizado'] },
                { title: 'E-Commerce', desc: 'Lojas online', icon: ShoppingCart, features: ['Catálogo de Produtos', 'Pagamento M-Pesa', 'Gestão de Stock'] },
                { title: 'Portais Pro', desc: 'Institucionais', icon: Globe, features: ['Multi-Idioma', 'Painel Admin', 'Analytics Avançado'] },
              ].map((project, i) => (
                <div key={i} className="web-module p-4 sm:p-5 rounded-2xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-lg hover:shadow-xl transition-all group flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all border border-transparent group-hover:border-primary/20 shadow-[0_0_15px_rgba(34,197,94,0)] group-hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                      <project.icon className="w-5 h-5 text-primary group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight">{project.title}</h3>
                      <p className="text-[10px] text-zinc-500 font-bold">{project.desc}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 mt-auto">
                    {project.features.map((f, fi) => (
                      <li key={fi} className="flex items-center gap-2 text-[11px] sm:text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="font-bold">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STACK VIEW */}
        {activeView === 'stack' && (
          <div className="p-4 lg:p-6 lg:max-w-5xl mx-auto space-y-4">
            <div className="web-module">
              <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter leading-none mb-1">STACK <span className="text-primary tracking-normal">TECNOLÓGICA</span></h2>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Ferramentas de alta performance</p>
            </div>

            <div className="space-y-3">
              {[
                { category: 'Frontend', tools: ['React 18', 'Next.js 15', 'TypeScript'], icon: Code2 },
                { category: 'Estilo', tools: ['Tailwind v4', 'GSAP', 'Glassmorphism'], icon: Layers },
                { category: 'Performance', tools: ['LCP < 2.5s', 'CDN Global'], icon: Zap },
                { category: 'Integrações', tools: ['WhatsApp API', 'M-Pesa'], icon: Globe },
              ].map((stack, i) => (
                <div key={i} className="web-module p-4 sm:p-5 rounded-2xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-lg flex items-center gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                    <stack.icon className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-black uppercase tracking-tight mb-2">{stack.category}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {stack.tools.map((tool, ti) => (
                        <span key={ti} className="px-2.5 py-1 dark:bg-zinc-800 bg-slate-100 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest dark:text-zinc-400 text-slate-600">{tool}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REQUEST VIEW */}
        {activeView === 'request' && (
          <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6 flex flex-col h-full justify-center">
            <div className="web-module text-center space-y-1">
              <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">CONSTRUIR <span className="text-primary tracking-normal">SITE</span></h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Orçamento em 30 minutos</p>
            </div>

            <div className="web-module p-6 rounded-3xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-xl space-y-6">
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">O que precisa?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Landing Page', icon: LayoutDashboard },
                    { label: 'Loja Online', icon: ShoppingCart },
                    { label: 'Institucional', icon: Globe },
                    { label: 'Web App', icon: Smartphone },
                  ].map((opt, i) => (
                    <button key={i} className="p-4 rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-100 text-left hover:border-primary/30 hover:bg-primary/5 transition-all group">
                      <opt.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/258849071180?text=${encodeURIComponent('Olá! Quero construir um site/loja online profissional. Podem ajudar?')}`}
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

export default WebsitesPortal;
