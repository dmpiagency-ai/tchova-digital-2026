// ============================================
// GSM TECH DASHBOARD - TCHOVA DIGITAL
// Painel Técnico Refatorado e Modularizado
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { gsap, useGSAP } from "@/lib/gsapConfig";
import { Sun, Moon, Menu, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// Modular components
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { ToolCard } from './components/ToolCard';

// Modular views
import { DashboardView } from './views/DashboardView';
import { ToolsView } from './views/ToolsView';
import { RentalsView } from './views/RentalsView';
import { IMEICheckView } from './views/IMEICheckView';
import { WalletView } from './views/WalletView';
import { ProfileView } from './views/ProfileView';

// Types & Mock Data
import { BoxTool, Rental, WalletData } from './types/gsm.types';
import { mockBoxTools } from './data/mockTools';

// Payments
import GSMPaymentModal from '@/components/GSMPaymentModal';

const GSMTechDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  // Theme management
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('gsm-theme') !== 'light';
    }
    return true; // Default to dark for elite dash
  });
  
  // URL-synchronized navigation
  const activeView = searchParams.get('view') || 'dashboard';
  const setActiveView = useCallback((view: string) => {
    setSearchParams({ view }, { replace: true });
  }, [setSearchParams]);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [tools, setTools] = useState<BoxTool[]>(mockBoxTools);
  const [rentals, setRentals] = useState<Rental[]>([
    { id: '1', toolName: 'Chimera Tool', toolId: '2', startTime: new Date(Date.now() - 3600000), status: 'active', price: 220, duration: 1 },
    { id: '2', toolName: 'UnlockTool', toolId: '1', startTime: new Date(Date.now() - 86400000), endTime: new Date(Date.now() - 82800000), status: 'completed', price: 100, duration: 2 },
  ]);
  const [wallet, setWallet] = useState<WalletData>({
    balance: 35000.00,
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

  // View Transition Animation
  useGSAP(() => {
    if (contentRef.current) {
      gsap.fromTo(contentRef.current,
        { opacity: 0, scale: 0.98, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out' }
      );
    }
  }, { scope: contentRef, dependencies: [activeView] });

  useEffect(() => {
    window.localStorage.setItem('gsm-theme', darkMode ? 'dark' : 'light');

    // Restore dark theme on header exit for global website
    return () => {
      document.documentElement.classList.add('dark');
    };
  }, [darkMode]);

  const handleRent = (tool: BoxTool) => {
    setToast({ 
      show: true, 
      message: `🔒 MODO DEMO PREVIEW: Aluguel da ferramenta ${tool.name} desativado. O serviço GSM está em desenvolvimento!`, 
      type: 'info' 
    });
  };

  const handleRefill = () => {
    setToast({
      show: true,
      message: '🔒 MODO DEMO PREVIEW: Carregamentos de saldo reais desativados temporariamente. Serviço GSM em desenvolvimento!',
      type: 'info'
    });
  };

  const handlePaymentSuccess = (amount: number, method: string) => {
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
    setToast({ show: true, message: `💰 Depósito de ${amount} MT efetuado com sucesso via ${method}!`, type: 'success' });
    setIsPaymentModalOpen(false);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard': 
        return <DashboardView tools={tools} darkMode={darkMode} rentals={rentals} wallet={wallet} setActiveView={setActiveView} />;
      case 'tools': 
        return <ToolsView tools={tools} onRent={handleRent} darkMode={darkMode} />;
      case 'rentals': 
        return <RentalsView rentals={rentals} darkMode={darkMode} />;
      case 'imei': 
        return <IMEICheckView darkMode={darkMode} />;
      case 'wallet': 
        return <WalletView wallet={wallet} darkMode={darkMode} onRefill={handleRefill} />;
      case 'profile': 
        return <ProfileView darkMode={darkMode} />;
      default: 
        return <DashboardView tools={tools} darkMode={darkMode} rentals={rentals} wallet={wallet} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className={`flex flex-col h-screen overflow-hidden ${darkMode ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Sticky Demo Banner - Premium & Lightweight */}
      <div className="w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-b border-amber-500/20 px-3 sm:px-4 py-2 sm:py-2.5 relative z-50 shrink-0 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
        <div className="flex items-center justify-center gap-2 sm:gap-3 max-w-7xl mx-auto">
          <div className="flex items-center justify-center shrink-0 relative">
            <span className="absolute w-2 h-2 rounded-full bg-amber-500 animate-ping opacity-60" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-x-1.5 sm:gap-x-2 gap-y-0.5 text-center leading-tight">
            <span className="text-[10px] sm:text-xs font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 tracking-widest uppercase drop-shadow-sm">
              MODO DEMO
            </span>
            <span className="hidden sm:inline-block text-zinc-600 text-[10px] sm:text-xs">—</span>
            <span className="text-[10px] sm:text-xs font-medium text-zinc-300">
              Serviço em desenvolvimento.
            </span>
            <span className="text-[9px] sm:text-[11px] font-normal text-zinc-500">
              Ações apenas p/ visualização.
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} darkMode={darkMode} />

        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Header */}
          <header className={`min-h-[70px] lg:min-h-[80px] flex items-center justify-between px-6 sm:px-8 lg:px-12 ${darkMode ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-white'} border-b z-40 shadow-sm relative pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-3 lg:pt-[max(0.75rem,env(safe-area-inset-top,0px))] lg:pb-4`}>
            <div className="flex items-center gap-4 lg:gap-6">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 bg-zinc-100 dark:bg-zinc-900 rounded-[1.2rem] transition-all transform active:scale-95 shadow-sm">
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden lg:flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary">{activeView}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold tracking-wider uppercase">DEMO PREVIEW</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">TchovaDigital v2.5.0 • Em Desenvolvimento</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className="p-3 bg-zinc-100 dark:bg-zinc-900 rounded-[1.2rem] transition-all transform active:scale-95 shadow-sm group">
                {darkMode ? <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform" /> : <Moon className="w-4 h-4 text-zinc-600 group-hover:-rotate-12 transition-transform" />}
              </button>
              <button onClick={() => navigate('/')} className="px-6 h-11 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transform transition-all active:scale-95 flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5" />
                Voltar
              </button>
            </div>
          </header>

        {/* Dynamic Viewport */}
        <main ref={contentRef} className="flex-1 overflow-auto no-scrollbar scroll-smooth">
          {renderContent()}
        </main>

        <BottomNav activeView={activeView} setActiveView={setActiveView} darkMode={darkMode} />
        </div>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      {isPaymentModalOpen && (
        <GSMPaymentModal 
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSuccess={handlePaymentSuccess}
          userId={user?.id || 'guest'}
          currentBalance={wallet.balance}
          currency="MTN"
        />
      )}
    </div>
  );
};

export default GSMTechDashboard;
