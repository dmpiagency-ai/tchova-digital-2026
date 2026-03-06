// ============================================
// TOOL SECTION COMPONENT
// Main GSM Tools section with responsive layout
// Mobile: Static grid with navigation buttons
// Desktop: 2-3 column grid
// ============================================

import { useState, useEffect, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Grid, 
  List, 
  Zap,
  Shield,
  Key,
  Server,
  AlertCircle,
  X
} from 'lucide-react';
import { 
  GSMTool, 
  Currency, 
  UserLevel, 
  GSMWallet 
} from '@/types/gsm';
import { 
  GSM_TOOLS, 
  TOOL_CATEGORIES,
  getToolsByCategory,
  searchTools
} from '@/config/gsmToolsConfig';
import { formatCurrency, getWallet } from '@/services/gsmRentalService';
import { checkTool, rentTool } from '@/api/gsm/checkAndRent';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ChecktoolModal from './ChecktoolModal';
import RentConfirmationModal from './RentConfirmationModal';
import ToolCard from './ToolCard';
import CategoryFilter from './CategoryFilter';

interface ToolSectionProps {
  userLevel?: UserLevel;
  currency?: Currency;
  showWalletBalance?: boolean;
}

const ITEMS_PER_PAGE = 6;

const ToolSection: React.FC<ToolSectionProps> = ({
  userLevel = 'cliente',
  currency = 'MTN',
  showWalletBalance = true
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  
  // Modal states
  const [checktoolModalOpen, setChecktoolModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<GSMTool | null>(null);
  const [checktoolLoading, setChecktoolLoading] = useState(false);
  const [checktoolResult, setChecktoolResult] = useState<any>(null);
  const [checktoolError, setChecktoolError] = useState<string | null>(null);
  
  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [rentDuration, setRentDuration] = useState(1);
  const [rentLoading, setRentLoading] = useState(false);
  const [rentResult, setRentResult] = useState<any>(null);
  const [rentError, setRentError] = useState<string | null>(null);

  const [wallet, setWallet] = useState<GSMWallet | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const userId = user?.id || 'anonymous';

  // Load wallet
  useEffect(() => {
    if (userId && userId !== 'anonymous') {
      const userWallet = getWallet(userId);
      setWallet(userWallet);
    }
  }, [userId]);

  // Filter tools
  const filteredTools = useMemo(() => {
    let tools = selectedCategory === 'all' 
      ? GSM_TOOLS 
      : getToolsByCategory(selectedCategory as any);
    
    if (searchQuery) {
      tools = searchTools(searchQuery);
    }
    
    return tools;
  }, [selectedCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredTools.length / ITEMS_PER_PAGE);
  const paginatedTools = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return filteredTools.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTools, currentPage]);

  // Check if mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 1024);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory, searchQuery]);

  // Navigation handlers
  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handlers
  const handleChecktool = (tool: GSMTool) => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para verificar o status',
        variant: 'destructive',
      });
      return;
    }
    setSelectedTool(tool);
    setChecktoolModalOpen(true);
    setChecktoolResult(null);
    setChecktoolError(null);
  };

  const handleCheckComplete = async (request: any) => {
    setChecktoolLoading(true);
    setChecktoolError(null);
    try {
      const inputData = request.inputData?.imei || request.inputData?.serial || '';
      const result = await checkTool(request.toolId, inputData, request.userId);
      if (result.success) {
        setChecktoolResult(result.data);
      } else {
        setChecktoolError(result.error?.message || 'Falha ao verificar');
      }
    } catch (error) {
      setChecktoolError('Erro de conexão');
    } finally {
      setChecktoolLoading(false);
    }
  };

  const handleRent = (tool: GSMTool, duration: number) => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para alugar',
        variant: 'destructive',
      });
      return;
    }
    setSelectedTool(tool);
    setRentDuration(duration);
    setRentModalOpen(true);
    setRentResult(null);
    setRentError(null);
  };

  const handleRentConfirm = async (imei?: string, serial?: string) => {
    if (!selectedTool) return;
    setRentLoading(true);
    setRentError(null);
    try {
      const result = await rentTool(selectedTool.id, rentDuration, userId, imei, serial);
      if (result.success) {
        setRentResult(result);
        // Refresh wallet after successful rental
        const updatedWallet = getWallet(userId);
        setWallet(updatedWallet);
      } else {
        setRentError(result.error?.message || 'Falha ao processar');
      }
    } catch (error) {
      setRentError('Erro de conexão');
    } finally {
      setRentLoading(false);
    }
  };

  // Category icons mapping
  const categoryIcons: Record<string, React.ReactNode> = {
    instant: <Zap className="w-4 h-4" />,
    server: <Grid className="w-4 h-4" />,
    box: <List className="w-4 h-4" />,
    teamviewer: <Zap className="w-4 h-4" />
  };

  const categories = TOOL_CATEGORIES.map(cat => ({
    id: cat.id,
    name: cat.name,
    icon: categoryIcons[cat.id]
  }));

  // Benefits data
  const benefits = [
    {
      icon: <Key className="w-6 h-6" />,
      title: 'Credenciais Instantâneas',
      description: 'Acesso imediato após confirmação do pagamento',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Ativação < 30s',
      description: 'Sua ferramenta pronta em menos de 30 segundos',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Segurança & Auditoria',
      description: 'Criptografia AES-256, Logs completos e 2FA',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: <Server className="w-6 h-6" />,
      title: 'API 24/7',
      description: 'REST API com 99.9% uptime e Webhooks',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-green/5 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 bg-brand-green/10 border-brand-green/20 text-brand-green px-4 py-1.5 rounded-full">
            <Zap className="w-4 h-4 mr-2" />
            Ferramentas Profissionais
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground mb-3">
            Alugue as Melhores{' '}
            <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
              Ferramentas GSM
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Escolha a duração, verifique o status do dispositivo e aluge instantaneamente
          </p>
        </div>

        {/* Wallet Balance */}
        {showWalletBalance && wallet && (
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/20 backdrop-blur-xl">
              <span className="text-sm text-muted-foreground">Saldo:</span>
              <span className="font-bold text-green-400">
                {formatCurrency(
                  currency === 'USD' ? wallet.balance.usd : wallet.balance.mtn, 
                  currency
                )}
              </span>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Buscar ferramentas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-2xl bg-white/5 border-white/10 backdrop-blur-xl focus:border-primary/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Desktop: Grid with all tools */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <div
              key={tool.id}
              className="opacity-0 animate-fade-up"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <ToolCard
                tool={tool}
                userLevel={userLevel}
                currency={currency}
                onRent={(t: GSMTool, d: number) => handleRent(t, d)}
                onChecktool={handleChecktool}
              />
            </div>
          ))}
        </div>

        {/* Mobile: 2-Column Compact Grid (no scroll, saves vertical space) */}
        <div className="lg:hidden grid grid-cols-2 gap-3">
          {filteredTools.map((tool, index) => (
            <div
              key={tool.id}
              className="opacity-0 animate-fade-up"
              style={{
                animationDelay: `${index * 50}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <ToolCard
                tool={tool}
                userLevel={userLevel}
                currency={currency}
                onRent={(t: GSMTool, d: number) => handleRent(t, d)}
                onChecktool={handleChecktool}
              />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Nenhuma ferramenta encontrada</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros</p>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-16">
          <h3 className="text-xl font-bold text-center text-foreground mb-8">
            Por que escolher a TchovaDigital?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="opacity-0 animate-fade-up p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300 hover:scale-105"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4`}>
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <h4 className="font-bold text-foreground mb-2">{benefit.title}</h4>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ChecktoolModal
        tool={selectedTool}
        isOpen={checktoolModalOpen}
        onClose={() => setChecktoolModalOpen(false)}
        onCheckComplete={handleCheckComplete}
        isLoading={checktoolLoading}
        checkResult={checktoolResult}
        error={checktoolError}
      />
      
      <RentConfirmationModal
        tool={selectedTool}
        duration={rentDuration}
        currency={currency}
        userLevel={userLevel}
        isOpen={rentModalOpen}
        onClose={() => setRentModalOpen(false)}
        onConfirm={handleRentConfirm}
        isLoading={rentLoading}
        rentalResult={rentResult}
        error={rentError}
      />
    </section>
  );
};

export default ToolSection;
