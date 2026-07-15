import { useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsapConfig';
import { WalletData } from '../types/gsm.types';

interface WalletViewProps {
  wallet: WalletData;
  darkMode: boolean;
  onRefill: () => void;
}

export const WalletView = ({ wallet, darkMode, onRefill }: WalletViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const header = containerRef.current?.querySelector('.gs-wallet-header');
    const hero = containerRef.current?.querySelector('.gs-wallet-hero');
    const cards = containerRef.current?.querySelectorAll('.gs-wallet-card');
    
    const tl = gsap.timeline();
    
    if (header) tl.fromTo(header, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
    if (hero) tl.fromTo(hero, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, "-=0.2");
    if (cards && cards.length > 0) tl.fromTo(cards, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, "-=0.4");
    
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
              onClick={onRefill}
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
export default WalletView;
