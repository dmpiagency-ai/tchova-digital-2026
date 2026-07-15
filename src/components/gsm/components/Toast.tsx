import { useRef } from 'react';
import { CheckCircle, AlertCircle, Bell, X } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
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
        {type === 'success' && <CheckCircle className="nav-icon w-5 h-5" />}
        {type === 'error' && <AlertCircle className="nav-icon w-5 h-5" />}
        {type === 'info' && <Bell className="nav-icon w-5 h-5" />}
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
