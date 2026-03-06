// ============================================
// GSM RENTAL PANEL - TOOLS SHOWCASE
// Design Liquid Glass Moderno - Grid Interativo
// Enhanced UX/UI with interactive tool cards
// ============================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Star,
  Users,
  Lock,
  Zap,
  Shield,
  Activity,
  RefreshCw,
  Smartphone,
  Monitor,
  Server,
  Box,
  Grid,
  List,
  ArrowRight,
  Clock,
  DollarSign,
  Coins,
  Sparkles,
  TrendingUp,
  Filter,
  Search as SearchIcon,
  Info,
  Calculator,
  Timer,
  CheckCircle,
  XCircle,
  ExternalLink,
  ChevronDown,
  Plus,
  Minus,
  AlertCircle,
  Wallet,
  CreditCard
} from 'lucide-react';

import {
  GSMTool,
  Currency,
  UserLevel,
  EXCHANGE_RATES,
  USER_LEVELS,
  ChecktoolRequest,
  GSMWallet
} from '@/types/gsm';

import {
  GSM_TOOLS,
  TOOL_CATEGORIES,
  getToolsByCategory,
  searchTools,
  getAvailableSlots,
  hasAvailableSlots
} from '@/config/gsmToolsConfig';

import {
  convertCurrency,
  formatCurrency,
  calculateRentalPrice,
  getWallet,
  hasSufficientBalance
} from '@/services/gsmRentalService';

import { checkTool, rentTool } from '@/api/gsm/checkAndRent';

import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

import ChecktoolModal from './ChecktoolModal';
import RentConfirmationModal from './RentConfirmationModal';

interface GSMToolsShowcaseProps {
  userLevel?: UserLevel;
  currency?: Currency;
  onToolSelect: (tool: GSMTool, duration: number) => void;
  onCurrencyChange?: (currency: Currency) => void;
  showWalletBalance?: boolean;
}

// Icon Map
const iconMap: Record<string, React.ReactNode> = {
  Box: <Box className="w-6 h-6" />,
  Lock: <Lock className="w-6 h-6" />,
  Activity: <Activity className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  RefreshCw: <RefreshCw className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
  Monitor: <Monitor className="w-6 h-6" />,
  Server: <Server className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />,
  Grid: <Grid className="w-6 h-6" />
};

