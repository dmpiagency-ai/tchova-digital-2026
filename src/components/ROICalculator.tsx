import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, Target } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface ROICalculatorProps {
  onClose?: () => void;
}

export const ROICalculator: React.FC<ROICalculatorProps> = ({ onClose }) => {
  const [investment, setInvestment] = useState('50000');
  const [expectedRevenue, setExpectedRevenue] = useState('150000');
  const [results, setResults] = useState<{
    roi: number;
    profit: number;
    status: 'excellent' | 'good' | 'average' | 'poor';
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const roiValueRef = useRef<HTMLDivElement>(null);
  const profitValueRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: containerRef });

  // Cinematic entrance
  useGSAP(() => {
    gsap.from(containerRef.current, {
      y: 50,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
      }
    });
  }, { scope: containerRef });

  const animateNumbers = contextSafe((roi: number, profit: number) => {
    // Initial display reset or setup
    const roiObj = { val: 0 };
    const profitObj = { val: 0 };

    gsap.to(roiObj, {
      val: roi,
      duration: 2,
      ease: 'power4.out',
      onUpdate: () => {
        if (roiValueRef.current) {
          roiValueRef.current.innerText = roiObj.val.toFixed(1) + '%';
        }
      }
    });

    gsap.to(profitObj, {
      val: profit,
      duration: 2.5,
      ease: 'power4.out',
      onUpdate: () => {
        if (profitValueRef.current) {
          profitValueRef.current.innerText = Math.floor(profitObj.val).toLocaleString('pt-MZ') + ' MZN';
        }
      }
    });

    // Reveal results card
    gsap.fromTo(resultsRef.current, 
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.7)' }
    );
  });

  const calculateROI = () => {
    const invest = parseFloat(investment);
    const revenue = parseFloat(expectedRevenue);

    if (!invest || !revenue || invest <= 0) return;

    const profit = revenue - invest;
    const roi = (profit / invest) * 100;

    let status: 'excellent' | 'good' | 'average' | 'poor';
    if (roi >= 300) status = 'excellent';
    else if (roi >= 150) status = 'good';
    else if (roi >= 50) status = 'average';
    else status = 'poor';

    setResults({ roi, profit, status });
    
    // Trigger GSAP animation after state update (using a small delay to ensure DOM is ready)
    setTimeout(() => animateNumbers(roi, profit), 50);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-emerald-500 shadow-lg shadow-emerald-500/20';
      case 'good': return 'bg-blue-500 shadow-lg shadow-blue-500/20';
      case 'average': return 'bg-amber-500 shadow-lg shadow-amber-500/20';
      case 'poor': return 'bg-rose-500 shadow-lg shadow-rose-500/20';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Performance de Elite';
      case 'good': return 'Crescimento Sólido';
      case 'average': return 'Moderado / Atenção';
      case 'poor': return 'Alerta Crítico';
      default: return 'N/A';
    }
  };

  // Real-time calculation effect
  React.useEffect(() => {
    const invest = parseFloat(investment);
    const revenue = parseFloat(expectedRevenue);
    if (!isNaN(invest) && !isNaN(revenue) && invest > 0) {
      calculateROI();
    } else {
      setResults(null);
    }
  }, [investment, expectedRevenue]);

  return (
    <div ref={containerRef} className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
      {/* Immersive Header */}
      <div className="text-center space-y-1 mb-2">
        <div className="flex items-center justify-center space-x-2">
          <TrendingUp className="w-6 h-6 text-primary animate-pulse" />
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-600 via-primary to-emerald-700 bg-clip-text text-transparent uppercase tracking-tight">ROI Elite</h1>
        </div>
        <p className="text-slate-500 dark:text-white/50 text-xs sm:text-sm font-bold uppercase tracking-widest">
          Mensure a eficiência do capital
        </p>
      </div>

      <Card className="border-primary/20 bg-white/50 dark:bg-white/5 backdrop-blur-2xl shadow-2xl shadow-primary/5 rounded-[32px] overflow-hidden">
        <CardContent className="p-0 sm:p-0 flex flex-col md:flex-row">
          
          {/* Left Side: Control Panel (Sliders) */}
          <div className="flex-1 p-5 sm:p-8 space-y-6 md:border-r border-slate-200 dark:border-white/10">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Painel de Controlo</h3>
            
            {/* Investment Block */}
            <div className="p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden group hover:border-primary/30 transition-all">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-[10px] font-black uppercase text-primary tracking-widest">Investimento</Label>
                <div className="flex items-center bg-white dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 focus-within:border-primary/50 transition-all">
                  <input 
                    type="number"
                    value={investment}
                    onChange={(e) => setInvestment(e.target.value)}
                    className="w-24 bg-transparent border-none outline-none text-right appearance-none font-black text-slate-900 dark:text-white [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[10px] ml-1 text-slate-500 dark:text-white/50 font-bold">MZN</span>
                </div>
              </div>
              <input 
                type="range" min="5000" max="1000000" step="5000"
                value={investment || 0}
                onChange={(e) => setInvestment(e.target.value)}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Revenue Block */}
            <div className="p-4 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/10 relative overflow-hidden group hover:border-green-500/30 transition-all">
              <div className="flex justify-between items-center mb-4">
                <Label className="text-[10px] font-black uppercase text-green-600 dark:text-green-500 tracking-widest">Receita Esperada</Label>
                <div className="flex items-center bg-white dark:bg-white/5 px-2 py-1 rounded-lg border border-slate-200 dark:border-white/10 focus-within:border-green-500/50 transition-all">
                  <input 
                    type="number"
                    value={expectedRevenue}
                    onChange={(e) => setExpectedRevenue(e.target.value)}
                    className="w-24 bg-transparent border-none outline-none text-right appearance-none font-black text-slate-900 dark:text-white [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="text-[10px] ml-1 text-slate-500 dark:text-white/50 font-bold">MZN</span>
                </div>
              </div>
              <input 
                type="range" min="10000" max="5000000" step="10000"
                value={expectedRevenue || 0}
                onChange={(e) => setExpectedRevenue(e.target.value)}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
            </div>
          </div>

          {/* Right Side: Output Display (Results) */}
          <div className="flex-1 p-5 sm:p-8 bg-slate-50/50 dark:bg-black/20 flex flex-col justify-center">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-6">Diagnóstico em Tempo Real</h3>
            
            <div ref={resultsRef} className="transition-opacity duration-500 flex-1 flex flex-col justify-between" style={{ opacity: results ? 1 : 0 }}>
              {results ? (
                <div className="space-y-6">
                  {/* Big ROI Display */}
                  <div className="text-center p-6 bg-primary/10 rounded-3xl border border-primary/20 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
                    <div className="relative z-10">
                      <div ref={roiValueRef} className="text-5xl font-black text-primary mb-2 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">0%</div>
                      <div className="text-[10px] uppercase font-black text-primary/60 tracking-widest">Retorno (ROI)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/10 rounded-2xl border border-green-500/20 text-center">
                      <div ref={profitValueRef} className="text-xl font-black text-green-500 dark:text-green-400 mb-1">0 MZN</div>
                      <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-white/40 tracking-widest">Lucro Líquido</div>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center">
                      <Badge className={`${getStatusColor(results.status)} text-white mb-1 px-2 py-0.5 font-bold text-[10px]`}>
                        {getStatusText(results.status)}
                      </Badge>
                      <div className="text-[9px] uppercase font-bold text-slate-500 dark:text-white/40 tracking-widest">Status da Operação</div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                      onClick={() => window.open('https://wa.me/258879097249?text=Ol%C3%A1%2C+fiz+um+c%C3%A1lculo+de+ROI+e+gostaria+de+conversar+sobre+minha+campanha', '_blank')}
                    >
                      Consultar Especialista
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center opacity-50">
                  <p className="text-xs uppercase tracking-widest font-bold">A aguardar parâmetros...</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="ghost" onClick={onClose} className="text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white text-[10px] font-bold uppercase tracking-widest h-8">
          Fechar Simulação
        </Button>
      </div>
    </div>
  );
};