// ============================================
// DESIGN PORTAL - TCHOVA DIGITAL
// Painel de Design Gráfico & Identidade Visual
// ============================================

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { AnimatedLogo } from '@/components/AnimatedLogo';
import {
  Palette, FileImage, Instagram, Droplets, Grid3X3,
  ChevronRight, Home, MessageCircle, Star, PenTool,
  Sparkles, Layers, Eye, Heart, Megaphone
} from 'lucide-react';
import { MobileTopNav } from './MobileTopNav';
import { env } from '@/config/env';

// Portfolio item type
interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  icon: any;
}

const portfolioItems: PortfolioItem[] = [
  { id: '1', title: 'Identidade Visual Completa', category: 'Branding', image: '/thumbnails/design-portal/item1.png', icon: Palette },
  { id: '2', title: 'Feed Instagram Premium', category: 'Social Media', image: '/thumbnails/design-portal/item2.png', icon: Instagram },
  { id: '3', title: 'Cartão de Visita Elite', category: 'Print', image: '/thumbnails/design-portal/item3.png', icon: FileImage },
  { id: '4', title: 'Banner Publicitário', category: 'Ads', image: '/thumbnails/design-portal/item4.png', icon: Megaphone },
  { id: '5', title: 'Logo & Manual da Marca', category: 'Branding', image: '/thumbnails/design-portal/item5.png', icon: PenTool },
  { id: '6', title: 'Embalagem de Produto', category: 'Packaging', image: '/thumbnails/design-portal/item6.png', icon: Layers },
];

const categories = ['Todos', 'Branding', 'Social Media', 'Print', 'Ads', 'Packaging'];

// Brand Color Palette Component
const BrandPalette = () => (
  <div className="space-y-4">
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Paleta da Marca</p>
    <div className="flex gap-3">
      {[
        { color: 'bg-primary', label: '#22C55E' },
        { color: 'bg-black', label: '#0A0A0B' },
        { color: 'bg-brand-yellow', label: '#FACC15' },
        { color: 'bg-white', label: '#FFFFFF' },
      ].map((c, i) => (
        <div key={i} className="group cursor-pointer">
          <div className={`w-12 h-12 rounded-2xl ${c.color} border border-white/10 shadow-lg group-hover:scale-110 transition-transform`} />
          <p className="text-[8px] font-mono text-zinc-500 mt-2 text-center">{c.label}</p>
        </div>
      ))}
    </div>
  </div>
);

// Typography Specimen
const TypographySpec = () => (
  <div className="space-y-4">
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Tipografia</p>
    <div className="space-y-2">
      <p className="text-4xl font-black tracking-tighter">Aa Bb Cc</p>
      <p className="text-sm font-bold text-zinc-500">Inter / Black 900</p>
      <p className="text-xs text-zinc-600">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
      <p className="text-xs text-zinc-600">abcdefghijklmnopqrstuvwxyz</p>
      <p className="text-xs text-zinc-600">0123456789 @#$%</p>
    </div>
  </div>
);

