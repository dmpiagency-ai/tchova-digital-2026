import { useRef } from 'react';
import { Key } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';
import { Rental } from '../types/gsm.types';

interface RentalsViewProps {
  rentals: Rental[];
  darkMode: boolean;
}

export const RentalsView = ({ rentals, darkMode }: RentalsViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = containerRef.current?.querySelectorAll('.gs-rental-item');
    if (items && items.length > 0) {
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
        {rentals.map((rental: Rental) => (
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
export default RentalsView;
