import React, { useRef } from 'react';
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  Activity, 
  Users, 
  DollarSign, 
  TrendingUp,
  Instagram,
  Palette,
  Sparkles,
  Terminal,
  Monitor,
  Video,
  Play,
  Settings,
  MousePointer2,
  Code2,
  Cpu,
  Zap
} from 'lucide-react';
import { gsap } from '@/lib/gsapConfig';
import { useGSAP } from '@/lib/gsapConfig';

interface ServiceProofMockupProps {
  type: 'marketing' | 'design' | 'websites' | 'audiovisual' | 'gsm' | string;
}

// ==========================================
// 1. MARKETING MOCKUP (Dashboard de Alta Performance)
// ==========================================
const MarketingMockup = () => {
  return (
    <div className="w-full h-full rounded-[2rem] bg-[#0A0A0B] border border-white/10 overflow-hidden flex flex-col font-sans text-white shadow-2xl relative group cursor-default">
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold tracking-tight">Tchova BoostIQ</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-white/50 bg-white/5 px-3 py-1.5 rounded-full">
            <Sparkles className="w-4 h-4 text-brand-yellow" />
            <span>AI Agent Active</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-brand-green" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Tráfego Total', value: '124.5K', icon: Users, trend: '+14.2%' },
            { label: 'Leads Gerados', value: '3,842', icon: Activity, trend: '+22.4%' },
            { label: 'Custo por Lead', value: '12.4 MZN', icon: DollarSign, trend: '-8.1%', isGood: true },
            { label: 'Conversão Real', value: '8.4%', icon: TrendingUp, trend: '+2.1%' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/50 font-medium">{stat.label}</span>
                <stat.icon className="w-4 h-4 text-white/30" />
              </div>
              <div className="text-2xl font-black mb-1">{stat.value}</div>
              <div className={`text-xs font-bold ${stat.isGood ? 'text-primary' : 'text-primary'}`}>
                {stat.trend} este mês
              </div>
            </div>
          ))}
        </div>

        {/* Charts Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          {/* Main Chart */}
          <div className="md:col-span-2 bg-white/5 border border-white/5 rounded-2xl p-5 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-sm text-white/70">Performance de Campanhas (ROI)</h3>
              <BarChart3 className="w-4 h-4 text-white/30" />
            </div>
            <div className="flex-1 flex items-end gap-2 md:gap-4 relative group-hover/chart:opacity-100">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-full h-px bg-white/5" />
                ))}
              </div>
              {/* Bars */}
              {[40, 65, 45, 80, 55, 90, 75, 100].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group/bar">
                  <div 
                    className="w-full bg-gradient-to-t from-primary/20 to-primary/80 rounded-t-sm transition-all duration-500 group-hover/bar:brightness-125"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights & Funnel */}
          <div className="flex flex-col gap-4">
            <div className="flex-1 bg-gradient-to-br from-brand-yellow/10 to-transparent border border-brand-yellow/20 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-yellow/20 blur-2xl rounded-full" />
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-brand-yellow" />
                <h3 className="font-bold text-sm text-brand-yellow">IA Insights</h3>
              </div>
              <p className="text-xs text-white/70 leading-relaxed">
                A campanha "Black Friday Antecipada" está com um ROAS 40% superior à média. Sugerimos escalar o orçamento no Meta Ads em 25%.
              </p>
              <button className="mt-4 text-xs font-bold bg-brand-yellow text-black px-4 py-2 rounded-lg w-full hover:bg-brand-yellow/90 transition-colors">
                Aplicar Escala Automática
              </button>
            </div>
            
            <div className="h-32 bg-white/5 border border-white/5 rounded-2xl p-5 flex items-center justify-center">
               <div className="w-24 h-24 relative rounded-full border-4 border-white/10 border-t-primary border-r-primary animate-[spin_10s_linear_infinite]">
                 <div className="absolute inset-2 rounded-full border-4 border-white/5 border-l-brand-green animate-[spin_5s_linear_infinite_reverse]" />
                 <div className="absolute inset-0 flex items-center justify-center font-black text-sm text-white">68%</div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Interactive cursor simulation */}
      <MousePointer2 className="absolute w-6 h-6 text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 animate-bounce" style={{ top: '60%', left: '70%' }} />
    </div>
  );
};

// ==========================================
// 2. DESIGN GRÁFICO MOCKUP (Brand Book & Feed)
// ==========================================
const DesignMockup = () => {
  return (
    <div className="w-full h-full rounded-[2rem] bg-[#0A0A0B] border border-white/10 overflow-hidden flex font-sans text-white shadow-2xl group">
      {/* Sidebar: Brand Guidelines */}
      <div className="w-1/3 border-r border-white/10 bg-white/[0.02] p-6 flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-sm">Identidade Visual</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-white/50 mb-2">Cores Primárias</p>
              <div className="flex gap-2">
                <div className="w-10 h-10 rounded-full bg-primary shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:scale-110 transition-transform cursor-pointer" />
                <div className="w-10 h-10 rounded-full bg-black border border-white/20 hover:scale-110 transition-transform cursor-pointer" />
                <div className="w-10 h-10 rounded-full bg-brand-yellow hover:scale-110 transition-transform cursor-pointer" />
              </div>
            </div>
            
            <div>
              <p className="text-xs text-white/50 mb-2">Tipografia</p>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="font-black text-2xl tracking-tighter">Aa</p>
                <p className="text-xs text-white/50 mt-1">Inter / Montserrat</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-white/50 mb-2">Grelha do Logótipo</p>
              <div className="h-20 bg-white/5 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center">
                {/* Simulated Grid */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                <div className="w-12 h-12 border-2 border-primary rotate-45 z-10 group-hover:rotate-90 transition-transform duration-1000" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Instagram Feed & Generative UI */}
      <div className="flex-1 p-6 flex flex-col gap-6 relative">
        <div className="flex justify-between items-center">
          <h3 className="font-bold flex items-center gap-2"><Instagram className="w-4 h-4" /> Prévia do Feed</h3>
          <span className="text-xs bg-white/10 px-2 py-1 rounded-md text-white/70">Grid de 9</span>
        </div>
        
        {/* Feed Grid */}
        <div className="grid grid-cols-3 gap-2 flex-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 rounded-xl border border-white/5 relative overflow-hidden group/post cursor-pointer">
              <div className={`absolute inset-0 bg-gradient-to-br ${
                i === 0 ? 'from-primary/40 to-black' :
                i === 1 ? 'from-brand-yellow/40 to-black' :
                i === 2 ? 'from-purple-500/40 to-black' :
                i === 3 ? 'from-blue-500/40 to-black' :
                i === 4 ? 'from-primary/20 to-brand-green/20' :
                'from-white/10 to-transparent'
              } transition-transform duration-700 group-hover/post:scale-110`} />
              
              {/* Mock content text */}
              <div className="absolute inset-x-2 bottom-2 h-4 bg-black/50 backdrop-blur-md rounded border border-white/10 hidden group-hover/post:block" />
            </div>
          ))}
        </div>

        {/* AI Generator Prompt */}
        <div className="h-14 bg-white/5 border border-white/10 rounded-full flex items-center px-4 gap-3 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-brand-yellow" />
          <Sparkles className="w-4 h-4 text-white/50" />
          <div className="text-sm text-white/50 flex-1 font-mono">
            /gerar post estilo "Dark Tech" para lançamento...
          </div>
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. WEBSITES MOCKUP (IDE & Browser Preview)
// ==========================================
const WebsitesMockup = () => {
  return (
    <div className="w-full h-full rounded-[2rem] bg-[#0A0A0B] border border-white/10 overflow-hidden flex font-sans text-white shadow-2xl relative">
      {/* IDE Section */}
      <div className="w-1/2 border-r border-white/10 bg-[#1E1E1E] flex flex-col">
        <div className="h-10 bg-[#2D2D2D] flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>
          <div className="ml-4 text-xs text-white/40 font-mono flex items-center gap-2">
            <Code2 className="w-3 h-3" /> App.tsx
          </div>
        </div>
        <div className="p-4 font-mono text-[10px] sm:text-xs leading-loose text-white/60 overflow-hidden relative group">
          <div className="text-[#569CD6]">import</div> {'{'} motion {'}'} <div className="text-[#569CD6]">from</div> <div className="text-[#CE9178]">'framer-motion'</div>;<br/>
          <div className="text-[#569CD6]">export default function</div> <div className="text-[#4EC9B0]">Hero</div>() {'{'}<br/>
          &nbsp;&nbsp;<div className="text-[#569CD6]">return</div> (<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;<div className="text-[#4EC9B0]">motion.div</div><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div className="text-[#9CDCFE]">initial</div>={'{'}{'{'} <div className="text-[#9CDCFE]">opacity</div>: <div className="text-[#B5CEA8]">0</div> {'}'}{'}'}<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div className="text-[#9CDCFE]">animate</div>={'{'}{'{'} <div className="text-[#9CDCFE]">opacity</div>: <div className="text-[#B5CEA8]">1</div> {'}'}{'}'}<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<div className="text-[#9CDCFE]">className</div>=<div className="text-[#CE9178]">"flex items-center"</div><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&gt;<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<div className="text-[#4EC9B0]">h1</div> <div className="text-[#9CDCFE]">className</div>=<div className="text-[#CE9178]">"text-7xl font-black text-primary"</div>&gt;<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tchova Digital<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<div className="text-[#4EC9B0]">h1</div>&gt;<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<div className="text-[#4EC9B0]">motion.div</div>&gt;<br/>
          &nbsp;&nbsp;);<br/>
          {'}'}
          
          {/* Typing cursor */}
          <div className="absolute w-2 h-4 bg-white/80 animate-pulse" style={{ top: '15.5rem', left: '2rem' }} />
        </div>
      </div>

      {/* Browser Preview Section */}
      <div className="w-1/2 flex flex-col bg-white/[0.02]">
        <div className="h-10 border-b border-white/10 flex items-center px-4 gap-3 bg-white/[0.02]">
          <Monitor className="w-4 h-4 text-white/50" />
          <div className="h-5 flex-1 bg-white/5 rounded-md border border-white/10 flex items-center px-2">
            <span className="text-[10px] text-white/30 font-mono">https://teu-site-de-elite.com</span>
          </div>
        </div>
        
        {/* Rendered Preview */}
        <div className="flex-1 p-6 relative flex flex-col items-center justify-center">
          {/* Lighthouse Score Floating Widget */}
          <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-xl border border-white/10 p-3 rounded-2xl flex gap-3 shadow-2xl">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary font-bold text-xs">100</div>
              <span className="text-[8px] text-white/50 mt-1 uppercase">Perf</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary font-bold text-xs">100</div>
              <span className="text-[8px] text-white/50 mt-1 uppercase">SEO</span>
            </div>
          </div>

          <h1 className="text-4xl font-black text-white text-center leading-tight mb-4">
            O Próximo Nível <br/><span className="text-primary">Da Tua Empresa</span>
          </h1>
          <div className="w-24 h-1 bg-primary rounded-full mb-6" />
          <div className="px-6 py-2 bg-white text-black font-bold rounded-full text-xs hover:scale-105 transition-transform cursor-pointer">
            Descobrir Mais
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. AUDIOVISUAL MOCKUP (Video Timeline)
// ==========================================
const AudiovisualMockup = () => {
  return (
    <div className="w-full h-full rounded-[2rem] bg-[#0F0F11] border border-white/10 overflow-hidden flex flex-col font-sans text-white shadow-2xl relative">
      {/* Top Half: Preview & Scopes */}
      <div className="flex-1 flex border-b border-white/10">
        {/* Video Preview */}
        <div className="w-2/3 bg-black flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-80 transition-opacity duration-1000 mix-blend-luminosity" />
          
          {/* Color Grading LUT simulation */}
          <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-orange-500/20 mix-blend-overlay" />
          
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 z-10 group-hover:scale-110 transition-transform cursor-pointer">
            <Play className="w-5 h-5 text-white ml-1" />
          </div>
        </div>
        
        {/* Scopes/Color Wheels */}
        <div className="w-1/3 bg-white/[0.02] p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Settings className="w-4 h-4 text-white/50" />
            <span className="text-xs font-bold text-white/50 uppercase">Color Wheels</span>
          </div>
          
          <div className="flex justify-center gap-2">
             <div className="w-16 h-16 rounded-full border-2 border-white/10 relative flex items-center justify-center">
               <div className="w-2 h-2 bg-brand-yellow rounded-full absolute" style={{ top: '30%', left: '60%' }} />
               <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,red,yellow,lime,aqua,blue,magenta,red)] opacity-10" />
             </div>
             <div className="w-16 h-16 rounded-full border-2 border-white/10 relative flex items-center justify-center">
               <div className="w-2 h-2 bg-blue-400 rounded-full absolute" style={{ top: '60%', left: '40%' }} />
               <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,red,yellow,lime,aqua,blue,magenta,red)] opacity-10" />
             </div>
          </div>
          
          {/* Audio Meters */}
          <div className="mt-auto flex gap-1 h-20">
            {[60, 80, 40, 90, 70, 50, 85, 30].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end bg-black/50 rounded-sm overflow-hidden">
                <div className={`w-full bg-gradient-to-t ${h > 80 ? 'from-green-500 via-yellow-500 to-red-500' : 'from-green-500 to-green-400'}`} style={{ height: `${h}%` }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Half: Timeline */}
      <div className="h-40 bg-[#1A1A1C] p-4 flex flex-col relative overflow-hidden">
        {/* Playhead */}
        <div className="absolute top-0 bottom-0 w-px bg-red-500 z-20 left-1/3 shadow-[0_0_10px_rgba(239,68,68,1)]">
          <div className="w-3 h-3 bg-red-500 rounded-sm -ml-[5px] flex items-center justify-center">
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
        </div>

        {/* Tracks */}
        <div className="flex-1 flex flex-col gap-1 mt-4">
          {/* Video Track 1 */}
          <div className="h-8 bg-black/30 rounded flex overflow-hidden border border-white/5 relative group">
            <div className="absolute left-4 w-32 h-full bg-blue-500/40 border border-blue-500/50 rounded-sm flex items-center px-2 group-hover:brightness-125 transition-all">
              <Video className="w-3 h-3 text-blue-200" />
            </div>
            <div className="absolute left-40 w-48 h-full bg-blue-500/40 border border-blue-500/50 rounded-sm flex items-center px-2 group-hover:brightness-125 transition-all">
              <span className="text-[10px] text-blue-200 truncate">B-Roll_A01.mp4</span>
            </div>
          </div>
          
          {/* Color/Adjustment Track */}
          <div className="h-6 bg-black/30 rounded flex overflow-hidden border border-white/5 relative">
            <div className="absolute left-4 w-64 h-full bg-purple-500/30 border border-purple-500/50 rounded-sm flex items-center px-2">
              <span className="text-[9px] text-purple-200">Color Grading Rec.709</span>
            </div>
          </div>
          
          {/* Audio Track */}
          <div className="h-8 bg-black/30 rounded flex overflow-hidden border border-white/5 relative mt-1">
            <div className="absolute left-4 w-full h-full bg-emerald-500/30 border border-emerald-500/50 rounded-sm flex items-center px-2">
               {/* Waveform simulation */}
               <div className="w-full h-4 flex items-center gap-px opacity-50">
                 {[...Array(40)].map((_, i) => (
                   <div key={i} className="flex-1 bg-emerald-300 rounded-full" style={{ height: `${Math.random() * 100}%` }} />
                 ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN EXPORT
// ==========================================
export const ServiceProofMockup: React.FC<ServiceProofMockupProps> = ({ type }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(containerRef.current, {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  }, { scope: containerRef });

  const renderMockup = () => {
    switch (type) {
      case 'marketing':
        return <MarketingMockup />;
      case 'design':
        return <DesignMockup />;
      case 'websites':
        return <WebsitesMockup />;
      case 'audiovisual':
        return <AudiovisualMockup />;
      default:
        return <MarketingMockup />;
    }
  };

  return (
    <div ref={containerRef} className="w-full aspect-[4/3] md:aspect-[16/9] lg:aspect-[21/9] max-h-[600px] relative">
      {/* Outer Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-brand-yellow/10 to-primary/30 rounded-[2.2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000" />
      
      {/* Container */}
      <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-black p-2 shadow-2xl">
        {renderMockup()}
      </div>
    </div>
  );
};
