import { useRef } from 'react';
import { ChevronRight, Fingerprint } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { menuItems } from '../data/mockTools';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  darkMode: boolean;
}

export const Sidebar = ({ activeView, setActiveView, isOpen, setIsOpen, darkMode }: SidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useGSAP(() => {
    if (sidebarRef.current) {
      const items = sidebarRef.current.querySelectorAll('.sidebar-item');
      gsap.fromTo(items, 
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: 'power3.out' }
      );
    }
  }, { scope: sidebarRef });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

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
        `}
      >
        {/* Logo Area */}
        <div className="h-28 flex items-center px-10">
          <div className="flex items-center gap-4">
            <div className="flex-1 w-full">
              <AnimatedLogo className="h-10 w-auto" />
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
            <button 
              onClick={handleLogout}
              className="w-full py-4 px-6 bg-zinc-900 dark:bg-zinc-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all"
            >
              Sair do Painel
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