const DesignPortal = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [activeView, setActiveView] = useState<'portfolio' | 'brand' | 'request'>('portfolio');
  const containerRef = useRef<HTMLDivElement>(null);
  const [darkMode] = useState(true);

  const filteredItems = activeCategory === 'Todos' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  useGSAP(() => {
    const cards = containerRef.current?.querySelectorAll('.design-card');
    if (cards) {
      gsap.fromTo(cards,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.08, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, { scope: containerRef, dependencies: [activeCategory, activeView] });

  const sidebarItems = [
    { id: 'portfolio', icon: Grid3X3, label: 'Portfolio', description: 'Trabalhos' },
    { id: 'brand', icon: Droplets, label: 'Brand Kit', description: 'Identidade' },
    { id: 'request', icon: PenTool, label: 'Solicitar', description: 'Novo Projeto' },
  ];

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r dark:border-white/5 border-slate-100 dark:bg-zinc-950/80 bg-white backdrop-blur-xl">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b dark:border-white/5 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <AnimatedLogo className="h-8 w-auto" />
            </div>
          </div>
        </div>

        {/* Nav */}
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

        {/* Back Button */}
        <div className="p-4 border-t dark:border-white/5 border-slate-100">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl dark:bg-zinc-900/50 bg-slate-50 border dark:border-white/5 border-slate-100 dark:text-zinc-400 text-slate-500 dark:hover:text-white hover:text-slate-900 transition-all"
          >
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
            <button onClick={() => navigate('/')} className="p-2 rounded-lg dark:bg-white/5 bg-slate-100">
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Nav Tabs */}
          <MobileTopNav items={sidebarItems} activeView={activeView} setActiveView={setActiveView} />
        </div>

        {/* Scrollable Workspace */}
        <div ref={containerRef} className="flex-1 overflow-y-auto no-scrollbar pb-24 lg:pb-0">
          
          {/* PORTFOLIO VIEW */}
          {activeView === 'portfolio' && (
            <div className="p-4 lg:p-6 lg:max-w-6xl mx-auto w-full flex flex-col gap-3 h-full">
              {/* Header & Filter Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 flex-none">
                <div className="design-card">
                  <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter leading-none mb-1">PORTFÓLIO <span className="text-primary tracking-normal">CRIATIVO</span></h2>
                  <p className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-zinc-400">Design de alto impacto que vende</p>
                </div>

                {/* Category Filter */}
                <div className="design-card flex gap-2 overflow-x-auto no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 active:scale-95 border ${
                        activeCategory === cat 
                          ? 'bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-md' 
                          : 'dark:bg-white/5 bg-slate-100 dark:border-white/5 border-slate-200 dark:text-zinc-400 text-slate-500 hover:bg-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 flex-1 content-start min-h-0">
              {filteredItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="design-card group rounded-2xl overflow-hidden dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col">
                    <div className="h-24 sm:h-28 lg:h-32 relative flex items-center justify-center bg-zinc-900 overflow-hidden flex-none">
                      {/* Background Image */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/70 transition-colors duration-500" />
                      
                      {/* Antigravity Glass Icon Container */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/20 transition-all duration-500 group-hover:scale-110 shadow-2xl">
                        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white/70 group-hover:text-primary transition-all duration-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                      </div>

                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[7px] sm:text-[8px] font-black text-white uppercase tracking-widest z-10">
                        {item.category}
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20 pointer-events-none">
                        <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-full pointer-events-auto"><Eye className="w-4 h-4 text-white" /></div>
                        <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-full pointer-events-auto"><Heart className="w-4 h-4 text-white" /></div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col justify-between flex-1">
                      <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight mb-1 line-clamp-1">{item.title}</h3>
                      <div className="flex items-center gap-1.5 mt-auto">
                        <Star className="w-3 h-3 text-brand-yellow fill-current" />
                        <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 uppercase">Premium Quality</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BRAND KIT VIEW */}
        {activeView === 'brand' && (
          <div className="p-4 lg:p-6 lg:max-w-5xl mx-auto space-y-4">
            <div className="design-card">
              <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter leading-none mb-1">BRAND <span className="text-primary tracking-normal">KIT</span></h2>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">O que entregamos na identidade visual</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Logo Construction */}
              <div className="design-card p-5 sm:p-6 rounded-3xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-xl">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">Construção do Logótipo</p>
                <div className="h-32 sm:h-40 rounded-2xl dark:bg-zinc-950 bg-slate-50 border dark:border-white/5 border-slate-100 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '15px 15px' }} />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-12 h-12 border-2 border-primary rounded-xl flex items-center justify-center">
                      <Palette className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-black tracking-tighter leading-none">TCHOVA</p>
                      <p className="text-[10px] font-bold text-primary">Digital</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colors & Type */}
              <div className="space-y-4">
                <div className="design-card p-5 rounded-3xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-xl">
                  <BrandPalette />
                </div>
                <div className="design-card p-5 rounded-3xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-xl">
                  <TypographySpec />
                </div>
              </div>
            </div>

            {/* Deliverables List */}
            <div className="design-card p-5 sm:p-6 rounded-3xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-xl">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-4">O que inclui</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  'Logótipo Principal',
                  'Paleta de Cores',
                  'Tipografia',
                  'Elementos Gráficos',
                  'Manual de Marca',
                  'Ficheiros AI/PSD',
                  'Mockups',
                  'Posts Instagram',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-3 rounded-xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-100">
                    <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold leading-tight">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REQUEST VIEW */}
        {activeView === 'request' && (
          <div className="p-4 lg:p-6 max-w-2xl mx-auto space-y-6 flex flex-col h-full justify-center">
            <div className="design-card text-center space-y-1">
              <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none">SOLICITAR <span className="text-primary tracking-normal">PROJETO</span></h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Orçamento em 30 minutos</p>
            </div>

            <div className="design-card p-6 rounded-3xl dark:bg-zinc-900/50 bg-white border dark:border-white/5 border-slate-100 shadow-xl space-y-6">
              {/* Quick Options */}
              <div className="space-y-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">O que precisa?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Identidade Visual', icon: Palette },
                    { label: 'Posts Instagram', icon: Instagram },
                    { label: 'Material Impresso', icon: FileImage },
                    { label: 'Anúncios', icon: Megaphone },
                  ].map((opt, i) => (
                    <button key={i} className="p-4 rounded-2xl dark:bg-white/5 bg-slate-50 border dark:border-white/5 border-slate-100 text-left hover:border-primary/30 hover:bg-primary/5 transition-all group">
                      <opt.icon className="w-5 h-5 text-primary mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Quero solicitar um serviço de Design Gráfico / Identidade Visual. Podem ajudar?')}`}
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

export default DesignPortal;
