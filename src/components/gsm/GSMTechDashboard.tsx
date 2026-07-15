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
    if (tool.status === 'available') {
      if (wallet.balance < tool.price) {
        setToast({ show: true, message: 'Saldo insuficiente. Recarregue a sua carteira.', type: 'error' });
        return;
      }
      setTools(prev => prev.map(t => t.id === tool.id ? { ...t, status: 'in_use' as const } : t));
      const newRental: Rental = { id: Date.now().toString(), toolName: tool.name, toolId: tool.id, startTime: new Date(), status: 'active', price: tool.price, duration: 1 };
      setRentals(prev => [newRental, ...prev]);
      setWallet(prev => ({ 
        ...prev, 
        balance: prev.balance - tool.price, 
        totalSpent: prev.totalSpent + tool.price,
        rentals: prev.rentals + 1 
      }));
      setToast({ show: true, message: `🚀 ALUGUEL INICIADO: ${tool.name}`, type: 'success' });
    }
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
        return <WalletView wallet={wallet} darkMode={darkMode} onRefill={() => setIsPaymentModalOpen(true)} />;
      case 'profile': 
        return <ProfileView darkMode={darkMode} />;
      default: 
        return <DashboardView tools={tools} darkMode={darkMode} rentals={rentals} wallet={wallet} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${darkMode ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
      <Sidebar activeView={activeView} setActiveView={setActiveView} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} darkMode={darkMode} />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className={`min-h-[80px] lg:min-h-[100px] flex items-center justify-between px-6 sm:px-8 lg:px-12 ${darkMode ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-white'} border-b z-40 shadow-sm relative pt-[max(0.5rem,env(safe-area-inset-top,0px))] pb-4 lg:pt-[max(1rem,env(safe-area-inset-top,0px))] lg:pb-6`}>
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
