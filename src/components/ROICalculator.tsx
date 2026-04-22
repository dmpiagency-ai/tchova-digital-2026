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
  const [investment, setInvestment] = useState('');
  const [expectedRevenue, setExpectedRevenue] = useState('');
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
    <div ref={containerRef} className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-xl">
            <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-emerald-600 via-primary to-emerald-700 bg-clip-text text-transparent uppercase tracking-tighter">Calculadora ROI Elite</h1>
        </div>
        <p className="text-slate-600 dark:text-white/60 text-sm sm:text-lg font-bold uppercase tracking-widest opacity-80 px-4">
          Mensure a eficiência do seu capital com precisão técnica
        </p>
      </div>

      <Card className="border-primary/20 bg-white dark:bg-white/5 backdrop-blur-xl shadow-2xl shadow-primary/5 rounded-[40px] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-3 text-2xl font-black text-slate-900 dark:text-white">
            <div className="p-2 bg-primary/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <span>Parâmetros de Investimento</span>
          </CardTitle>
          <CardDescription className="text-base">Insira os valores para projeção instantânea de lucro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investment" className="text-sm font-black uppercase text-primary/80 ml-1">Investimento (MZN)</Label>
              <Input
                id="investment"
                type="number"
                placeholder="Ex: 50000"
                value={investment}
                onChange={(e) => setInvestment(e.target.value)}
                className="h-14 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xl font-black rounded-2xl focus:ring-primary/40 focus:border-primary transition-all pr-4"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revenue" className="text-sm font-black uppercase text-primary/80 ml-1">Receita Esperada (MZN)</Label>
              <Input
                id="revenue"
                type="number"
                placeholder="Ex: 150000"
                value={expectedRevenue}
                onChange={(e) => setExpectedRevenue(e.target.value)}
                className="h-14 bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white text-xl font-black rounded-2xl focus:ring-primary/40 focus:border-primary transition-all pr-4"
              />
            </div>
          </div>
          <div className="pt-2">
            <div className="w-full h-1 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-700 ease-out" 
                style={{ width: investment && expectedRevenue ? '100%' : '0%' }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div ref={resultsRef} style={{ opacity: results ? 1 : 0 }}>
        {results && (
          <Card className="border-primary/40 bg-primary/5 backdrop-blur-2xl rounded-[40px] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full -mr-10 -mt-10" />
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-2xl font-black text-slate-900 dark:text-white">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <span>Análise de Desempenho Digital</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-5 bg-primary/10 rounded-2xl border border-primary/20">
                  <div ref={roiValueRef} className="text-3xl sm:text-4xl font-black text-primary mb-1">0%</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-white/40 tracking-widest">Retorno (ROI)</div>
                </div>
                <div className="text-center p-5 bg-green-500/10 rounded-2xl border border-green-500/20">
                  <div ref={profitValueRef} className="text-2xl sm:text-3xl font-black text-green-500 dark:text-green-400 mb-1">0 MZN</div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-white/40 tracking-widest">Lucro Líquido</div>
                </div>
                <div className="text-center p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col items-center justify-center">
                  <Badge className={`${getStatusColor(results.status)} text-white mb-2 px-3 py-1 font-bold text-xs`}>
                    {getStatusText(results.status)}
                  </Badge>
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-white/40 tracking-widest">Status</div>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-5 border border-slate-200 dark:border-white/10">
                <h4 className="font-bold text-sm mb-2 text-slate-800 dark:text-white/80">Parecer Técnico:</h4>
                <div className="text-sm font-medium">
                  {results.roi >= 300 && <p className="text-green-600 dark:text-green-400">🚀 Performance de Elite. Sua campanha está a gerar um retorno massivo sobre o capital.</p>}
                  {results.roi >= 150 && results.roi < 300 && <p className="text-blue-600 dark:text-blue-400">📈 Retorno sólido. Existe margem para escalabilidade vertical.</p>}
                  {results.roi >= 50 && results.roi < 150 && <p className="text-yellow-600 dark:text-yellow-400">⚖️ Rendimento regular. Recomendamos optimização tática para mitigar fugas de capital.</p>}
                  {results.roi < 50 && <p className="text-red-600 dark:text-red-400">⚠️ Alerta de Ineficiência. A estratégia actual carece de revisão profunda para evitar perdas.</p>}
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 text-sm font-black uppercase tracking-widest border-primary/30 text-primary hover:bg-primary hover:text-white"
                onClick={() => window.open('https://wa.me/258879097249?text=Ol%C3%A1%2C+fiz+um+c%C3%A1lculo+de+ROI+e+gostaria+de+conversar+sobre+minha+campanha', '_blank')}
              >
                Consultar Estratégia Alpha
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="text-center pt-2">
        <Button variant="ghost" onClick={onClose} className="text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white text-xs font-bold uppercase tracking-widest">
          Fechar Simulação
        </Button>
      </div>
    </div>
  );
};