// ============================================
// INTERACTIVE TOOL CARD COMPONENT
// ============================================
interface ToolCardProps {
  tool: GSMTool;
  userLevel: UserLevel;
  currency: Currency;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onRent: (tool: GSMTool, duration: number) => void;
  onChecktool: (tool: GSMTool) => void;
  index: number;
  isVisible: boolean;
}

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  userLevel,
  currency,
  isHovered,
  onHover,
  onRent,
  onChecktool,
  index,
  isVisible
}) => {
  const [duration, setDuration] = useState(1);
  const [showCalculator, setShowCalculator] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const availableSlots = getAvailableSlots(tool);
  const isAvailable = hasAvailableSlots(tool);
  
  // Get price for user level
  const hourlyPrice = currency === 'USD' ? tool.pricing[userLevel].usd : tool.pricing[userLevel].mtn;
  const totalPrice = hourlyPrice * duration;
  
  // Calculate discount for longer durations
  const discount = duration >= 8 ? 10 : duration >= 4 ? 5 : 0;
  const discountedPrice = totalPrice * (1 - discount / 100);
  
  // Duration options based on tool config
  const durationOptions = tool.duration.options || [1, 2, 4, 6, 8, 12, 24];
  
  const handleDurationChange = (newDuration: number) => {
    if (newDuration >= tool.duration.min && newDuration <= tool.duration.max) {
      setDuration(newDuration);
    }
  };
  
  return (
    <Card
      className={`
        group relative overflow-hidden cursor-pointer transition-all duration-500
        rounded-[48px]
        ${isHovered ? 'scale-[1.02] shadow-2xl shadow-primary/30' : 'shadow-lg'}
        ${tool.popular ? 'ring-2 ring-primary/30' : ''}
        ${!isAvailable ? 'opacity-60' : ''}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${isPressed ? 'scale-[0.98]' : ''}
      `}
      style={{ 
        transitionDelay: `${index * 50}ms`,
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px) saturate(180%)'
      }}
      onMouseEnter={() => onHover(tool.id)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => { setIsPressed(false); onHover(null); }}
    >
      {/* Liquid Glass Background Layers */}
      <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-10`} />
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/[0.02]" />
      
      {/* Animated Shimmer Effect */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none`}>
        <div className={`absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-1000 ${isHovered ? 'translate-x-full' : ''}`} />
      </div>
      
      {/* Glass Border with Glow */}
      <div className={`absolute inset-0 rounded-[48px] border-2 ${isHovered ? 'border-primary/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-white/10'} transition-all duration-300`} />

      {/* Popular & Status Indicators */}
      <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-start">
        {tool.popular && (
          <div className="px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-brand-green text-white text-xs font-semibold shadow-lg">
            <TrendingUp className="w-3 h-3 inline mr-1" />
            Popular
          </div>
        )}
        <div className={`ml-auto px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md ${
          isAvailable 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {isAvailable ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
          {isAvailable ? 'Disponível' : 'Esgotado'}
        </div>
      </div>

      <CardContent className="relative p-4">
        {/* Image or Icon */}
        {tool.image ? (
          <div className="mb-3 mt-2">
            <img 
              src={tool.image} 
              alt={tool.name}
              className="w-full h-24 object-contain rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mt-2 shadow-lg group-hover:scale-110 transition-transform duration-300"
            style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.gradient.split(' ')[0].replace('from-', '')})` }}
          >
            <span className="text-white text-xl">
              {iconMap[tool.icon]}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {tool.name}
        </h3>

        {/* Quick Features */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-muted-foreground border border-white/10">
              {feature}
            </span>
          ))}
          {tool.features.length > 3 && (
            <span className="px-2.5 py-1 rounded-full bg-primary/20 text-xs text-primary border border-primary/20">
              +{tool.features.length - 3}
            </span>
          )}
        </div>

        {/* Interactive Duration Selector - Glass Panel */}
        <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Timer className="w-4 h-4 text-primary" />
              Duração
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {tool.duration.min}-{tool.duration.max}h
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full text-sm bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all"
              onClick={() => handleDurationChange(Math.max(tool.duration.min, duration - 1))}
              disabled={duration <= tool.duration.min}
            >
              <Minus className="w-4 h-4" />
            </Button>
            
            <div className="flex-1 text-center">
              <span className="text-2xl font-black text-primary">{duration}</span>
              <span className="text-sm text-muted-foreground ml-1">h</span>
            </div>
            
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full text-sm bg-white/5 border-white/10 hover:bg-primary/20 hover:border-primary/30 transition-all"
              onClick={() => handleDurationChange(Math.min(tool.duration.max, duration + 1))}
              disabled={duration >= tool.duration.max}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Quick Duration Options */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[1, 2, 4, 8].filter(d => d >= tool.duration.min && d <= tool.duration.max).map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  duration === d 
                    ? 'bg-gradient-to-r from-primary to-brand-green text-white shadow-lg shadow-primary/25' 
                    : 'bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10'
                }`}
              >
                {d}h
              </button>
            ))}
          </div>
        </div>

        {/* Price Calculator Display - Glass Panel */}
        <div className="mb-4 p-3 rounded-2xl bg-gradient-to-r from-primary/10 via-brand-green/10 to-emerald-500/10 border border-primary/20 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calculator className="w-4 h-4 text-brand-green" />
              Total
            </span>
            {discount > 0 && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs py-0.5 border border-green-500/30">
                -{discount}% OFF
              </Badge>
            )}
          </div>
          
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-3xl font-black text-primary drop-shadow-lg">
                {formatCurrency(discountedPrice, currency)}
              </span>
              {discount > 0 && (
                <span className="text-xs text-muted-foreground line-through ml-2">
                  {formatCurrency(totalPrice, currency)}
                </span>
              )}
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div className="font-medium">{formatCurrency(hourlyPrice, currency)}/h</div>
              {userLevel !== 'cliente' && (
                <div className="text-green-400 font-semibold">{USER_LEVELS[userLevel].discount}%off</div>
              )}
            </div>
          </div>
        </div>

        {/* Slots & Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span className="font-medium">{availableSlots} slots</span>
          </div>
          {(tool.requires_imei || tool.requires_serial) && (
            <div className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span className="font-medium">{tool.requires_imei && tool.requires_serial ? 'IMEI/Serial' : tool.requires_imei ? 'IMEI' : 'Serial'}</span>
            </div>
          )}
        </div>

        {/* Action Buttons - Glass Effect */}
        <div className="flex gap-2">
          {(tool.requires_imei || tool.requires_serial) && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onChecktool(tool);
              }}
              className="bg-white/5 hover:bg-white/15 border-white/10 hover:border-white/20 flex-1 rounded-xl transition-all duration-200"
            >
              <Search className="w-4 h-4 mr-1.5" />
              Verificar
            </Button>
          )}
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green flex-1 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-primary/40"
            disabled={!isAvailable}
            onClick={(e) => {
              e.stopPropagation();
              if (isAvailable) {
                onRent(tool, duration);
              }
            }}
          >
            <Zap className="w-4 h-4 mr-1.5" />
            {isAvailable ? 'Alugar Agora' : 'Esgotado'}
          </Button>
        </div>
      </CardContent>

      {/* Hover Glow Effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none rounded-[48px]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-brand-green/10 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        </div>
      )}
    </Card>
  );
};

// ============================================
// MAIN SHOWCASE COMPONENT
// ============================================
const GSMToolsShowcase: React.FC<GSMToolsShowcaseProps> = ({
  userLevel = 'cliente',
  currency = 'MTN',
  onToolSelect,
  onCurrencyChange,
  showWalletBalance = true
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [checktoolModalOpen, setChecktoolModalOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<GSMTool | null>(null);
  const [checktoolLoading, setChecktoolLoading] = useState(false);
  const [checktoolResult, setChecktoolResult] = useState<any>(null);
  const [checktoolError, setChecktoolError] = useState<string | null>(null);
  
  // Rent modal state
  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [rentDuration, setRentDuration] = useState(1);
  const [rentLoading, setRentLoading] = useState(false);
  const [rentResult, setRentResult] = useState<any>(null);
  const [rentError, setRentError] = useState<string | null>(null);

  // Wallet state
  const [wallet, setWallet] = useState<GSMWallet | null>(null);

  // Auth and user info
  const { user } = useAuth();
  const { toast } = useToast();

  // Get user ID for API calls
  const userId = user?.id || 'anonymous';

  // Load wallet on mount and when user changes
  useEffect(() => {
    if (userId && userId !== 'anonymous') {
      const userWallet = getWallet(userId);
      setWallet(userWallet);
    } else {
      setWallet(null);
    }
  }, [userId]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Filtered tools
  const filteredTools = useMemo(() => {
    let tools = getToolsByCategory(selectedCategory as 'all' | 'instant' | 'server' | 'box' | 'teamviewer');
    
    if (searchQuery) {
      tools = searchTools(searchQuery);
    }
    
    return tools;
  }, [selectedCategory, searchQuery]);

  // Handle checktool with authentication check
  const handleChecktool = (tool: GSMTool) => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para verificar o status da ferramenta',
        variant: 'destructive',
      });
      return;
    }
    
    setSelectedTool(tool);
    setChecktoolModalOpen(true);
    setChecktoolResult(null);
    setChecktoolError(null);
  };

  // Handle check complete
  const handleCheckComplete = async (request: ChecktoolRequest) => {
    setChecktoolLoading(true);
    setChecktoolError(null);
    
    try {
      // Extract the input data - could be IMEI or Serial
      const inputData = request.inputData?.imei || request.inputData?.serial || '';
      
      // Use the API function directly
      const result = await checkTool(request.toolId, inputData, request.userId);

      if (result.success) {
        setChecktoolResult(result.data);
      } else {
        setChecktoolError(result.error?.message || 'Falha ao verificar status');
      }
    } catch (error) {
      setChecktoolError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setChecktoolLoading(false);
    }
  };

  // Handle rental with duration and authentication check
  const handleRent = (tool: GSMTool, duration: number) => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para alugar esta ferramenta',
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
  
  // Handle rent confirmation
  const handleRentConfirm = async (imei?: string, serial?: string) => {
    if (!selectedTool) return;
    
    setRentLoading(true);
    setRentError(null);
    
    try {
      // Use the API function directly
      const result = await rentTool(selectedTool.id, rentDuration, userId, imei, serial);

      if (result.success) {
        setRentResult(result);
      } else {
        setRentError(result.error?.message || 'Falha ao processar aluguel');
      }
    } catch (error) {
      setRentError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setRentLoading(false);
    }
  };
  
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-green/5 to-transparent" />
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-sm font-medium mb-4">
            <Grid className="w-4 h-4 inline mr-2" />
            Catálogo de Ferramentas
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-4">
            Ferramentas{' '}
            <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
              Profissionais
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha entre as melhores ferramentas GSM do mercado. 
            Selecione a duração e veja o preço em tempo real.
          </p>
        </div>

        {/* User Level Badge */}
        <div className="flex flex-col lg:flex-row justify-center items-center gap-4 mb-8">
          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${USER_LEVELS[userLevel].color} bg-opacity-10 border border-white/10 backdrop-blur-xl`}>
            {userLevel === 'vip' && <Sparkles className="w-5 h-5 text-amber-500" />}
            {userLevel === 'revenda' && <TrendingUp className="w-5 h-5 text-purple-500" />}
            <span className="font-semibold text-foreground">
              Nível: {USER_LEVELS[userLevel].name}
            </span>
            {USER_LEVELS[userLevel].discount > 0 && (
              <Badge variant="secondary" className="bg-primary/20 text-primary">
                -{USER_LEVELS[userLevel].discount}% desconto
              </Badge>
            )}
          </div>
          
          {/* Wallet Balance Display */}
          {showWalletBalance && wallet && (
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-xl animate-fade-in">
              <Wallet className="w-5 h-5 text-green-400" />
              <span className="text-sm text-muted-foreground">Saldo:</span>
              <span className="font-bold text-green-400">
                {formatCurrency(
                  currency === 'USD' ? wallet.balance.usd : wallet.balance.mtn, 
                  currency
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-6 px-2 text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10"
                onClick={() => window.location.href = '/checkout'}
              >
                <CreditCard className="w-3 h-3 mr-1" />
                Adicionar
              </Button>
            </div>
          )}
          
          {/* Login prompt for non-authenticated users */}
          {showWalletBalance && !wallet && user && (
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-xl animate-fade-in">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-yellow-400">
                Carregue seu saldo para alugar ferramentas
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-6 px-2 text-xs text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10"
                onClick={() => window.location.href = '/checkout'}
              >
                <CreditCard className="w-3 h-3 mr-1" />
                Carregar
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar ferramentas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-2xl bg-white/5 border-white/10 backdrop-blur-xl focus:border-primary/50"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-1">
                {TOOL_CATEGORIES.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-xl px-4"
                  >
                    <span className="hidden sm:inline">{category.name}</span>
                    <span className="sm:hidden">{category.name.slice(0, 3)}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="rounded-xl"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="rounded-xl"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
          {filteredTools.map((tool, index) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              userLevel={userLevel}
              currency={currency}
              isHovered={hoveredTool === tool.id}
              onHover={setHoveredTool}
              onRent={handleRent}
              onChecktool={handleChecktool}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Nenhuma ferramenta encontrada</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros ou a busca
            </p>
          </div>
        )}

        {/* Currency Toggle */}
        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            onClick={() => {
              const newCurrency = currency === 'USD' ? 'MTN' : 'USD';
              onCurrencyChange?.(newCurrency);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/20 rounded-2xl font-semibold transition-all duration-300"
          >
            {currency === 'USD' ? <DollarSign className="w-5 h-5" /> : <Coins className="w-5 h-5" />}
            <span className="text-white">{currency}</span>
            <span className="text-white/60 text-sm">(Clique para alternar)</span>
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>Dúvidas? Entre em contato com nosso suporte.</p>
        </div>
      </div>

      {/* Checktool Modal */}
      <ChecktoolModal
        tool={selectedTool}
        isOpen={checktoolModalOpen}
        onClose={() => setChecktoolModalOpen(false)}
        onCheckComplete={handleCheckComplete}
        isLoading={checktoolLoading}
        checkResult={checktoolResult}
        error={checktoolError}
      />
      
      {/* Rent Confirmation Modal */}
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

export default GSMToolsShowcase;
