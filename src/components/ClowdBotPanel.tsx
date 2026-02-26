/**
 * ============================================
 * CLOWDBOT - AI-POWERED ADMIN PANEL
 * ============================================
 * Painel administrativo inteligente com assistente AI
 * O "cérebro" da TchovaDigital
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  TrendingUp,
  Users,
  DollarSign,
  ShoppingCart,
  RefreshCw,
  Settings,
  BarChart3,
  Zap,
  Brain,
  Lightbulb,
  Target,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
import { aiAgent } from '@/api';
import { trackEvent } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// ============================================
// TYPES
// ============================================

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: SuggestedAction[];
}

interface SuggestedAction {
  id: string;
  label: string;
  action: () => void;
}

interface DashboardMetric {
  label: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  color: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  createdAt: Date;
}

// ============================================
// CLOWDBOT CHAT COMPONENT
// ============================================

interface ClowdBotChatProps {
  onAction?: (action: string, data?: unknown) => void;
  className?: string;
}

export const ClowdBotChat: React.FC<ClowdBotChatProps> = ({ 
  onAction,
  className 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial greeting
  useEffect(() => {
    const greeting: Message = {
      id: '1',
      role: 'assistant',
      content: `Olá! Sou o **ClowdBot**, o assistente inteligente da TchovaDigital! 🤖

Posso ajudá-lo com:
- 📊 **Análise de dados** - Ver métricas e relatórios
- 👥 **Gestão de leads** - Ver e qualificar novos leads
- 💰 **Pagamentos** - Status de transações
- 🎯 **Sugestões** - Otimizações para o negócio
- 📝 **Relatórios** - Gerar relatórios automáticos

O que gostaria de fazer hoje?`,
      timestamp: new Date(),
      actions: [
        { id: 'metrics', label: '📊 Ver métricas', action: () => handleQuickAction('metrics') },
        { id: 'leads', label: '👥 Novos leads', action: () => handleQuickAction('leads') },
        { id: 'suggestions', label: '💡 Sugestões', action: () => handleQuickAction('suggestions') }
      ]
    };
    setMessages([greeting]);
  }, []);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleQuickAction = async (action: string) => {
    const actionMessages: Record<string, string> = {
      metrics: 'Mostre-me as métricas de hoje',
      leads: 'Quais são os novos leads?',
      suggestions: 'Dê-me sugestões para melhorar o negócio',
      payments: 'Qual o status dos pagamentos?'
    };

    setInput(actionMessages[action] || action);
    await handleSend(actionMessages[action] || action);
  };

  const handleSend = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Track event
    trackEvent({ name: 'clowdbot_message', category: 'ai', label: text });

    try {
      // Get AI response
      const response = await aiAgent.generate(text);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data?.content || 'Desculpe, não consegui processar sua solicitação.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Text-to-speech if enabled
      if (isSpeaking && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(assistantMessage.content);
        utterance.lang = 'pt-MZ';
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: '⚠️ Erro ao processar mensagem. Por favor, tente novamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Reconhecimento de voz não suportado neste navegador');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    // TypeScript types for WebKit Speech Recognition
    interface SpeechRecognitionEvent extends Event {
      results: SpeechRecognitionResultList;
    }

    interface SpeechRecognitionResultList {
      readonly length: number;
      item(index: number): SpeechRecognitionResult;
      [index: number]: SpeechRecognitionResult;
    }

    interface SpeechRecognitionResult {
      readonly length: number;
      item(index: number): SpeechRecognitionAlternative;
      readonly isFinal: boolean;
      [index: number]: SpeechRecognitionAlternative;
    }

    interface SpeechRecognitionAlternative {
      readonly transcript: string;
      readonly confidence: number;
    }

    interface WebKitSpeechRecognition extends EventTarget {
      lang: string;
      continuous: boolean;
      onstart: (() => void) | null;
      onend: (() => void) | null;
      onresult: ((event: SpeechRecognitionEvent) => void) | null;
      start(): void;
      stop(): void;
      abort(): void;
    }

    const SpeechRecognitionClass = (window as Window & { webkitSpeechRecognition: new () => WebKitSpeechRecognition }).webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    recognition.lang = 'pt-MZ';
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  return (
    <Card className={cn('flex flex-col h-full bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700', className)}>
      {/* Header */}
      <CardHeader className="border-b border-slate-700 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900" />
            </div>
            <div>
              <CardTitle className="text-white text-lg">ClowdBot</CardTitle>
              <p className="text-xs text-slate-400">Assistente Inteligente</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSpeaking(!isSpeaking)}
              className="text-slate-400 hover:text-white"
            >
              {isSpeaking ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role !== 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-2.5',
                    message.role === 'user'
                      ? 'bg-violet-600 text-white'
                      : message.role === 'system'
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                      : 'bg-slate-700 text-slate-100'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-50 mt-1">
                    {message.timestamp.toLocaleTimeString('pt-MZ', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  
                  {/* Suggested Actions */}
                  {message.actions && message.actions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.actions.map((action) => (
                        <Button
                          key={action.id}
                          variant="outline"
                          size="sm"
                          onClick={action.action}
                          className="bg-slate-600/50 border-slate-500 text-slate-200 hover:bg-slate-600"
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-700 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoiceInput}
            className={cn(
              'text-slate-400 hover:text-white',
              isListening && 'text-red-400 animate-pulse'
            )}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </Button>
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            disabled={isLoading}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

// ============================================
// DASHBOARD METRICS COMPONENT
// ============================================

interface DashboardMetricsProps {
  className?: string;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ className }) => {
  const metrics: DashboardMetric[] = [
    {
      label: 'Receita Hoje',
      value: '45.230 MZN',
      change: 12.5,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'text-green-400'
    },
    {
      label: 'Novos Leads',
      value: 23,
      change: 8.3,
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-400'
    },
    {
      label: 'Conversões',
      value: 8,
      change: -2.1,
      icon: <Target className="w-5 h-5" />,
      color: 'text-violet-400'
    },
    {
      label: 'Taxa de Conversão',
      value: '34.8%',
      change: 5.2,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'text-amber-400'
    }
  ];

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4', className)}>
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className={cn('p-2 rounded-lg bg-slate-700/50', metric.color)}>
                  {metric.icon}
                </div>
                {metric.change !== undefined && (
                  <Badge
                    variant="outline"
                    className={cn(
                      metric.change >= 0 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border-red-500/30'
                    )}
                  >
                    {metric.change >= 0 ? '+' : ''}{metric.change}%
                  </Badge>
                )}
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-white">{metric.value}</p>
                <p className="text-sm text-slate-400">{metric.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// ============================================
// LEADS TABLE COMPONENT
// ============================================

interface LeadsTableProps {
  className?: string;
}

export const LeadsTable: React.FC<LeadsTableProps> = ({ className }) => {
  const [leads, setLeads] = useState<Lead[]>([
    { id: '1', name: 'João Silva', email: 'joao@email.com', phone: '841234567', service: 'Website', status: 'new', createdAt: new Date() },
    { id: '2', name: 'Maria Santos', email: 'maria@email.com', phone: '827654321', service: 'Design Gráfico', status: 'contacted', createdAt: new Date() },
    { id: '3', name: 'Pedro Machava', email: 'pedro@email.com', phone: '847891234', service: 'Marketing Digital', status: 'new', createdAt: new Date() },
    { id: '4', name: 'Ana Nhantumbo', email: 'ana@email.com', phone: '861234567', service: 'GSM', status: 'converted', createdAt: new Date() },
  ]);

  const statusColors: Record<Lead['status'], string> = {
    new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    contacted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    converted: 'bg-green-500/20 text-green-400 border-green-500/30',
    lost: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const statusLabels: Record<Lead['status'], string> = {
    new: 'Novo',
    contacted: 'Contactado',
    converted: 'Convertido',
    lost: 'Perdido'
  };

  return (
    <Card className={cn('bg-slate-800/50 border-slate-700', className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-400" />
          Leads Recentes
        </CardTitle>
        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
          Ver todos
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-medium">{lead.name}</p>
                  <p className="text-sm text-slate-400">{lead.service}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className={statusColors[lead.status]}>
                  {statusLabels[lead.status]}
                </Badge>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// AI SUGGESTIONS COMPONENT
// ============================================

interface AISuggestionsProps {
  className?: string;
}

export const AISuggestions: React.FC<AISuggestionsProps> = ({ className }) => {
  const suggestions = [
    {
      id: '1',
      title: 'Aumentar conversão de leads',
      description: '3 leads não foram contactados há mais de 24h. Entre em contacto agora.',
      priority: 'high',
      action: 'Contactar leads'
    },
    {
      id: '2',
      title: 'Oportunidade de upsell',
      description: 'João Silva mostrou interesse em Marketing Digital. Ofereça pacote combo.',
      priority: 'medium',
      action: 'Ver perfil'
    },
    {
      id: '3',
      title: 'Pagamento pendente',
      description: 'Maria Santos tem um pagamento de 5.000 MZN pendente há 3 dias.',
      priority: 'high',
      action: 'Enviar lembrete'
    }
  ];

  const priorityColors: Record<string, string> = {
    high: 'bg-red-500/20 text-red-400 border-red-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  };

  return (
    <Card className={cn('bg-slate-800/50 border-slate-700', className)}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          Sugestões do ClowdBot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className="p-3 rounded-lg bg-slate-700/30 border border-slate-600/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium">{suggestion.title}</h4>
                    <Badge variant="outline" className={priorityColors[suggestion.priority]}>
                      {suggestion.priority === 'high' ? 'Urgente' : suggestion.priority === 'medium' ? 'Médio' : 'Baixo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">{suggestion.description}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-violet-500/50 text-violet-400 hover:bg-violet-500/20"
              >
                <Zap className="w-3 h-3 mr-1" />
                {suggestion.action}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================
// MAIN ADMIN PANEL
// ============================================

export const ClowdBotPanel: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize AI agent
    const init = async () => {
      if (aiAgent.isConfigured()) {
        console.log('ClowdBot initialized with provider:', aiAgent.getProvider());
      } else {
        console.log('ClowdBot running in demo mode');
      }
      setIsInitialized(true);
    };
    init();
  }, []);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-slate-400">Inicializando ClowdBot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-8 h-8 text-violet-400" />
            ClowdBot Admin
          </h1>
          <p className="text-slate-400">Painel administrativo inteligente</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <DashboardMetrics className="mb-6" />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Leads & Suggestions */}
        <div className="lg:col-span-2 space-y-6">
          <LeadsTable />
          <AISuggestions />
        </div>

        {/* Right Column - ClowdBot Chat */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <ClowdBotChat className="h-[600px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClowdBotPanel;