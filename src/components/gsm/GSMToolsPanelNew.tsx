// ============================================
// GSM TOOLS - FERRAMENTAS REAIS 2025/2026
// Painel atualizado com ferramentas disponíveis
// ============================================

import { useState, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Search, 
  Smartphone,
  Wrench,
  Server,
  Settings,
  ArrowRight,
  Crown,
  Zap
} from 'lucide-react';

// Tool Interface
interface GSMTool {
  id: string;
  name: string;
  nickname: string;
  description: string;
  features: string[];
  models: string;
  chips: string;
  pricing: {
    mtn: number;
  };
  category: string;
  available: boolean;
  timeOptions: number[];
}

// Ferramentas reais disponíveis (2025/2026)
const mockTools: GSMTool[] = [
  {
    id: 'unlocktool',
    name: 'UnlockTool',
    nickname: 'Canivete Suíço',
    description: 'Versatilidade total e rapidez',
    features: ['FRP Bypass', 'Mi Cloud / Relock Fix', 'Apple Module', 'Bootloader Unlock'],
    models: 'Xiaomi, Samsung, Oppo, Vivo, Huawei, Vsmart',
    chips: 'MTK, Qualcomm, Unisoc',
    pricing: { mtn: 250.00 },
    category: 'universal',
    available: true,
    timeOptions: [1, 2, 4, 8, 12, 24]
  },
  {
    id: 'chimera',
    name: 'Chimera Tool',
    nickname: 'Especialista Samsung',
    description: 'Reparação avançada e funções de rede',
    features: ['Repair IMEI / Patch Certificate', 'Read Codes', 'Firmware Flash', 'KG / MDM Lock'],
    models: 'Samsung (Exynos/Qualcomm), Huawei (Kirin), BlackBerry',
    chips: 'Exynos, Qualcomm, Kirin',
    pricing: { mtn: 320.00 },
    category: 'samsung',
    available: true,
    timeOptions: [1, 2, 4, 8, 12, 24]
  },
  {
    id: 'dft',
    name: 'DFT Pro',
    nickname: 'Solução Low-End',
    description: 'Excelente para modelos de entrada e processadores específicos',
    features: ['Unisoc/SPD Support', 'Xiaomi Dual Sim Repair', 'Auth Bypass'],
    models: 'Xiaomi (Redmi A), Vivo, Oppo, Realme, Infinix',
    chips: 'Unisoc, MediaTek',
    pricing: { mtn: 280.00 },
    category: 'lowend',
    available: true,
    timeOptions: [1, 2, 4, 8, 12, 24]
  },
  {
    id: 'tfm',
    name: 'TFM Tool Pro',
    nickname: 'Rainha do Servidor',
    description: 'Estabilidade em processos com créditos e autorização oficial',
    features: ['SLA/DA Auth', 'Server FRP', 'Factory Reset'],
    models: 'Tecno, Infinix, Itel, Samsung, MTK genéricos',
    chips: 'MTK',
    pricing: { mtn: 350.00 },
    category: 'server',
    available: true,
    timeOptions: [1, 2, 4, 8, 12, 24]
  },
  {
    id: 'eft',
    name: 'EFT Pro',
    nickname: 'Mestra das Customizações',
    description: 'Focada em firmwares modificados e acesso Root',
    features: ['Root Multi-Brand', 'Make Kernel', 'FTP Support'],
    models: 'Samsung, Huawei, Motorola, Qualcomm',
    chips: 'Qualcomm',
    pricing: { mtn: 400.00 },
    category: 'custom',
    available: true,
    timeOptions: [1, 2, 4, 8, 12, 24]
  }
];

// Category icons
const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'universal': return <Zap className="w-6 h-6" />;
    case 'samsung': return <Smartphone className="w-6 h-6" />;
    case 'lowend': return <Settings className="w-6 h-6" />;
    case 'server': return <Server className="w-6 h-6" />;
    case 'custom': return <Crown className="w-6 h-6" />;
    default: return <Wrench className="w-6 h-6" />;
  }
};

// Category colors
const getCategoryColor = (category: string) => {
  switch(category) {
    case 'universal': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
    case 'samsung': return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'lowend': return 'bg-orange-50 text-orange-600 border-orange-100';
    case 'server': return 'bg-purple-50 text-purple-600 border-purple-100';
    case 'custom': return 'bg-pink-50 text-pink-600 border-pink-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

// Tool Row
const ToolRow = ({ 
  tool, 
  onSelect
}: { 
  tool: GSMTool; 
  selectedTime: number;
  onTimeChange: (time: number) => void;
  onSelect: () => void;
}) => {
  return (
    <div className="gsm-tool-row bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 opacity-0 transform translate-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center shadow-sm ${getCategoryColor(tool.category)}`}>
          {getCategoryIcon(tool.category)}
        </div>

        {/* Name & Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{tool.name}</h3>
            <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
              {tool.nickname}
            </span>
            {tool.available && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Ativo</span>
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-gray-500 leading-relaxed">{tool.description}</p>
        </div>

        {/* Models & Chips */}
        <div className="hidden lg:block w-56">
          <div className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Compatibilidade</div>
          <p className="text-xs font-bold text-gray-600 line-clamp-2">{tool.models}</p>
        </div>

        {/* Action Button */}
        <button 
          onClick={onSelect}
          className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group"
        >
          Verificar
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Features */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex flex-wrap gap-2">
          {tool.features.map((feature, idx) => (
            <span key={idx} className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-gray-50 text-gray-400 border border-gray-100 rounded-lg hover:bg-primary/5 hover:text-primary hover:border-primary/20 transition-colors">
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// Categories
const categories = [
  { id: 'all', name: 'Todos', icon: 'All' },
  { id: 'universal', name: 'Universal', icon: 'Zap' },
  { id: 'samsung', name: 'Samsung', icon: 'Phone' },
  { id: 'lowend', name: 'Low-End', icon: 'Settings' },
  { id: 'server', name: 'Servidor', icon: 'Server' },
  { id: 'custom', name: 'Custom', icon: 'Crown' }
];

// Main Component
const GSMToolsPanelNew = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter
  const filteredTools = useMemo(() => {
    return mockTools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tool.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Orchestrate staggered entrance
  useGSAP(() => {
    const rows = containerRef.current?.querySelectorAll('.gsm-tool-row');
    if (rows && rows.length > 0) {
      gsap.to(rows, {
        opacity: 1,
        y: 0,
        stagger: {
          each: 0.1,
          from: 'start'
        },
        duration: 0.8,
        ease: 'power3.out',
        clearProps: 'transform'
      });
    }
  }, { scope: containerRef, dependencies: [filteredTools] });

  const handleToolSelect = (tool: GSMTool) => {
    alert(`Ferramenta: ${tool.name}\nStatus: Operacional\nSuporte: 24/7`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Database className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                  TOOLS <span className="text-primary tracking-normal">GSM</span>
                </h1>
              </div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Catálogo de Ferramentas Profissionais (2025/2026)
              </p>
            </div>
            <div className="flex items-center gap-4 bg-primary/5 px-6 py-4 rounded-3xl border border-primary/10">
              <RefreshCw className="w-5 h-5 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">Status: Em Tempo Real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Search */}
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="PROCURAR FERRAMENTA..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 text-sm font-bold tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 bg-gray-50 focus:bg-white transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 transform active:scale-95 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white shadow-xl shadow-primary/20'
                      : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tools List */}
      <div className="container mx-auto max-w-7xl px-6 py-10" ref={containerRef}>
        <div className="grid gap-4">
          {filteredTools.map(tool => (
            <ToolRow
              key={tool.id}
              tool={tool}
              selectedTime={1}
              onTimeChange={() => {}}
              onSelect={() => handleToolSelect(tool)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="p-6 bg-gray-50 inline-block rounded-[2.5rem] mb-6">
              <Search className="w-16 h-16 text-gray-300" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">
              Nada Encontrado
            </h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest max-w-xs mx-auto">
              Tente redefinir seus filtros ou busca
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="container mx-auto max-w-7xl px-6">
        <div className="bg-zinc-900 rounded-[3rem] p-12 text-center text-white shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl rounded-full scale-150" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">SUPORTE EXCLUSIVO</h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] mb-8">
              Assistência técnica especializada TchovaDigital
            </p>
            <button className="px-10 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all duration-300 transform active:scale-95">
              Contactar Equipa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSMToolsPanelNew;
