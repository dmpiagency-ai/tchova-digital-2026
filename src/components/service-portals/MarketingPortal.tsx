// ============================================
// MARKETING PORTAL - TCHOVA DIGITAL
// Painel de Marketing Digital & Tráfego Pago
// ============================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { AnimatedLogo } from '@/components/AnimatedLogo';
import {
  BarChart3, TrendingUp, Users, Activity, DollarSign,
  Instagram, Megaphone, Target, Eye, ChevronRight, Home,
  Sparkles, MessageCircle, PieChart, ArrowUpRight,
  LayoutDashboard, Layers, Zap
} from 'lucide-react';
import { MobileTopNav } from './MobileTopNav';
import { env } from '@/config/env';

const MarketingPortal = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'dashboard' | 'campaigns' | 'request'>('dashboard');
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const modules = containerRef.current?.querySelectorAll('.mkt-module');
    if (modules) {
      gsap.fromTo(modules,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, { scope: containerRef, dependencies: [activeView] });

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Visão Geral' },
    { id: 'campaigns', icon: Megaphone, label: 'Campanhas', description: 'Resultados' },
    { id: 'request', icon: Target, label: 'Solicitar', description: 'Novo Projeto' },
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

        {/* DASHBOARD VIEW */}
        {activeView === 'dashboard' && (
          <div className="p-4 lg:p-6 lg:max-w-6xl mx-auto w-full flex flex-col gap-3 h-full">
            {/* Welcome Banner + ROI */}
            <div className="mkt-module relative overflow-hidden rounded-2xl p-5 sm:p-6 bg-primary text-white shadow-xl flex-none">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 flex justify-between items-center gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none mb-1">CENTRO DE<br className="sm:hidden" /> PERFORMANCE</h2>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-white/60">Métricas que geram lucro real</p>
                </div>
                <div className="bg-white/10 backdrop-blur-3xl border border-white/10 p-3 sm:p-4 rounded-xl flex-shrink-0">
                  <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-white/50 mb-0.5">ROI MÉDIO</p>
                  <p className="text-2xl sm:text-3xl font-black tracking-tighter">340% <span className="text-sm opacity-40">⬆</span></p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3 flex-none">
              {[
                { label: 'Impressões', value: '2.4M', icon: Eye, trend: '+18%' },
                { label: 'Leads', value: '12.8K', icon: Users, trend: '+34%' },
                { label: 'Conversão', value: '8.2%', icon: TrendingUp, trend: '+2.1%' },
                { label: 'Investido', value: '45K', icon: DollarSign, trend: '-12% CPA' },
              ].map((stat, i) => (
                <div key={i} className="mkt-module p-3 sm:p-4 rounded-xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</span>
                    <stat.icon className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                  <div className="text-lg sm:text-xl font-black tracking-tighter">{stat.value}</div>
                  <div className="text-[9px] font-bold text-primary">{stat.trend}</div>
                </div>
              ))}
            </div>

            {/* Chart + AI Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 min-h-0">
              <div className="mkt-module p-4 sm:p-5 rounded-2xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-lg md:col-span-2 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black uppercase tracking-tighter">Performance</h3>
                    <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400 mt-0.5">Últimos 30 dias</p>
                  </div>
                  <BarChart3 className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="flex-1 flex items-end gap-1 sm:gap-2 relative min-h-[80px]">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    {[...Array(4)].map((_, i) => (<div key={i} className="w-full h-px dark:bg-white/5 bg-slate-100" />))}
                  </div>
                  {[35, 55, 40, 70, 50, 85, 65, 95, 75, 60, 80, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col justify-end group">
                      <div className="w-full bg-gradient-to-t from-primary/30 to-primary rounded-t-sm transition-all duration-500 group-hover:brightness-125 cursor-pointer" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights */}
              <div className="mkt-module p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-brand-yellow/10 to-transparent border border-brand-yellow/20 shadow-lg relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/20 blur-3xl rounded-full" />
                <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-brand-yellow" />
                    <h3 className="font-black text-[10px] sm:text-xs uppercase tracking-widest text-brand-yellow">IA Insights</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs leading-relaxed dark:text-white/80 text-slate-700 flex-1 content-center">
                    Campanhas com vídeo curto (&lt;15s) no Instagram geram 3.2x mais conversões. 
                    Recomendamos realocar 30% do budget para Reels e Stories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAMPAIGNS VIEW */}
        {activeView === 'campaigns' && (
          <div className="p-4 lg:p-6 lg:max-w-6xl mx-auto flex flex-col gap-3 h-full">
            <div className="mkt-module flex-none">
              <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter leading-none mb-1">CAMPANHAS <span className="text-primary tracking-normal">ATIVAS</span></h2>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400">Resultados em tempo real</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 flex-1 content-start">
              {[
                { name: 'Black Friday Antecipada', platform: 'Meta Ads', reach: '845K', conversion: '6.2%', spend: '12,500 MZN', status: 'active' },
                { name: 'Lançamento E-commerce', platform: 'Google Ads', reach: '320K', conversion: '4.8%', spend: '8,000 MZN', status: 'active' },
                { name: 'Brand Awareness Q4', platform: 'Instagram', reach: '1.2M', conversion: '2.1%', spend: '15,000 MZN', status: 'active' },
                { name: 'Retargeting Carrinho', platform: 'Meta Ads', reach: '125K', conversion: '12.4%', spend: '5,500 MZN', status: 'paused' },
              ].map((campaign, i) => (
                <div key={i} className="mkt-module p-3 sm:p-4 rounded-2xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-lg flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${campaign.status === 'active' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}>
                    <Megaphone className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-black uppercase tracking-tight truncate">{campaign.name}</h4>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">{campaign.platform} • {campaign.reach}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Conv.</p>
                      <p className="text-sm font-black text-primary">{campaign.conversion}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Invest.</p>
                      <p className="text-sm font-black">{campaign.spend}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-[7px] font-black uppercase tracking-widest ${campaign.status === 'active' ? 'bg-primary text-white shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'dark:bg-zinc-800 bg-slate-100 text-zinc-400'}`}>
                      {campaign.status === 'active' ? '●' : '⏸'}
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
            <div className="mkt-module text-center space-y-1">
              <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">ACELERAR <span className="text-primary tracking-normal">VENDAS</span></h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Orçamento em 30 minutos</p>
            </div>

            <div className="mkt-module p-6 rounded-3xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-xl space-y-6">
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">O que precisa?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Gestão de Anúncios', icon: Megaphone },
                    { label: 'Redes Sociais', icon: Instagram },
                    { label: 'Estratégia Funil', icon: Target },
                    { label: 'Análise & ROI', icon: BarChart3 },
                  ].map((opt, i) => (
                    <button key={i} className="p-4 rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-100 text-left hover:border-primary/30 hover:bg-primary/5 transition-all group">
                      <opt.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Quero acelerar as vendas com Marketing Digital / Tráfego Pago. Podem ajudar?')}`}
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

export default MarketingPortal;
