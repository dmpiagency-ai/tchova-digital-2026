import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAICredits } from '@/contexts/AICreditsContext';
import { useAuth } from '@/contexts/AuthContext';
import { MOZAMBICAN_AI_TEMPLATES, getTemplatesByCategory, processPrompt } from '@/config/aiTemplates';
import {
  Sparkles,
  Image,
  Type,
  Palette,
  Upload,
  Download,
  CreditCard,
  Zap,
  Wand2,
  FileImage,
  Edit3,
  Settings,
  ArrowRight,
  ArrowLeft,
  Search,
  Filter,
  Star,
  CheckCircle2,
  Clock,
  Heart,
  Layers,
  Box,
  RefreshCw,
  Sliders
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  cost: number;
  category: 'generation' | 'editing' | 'enhancement';
  featured?: boolean;
  popularity?: number;
}

const AI_TOOLS: AITool[] = [
  // Geração
  {
    id: 'logo-generator',
    name: 'Gerador de Logos',
    description: 'Crie logos profissionais com elementos locais',
    icon: <Palette className="w-6 h-6" />,
    cost: 50,
    category: 'generation',
    featured: true,
    popularity: 95
  },
  {
    id: 'post-generator',
    name: 'Gerador de Posts',
    description: 'Gere posts para redes sociais com linguagem jovem',
    icon: <Type className="w-6 h-6" />,
    cost: 30,
    category: 'generation',
    featured: true,
    popularity: 92
  },
  {
    id: 'banner-generator',
    name: 'Gerador de Banners',
    description: 'Crie banners impactantes para fachadas e anúncios',
    icon: <FileImage className="w-6 h-6" />,
    cost: 40,
    category: 'generation',
    popularity: 88
  },
  {
    id: 'cartaz-generator',
    name: 'Gerador de Cartazes',
    description: 'Cartazes profissionais para eventos e promoções',
    icon: <FileImage className="w-6 h-6" />,
    cost: 45,
    category: 'generation',
    popularity: 85
  },
  {
    id: 'podcast-cover-generator',
    name: 'Capa para Podcast',
    description: 'Capas atrativas para podcasts e áudios',
    icon: <Upload className="w-6 h-6" />,
    cost: 35,
    category: 'generation',
    popularity: 80
  },
  {
    id: 'video-thumbnail-generator',
    name: 'Thumbnail para Vídeo',
    description: 'Thumbnails que aumentam cliques e engajamento',
    icon: <Image className="w-6 h-6" />,
    cost: 30,
    category: 'generation',
    popularity: 87
  },
  // Edição
  {
    id: 'image-editor',
    name: 'Editor de Imagens',
    description: 'Edite e personalize imagens com IA',
    icon: <Edit3 className="w-6 h-6" />,
    cost: 25,
    category: 'editing',
    featured: true,
    popularity: 90
  },
  {
    id: 'text-overlay',
    name: 'Sobreposição de Texto',
    description: 'Adicione textos estilizados às suas imagens',
    icon: <Type className="w-6 h-6" />,
    cost: 20,
    category: 'editing',
    popularity: 82
  },
  // Aprimoramento
  {
    id: 'upscale',
    name: 'Aumentar Resolução',
    description: 'Melhore a qualidade e resolução de imagens',
    icon: <Zap className="w-6 h-6" />,
    cost: 35,
    category: 'enhancement',
    popularity: 89
  },
  {
    id: 'color-enhance',
    name: 'Otimização de Cores',
    description: 'Melhore cores e contraste automaticamente',
    icon: <Wand2 className="w-6 h-6" />,
    cost: 15,
    category: 'enhancement',
    popularity: 84
  },
  {
    id: 'background-removal',
    name: 'Remoção de Fundo',
    description: 'Remova fundos de imagens automaticamente',
    icon: <Wand2 className="w-6 h-6" />,
    cost: 25,
    category: 'enhancement',
    popularity: 86
  },
  {
    id: 'face-enhance',
    name: 'Aprimoramento Facial',
    description: 'Melhore qualidade de fotos de rostos',
    icon: <Wand2 className="w-6 h-6" />,
    cost: 30,
    category: 'enhancement',
    popularity: 83
  }
];

interface AIToolsDashboardProps {
  onClose?: () => void;
}

