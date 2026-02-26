// ============================================
// TCHOVA RENT PAINEL
// Sistema de aluguel de ferramentas GSM
// ============================================

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Box,
  Lock,
  Activity,
  Zap,
  RefreshCw,
  Smartphone,
  Monitor,
  Server,
  Search,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Copy,
  Eye,
  EyeOff,
  Timer,
  History,
  Wallet,
  Key,
  ExternalLink,
  Filter,
  Star,
  X,
  ChevronDown,
  Info,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import {
  GSM_TOOLS,
  GSM_TOOL_CATEGORIES,
  GSMTool,
  GSMToolRental,
  calculateRentalPrice,
  generateCredentials,
  isRentalActive,
  getRemainingTime,
  formatRemainingTime,
  DURATION_PRICING
} from '@/config/gsmTools';
import { env } from '@/config/env';
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// TYPES
// ============================================

interface GSMToolsPanelProps {
  onRentTool?: (tool: GSMTool, duration: number, price: number) => void;
  showBalance?: boolean;
  initialCategory?: string;
}

interface UserBalance {
  credits: number;
  currency: 'MZN' | 'USD';
}

interface RentalHistoryItem extends GSMToolRental {
  toolName: string;
  toolIcon: string;
}

// ============================================
// ICON MAP
// ============================================

const iconMap: Record<string, React.ReactNode> = {
  Box: <Box className="w-5 h-5" />,
  Lock: <Lock className="w-5 h-5" />,
  Activity: <Activity className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  RefreshCw: <RefreshCw className="w-5 h-5" />,
  Smartphone: <Smartphone className="w-5 h-5" />,
  Monitor: <Monitor className="w-5 h-5" />,
  Server: <Server className="w-5 h-5" />,
  Grid: <Box className="w-5 h-5" />
};

// ============================================
// MAIN COMPONENT
// ============================================

