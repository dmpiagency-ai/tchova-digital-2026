// ============================================
// TOOL CARD COMPONENT
// Individual tool card with glassmorphism styling
// ============================================

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Zap, 
  Timer, 
  Calculator, 
  Users, 
  Info,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { GSMTool, Currency, UserLevel, USER_LEVELS } from '@/types/gsm';
import { formatCurrency } from '@/services/gsmRentalService';
import { getAvailableSlots, hasAvailableSlots } from '@/config/gsmToolsConfig';

interface ToolCardProps {
  tool: GSMTool;
  userLevel: UserLevel;
  currency: Currency;
  onRent: (tool: GSMTool, duration: number) => void;
  onChecktool: (tool: GSMTool) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  userLevel,
  currency,
  onRent,
  onChecktool
}) => {
  const [duration, setDuration] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  
  const availableSlots = getAvailableSlots(tool);
  const isAvailable = hasAvailableSlots(tool);
  
  // Get price for user level
  const hourlyPrice = currency === 'USD' ? tool.pricing[userLevel].usd : tool.pricing[userLevel].mtn;
  const totalPrice = hourlyPrice * duration;
  
  // Calculate discount for longer durations
  const discount = duration >= 8 ? 10 : duration >= 4 ? 5 : 0;
  const discountedPrice = totalPrice * (1 - discount / 100);
  
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
      `}
      style={{ 
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px) saturate(180%)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} opacity-10`} />
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/[0.02]" />
      
      {/* Glass Border */}
      <div className={`absolute inset-0 rounded-[48px] border-2 ${isHovered ? 'border-primary/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-white/10'} transition-all duration-300`} />

      {/* Status Indicators */}
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
        {/* Image */}
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
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 mt-2 shadow-lg"
            style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.color}80)` }}
          >
            <Zap className="w-7 h-7 text-white" />
          </div>
        )}

        {/* Title */}
        <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {tool.name}
        </h3>

        {/* Features */}
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

        {/* Duration Selector */}
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
          
          {/* Quick Options */}
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

        {/* Price Calculator */}
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

        {/* Action Buttons */}
        <div className="flex gap-2">
          {(tool.requires_imei || tool.requires_serial) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onChecktool(tool)}
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
            onClick={() => isAvailable && onRent(tool, duration)}
          >
            <Zap className="w-4 h-4 mr-1.5" />
            {isAvailable ? 'Alugar' : 'Esgotado'}
          </Button>
        </div>
      </CardContent>

      {/* Hover Glow */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none rounded-[48px]">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-brand-green/10 animate-pulse" />
        </div>
      )}
    </Card>
  );
};

export default ToolCard;
