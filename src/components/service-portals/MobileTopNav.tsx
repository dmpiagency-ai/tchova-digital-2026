import { useRef } from 'react';
import { gsap, useGSAP } from "@/lib/gsapConfig";

interface NavItem {
  id: string;
  icon: any;
  label: string;
}

interface MobileTopNavProps {
  items: NavItem[];
  activeView: string;
  setActiveView: (view: any) => void;
}

export const MobileTopNav = ({ items, activeView, setActiveView }: MobileTopNavProps) => {
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
    items.forEach((item) => {
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
    <div className="mt-3 w-full">
      <div ref={containerRef} className="relative rounded-full dark:bg-zinc-900/80 bg-zinc-100 border dark:border-white/5 border-black/5 p-1 flex">
        {/* Active Indicator Backdrop */}
        <div 
          ref={indicatorRef}
          className="absolute top-1 bottom-1 bg-primary rounded-full shadow-md shadow-primary/20 pointer-events-none z-0"
        />
        
        <div className="flex items-center justify-between w-full relative z-10">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                data-id={item.id}
                onClick={() => setActiveView(item.id)}
                className="flex-1 flex flex-row items-center justify-center h-8 rounded-full px-2"
              >
                <Icon 
                  className={`nav-icon w-3.5 h-3.5 shrink-0 transition-colors duration-300 ${
                    isActive ? 'text-white drop-shadow-md' : 'dark:text-zinc-500 text-slate-500'
                  }`} 
                />
                <div className="nav-label overflow-hidden flex items-center" style={{ width: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0, marginLeft: isActive ? 6 : 0, paddingRight: isActive ? 4 : 0 }}>
                  <span className="text-[9px] font-black uppercase tracking-wider text-white whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
