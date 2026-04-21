// ============================================
// GSM TECH DASHBOARD - TCHOVA DIGITAL
// Painel Técnico com design moderno iOS 26
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import logo from '@/assets/logo.svg';
import { 
  Smartphone, 
  CheckCircle, 
  Clock, 
  DollarSign,
  User,
  Calendar,
  Box,
  Wifi,
  Signal,
  Zap,
  Sun,
  Moon,
  Menu,
  ChevronRight,
  Home,
  ExternalLink,
  LayoutDashboard,
  Layers,
  RefreshCw,
  Settings,
  History,
  Key,
  ArrowRight,
  TrendingUp,
  Activity,
  ShieldCheck,
  Wallet,
  UserCheck,
  Hash,
  Star,
  HardDrive,
  Search,
  Palette,
  AlertTriangle,
  AlertCircle,
  X,
  MapPin,
  Plus,
  MessageCircle,
  HelpCircle,
  Bell,
  Fingerprint,
  QrCode
} from 'lucide-react';

// Box Tool Interface
interface BoxTool {
  id: string;
  name: string;
  nickname?: string;
  image: string;
  description: string;
  price: number;
  status: 'available' | 'in_use' | 'maintenance';
  category: 'chimera' | 'server' | 'remote' | 'check';
  features?: string[];
  models?: string;
  chips?: string;
  rating: number;
  rentals: number;
}

// Rental Interface
interface Rental {
  id: string;
  toolName: string;
  toolId: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'cancelled';
  price: number;
  duration: number;
}

// User Wallet Interface
interface WalletData {
  balance: number;
  totalSpent: number;
  rentals: number;
  bonusPoints: number;
}

// Transaction Interface
interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'rental' | 'bonus';
  amount: number;
  description: string;
  date: Date;
  status: 'completed' | 'pending' | 'failed';
}

// Ferramentas reais GSM (2025/2026)
const mockBoxTools: BoxTool[] = [
  { 
    id: '1', 
    name: 'UnlockTool', 
    nickname: 'Canivete Suíço',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750319/unlock_tool_2_uyqzof.png',
    description: 'Versatilidade total e rapidez - FRP, Mi Cloud, Apple, Bootloader',
    price: 50,
    status: 'available',
    category: 'chimera',
    features: ['FRP Bypass', 'Mi Cloud / Relock Fix', 'Apple Module', 'Bootloader Unlock'],
    models: 'Xiaomi, Samsung, Oppo, Vivo, Huawei, Vsmart',
    chips: 'MTK, Qualcomm, Unisoc',
    rating: 4.8,
    rentals: 245
  },
  { 
    id: '2', 
    name: 'Chimera Tool', 
    nickname: 'Especialista Samsung',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750320/chimera_tool_img_ti5l2p.png',
    description: 'Reparação avançada e funções de rede - IMEI, Certificate, Firmware',
    price: 100,
    status: 'available',
    category: 'chimera',
    features: ['Repair IMEI', 'Patch Certificate', 'Read Codes', 'Firmware Flash'],
    models: 'Samsung, Huawei, BlackBerry',
    chips: 'Exynos, Qualcomm, Kirin',
    rating: 4.9,
    rentals: 189
  },
  { 
    id: '3', 
    name: 'DFT Pro', 
    nickname: 'Solução Low-End',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750321/dft_pro_wxuuev.png',
    description: 'Excelente para modelos de entrada - Unisoc, Xiaomi Dual Sim',
    price: 30,
    status: 'available',
    category: 'server',
    features: ['Unisoc/SPD Support', 'Xiaomi Dual Sim Repair', 'Auth Bypass'],
    models: 'Xiaomi, Vivo, Oppo, Realme, Infinix',
    chips: 'Unisoc, MediaTek',
    rating: 4.5,
    rentals: 312
  },
  { 
    id: '4', 
    name: 'TFM Tool Pro', 
    nickname: 'Rainha do Servidor',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750323/tfm_swio6w.png',
    description: 'Estabilidade em processos com créditos - SLA/DA Auth',
    price: 15,
    status: 'in_use',
    category: 'server',
    features: ['SLA/DA Auth', 'Server FRP', 'Factory Reset'],
    models: 'Tecno, Infinix, Itel, Samsung',
    chips: 'MTK',
    rating: 4.7,
    rentals: 156
  },
  { 
    id: '5', 
    name: 'EFT Pro', 
    nickname: 'Mestra das Customizações',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750323/eft_pro_uegdv8.png',
    description: 'Focada em firmwares modificados e Root - Multi-Brand',
    price: 45,
    status: 'available',
    category: 'remote',
    features: ['Root Multi-Brand', 'Make Kernel', 'FTP Support'],
    models: 'Samsung, Huawei, Motorola',
    chips: 'Qualcomm',
    rating: 4.6,
    rentals: 98
  },
];