const GSMToolsPanel: React.FC<GSMToolsPanelProps> = ({
  onRentTool,
  showBalance = true,
  initialCategory = 'all'
}) => {
  const { user, isAuthenticated } = useAuth();
  
  // State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<GSMTool | null>(null);
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [showRentDialog, setShowRentDialog] = useState(false);
  const [showCredentialsDialog, setShowCredentialsDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showAPIDialog, setShowAPIDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeRental, setActiveRental] = useState<GSMToolRental | null>(null);
  const [balance, setBalance] = useState<UserBalance>({ credits: 5000, currency: 'MZN' });
  const [rentalHistory, setRentalHistory] = useState<RentalHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Filter tools based on category and search
  const filteredTools = useMemo(() => {
    let tools = GSM_TOOLS;
    
    if (selectedCategory !== 'all') {
      tools = tools.filter(tool => tool.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.features.some(f => f.toLowerCase().includes(query))
      );
    }
    
    return tools;
  }, [selectedCategory, searchQuery]);

  // Calculate price for selected tool and duration
  const priceCalculation = useMemo(() => {
    if (!selectedTool) return { basePrice: 0, discount: 0, finalPrice: 0 };
    return calculateRentalPrice(selectedTool.id, selectedDuration);
  }, [selectedTool, selectedDuration]);

  // Check if user can afford the rental
  const canAfford = useMemo(() => {
    return balance.credits >= priceCalculation.finalPrice;
  }, [balance.credits, priceCalculation.finalPrice]);

  // Countdown timer for active rental
  useEffect(() => {
    if (!activeRental || !isRentalActive(activeRental)) return;

    const timer = setInterval(() => {
      const remaining = getRemainingTime(activeRental);
      setCountdown({ hours: remaining.hours, minutes: remaining.minutes, seconds: remaining.seconds });
      
      if (remaining.total <= 0) {
        setActiveRental(null);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeRental]);

  // Load rental history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('gsm_rental_history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory) as RentalHistoryItem[];
        // Convert date strings back to Date objects
        const history: RentalHistoryItem[] = parsed.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          expiresAt: new Date(item.expiresAt),
          startedAt: item.startedAt ? new Date(item.startedAt) : undefined
        }));
        setRentalHistory(history);
        
        // Find active rental
        const active = history.find((r) => isRentalActive(r));
        if (active) {
          setActiveRental(active);
        }
      } catch (error) {
        console.error('Error loading rental history:', error);
      }
    }
    
    // Load balance
    const savedBalance = localStorage.getItem('gsm_user_balance');
    if (savedBalance) {
      try {
        setBalance(JSON.parse(savedBalance));
      } catch (error) {
        console.error('Error loading balance:', error);
      }
    }
  }, []);

  // Save rental history to localStorage
  const saveRentalHistory = useCallback((history: RentalHistoryItem[]) => {
    localStorage.setItem('gsm_rental_history', JSON.stringify(history));
    setRentalHistory(history);
  }, []);

  // Save balance to localStorage
  const saveBalance = useCallback((newBalance: UserBalance) => {
    localStorage.setItem('gsm_user_balance', JSON.stringify(newBalance));
    setBalance(newBalance);
  }, []);

  // Handle tool selection for rent
  const handleSelectTool = (tool: GSMTool) => {
    setSelectedTool(tool);
    setSelectedDuration(tool.minDuration);
    setShowRentDialog(true);
  };

  // Handle rent confirmation
  const handleConfirmRent = async () => {
    if (!selectedTool || !canAfford) return;

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate credentials
    const credentials = generateCredentials(selectedTool.id);

    // Create rental
    const rental: GSMToolRental = {
      id: `rental_${Date.now()}`,
      toolId: selectedTool.id,
      userId: user?.id || 'guest',
      userName: user?.name || 'Guest',
      userEmail: user?.email || 'guest@example.com',
      duration: selectedDuration,
      price: priceCalculation.finalPrice,
      status: 'active',
      credentials,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + selectedDuration * 60 * 60 * 1000),
      startedAt: new Date()
    };

    // Update balance
    const newBalance = {
      ...balance,
      credits: balance.credits - priceCalculation.finalPrice
    };
    saveBalance(newBalance);

    // Add to history
    const historyItem: RentalHistoryItem = {
      ...rental,
      toolName: selectedTool.name,
      toolIcon: selectedTool.icon
    };
    const newHistory = [historyItem, ...rentalHistory];
    saveRentalHistory(newHistory);

    // Set active rental
    setActiveRental(rental);

    // Close rent dialog and show credentials
    setShowRentDialog(false);
    setShowCredentialsDialog(true);
    setIsLoading(false);

    // Callback
    if (onRentTool) {
      onRentTool(selectedTool, selectedDuration, priceCalculation.finalPrice);
    }
  };

  // Copy credentials to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  // Format duration options
  const getDurationOptions = (tool: GSMTool) => {
    const options = [];
    for (let d = tool.minDuration; d <= tool.maxDuration; d *= 2) {
      if (d <= tool.maxDuration) {
        const pricing = DURATION_PRICING[d as keyof typeof DURATION_PRICING] || 
          { multiplier: d, discount: 0 };
        options.push({
          value: d,
          label: d === 1 ? '1 hora' : `${d} horas`,
          discount: pricing.discount
        });
      }
    }
    // Ensure max duration is included
    if (!options.find(o => o.value === tool.maxDuration)) {
      const pricing = DURATION_PRICING[tool.maxDuration as keyof typeof DURATION_PRICING] || 
        { multiplier: tool.maxDuration, discount: 0 };
      options.push({
        value: tool.maxDuration,
        label: tool.maxDuration === 1 ? '1 hora' : `${tool.maxDuration} horas`,
        discount: pricing.discount
      });
    }
    return options;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="w-full space-y-6">
      {/* Header with Balance and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
            Tchova Rent Painel
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Aluguel de ferramentas GSM com ativação instantânea
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Balance */}
          {showBalance && (
            <div className="bg-gradient-to-r from-primary/10 to-brand-green/10 rounded-xl px-4 py-2 border border-primary/20">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-primary" />
                <span className="font-bold text-primary">
                  {balance.credits.toLocaleString('pt-MZ')} {balance.currency}
                </span>
              </div>
            </div>
          )}
          
          {/* History Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowHistoryDialog(true)}
            className="gap-2"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Histórico</span>
          </Button>
          
          {/* API Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAPIDialog(true)}
            className="gap-2"
          >
            <Key className="w-4 h-4" />
            <span className="hidden sm:inline">API</span>
          </Button>
        </div>
      </div>

      {/* Active Rental Banner */}
      {activeRental && isRentalActive(activeRental) && (
        <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 rounded-2xl p-4 border border-green-300/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Timer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-green-600 dark:text-green-400">
                  Aluguel Ativo: {GSM_TOOLS.find(t => t.id === activeRental.toolId)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Expira em {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCredentialsDialog(true)}
              className="gap-2 border-green-300 text-green-600 hover:bg-green-50"
            >
              <Eye className="w-4 h-4" />
              Ver Credenciais
            </Button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ferramentas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {GSM_TOOL_CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap gap-2"
            >
              {iconMap[category.icon]}
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <Card
            key={tool.id}
            className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl cursor-pointer ${
              tool.popular ? 'border-primary/50 ring-2 ring-primary/20' : ''
            }`}
            onClick={() => handleSelectTool(tool)}
          >
            {/* Popular Badge */}
            {tool.popular && (
              <div className="absolute top-2 right-2 z-10">
                <Badge className="bg-gradient-to-r from-primary to-brand-green text-white">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white">
                    {iconMap[tool.icon]}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <CardDescription className="text-xs capitalize">
                    {tool.category === 'instant' ? 'Instantâneo' : 
                     tool.category === 'teamviewer' ? 'TeamViewer' :
                     tool.category === 'server' ? 'Servidor' : 'Box'}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {tool.description}
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-1">
                {tool.features.slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
                {tool.features.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{tool.features.length - 3}
                  </Badge>
                )}
              </div>
              
              <Separator />
              
              {/* Price */}
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-2xl font-bold text-primary">
                    {tool.price}
                  </span>
                  <span className="text-sm text-muted-foreground"> MZN/hora</span>
                </div>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green"
                  disabled={!tool.available}
                >
                  {tool.available ? 'Alugar' : 'Indisponível'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma ferramenta encontrada</h3>
          <p className="text-muted-foreground">
            Tente ajustar os filtros ou a busca
          </p>
        </div>
      )}

      {/* ============================================ */}
      {/* RENT DIALOG */}
      {/* ============================================ */}
      <Dialog open={showRentDialog} onOpenChange={setShowRentDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTool && (
                <>
                  <div className={`w-10 h-10 bg-gradient-to-br ${selectedTool.color} rounded-xl flex items-center justify-center`}>
                    <span className="text-white">{iconMap[selectedTool.icon]}</span>
                  </div>
                  Alugar {selectedTool.name}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Escolha a duração do aluguel e confirme o pagamento
            </DialogDescription>
          </DialogHeader>
          
          {selectedTool && (
            <div className="space-y-6 py-4">
              {/* Duration Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Duração</Label>
                <div className="grid grid-cols-3 gap-2">
                  {getDurationOptions(selectedTool).map((option) => (
                    <Button
                      key={option.value}
                      variant={selectedDuration === option.value ? 'default' : 'outline'}
                      className={`flex flex-col h-auto py-3 ${
                        selectedDuration === option.value 
                          ? 'bg-gradient-to-r from-primary to-brand-green' 
                          : ''
                      }`}
                      onClick={() => setSelectedDuration(option.value)}
                    >
                      <span className="font-bold">{option.label}</span>
                      {option.discount > 0 && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          -{option.discount}%
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Price Breakdown */}
              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Preço base ({selectedDuration}h)</span>
                  <span>{priceCalculation.basePrice.toLocaleString('pt-MZ')} MZN</span>
                </div>
                {priceCalculation.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Desconto</span>
                    <span>-{priceCalculation.discount}%</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    {priceCalculation.finalPrice.toLocaleString('pt-MZ')} MZN
                  </span>
                </div>
              </div>
              
              {/* Balance Check */}
              <div className={`flex items-center gap-3 p-3 rounded-xl ${
                canAfford 
                  ? 'bg-green-500/10 border border-green-300/30' 
                  : 'bg-red-500/10 border border-red-300/30'
              }`}>
                {canAfford ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-semibold text-green-600">Saldo suficiente</p>
                      <p className="text-sm text-muted-foreground">
                        Saldo após: {(balance.credits - priceCalculation.finalPrice).toLocaleString('pt-MZ')} MZN
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-red-600">Saldo insuficiente</p>
                      <p className="text-sm text-muted-foreground">
                        Necessário: {(priceCalculation.finalPrice - balance.credits).toLocaleString('pt-MZ')} MZN adicional
                      </p>
                    </div>
                  </>
                )}
              </div>
              
              {/* Features */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">O que está incluído:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTool.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRentDialog(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmRent}
              disabled={!canAfford || isLoading}
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-brand-green"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Confirmar Aluguel
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* CREDENTIALS DIALOG */}
      {/* ============================================ */}
      <Dialog open={showCredentialsDialog} onOpenChange={setShowCredentialsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <ShieldCheck className="w-5 h-5" />
              Credenciais de Acesso
            </DialogTitle>
            <DialogDescription>
              Guarde estas credenciais em segurança. Elas são válidas durante o período do aluguel.
            </DialogDescription>
          </DialogHeader>
          
          {activeRental && (
            <div className="space-y-4 py-4">
              {/* Timer */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-4 text-center">
                <Timer className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Tempo restante</p>
                <p className="text-2xl font-bold text-green-600">
                  {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                </p>
              </div>
              
              {/* Credentials */}
              <div className="space-y-3">
                {/* URL */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">URL de Acesso</Label>
                  <div className="flex gap-2">
                    <Input
                      value={activeRental.credentials.url}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(activeRental.credentials.url)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Username */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Usuário</Label>
                  <div className="flex gap-2">
                    <Input
                      value={activeRental.credentials.username}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(activeRental.credentials.username)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Password */}
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Senha</Label>
                  <div className="flex gap-2">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={activeRental.credentials.password}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(activeRental.credentials.password)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Open Tool Button */}
              <Button
                className="w-full bg-gradient-to-r from-primary to-brand-green"
                onClick={() => window.open(activeRental.credentials.url, '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir Ferramenta
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* HISTORY DIALOG */}
      {/* ============================================ */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Histórico de Aluguéis
            </DialogTitle>
            <DialogDescription>
              Seus aluguéis anteriores e ativos
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            {rentalHistory.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum aluguel ainda</h3>
                <p className="text-muted-foreground">
                  Seus aluguéis aparecerão aqui
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {rentalHistory.map((rental) => {
                  const tool = GSM_TOOLS.find(t => t.id === rental.toolId);
                  const isActive = isRentalActive(rental);
                  
                  return (
                    <div
                      key={rental.id}
                      className={`p-4 rounded-xl border ${
                        isActive 
                          ? 'bg-green-500/10 border-green-300/30' 
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 bg-gradient-to-br ${tool?.color || 'from-gray-400 to-gray-500'} rounded-xl flex items-center justify-center`}>
                            <span className="text-white">{iconMap[rental.toolIcon] || <Box className="w-5 h-5" />}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{rental.toolName}</h4>
                            <p className="text-sm text-muted-foreground">
                              {rental.duration}h - {rental.price.toLocaleString('pt-MZ')} MZN
                            </p>
                          </div>
                        </div>
                        <Badge variant={isActive ? 'default' : 'secondary'} className={isActive ? 'bg-green-500' : ''}>
                          {isActive ? 'Ativo' : rental.status === 'expired' ? 'Expirado' : 'Finalizado'}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 text-sm text-muted-foreground">
                        <p>Criado: {new Date(rental.createdAt).toLocaleString('pt-MZ')}</p>
                        <p>Expirou: {new Date(rental.expiresAt).toLocaleString('pt-MZ')}</p>
                      </div>
                      
                      {isActive && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3"
                          onClick={() => {
                            setActiveRental(rental);
                            setShowHistoryDialog(false);
                            setShowCredentialsDialog(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Ver Credenciais
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* ============================================ */}
      {/* API DIALOG */}
      {/* ============================================ */}
      <Dialog open={showAPIDialog} onOpenChange={setShowAPIDialog}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Integração API
            </DialogTitle>
            <DialogDescription>
              Integre o aluguel de ferramentas em sua aplicação
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* API Key */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">Sua Chave de API</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value="sk_live_xxxxxxxxxxxxxxxxxxxx"
                  readOnly
                  className="font-mono"
                />
                <Button variant="outline" onClick={() => copyToClipboard('sk_live_xxxxxxxxxxxxxxxxxxxx')}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Mantenha esta chave segura. Não compartilhe com terceiros.
              </p>
            </div>
            
            {/* Endpoints */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Endpoints</Label>
              
              <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                {/* GET /tools */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">GET</Badge>
                    <code className="text-sm">/api/gsm/tools</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Lista todas as ferramentas disponíveis
                  </p>
                </div>
                
                {/* POST /rent */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500">POST</Badge>
                    <code className="text-sm">/api/gsm/rent</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Aluga uma ferramenta específica
                  </p>
                  <pre className="text-xs bg-background p-2 rounded-lg overflow-x-auto">
{`{
  "tool_id": "chimera",
  "duration": 4,
  "api_key": "sk_live_xxx"
}`}
                  </pre>
                </div>
                
                {/* GET /status */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">GET</Badge>
                    <code className="text-sm">/api/gsm/status/:id</code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Verifica o status de um aluguel
                  </p>
                </div>
              </div>
            </div>
            
            {/* Limits */}
            <div className="bg-amber-500/10 border border-amber-300/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-amber-600">Limites de Requisição</span>
              </div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>60 requisições por minuto</li>
                <li>1.000 requisições por hora</li>
                <li>10.000 requisições por dia</li>
              </ul>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAPIDialog(false)}>
              Fechar
            </Button>
            <Button className="bg-gradient-to-r from-primary to-brand-green">
              <ExternalLink className="w-4 h-4 mr-2" />
              Documentação Completa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GSMToolsPanel;