export const AIToolsDashboard: React.FC<AIToolsDashboardProps> = ({ onClose }) => {
  const { credits, deductCredits, hasEnoughCredits } = useAICredits();
  const { user } = useAuth();
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('templates');

  const handleToolSelect = (tool: AITool) => {
    if (!hasEnoughCredits(tool.cost)) {
      // Show a modern alert instead of alert()
      return;
    }
    setSelectedTool(tool);
    setTemplateVariables({});
    setGeneratedResult(null);
  };

  const handleGenerate = async () => {
    if (!selectedTool) return;

    setIsGenerating(true);

    // Verificar se é um template
    const template = MOZAMBICAN_AI_TEMPLATES.find(t => t.id === selectedTool.id);
    let prompt = '';

    if (template) {
      // Usar template com variáveis preenchidas
      prompt = processPrompt(template, templateVariables);
    } else {
      // Usar prompt personalizado (simulado)
      prompt = `Gerar ${selectedTool.name.toLowerCase()} baseado na descrição fornecida`;
    }

    // Simular geração com IA (em produção, seria chamada para API)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Deduzir créditos
    const success = deductCredits(selectedTool.cost, selectedTool.id, `Geração com ${selectedTool.name}`);

    if (success) {
      // Simular resultado baseado no template
      let resultMessage = `Resultado gerado com ${selectedTool.name}`;
      if (template) {
        resultMessage += ` usando template "${template.name}"`;
      }
      resultMessage += ` - ${new Date().toLocaleString()}`;

      setGeneratedResult(resultMessage);
    }

    setIsGenerating(false);
  };

  const toolsByCategory = AI_TOOLS.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, AITool[]>);

  const filteredTemplates = MOZAMBICAN_AI_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = AI_TOOLS.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categoryNames: Record<string, string> = {
    templates: 'Templates Prontos para Vender',
    generation: 'Geração',
    editing: 'Edição',
    enhancement: 'Aprimoramento'
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header com efeito glass */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-10 lg:p-12 text-center space-y-6 animate-fade-up">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 animate-pulse-glow"></div>
        <div className="relative z-10 flex items-center justify-center space-x-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-primary to-primary-light rounded-2xl animate-glow shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text">Ferramentas de IA</h1>
        </div>
        <p className="text-muted-foreground max-w-3xl mx-auto text-sm sm:text-base lg:text-lg px-4 relative z-10 leading-relaxed">
          Use inteligência artificial para criar conteúdo profissional rapidamente.
          Cada ferramenta consome créditos que você pode recarregar a qualquer momento.
          Templates prontos para vender, geração de conteúdo, edição e aprimoramento de imagens em um só lugar!
        </p>

        {/* Saldo de Créditos com efeito premium */}
        <div className="max-w-md mx-auto relative z-10">
          <Card className="bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-2xl shadow-2xl backdrop-blur-xl">
            <CardContent className="pt-6 px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground font-medium">
                      <span className="hidden sm:inline">Créditos Disponíveis</span>
                      <span className="sm:hidden">Créditos</span>
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {credits.balance} MZN
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-lg font-bold px-4 py-2 bg-gradient-to-r from-primary to-accent text-white">
                  ✔ Ativo
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between glass-card p-4 rounded-2xl animate-fade-up">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar ferramentas ou templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtro</span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
              {filteredTools.length + filteredTemplates.length} resultados
            </Badge>
          </div>
        </div>
      </div>

      {/* Ferramentas por Categoria com Tabs Modernos */}
      <div className="space-y-6">
        <Tabs 
          defaultValue="templates" 
          className="w-full"
          onValueChange={setActiveCategory}
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2 bg-gradient-to-r from-primary/10 to-accent/10 p-2 rounded-2xl">
            <TabsTrigger 
              value="templates" 
              className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all duration-300 hover:bg-white/20"
            >
              <span className="hidden sm:inline">Templates Prontos para Vender</span>
              <span className="sm:hidden">Templates</span>
            </TabsTrigger>
            <TabsTrigger 
              value="generation" 
              className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all duration-300 hover:bg-white/20"
            >
              Geração
            </TabsTrigger>
            <TabsTrigger 
              value="editing" 
              className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all duration-300 hover:bg-white/20"
            >
              Edição
            </TabsTrigger>
            <TabsTrigger 
              value="enhancement" 
              className="text-sm sm:text-base px-3 sm:px-4 py-2 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-white transition-all duration-300 hover:bg-white/20"
            >
              <span className="hidden sm:inline">Aprimoramento</span>
              <span className="sm:hidden">Aprimorar</span>
            </TabsTrigger>
          </TabsList>

          {/* Templates Prontos para Vender */}
          <TabsContent value="templates" className="space-y-6 pt-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold gradient-text">Templates Prontos para Vender</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Templates otimizados para converter visitantes em clientes. Linguagem jovem e elementos locais incluídos.
              </p>
              {searchQuery && (
                <p className="text-sm text-primary mt-2">
                  Encontrados {filteredTemplates.length} resultados para "{searchQuery}"
                </p>
              )}
            </div>

            {/* Templates por categoria */}
            <div className="space-y-8">
              {['logos', 'posts', 'banners', 'cartazes', 'audios', 'videos'].map(category => {
                const templates = getTemplatesByCategory(category).filter(template => 
                  template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  template.description.toLowerCase().includes(searchQuery.toLowerCase())
                );
                if (templates.length === 0) return null;

                return (
                  <div key={category} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-bold capitalize">{category}</h4>
                      <Badge variant="secondary" className="text-sm">
                        {templates.length} template{templates.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {templates.map((template, index) => (
                        <Card 
                          key={template.id} 
                          className="hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl shadow-lg hover:scale-105 transform hover:-translate-y-1 card-hover"
                          onClick={() => handleToolSelect({
                            id: template.id,
                            name: template.name,
                            description: template.description,
                            icon: <Sparkles className="w-5 h-5" />,
                            cost: 25,
                            category: 'generation'
                          })}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-base sm:text-lg font-bold">{template.name}</CardTitle>
                                <CardDescription className="text-sm text-muted-foreground">{template.description}</CardDescription>
                              </div>
                              <div className="flex flex-col gap-1 ml-2">
                                <Badge variant="secondary" className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                  ✔ Local
                                </Badge>
                                <Badge variant="secondary" className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                  ✔ Jovem
                                </Badge>
                                <Badge variant="secondary" className="text-xs px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                  ✔ WhatsApp
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  {template.variables.length} variável{template.variables.length !== 1 ? 'is' : ''}
                                </span>
                                <Badge variant="outline" className="text-xs font-bold">25 MZN</Badge>
                              </div>
                              <Button
                                size="sm"
                                className="w-full h-11 text-sm premium-button"
                              >
                                <span className="hidden sm:inline">Usar Template (25 MZN)</span>
                                <span className="sm:hidden">Usar (25 MZN)</span>
                              </Button>
                              <p className="text-xs text-muted-foreground text-center">
                                Menos que um pacote de dados diário
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Quick Template Selector */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Templates Mais Usados
                </h4>
                <Badge variant="secondary" className="text-sm">
                  +100 Vendas
                </Badge>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {MOZAMBICAN_AI_TEMPLATES.slice(0, 4).map(template => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="flex flex-col items-center justify-center py-3 h-24 text-center border-primary/20 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                    onClick={() => handleToolSelect({
                      id: template.id,
                      name: template.name,
                      description: template.description,
                      icon: <Sparkles className="w-4 h-4" />,
                      cost: 25,
                      category: 'generation'
                    })}
                  >
                    <Sparkles className="w-5 h-5 text-primary mb-2" />
                    <span className="text-xs font-medium">{template.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Prova Social */}
            <div className="text-center py-8 border-t border-border/50">
              <div className="flex items-center justify-center space-x-4 mb-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                      {i}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Mais de 100 designs criados para negócios locais
                </div>
              </div>
              <div className="flex items-center justify-center space-x-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm text-muted-foreground ml-2">(4.9/5)</span>
              </div>
            </div>
          </TabsContent>

          {Object.entries(toolsByCategory).map(([category, tools]) => (
            <TabsContent key={category} value={category} className="space-y-6 pt-6">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold gradient-text">{categoryNames[category]}</h3>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Ferramentas avançadas de {categoryNames[category].toLowerCase()} para criar conteúdo profissional em segundos
                </p>
                {searchQuery && (
                  <p className="text-sm text-primary mt-2">
                    Encontrados {filteredTools.filter(t => t.category === category).length} resultados para "{searchQuery}"
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.filter(tool => 
                  tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  tool.description.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((tool, index) => (
                  <Card 
                    key={tool.id} 
                    className="hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl shadow-lg hover:scale-105 transform hover:-translate-y-1 card-hover"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-xl ${tool.featured ? 'bg-gradient-to-br from-primary to-accent text-white' : 'bg-primary/10 text-primary'}`}>
                            {tool.icon}
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg font-bold">{tool.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              {tool.featured && (
                                <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                                  Destacado
                                </Badge>
                              )}
                              <Badge variant="outline" className="text-xs">{tool.cost} MZN</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground mt-2">
                        {tool.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            30s avg
                          </span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{(tool.popularity || 80)/10}</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleToolSelect(tool)}
                          className="w-full h-11 premium-button"
                          disabled={!hasEnoughCredits(tool.cost)}
                        >
                          {hasEnoughCredits(tool.cost) ? (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              Usar Ferramenta
                            </>
                          ) : (
                            'Créditos Insuficientes'
                          )}
                        </Button>
                        {hasEnoughCredits(tool.cost) && (
                          <p className="text-xs text-muted-foreground text-center">
                            {tool.cost === 50 && 'Menos que um pacote de dados diário'}
                            {tool.cost === 45 && 'Preço de um lanche completo'}
                            {tool.cost === 40 && 'Valor de uma refeição em restaurante'}
                            {tool.cost === 35 && 'Custo de um bilhete de cinema'}
                            {tool.cost === 30 && 'Preço de um café na cidade'}
                            {tool.cost === 25 && 'Valor de uma chamada de táxi curta'}
                            {tool.cost === 20 && 'Preço de uma água mineral'}
                            {tool.cost === 15 && 'Valor de um bilhete de autocarro'}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Modal de Ferramenta Selecionada com Design Moderno */}
      <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl backdrop-blur-xl custom-scrollbar">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center space-x-3 text-2xl">
              <div className="p-2 bg-gradient-to-br from-primary to-accent text-white rounded-xl">
                {selectedTool?.icon}
              </div>
              <span>{selectedTool?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {selectedTool?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Inputs baseados na ferramenta ou template */}
            {(() => {
              const template = MOZAMBICAN_AI_TEMPLATES.find(t => t.id === selectedTool?.id);
              if (template) {
                // É um template - mostrar campos das variáveis
                return (
                  <div className="space-y-4">
                    {template.variables.map(variable => (
                      <div key={variable} className="space-y-2">
                        <Label htmlFor={variable} className="capitalize text-sm font-medium">
                          {variable.replace('_', ' ')}
                        </Label>
                        <Input
                          id={variable}
                          placeholder={`Ex: ${template.examples[Math.floor(Math.random() * template.examples.length)]}`}
                          value={templateVariables[variable] || ''}
                          onChange={(e) => setTemplateVariables(prev => ({
                            ...prev,
                            [variable]: e.target.value
                          }))}
                          className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    ))}
                  </div>
                );
              }

              // Ferramentas normais
              if (selectedTool?.id === 'logo-generator') {
                return (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="business-name" className="text-sm font-medium">Nome do Negócio</Label>
                      <Input id="business-name" placeholder="Ex: Tchova Digital" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business-type" className="text-sm font-medium">Tipo de Negócio</Label>
                      <Input id="business-type" placeholder="Ex: Tecnologia, Alimentação, etc." className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="style" className="text-sm font-medium">Estilo Preferido</Label>
                      <Input id="style" placeholder="Ex: Moderno, Clássico, Criativo" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                );
              }

              if (selectedTool?.id === 'post-generator') {
                return (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="post-theme" className="text-sm font-medium">Tema do Post</Label>
                      <Input id="post-theme" placeholder="Ex: Promoção, Anúncio de produto" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-audience" className="text-sm font-medium">Público-Alvo</Label>
                      <Input id="target-audience" placeholder="Ex: Jovens, Empresários" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform" className="text-sm font-medium">Plataforma</Label>
                      <Input id="platform" placeholder="Ex: Instagram, Facebook" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                );
              }

              if (selectedTool?.id === 'image-editor') {
                return (
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start space-x-3">
                        <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-blue-800 dark:text-blue-200 text-lg">Editor de Imagens IA</h5>
                          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                            Edite suas imagens com ferramentas profissionais: ajuste de brilho, contraste, saturação, desfoque e muito mais.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="image-upload" className="text-sm font-medium flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload de Imagem
                          </Label>
                          <div className="relative">
                            <Input 
                              id="image-upload" 
                              type="file" 
                              accept="image/*" 
                              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground">Suporta JPG, PNG, WEBP até 10MB</p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="batch-process" className="text-sm font-medium flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            Processamento em Massa
                          </Label>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Processar múltiplas imagens</span>
                            <Badge variant="secondary" className="text-xs">
                              Premium
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Processamento paralelo para até 20 imagens</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-description" className="text-sm font-medium flex items-center gap-2">
                            <Settings className="w-4 h-4" />
                            Descrição das Edições
                          </Label>
                          <Textarea
                            id="edit-description"
                            placeholder="Descreva as edições desejadas (ex: 'Aumentar brilho em 20%, contraste em 15%, saturação em 10%')..."
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="enhancement-type" className="text-sm font-medium flex items-center gap-2">
                            <Wand2 className="w-4 h-4" />
                            Tipo de Aprimoramento
                          </Label>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="text-sm">
                              Basic
                            </Button>
                            <Button variant="outline" className="text-sm">
                              Advanced
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                      <div className="flex items-start space-x-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-green-800 dark:text-green-200">IA Automatica</h5>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                            Nossa IA analisará automaticamente sua imagem e aplicará os ajustes óptimos para melhor qualidade!
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quick Edit Presets */}
                    <div className="space-y-4">
                      <h5 className="text-sm font-semibold flex items-center gap-2">
                        <Zap className="w-4 h-4 text-primary" />
                        Presets Rápidos
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Button variant="outline" className="text-xs h-10">
                          ✨ Auto Ajustar
                        </Button>
                        <Button variant="outline" className="text-xs h-10">
                          📷 Clarificar
                        </Button>
                        <Button variant="outline" className="text-xs h-10">
                          🎨 Vibrante
                        </Button>
                        <Button variant="outline" className="text-xs h-10">
                          🎯 Focar
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              }

              if (selectedTool?.id === 'background-removal') {
                return (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="background-upload" className="text-sm font-medium">Upload de Imagem</Label>
                      <Input id="background-upload" type="file" accept="image/*" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                );
              }

              if (selectedTool?.id === 'face-enhance') {
                return (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="face-upload" className="text-sm font-medium">Upload de Foto</Label>
                      <Input id="face-upload" type="file" accept="image/*" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                );
              }

              if (selectedTool?.id === 'podcast-cover-generator') {
                return (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="podcast-name" className="text-sm font-medium">Nome do Podcast</Label>
                      <Input id="podcast-name" placeholder="Ex: Vozes de Moçambique" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="podcast-topic" className="text-sm font-medium">Tema Principal</Label>
                      <Input id="podcast-topic" placeholder="Ex: Cultura, Tecnologia, Negócios" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                );
              }

              if (selectedTool?.id === 'video-thumbnail-generator') {
                return (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="video-topic" className="text-sm font-medium">Tema do Vídeo</Label>
                      <Input id="video-topic" placeholder="Ex: 10 Dicas para Negócios" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                );
              }

              // Default para outras ferramentas
              return (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">Descrição do que você quer gerar</Label>
                    <Textarea
                      id="description"
                      placeholder="Descreva detalhadamente o que você quer criar..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/30 border border-white/30 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              );
            })()}

            {/* Botão de Geração com Efeito Premium */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-border/50 gap-4 sm:gap-0">
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Custo: {selectedTool?.cost} MZN créditos
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full sm:w-auto sm:min-w-40 h-12 premium-button text-base font-semibold"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="hidden sm:inline">Gerando...</span>
                    <span className="sm:hidden">Gerando</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Gerar
                  </>
                )}
              </Button>
            </div>

            {/* Resultado com Design Moderno */}
            {generatedResult && (
              <div className="p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-800 animate-fade-up">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-800 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-green-800 dark:text-green-200 mb-2 text-lg">
                      ✅ Resultado Gerado com Sucesso!
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-4">
                      {generatedResult}
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="bg-white/50 dark:bg-black/30">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Resultado
                      </Button>
                      <Button variant="outline" size="sm" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Gerar Nova Versão
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Loading State */}
            {isGenerating && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-center space-x-4 py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <div className="text-center">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Gerando Resultado...
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Nossa IA está criando algo incrível para você!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer Actions com Efeito Glass */}
      <div className="flex justify-end space-x-4 pt-8 border-t border-border/50">
        <Button variant="outline" onClick={onClose} className="px-6 py-3 text-primary hover:bg-primary/10 rounded-xl transition-all duration-300 hover:shadow-lg">
          Fechar Dashboard
        </Button>
      </div>
    </div>
  );
};