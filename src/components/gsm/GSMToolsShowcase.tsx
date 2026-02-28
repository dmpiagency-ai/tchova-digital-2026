// ============================================
// GSM RENTAL PAINEL - TOOLS SHOWCASE
// Design Liquid Glass Moderno - Grid Interativo
// ============================================

import { useState, useEffect, useMemo } from 'react';
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
  Filter
} from 'lucide-react';

import {
  GSMTool,
  Currency,
  UserLevel,
  EXCHANGE_RATES,
  USER_LEVELS
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
  calculateRentalPrice
} from '@/services/gsmRentalService';

interface GSMToolsShowcaseProps {
  userLevel?: UserLevel;
  currency?: Currency;
  onToolSelect: (tool: GSMTool) => void;
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

const GSMToolsShowcase: React.FC<GSMToolsShowcaseProps> = ({
  userLevel = 'cliente',
  currency = 'MTN',
  onToolSelect
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  // Get price for user level
  const getPriceForLevel = (tool: GSMTool, curr: Currency): number => {
    return curr === 'USD' ? tool.pricing[userLevel].usd : tool.pricing[userLevel].mtn;
  };

  // Get balance in current currency
  const getCurrencySymbol = (): string => {
    return EXCHANGE_RATES[currency].symbol;
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
            Ativação instantânea e suporte especializado.
          </p>
        </div>

        {/* User Level Badge */}
        <div className="flex justify-center mb-8">
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

        {/* Tools Grid/List */}
        <div className={`
          ${viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
            : 'flex flex-col gap-3'
          }
        `}>
          {filteredTools.map((tool, index) => {
            const availableSlots = getAvailableSlots(tool);
            const isAvailable = hasAvailableSlots(tool);
            const isHovered = hoveredTool === tool.id;

            return (
              <Card
                key={tool.id}
                className={`
                  group relative overflow-hidden cursor-pointer transition-all duration-300
                  ${viewMode === 'grid' ? 'rounded-2xl' : 'rounded-xl'}
                  ${isHovered ? 'scale-[1.02] shadow-2xl shadow-primary/10' : ''}
                  ${tool.popular ? 'ring-2 ring-primary/30' : ''}
                  ${!isAvailable ? 'opacity-60' : ''}
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                onClick={() => isAvailable && onToolSelect(tool)}
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-5`} />
                <div className="absolute inset-0 backdrop-blur-xl bg-white/5" />
                
                {/* Border */}
                <div className={`absolute inset-0 rounded-2xl border ${isHovered ? 'border-primary/40' : 'border-white/10'} transition-colors`} />

                {/* Popular Badge */}
                {tool.popular && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="bg-gradient-to-r from-primary to-brand-green text-white border-0">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  </div>
                )}

                <CardContent className={`relative ${viewMode === 'grid' ? 'p-5' : 'p-4'}`}>
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      {/* Image or Icon */}
                      {tool.image ? (
                        <div className="mb-4">
                          <img 
                            src={tool.image} 
                            alt={tool.name}
                            className="w-full h-32 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div 
                          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
                          style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.gradient.split(' ')[0].replace('from-', '')})` }}
                        >
                          <span className="text-white text-xl">
                            {iconMap[tool.icon]}
                          </span>
                        </div>
                      )}

                      {/* Title & Description */}
                      <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {tool.shortDescription}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-3">
                        <Star className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                        <span className="text-sm font-medium">{tool.rating}</span>
                        <span className="text-xs text-muted-foreground">({tool.reviewCount})</span>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {tool.features.slice(0, 2).map((feature, i) => (
                          <Badge key={i} variant="secondary" className="text-xs bg-white/10 border-0">
                            {feature}
                          </Badge>
                        ))}
                        {tool.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{tool.features.length - 2}
                          </Badge>
                        )}
                      </div>

                      {/* Price & Action */}
                      <div className="flex justify-between items-center pt-3 border-t border-white/10">
                        <div>
                          <span className="text-2xl font-black text-primary">
                            {formatCurrency(getPriceForLevel(tool, currency), currency)}
                          </span>
                          <span className="text-sm text-muted-foreground">/hora</span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground mb-1">
                            {availableSlots} slots
                          </div>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green"
                            disabled={!isAvailable}
                          >
                            {isAvailable ? 'Alugar' : 'Esgotado'}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // List View
                    <div className="flex items-center gap-4">
                      {/* Image or Icon */}
                      {tool.image ? (
                        <div className="flex-shrink-0">
                          <img 
                            src={tool.image} 
                            alt={tool.name}
                            className="w-20 h-16 object-cover rounded-xl shadow-lg"
                          />
                        </div>
                      ) : (
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                          style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.gradient.split(' ')[0].replace('from-', '')})` }}
                        >
                          <span className="text-white">
                            {iconMap[tool.icon]}
                          </span>
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {tool.name}
                          </h3>
                          {tool.popular && (
                            <Star className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {tool.shortDescription}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="hidden sm:flex items-center gap-1">
                        <Star className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
                        <span className="text-sm font-medium">{tool.rating}</span>
                      </div>

                      {/* Slots */}
                      <div className="hidden md:block text-center">
                        <span className="text-sm text-muted-foreground">{availableSlots} slots</span>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-xl font-black text-primary">
                          {formatCurrency(getPriceForLevel(tool, currency), currency)}
                        </span>
                        <span className="text-xs text-muted-foreground block">/hora</span>
                      </div>

                      {/* Action */}
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green"
                        disabled={!isAvailable}
                      >
                        {isAvailable ? 'Alugar' : 'Esgotado'}
                      </Button>
                    </div>
                  )}
                </CardContent>

                {/* Hover Glow */}
                {isHovered && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-brand-green/5" />
                  </div>
                )}
              </Card>
            );
          })}
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
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={() => {}}
            className="gap-2 rounded-2xl bg-white/5 border-white/10 backdrop-blur-xl"
          >
            {currency === 'USD' ? <DollarSign className="w-4 h-4" /> : <Coins className="w-4 h-4" />}
            {currency} - Clique para alternar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GSMToolsShowcase;
