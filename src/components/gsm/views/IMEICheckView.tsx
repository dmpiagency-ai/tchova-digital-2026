import { useState, useRef } from 'react';
import { RefreshCw, Fingerprint } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';

interface IMEICheckViewProps {
  darkMode: boolean;
}

interface IMEICheckResult {
  imei: string;
  brand: string;
  model: string;
  status: string;
  carrier: string;
  date: string;
}

export const IMEICheckView = ({ darkMode }: IMEICheckViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imei, setImei] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IMEICheckResult | null>(null);
  const [error, setError] = useState('');

  useGSAP(() => {
    const elements = containerRef.current?.querySelectorAll('.gs-imei');
    if (elements && elements.length > 0) {
      gsap.fromTo(elements,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'back.out(1.2)' }
      );
    }
  }, { scope: containerRef });

  const isValidLuhn = (digits: string): boolean => {
    let sum = 0;
    for (let i = digits.length - 1; i >= 0; i--) {
      let d = parseInt(digits[i], 10);
      if ((digits.length - 1 - i) % 2 === 1) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
    }
    return sum % 10 === 0;
  };

  const handleCheck = async () => {
    if (!/^\d{15}$/.test(imei)) {
      setError('Por favor, insira um IMEI válido com 15 dígitos numéricos');
      return;
    }
    if (!isValidLuhn(imei)) {
      setError('IMEI inválido — falha na verificação de checksum');
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
export default IMEICheckView;