// Menu items for navigation
const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Visão Geral' },
  { id: 'tools', icon: Layers, label: 'Ferramentas', description: 'Alugar Tools' },
  { id: 'rentals', icon: Clock, label: 'Aluguéis', description: 'Histórico' },
  { id: 'imei', icon: QrCode, label: 'Verificar IMEI', description: 'Check IMEI' },
  { id: 'wallet', icon: Wallet, label: 'Saldo', description: 'Créditos GSM' },
  { id: 'profile', icon: UserCheck, label: 'Perfil', description: 'Minha Conta' },
];

// Mobile Bottom Navigation (iOS 26 Style)
const BottomNav = ({ activeView, setActiveView, darkMode }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const activeBtn = containerRef.current.querySelector(`[data-id="${activeView}"]`) as HTMLElement;
    
    // Animate Indicator
    if (activeBtn && indicatorRef.current) {
      gsap.to(indicatorRef.current, {
        x: activeBtn.offsetLeft,
        width: activeBtn.offsetWidth,
        duration: 0.6,
        ease: 'elastic.out(1, 0.85)'
      });
    }

    // Animate Tab Contents
    menuItems.forEach((item) => {
      const btn = containerRef.current?.querySelector(`[data-id="${item.id}"]`) as HTMLElement;
      if (!btn) return;
      
      const label = btn.querySelector('.nav-label');
      const icon = btn.querySelector('.nav-icon');
      const isActive = activeView === item.id;

      if (isActive) {
        gsap.to(btn, { opacity: 1, duration: 0.3 });
        if (icon) gsap.to(icon, { scale: 1.15, duration: 0.4, ease: 'back.out(1.5)' });
        if (label) gsap.to(label, { 
          width: 'auto', 
          opacity: 1, 
          marginLeft: 6,
          paddingRight: 4,
          duration: 0.5, 
          ease: 'power3.out' 
        });
      } else {
        gsap.to(btn, { opacity: 0.6, duration: 0.3 });
        if (icon) gsap.to(icon, { scale: 1, duration: 0.4, ease: 'power2.out' });
        if (label) gsap.to(label, { 
          width: 0, 
          opacity: 0, 
          marginLeft: 0,
          paddingRight: 0,
          duration: 0.4, 
          ease: 'power3.inOut' 
        });
      }
    });
  }, { scope: containerRef, dependencies: [activeView] });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden pb-[max(env(safe-area-inset-bottom),1rem)]">
      <div className="mx-2 sm:mx-3 mb-2 sm:mb-3">
        <div ref={containerRef} className={`
          relative rounded-[32px] sm:rounded-[36px] backdrop-blur-3xl shadow-3xl overflow-hidden px-1 sm:px-2
          ${darkMode 
            ? 'bg-zinc-900/90 border border-white/10' 
            : 'bg-white/90 border border-black/5'
          }
        `}>
          {/* Active Indicator Backdrop */}
          <div 
            ref={indicatorRef}
            className="absolute top-2 bottom-2 bg-primary rounded-[20px] shadow-lg shadow-primary/30 pointer-events-none z-0"
          />
          
          <div className="flex items-center justify-between px-1 py-2 relative z-10">
            {menuItems.slice(0, 5).map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  data-id={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`
                    flex flex-row items-center justify-center h-10 sm:h-12 rounded-2xl px-3 sm:px-4
                  `}
                >
                  <Icon 
                    className={`nav-icon w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0 transition-colors duration-300 ${
                      isActive ? 'text-white drop-shadow-lg' : darkMode ? 'text-zinc-500' : 'text-zinc-500'
                    }`} 
                  />
                  <div className="nav-label overflow-hidden flex items-center" style={{ width: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0, marginLeft: isActive ? 6 : 0, paddingRight: isActive ? 4 : 0 }}>
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-white whitespace-nowrap">
                      {item.label.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Desktop Sidebar
const Sidebar = ({ activeView, setActiveView, isOpen, setIsOpen, darkMode }: any) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (sidebarRef.current) {
      const items = sidebarRef.current.querySelectorAll('.sidebar-item');
      gsap.fromTo(items, 
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, { scope: sidebarRef });

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[100] lg:hidden transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      
      <aside 
        ref={sidebarRef}
        className={`
        fixed lg:static top-0 left-0 z-[101] h-full w-[320px] lg:w-[320px] flex-col
        ${darkMode ? 'bg-zinc-950 border-r border-white/5' : 'bg-white border-r border-slate-100'} 
        transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) shadow-3xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="h-28 flex items-center px-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <img src={logo} alt="Tchova" className="w-10 h-10 object-contain" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">TCHOVA <span className="text-primary tracking-normal font-medium">GSM</span></h1>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Tech Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-3 flex-1 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setIsOpen(false);
                }}
                className={`
                  sidebar-item w-full flex items-center gap-4 px-6 py-5 rounded-[2rem] transition-all duration-300 transform active:scale-95
                  ${isActive 
                    ? 'bg-primary text-white shadow-2xl shadow-primary/20' 
                    : `${darkMode ? 'text-zinc-500 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`
                  }
                `}
              >
                <div className={`p-2.5 rounded-xl ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <span className="font-black uppercase tracking-widest text-[11px] block">{item.label}</span>
                  <span className={`text-[10px] font-bold ${isActive ? 'text-white/60' : 'text-zinc-600'}`}>{item.description}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-6">
          <div className={`p-6 rounded-[2.5rem] border ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-slate-50 border-slate-100'} shadow-sm`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Fingerprint className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-tighter">Técnico Master</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Status: Online</p>
              </div>
            </div>
            <button className="w-full py-4 px-6 bg-zinc-900 dark:bg-zinc-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all">
              Sair do Painel
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

// Toast Notification
const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) => {
  const toastRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (toastRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onClose, 3000);
        }
      });

      tl.fromTo(toastRef.current,
        { y: 50, opacity: 0, scale: 0.8 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }
  }, { scope: toastRef });

  return (
    <div
      ref={toastRef}
      className={`
        fixed bottom-32 left-1/2 -translate-x-1/2 z-[1000] px-8 py-5 rounded-3xl shadow-3xl flex items-center gap-4 min-w-[320px] border backdrop-blur-2xl
        ${type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : type === 'error' ? 'bg-rose-500/90 border-rose-400 text-white' : 'bg-blue-500/90 border-blue-400 text-white'}
      `}
    >
      <div className="p-2 bg-white/20 rounded-xl">
        {type === 'success' && <CheckCircle className="w-5 h-5" />}
        {type === 'error' && <AlertCircle className="w-5 h-5" />}
        {type === 'info' && <Bell className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <p className="font-black uppercase tracking-widest text-[10px] opacity-70">{type}</p>
        <p className="font-bold text-sm tracking-tight">{message}</p>
      </div>
      <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Dashboard Module
const DashboardView = ({ tools, darkMode, rentals, wallet, setActiveView }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const modules = containerRef.current?.querySelectorAll('.gs-module');
    if (modules) {
      gsap.fromTo(modules,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
      );
    }
  }, { scope: containerRef });

  const stats = [
    { label: 'DISPONÍVEIS', value: tools.filter((t: any) => t.status === 'available').length, icon: Box, sub: 'Prontas p/ uso', pulse: true },
    { label: 'EM OPERAÇÃO', value: tools.filter((t: any) => t.status === 'in_use').length, icon: Activity, sub: 'Uso atual' },
    { label: 'TOTAL ALUGUÉIS', value: rentals.length, icon: History, sub: 'Histórico' },
  ];

  return (
    <div ref={containerRef} className="p-4 sm:p-8 lg:p-12 pb-32 lg:pb-12 space-y-6 sm:space-y-10">
      {/* Welcome Banner */}
      <div className={`gs-module relative overflow-hidden rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 lg:p-16 ${darkMode ? 'bg-zinc-900 border border-white/5' : 'bg-primary'} text-white shadow-3xl`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 sm:gap-10">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none">BEM-VINDO AO<br />GSM <span className="text-white/40">ELITE</span></h2>
            <p className="text-[10px] sm:text-sm font-black uppercase tracking-widest sm:tracking-[0.4em] text-white/60">Infraestrutura de alta performance</p>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="bg-white/10 backdrop-blur-3xl border border-white/10 p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] w-full sm:w-auto">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1 sm:mb-2">SALDO DISPONÍVEL</p>
              <p className="text-3xl sm:text-4xl font-black tracking-tighter">{wallet.balance.toFixed(0)} <span className="text-base sm:text-lg opacity-40">MT</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i}
            className={`gs-module p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'} border shadow-xl flex items-center gap-4 sm:gap-6`}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-black tracking-tighter">{stat.value}</span>
                {stat.pulse && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mb-2" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popular Tools */}
      <div className="space-y-8">
        <div className="gs-module flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter">FERRAMENTAS POPULARES</h3>
          <button onClick={() => setActiveView('tools')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:tracking-[0.2em] transition-all">Ver Todas</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {tools.slice(0, 3).map((tool: any, i: number) => (
            <div
              key={tool.id}
              className={`gs-module group rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'} border shadow-xl hover:shadow-2xl transition-all duration-500`}
            >
              <div className="h-48 overflow-hidden relative">
                <img src={tool.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 right-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                  {tool.price} MT/H
                </div>
              </div>
              <div className="p-8">
                <h4 className="text-xl font-black uppercase tracking-tighter mb-2">{tool.name}</h4>
                <p className="text-xs font-bold text-zinc-500 line-clamp-2">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tool Card
const ToolCard = ({ tool, onRent, darkMode }: any) => {
  return (
    <div className={`gs-tool-card group rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-8 ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'} border shadow-xl hover:shadow-3xl transition-all duration-500 opacity-0 transform translate-y-10`}>
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-10">
        <div className="w-full lg:w-48 h-40 sm:h-48 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl">
          <img src={tool.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        </div>
        <div className="flex-1 space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
            <div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter leading-none">{tool.name}</h3>
                {tool.nickname && <span className="px-2 sm:px-3 py-1 bg-primary/10 text-primary text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-full">{tool.nickname}</span>}
              </div>
              <p className="text-xs sm:text-sm font-bold text-zinc-500 max-w-xl">{tool.description}</p>
            </div>
            <div className={`self-start px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${tool.status === 'available' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {tool.status === 'available' ? 'Disponível' : 'Em Uso'}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tool.features?.map((f: string, i: number) => (
              <span key={i} className="px-3 py-1 sm:px-4 sm:py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400">{f}</span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-4 sm:pt-6 border-t border-zinc-100 dark:border-zinc-800 gap-4 sm:gap-0">
            <div className="flex items-center justify-between sm:justify-start gap-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Custo/Hora</p>
                <p className="text-xl sm:text-2xl font-black text-primary">{tool.price} <span className="text-xs sm:text-sm">MT</span></p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Avaliação</p>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-black text-sm">{tool.rating}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onRent(tool)}
              disabled={tool.status !== 'available'}
              className={`w-full sm:w-auto px-6 py-4 sm:px-10 sm:py-5 mt-2 sm:mt-0 rounded-[1.2rem] sm:rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all shadow-xl ${
                tool.status === 'available' 
                  ? 'bg-primary text-white hover:shadow-primary/30 hover:scale-[1.02] transform' 
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              }`}
            >
              {tool.status === 'available' ? 'Alugar Agora' : 'Indisponível'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Tools List View
const ToolsView = ({ tools, onRent, darkMode }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = containerRef.current?.querySelectorAll('.gs-tool-card');
    if (cards) {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power4.out'
      });
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="p-4 sm:p-8 lg:p-12 pb-32 sm:pb-32 lg:pb-12 space-y-6 sm:space-y-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter">CATÁLOGO <span className="text-primary tracking-normal">TOOLS</span></h2>
          <p className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-zinc-400 mt-1 sm:mt-2">Tecnologias de desbloqueio em tempo real</p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input type="text" placeholder="BUSCAR..." className="w-full lg:w-64 pl-12 pr-6 py-4 rounded-[1.2rem] sm:rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {tools.map((tool: any) => (
          <ToolCard key={tool.id} tool={tool} onRent={onRent} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
};

// Rentals View
const RentalsView = ({ rentals, darkMode }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = containerRef.current?.querySelectorAll('.gs-rental-item');
    if (items) {
      gsap.fromTo(items,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, stagger: 0.05, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="p-4 sm:p-8 lg:p-12 pb-32 sm:pb-32 lg:pb-12 space-y-6 sm:space-y-10">
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter">MEUS <span className="text-primary tracking-normal font-medium">ALUGUÉIS</span></h2>
        <p className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-zinc-400">Gerencie suas ferramentas em operação</p>
      </div>

      <div className="grid gap-4">
        {rentals.map((rental: any, i: number) => (
          <div key={rental.id} className="gs-rental-item p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white dark:bg-zinc-900 border border-slate-100 dark:border-white/5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between group gap-4 sm:gap-0">
            <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto">
              <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${rental.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-100 text-zinc-400'}`}>
                <Key className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg sm:text-xl font-black uppercase tracking-tighter mb-1">{rental.toolName}</h4>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-500">{new Date(rental.startTime).toLocaleDateString()} • {rental.duration}H</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-100 dark:border-zinc-800">
              <div className="text-left sm:text-right">
                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Custo Total</p>
                <p className="text-xl sm:text-2xl font-black text-primary">{rental.price} MT</p>
              </div>
              <div className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${rental.status === 'active' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'bg-zinc-100 text-zinc-400'}`}>
                {rental.status === 'active' ? '● Em Operação' : 'Concluído'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// IMEI View
const IMEICheckView = ({ darkMode }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imei, setImei] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useGSAP(() => {
    const elements = containerRef.current?.querySelectorAll('.gs-imei');
    if (elements) {
      gsap.fromTo(elements,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.2)' }
      );
    }
  }, { scope: containerRef });

  const handleCheck = async () => {
    if (imei.length !== 15) {
      setError('Por favor, insira um IMEI válido com 15 dígitos');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResult({
      imei: imei,
      brand: 'XIAOMI',
      model: 'REDMI NOTE 13 PRO',
      status: 'LIMPO',
      carrier: 'GLOBAL',
      date: '2025-04-17'
    });
    setLoading(false);
  };

  return (
    <div ref={containerRef} className="p-4 sm:p-8 lg:p-12 pb-32 sm:pb-32 lg:pb-12 space-y-6 sm:space-y-10 max-w-4xl mx-auto">
      <div className="gs-imei text-center space-y-2 sm:space-y-4">
        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black uppercase tracking-tighter">CHECK <span className="text-primary tracking-normal">IMEI</span></h2>
        <p className="text-[10px] sm:text-sm font-black uppercase sm:tracking-[0.3em] tracking-widest text-zinc-400">Verificação global de dispositivos</p>
      </div>

      <div className={`gs-imei p-6 sm:p-10 lg:p-16 rounded-[2rem] sm:rounded-[4rem] ${darkMode ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-100'} border shadow-3xl space-y-8 sm:space-y-10`}>
        <div className="space-y-4 text-center">
          <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-primary">Insira os 15 dígitos</label>
          <input
            type="text"
            value={imei}
            onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 15))}
            placeholder="000000 00 000000 0"
            className="w-full bg-zinc-100 dark:bg-zinc-950 border-none h-24 sm:h-32 rounded-[1.5rem] sm:rounded-[2.5rem] text-center text-2xl sm:text-4xl lg:text-6xl font-black tracking-tighter placeholder:opacity-10 focus:ring-4 focus:ring-primary/20 transition-all font-mono"
            maxLength={15}
          />
        </div>

        {error && (
          <div className="p-6 bg-rose-500/10 text-rose-500 rounded-3xl text-xs font-black uppercase tracking-widest text-center border border-rose-500/20">
            {error}
          </div>
        )}

        <button
          onClick={handleCheck}
          disabled={loading || imei.length !== 15}
          className="w-full h-16 sm:h-24 bg-primary text-white rounded-[1.2rem] sm:rounded-[2rem] text-[10px] sm:text-base font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-2xl shadow-primary/30 hover:shadow-primary/40 hover:scale-[1.02] transform transition-all active:scale-95 disabled:opacity-30 disabled:grayscale cursor-pointer flex items-center justify-center gap-3 sm:gap-4"
        >
          {loading ? <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" /> : <Fingerprint className="w-6 h-6 sm:w-8 sm:h-8" />}
          {loading ? 'PROCESSANDO...' : 'INICIAR SCAN'}
        </button>

        {result && (
          <div className="grid grid-cols-2 gap-4 pt-10 border-t border-zinc-100 dark:border-white/5">
            <div className="p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-950">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">MODELO</p>
              <p className="text-lg font-black tracking-tight">{result.brand} {result.model}</p>
            </div>
            <div className="p-6 rounded-3xl bg-emerald-500/10 text-emerald-500">
              <p className="text-[10px] font-black uppercase tracking-widest mb-1">STATUS</p>
              <p className="text-lg font-black tracking-tight tracking-widest">{result.status}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Wallet View
const WalletView = ({ wallet, darkMode, setShowToast }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const header = containerRef.current?.querySelector('.gs-wallet-header');
    const hero = containerRef.current?.querySelector('.gs-wallet-hero');
    const cards = containerRef.current?.querySelectorAll('.gs-wallet-card');
    
    const tl = gsap.timeline();
    
    if (header) tl.fromTo(header, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
    if (hero) tl.fromTo(hero, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, "-=0.2");
    if (cards) tl.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, "-=0.4");
    
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="p-4 sm:p-8 lg:p-12 pb-32 sm:pb-32 lg:pb-12 space-y-6 sm:space-y-10 max-w-4xl mx-auto">
      <div className="gs-wallet-header space-y-1 sm:space-y-2 text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter">MEU <span className="text-primary tracking-normal">SALDO</span></h2>
        <p className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-zinc-400">Gerenciamento de créditos GSM</p>
      </div>

      <div className="grid gap-6 sm:gap-10">
        <div className="gs-wallet-hero relative overflow-hidden rounded-[2rem] sm:rounded-[4rem] p-8 sm:p-16 bg-zinc-900 border border-white/10 text-white shadow-3xl text-center">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-6">
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-white/40">CRÉDITOS DISPONÍVEIS</p>
            <h3 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter">{wallet.balance.toFixed(0)} <span className="text-xl sm:text-3xl opacity-30">MT</span></h3>
            <button 
              onClick={() => setShowToast({ show: true, message: 'Suporte Tchova disponível no WhatsApp', type: 'info' })}
              className="px-8 py-4 sm:px-12 sm:py-6 w-full sm:w-auto bg-primary text-white rounded-2xl sm:rounded-3xl font-black uppercase tracking-widest text-[10px] sm:text-xs hover:scale-[1.02] transition-all shadow-2xl shadow-primary/20"
            >
              Recarregar Carteira
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: ' GASTOS', value: wallet.totalSpent, color: 'text-rose-500' },
            { label: 'ALUGUÉIS', value: wallet.rentals, color: 'text-blue-500' },
            { label: 'BÓNUS', value: wallet.bonusPoints, color: 'text-amber-500' },
          ].map((s, i) => (
            <div key={i} className={`gs-wallet-card p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] flex sm:flex-col items-center justify-between sm:justify-center ${darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'} border shadow-xl text-center`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-0 sm:mb-2">{s.label}</p>
              <p className={`text-xl sm:text-2xl font-black tracking-tighter ${s.color}`}>{s.value.toFixed(0)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Profile View
const ProfileView = ({ darkMode }: any) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = containerRef.current?.querySelectorAll('.gs-profile-item');
    if (items) {
      gsap.fromTo(items,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }
      );
    }
    
    const hero = containerRef.current?.querySelector('.gs-profile-hero');
    if (hero) {
      gsap.fromTo(hero,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.5)' }
      );
    }
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="p-4 sm:p-8 lg:p-12 pb-32 sm:pb-32 lg:pb-12 max-w-4xl mx-auto space-y-8 sm:space-y-10 text-center">
      <div className="gs-profile-hero relative inline-block mt-4 sm:mt-0">
        <div className="w-32 h-32 sm:w-40 sm:h-40 bg-primary rounded-[2rem] sm:rounded-[3rem] flex items-center justify-center shadow-3xl shadow-primary/30 relative z-10 mx-auto">
          <UserCheck className="w-16 h-16 sm:w-20 sm:h-20 text-white" />
        </div>
        <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 px-4 py-2 sm:px-6 sm:py-3 bg-amber-500 text-white rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 z-20">
          VIP GOLD
        </div>
      </div>

      <div className="gs-profile-hero space-y-1 sm:space-y-2">
        <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">TÉCNICO MASTER</h2>
        <p className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-primary break-all px-4">tecnico@tchovadigital.com</p>
      </div>

      <div className="grid gap-4">
        {[
          { icon: Smartphone, label: 'TELEFONE', value: '+258 84 123 4567' },
          { icon: MapPin, label: 'LOCALIZAÇÃO', value: 'MAPUTO, MOÇAMBIQUE' },
          { icon: ShieldCheck, label: 'SEGURANÇA', value: '2FA ATIVO' },
        ].map((item, i) => (
          <div key={i} className={`gs-profile-item p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 ${darkMode ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-100'} border shadow-xl group hover:border-primary/50 transition-all`}>
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-100 dark:bg-zinc-800 rounded-xl sm:rounded-2xl flex items-center justify-center text-zinc-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0">
                <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-zinc-400">{item.label}</p>
            </div>
            <p className="text-xs sm:text-sm font-black uppercase tracking-widest pl-14 sm:pl-0 text-left sm:text-right">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// MAIN DASHBOARD
const GSMTechDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('theme') === 'dark';
    }
    return true; // Default to dark for elite dash
  });
  
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tools, setTools] = useState<BoxTool[]>(mockBoxTools);
  const [rentals, setRentals] = useState<Rental[]>([
    { id: '1', toolName: 'Chimera Tool', toolId: '2', startTime: new Date(Date.now() - 3600000), status: 'active', price: 100, duration: 1 },
    { id: '2', toolName: 'UnlockTool', toolId: '1', startTime: new Date(Date.now() - 86400000), endTime: new Date(Date.now() - 82800000), status: 'completed', price: 50, duration: 2 },
  ]);
  const [wallet, setWallet] = useState<WalletData>({
    balance: 2500.00,
    totalSpent: 1500.00,
    rentals: 12,
    bonusPoints: 450
  });
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    show: false,
    message: '',
    type: 'info'
  });

  const contentRef = useRef<HTMLDivElement>(null);

  // View Transition Orchestrator
  useGSAP(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, scale: 0.98, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out' }
      );
    }
  }, { scope: contentRef, dependencies: [activeView] });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      window.localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      window.localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleRent = (tool: BoxTool) => {
    if (tool.status === 'available') {
      setTools(prev => prev.map(t => t.id === tool.id ? { ...t, status: 'in_use' as const } : t));
      const newRental: Rental = { id: Date.now().toString(), toolName: tool.name, toolId: tool.id, startTime: new Date(), status: 'active', price: tool.price, duration: 1 };
      setRentals(prev => [newRental, ...prev]);
      setWallet(prev => ({ ...prev, balance: prev.balance - tool.price, rentals: prev.rentals + 1 }));
      setToast({ show: true, message: `🚀 ALUGUEL INICIADO: ${tool.name}`, type: 'success' });
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView tools={tools} darkMode={darkMode} rentals={rentals} wallet={wallet} setActiveView={setActiveView} />;
      case 'tools': return <ToolsView tools={tools} onRent={handleRent} darkMode={darkMode} />;
      case 'rentals': return <RentalsView rentals={rentals} darkMode={darkMode} />;
      case 'imei': return <IMEICheckView darkMode={darkMode} />;
      case 'wallet': return <WalletView wallet={wallet} darkMode={darkMode} setShowToast={setToast} />;
      case 'profile': return <ProfileView darkMode={darkMode} />;
      default: return <DashboardView tools={tools} darkMode={darkMode} rentals={rentals} wallet={wallet} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} darkMode={darkMode} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className={`min-h-[80px] lg:min-h-[100px] flex items-center justify-between px-6 sm:px-8 lg:px-12 ${darkMode ? 'border-zinc-800 bg-zinc-950/95' : 'border-slate-200 bg-white/95'} border-b z-40 backdrop-blur-xl shadow-sm relative pt-[calc(env(safe-area-inset-top,0px)+1rem)] pb-4 lg:pt-[calc(env(safe-area-inset-top,0px)+1.5rem)] lg:pb-6`}>
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-4 bg-zinc-100 dark:bg-zinc-900 rounded-[1.5rem] transition-all transform active:scale-95 shadow-sm">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex flex-col">
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">{activeView}</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">TchovaDigital v2.5.0</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)} className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-[1.5rem] transition-all transform active:scale-95 shadow-sm group">
              {darkMode ? <Sun className="w-5 h-5 text-amber-500 group-hover:rotate-45 transition-transform" /> : <Moon className="w-5 h-5 text-zinc-600 group-hover:-rotate-12 transition-transform" />}
            </button>
            <button onClick={() => navigate('/')} className="px-8 h-14 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transform transition-all active:scale-95 flex items-center gap-3">
              <ExternalLink className="w-4 h-4" />
              Sair
            </button>
          </div>
        </header>

        {/* Dynamic Viewport */}
        <main ref={contentRef} className="flex-1 overflow-auto no-scrollbar scroll-smooth">
          {renderContent()}
        </main>

        <BottomNav activeView={activeView} setActiveView={setActiveView} darkMode={darkMode} />
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
    </div>
  );
};

export default GSMTechDashboard;
