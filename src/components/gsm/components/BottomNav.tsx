import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsapConfig';
import { menuItems } from '../data/mockTools';

interface BottomNavProps {
  activeView: string;
  setActiveView: (view: string) => void;
  darkMode: boolean;
}

export const BottomNav = ({ activeView, setActiveView, darkMode }: BottomNavProps) => {
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
                  className="flex flex-row items-center justify-center h-10 sm:h-12 rounded-2xl px-3 sm:px-4"
                >
                  <Icon 
                    className={`nav-icon w-[18px] h-[18px] sm:w-5 sm:h-5 shrink-0 transition-colors duration-300 ${
                      isActive ? 'text-white drop-shadow-lg' : 'text-zinc-500'
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
