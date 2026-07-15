import { useRef } from 'react';
import { UserCheck, Smartphone, MapPin, ShieldCheck } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';

interface ProfileViewProps {
  darkMode: boolean;
}

export const ProfileView = ({ darkMode }: ProfileViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const items = containerRef.current?.querySelectorAll('.gs-profile-item');
    if (items && items.length > 0) {
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
          { icon: MapPin, label: 'LOCALIZAÇÃO', value: 'GLOBAL / REMOTO' },
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
export default ProfileView;
