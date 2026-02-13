// Single source of truth for all pricing and service data
import { Zap, Star, TrendingUp, Building, Crown } from 'lucide-react';
export interface Service {
   id: number;
   title: string;
   category: string;
   description: string;
   shortDescription: string;
   price: number;
   priceNote: string;
   features: string[];
   benefits: string[];
   deliveryTime: string;
   revisions: string;
   expertise: string;
   projects: string;
   rating: number;
   clients: number;
   tags: string[];
   image: string;
   isPopular?: boolean;
   isIndividuallyAvailable?: boolean;
   isAI?: boolean; // New field to distinguish AI vs Designer services
   aiPrompts?: string[]; // AI-specific prompts for Mozambique context
 }

export interface Plan {
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  borderColor: string;
  priceColor: string;
  buttonColor: string;
  buttonText: string;
  buttonAction: string;
  icon: React.ComponentType<any>;
  badge?: string;
  savings?: string;
}

// Individual Services Pricing (Reestruturados - Serviços Essenciais)
export const INDIVIDUAL_SERVICES: Service[] = [
  {
    id: 1,
    title: 'Identidade Visual Completa',
    category: 'Design Gráfico',
    description: 'Sistema completo de identidade visual profissional que inclui logo, paleta de cores, tipografia e aplicações práticas. Criamos uma marca forte e memorável que se destaca no mercado moçambicano.',
    shortDescription: 'Sistema completo de identidade visual profissional.',
    price: 4500,
    priceNote: 'Inclui 3 revisões e arquivos em todos os formatos',
    features: [
      'Logo profissional (3 conceitos)',
      'Manual da marca completo',
      'Paleta de cores otimizada',
      'Tipografia selecionada',
      'Aplicações básicas (cartão, papel timbrado)',
      'Arquivos em alta resolução',
      'Direitos de uso comercial',
      'Orientação de aplicação'
    ],
    benefits: [
      'Marca profissional e diferenciada',
      'Consistência visual em todos os materiais',
      'Reconhecimento instantâneo no mercado',
      'Valorização da empresa',
      'Materiais prontos para uso imediato',
      'Suporte para implementação'
    ],
    deliveryTime: '10-15 dias úteis',
    revisions: '3 revisões completas inclusas',
    expertise: '8+ anos de experiência',
    projects: '150+ identidades visuais criadas',
    rating: 4.9,
    clients: 150,
    tags: ['Branding', 'Logo', 'Identidade Visual', 'Manual da Marca'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true,
    isPopular: true,
    isAI: false
  },
  {
    id: 2,
    title: 'Website Profissional',
    category: 'Desenvolvimento Web',
    description: 'Website moderno e responsivo otimizado para conversão e experiência do usuário. Inclui integração com sistemas de pagamento locais e otimização para motores de busca.',
    shortDescription: 'Website profissional responsivo com otimização completa.',
    price: 6000,
    priceNote: 'Inclui hospedagem por 1 ano e domínio',
    features: [
      'Design responsivo (mobile-first)',
      'Até 15 páginas otimizadas',
      'Formulários de contato funcionais',
      'Integração com WhatsApp Business',
      'Otimização SEO básica',
      'Certificado SSL incluído',
      'Painel administrativo simples',
      'Suporte técnico por 6 meses'
    ],
    benefits: [
      'Presença digital profissional 24/7',
      'Melhor posicionamento no Google',
      'Experiência mobile otimizada',
      'Integração com ferramentas locais',
      'Fácil gestão de conteúdo',
      'Suporte técnico incluído'
    ],
    deliveryTime: '15-20 dias úteis',
    revisions: '2 revisões completas inclusas',
    expertise: '6+ anos de experiência',
    projects: '200+ websites entregues',
    rating: 4.8,
    clients: 200,
    tags: ['Website', 'Responsivo', 'SEO', 'Mobile-First'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png',
    isIndividuallyAvailable: true,
    isPopular: true,
    isAI: false
  },
  {
    id: 3,
    title: 'Marketing Digital Completo',
    category: 'Marketing Digital',
    description: 'Estratégia completa de marketing digital com foco em resultados mensuráveis. Inclui gestão de redes sociais, tráfego pago otimizado e relatórios detalhados de performance.',
    shortDescription: 'Marketing digital completo com resultados garantidos.',
    price: 4500,
    priceNote: 'Pacote mensal - mínimo 3 meses de compromisso',
    features: [
      'Gestão profissional de 2 redes sociais',
      '12 posts + stories por mês',
      'Campanha Facebook Ads (orçamento de 2.000 MZN)',
      'Otimização SEO básica do website',
      'Relatórios semanais de performance',
      'Consultoria mensal incluída',
      'Suporte via WhatsApp prioritário',
      'Estratégia personalizada'
    ],
    benefits: [
      'Aumento de seguidores e engajamento',
      'Tráfego qualificado para seu negócio',
      'ROI mensurável e transparente',
      'Presença digital consistente',
      'Relatórios detalhados de resultados',
      'Estratégia baseada em dados reais'
    ],
    deliveryTime: '7 dias úteis para início das campanhas',
    revisions: 'Otimização contínua incluída',
    expertise: '7+ anos de experiência',
    projects: '300+ campanhas de sucesso',
    rating: 4.9,
    clients: 300,
    tags: ['Marketing Digital', 'Redes Sociais', 'Tráfego Pago', 'ROI'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762747013/1762701812733_p93nsd.png',
    isIndividuallyAvailable: true,
    isPopular: true,
    isAI: false
  },
  {
    id: 4,
    title: 'Produção Audiovisual',
    category: 'Produção Audiovisual',
    description: 'Cobertura profissional completa de eventos com filmagem em alta definição, fotografia e edição premium. Pacotes estruturados para diferentes necessidades e orçamentos.',
    shortDescription: 'Cobertura completa de eventos com produção audiovisual profissional.',
    price: 15000,
    priceNote: 'Pacote completo - consulte pacotes específicos',
    features: [
      'Filmagem profissional em 4K',
      'Seção fotográfica completa',
      'Edição de vídeo com motion graphics',
      'Música e efeitos sonoros',
      '2 DVDs com todo o material',
      'Galeria online privada',
      'Entrega em até 15 dias',
      'Equipe profissional completa'
    ],
    benefits: [
      'Memórias profissionais do seu evento',
      'Qualidade cinematográfica',
      'Cobertura completa (pré-evento até final)',
      'Edição criativa e moderna',
      'Material para marketing futuro',
      'Galeria online para compartilhamento',
      'Suporte completo durante o evento'
    ],
    deliveryTime: '10-15 dias úteis após o evento',
    revisions: '1 revisão completa incluída',
    expertise: '8+ anos em produção audiovisual',
    projects: '200+ eventos cobertos',
    rating: 4.9,
    clients: 180,
    tags: ['Eventos', 'Filmagem', 'Fotografia', 'Edição'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755464/1762703721009_w7posw.png',
    isIndividuallyAvailable: true,
    isAI: false
  },
  {
    id: 5,
    title: 'IMPORTAÇÃO ASSISTIDA TCHOVADIGITAL',
    category: 'Importação',
    description: 'Este serviço funciona por consulta. Após análise e confirmação, o pagamento é realizado pela TchovaDigital e a importação é acompanhada num sistema privado até a chegada do produto. Serviço humano especializado de importação internacional.',
    shortDescription: 'Importação assistida com acompanhamento privado até a entrega.',
    price: 0,
    priceNote: 'Serviço por consulta - sem custos iniciais',
    features: [
      'ETAPA 1: Consulta - Cliente solicita análise do produto',
      'ETAPA 2: Análise - TchovaDigital analisa e valida fornecedor',
      'ETAPA 3: Proposta - Envia orçamento final em metical',
      'ETAPA 4: Confirmação - Cliente aceita proposta',
      'ETAPA 5: Ativação - Sistema de acompanhamento é ativado'
    ],
    benefits: [
      'Consulta gratuita sem compromisso',
      'Análise completa do produto e fornecedor',
      'Orçamento transparente em metical',
      'Sistema privado ativado apenas após pagamento confirmado',
      'Acompanhamento exclusivo por cliente',
      'Dados em tempo real: produto, quantidade, fornecedor',
      'Status do pedido com contagem regressiva',
      'Atualizações oficiais do agente TchovaDigital',
      'Histórico completo da importação',
      'Segurança total - importações externas não têm acesso'
    ],
    deliveryTime: '7-14 dias úteis no máximo',
    revisions: '2 revisões completas inclusas',
    expertise: '6+ anos em importação internacional',
    projects: '2000+ importações realizadas com sucesso',
    rating: 4.8,
    clients: 500,
    tags: ['Importação Assistida', 'China', 'Compras Internacionais', 'Seguro', 'Acompanhamento Privado', 'TchovaDigital'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png',
    isIndividuallyAvailable: true,
    isAI: false
  },
  {
    id: 6,
    title: 'Ferramentas GSM Profissionais',
    category: 'Assistência GSM',
    description: 'Acesso completo ao painel profissional de ferramentas GSM para desbloqueio, reparação e manutenção de dispositivos móveis. Mais de 500 ferramentas premium incluídas.',
    shortDescription: 'Acesso completo a ferramentas GSM premium para técnicos.',
    price: 1500,
    priceNote: 'Acesso mensal - primeiro mês grátis para novos usuários',
    features: [
      'Mais de 500 ferramentas GSM',
      'Desbloqueio remoto profissional',
      'Reparação IMEI legal',
      'Flashing e atualização de firmware',
      'Diagnóstico avançado',
      'Suporte técnico 24/7',
      'Atualizações constantes',
      'Interface profissional intuitiva'
    ],
    benefits: [
      'Ferramentas premium para reparações',
      'Taxa de sucesso superior a 99%',
      'Suporte técnico especializado',
      'Atualizações automáticas',
      'Interface intuitiva e profissional',
      'Acesso remoto seguro'
    ],
    deliveryTime: 'Acesso imediato após ativação',
    revisions: 'Suporte técnico contínuo incluído',
    expertise: '15+ anos em ferramentas GSM',
    projects: '100000+ dispositivos atendidos',
    rating: 4.9,
    clients: 10000,
    tags: ['GSM', 'Ferramentas', 'Desbloqueio', 'Reparação'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755441/Gemini_Generated_Image_66r0q266r0q266r0_kbpqc8.png',
    isIndividuallyAvailable: true,
    isAI: false
  },
  {
    id: 7,
    title: 'Social Media Design',
    category: 'Design Gráfico',
    description: 'Pacote completo de design para redes sociais com posts, stories e capa profissional. Estratégia visual completa para sua presença digital.',
    shortDescription: 'Design completo para suas redes sociais.',
    price: 2500,
    priceNote: 'Pacote mensal - 12 posts + stories',
    features: [
      '12 posts para Instagram/Facebook',
      '8 stories destacáveis',
      'Capa profissional para perfil',
      'Templates otimizados para engajamento',
      'Calendário de postagem',
      'Otimização para algoritmos',
      'Arquivos em alta resolução'
    ],
    benefits: [
      'Presença visual consistente',
      'Aumento de engajamento',
      'Profissionalismo nas redes',
      'Conteúdo pronto para postar',
      'Estratégia visual definida',
      'Resultados mensuráveis'
    ],
    deliveryTime: '5-7 dias úteis',
    revisions: '2 revisões completas inclusas',
    expertise: '6+ anos em design social',
    projects: '200+ perfis redesenhados',
    rating: 4.8,
    clients: 120,
    tags: ['Social Media', 'Posts', 'Stories', 'Instagram'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true,
    isAI: false
  },
  {
    id: 8,
    title: 'Materiais Publicitários',
    category: 'Design Gráfico',
    description: 'Conjunto completo de materiais publicitários para sua empresa: cartazes, banners, flyers e materiais impressos profissionais.',
    shortDescription: 'Materiais publicitários completos para sua empresa.',
    price: 1800,
    priceNote: 'Kit completo com 5 materiais diferentes',
    features: [
      '2 cartazes A3 em diferentes formatos',
      '1 banner personalizado',
      '3 flyers para distribuição',
      'Otimização para impressão',
      'Arquivos em CMYK',
      'Marca d\'água de corte incluída',
      'Orientação para gráfica'
    ],
    benefits: [
      'Materiais prontos para impressão',
      'Campanha publicitária completa',
      'Visibilidade offline profissional',
      'Custo-benefício otimizado',
      'Qualidade gráfica garantida',
      'Suporte para impressão'
    ],
    deliveryTime: '4-6 dias úteis',
    revisions: '2 revisões completas inclusas',
    expertise: '7+ anos em design publicitário',
    projects: '150+ campanhas publicitárias',
    rating: 4.7,
    clients: 100,
    tags: ['Cartazes', 'Banners', 'Publicidade', 'Impressão'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true,
    isAI: false
  },
  {
    id: 9,
    title: 'Pacote Design Completo',
    category: 'Design Gráfico',
    description: 'Pacote completo de design gráfico incluindo criação de logos, ferramentas IA, posts semanais, layout para camisetas, banners, adesivos, vinis, fotos para tela e todos os tipos de materiais impressos.',
    shortDescription: 'Pacote completo de design com todos os materiais impressos.',
    price: 3500,
    priceNote: 'Pacote mensal - inclui todos os serviços de design',
    features: [
      'Criação de logos profissionais',
      'Ferramentas IA para logos',
      'Posts semanais para redes sociais',
      'Layout para camisetas personalizadas',
      'Banners e faixas publicitárias',
      'Adesivos e vinis para veículos',
      'Fotos para tela e impressão',
      'Cartazes e flyers promocionais',
      'Materiais impressos diversos',
      'Suporte técnico completo',
      'Customização ilimitada'
    ],
    benefits: [
      'Todos os materiais de design incluídos',
      'Soluções completas para impressão',
      'Criatividade profissional garantida',
      'Materiais prontos para produção',
      'Suporte completo para gráficas',
      'Qualidade premium assegurada',
      'Economia vs serviços avulsos'
    ],
    deliveryTime: '7-10 dias úteis',
    revisions: 'Revisões ilimitadas inclusas',
    expertise: '8+ anos em design e impressão',
    projects: '500+ projetos de design completos',
    rating: 4.9,
    clients: 200,
    tags: ['Design Completo', 'Impressão', 'Logos', 'Materiais', 'IA'],
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
    isIndividuallyAvailable: true,
    isAI: true
  }
];

// Planos Reestruturados - Foco em Público Jovem Moçambicano
export const SERVICE_PLANS: Plan[] = [
  {
    name: 'START RÁPIDO IA',
    price: 699,
    period: 'MZN',
    description: 'Para quem está começando agora e quer algo rápido, barato e funcional. Logo simples OU 3 posts gerados com IA.',
    features: [
      'Logo simples OU 3 posts para redes sociais',
      'Templates modernos prontos para usar',
      'Conteúdo adaptado ao contexto de Moçambique',
      'Linguagem jovem e direta',
      'Entrega rápida (até 24h)',
      'Extra opcional: Refinamento com designer (+300-600 MZN)'
    ],
    highlighted: false,
    borderColor: 'border-green-500 dark:border-green-400',
    priceColor: 'text-green-600 dark:text-green-400',
    buttonColor: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-400',
    buttonText: 'Começar Agora',
    buttonAction: 'start-rapido-ia',
    icon: Zap,
    badge: 'Mais Barato',
    savings: 'Perfeito para Iniciantes'
  },
  {
    name: 'STARTUP DESIGN',
    price: 2299,
    period: 'MZN',
    description: 'Para pequenos negócios que precisam da primeira presença digital profissional. Tudo que você precisa para começar.',
    features: [
      'Logotipo profissional (3 conceitos)',
      'Landing page simples + Link Bio',
      '4 posts para redes sociais',
      'Cartão digital com QR Code',
      'Ajustes manuais por designer',
      'Suporte técnico por 30 dias'
    ],
    highlighted: false,
    borderColor: 'border-yellow-500 dark:border-yellow-400',
    priceColor: 'text-yellow-600 dark:text-yellow-400',
    buttonColor: 'bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-400',
    buttonText: 'Criar Minha Marca',
    buttonAction: 'startup-design',
    icon: Star,
    badge: 'Mais Popular',
    savings: 'Pacote Completo Essencial'
  },
  {
    name: 'CRESCIMENTO DIGITAL',
    price: 5500,
    originalPrice: 7500,
    period: 'MZN',
    description: 'Para negócios que já vendem e querem crescer no digital. Website profissional + identidade visual completa.',
    features: [
      'Website profissional responsivo (até 10 páginas)',
      'Identidade visual completa (logo + cores + tipografia)',
      '5 posts profissionais para redes sociais',
      'Estrutura preparada para anúncios',
      'Otimização SEO básica incluída',
      'Suporte inicial por 60 dias'
    ],
    highlighted: true,
    borderColor: 'border-blue-500 dark:border-blue-400',
    priceColor: 'text-blue-600 dark:text-blue-400',
    buttonColor: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400',
    buttonText: 'Quero Crescer',
    buttonAction: 'crescimento-digital',
    icon: TrendingUp,
    badge: 'Promoção',
    savings: 'Antes 7.500 MZN - Economize 2.000 MZN'
  },
  {
    name: 'EMPRESA DIGITAL',
    price: 12000,
    period: 'MZN + 3.500/Mês',
    description: 'Para empresas e marcas que querem vender online de forma estruturada. E-commerce + suporte mensal.',
    features: [
      'Website avançado + Blog integrado',
      'E-commerce básico (até 50 produtos)',
      'Identidade visual premium',
      'Integração com M-Pesa e e-Mola',
      'Suporte mensal e atualizações',
      'Relatórios de vendas automáticos',
      'Backup e segurança incluídos'
    ],
    highlighted: false,
    borderColor: 'border-purple-500 dark:border-purple-400',
    priceColor: 'text-purple-600 dark:text-purple-400',
    buttonColor: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400',
    buttonText: 'Estruturar Meu Negócio',
    buttonAction: 'empresa-digital',
    icon: Building,
    badge: 'Para Quem Vende',
    savings: 'Setup + Manutenção Mensal'
  },
  {
    name: 'DOMÍNIO TOTAL',
    price: 25000,
    period: 'MZN + 8.500/Mês',
    description: 'Para negócios grandes ou em forte crescimento que querem tudo num só lugar. Solução completa 360º.',
    features: [
      'Plataforma web personalizada + E-commerce avançado',
      'Design gráfico ilimitado (todos os materiais)',
      'Marketing digital completo e ilimitado',
      'Produção audiovisual profissional',
      'Suporte total 360º com prioridade máxima',
      'Consultoria estratégica semanal',
      'Acesso direto à equipe fundadora'
    ],
    highlighted: false,
    borderColor: 'border-orange-500 dark:border-orange-400',
    priceColor: 'text-orange-600 dark:text-orange-400',
    buttonColor: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-400',
    buttonText: 'Orçamento VIP',
    buttonAction: 'dominio-total',
    icon: Crown,
    badge: 'Solução Completa',
    savings: 'Tudo incluído + Suporte Premium'
  }
];

// Service Categories for filtering (Atualizadas)
export const SERVICE_CATEGORIES = [
  'Todos',
  'Design Gráfico',
  'Desenvolvimento Web',
  'Marketing Digital',
  'Produção Audiovisual',
  'E-commerce',
  'Assistência GSM'
];

// WhatsApp message templates (Atualizados para nova estrutura)
export const WHATSAPP_MESSAGES = {
  service: {
    'Identidade Visual Completa': '🎨 Olá! Gostaria de orçamento para identidade visual completa da minha marca.',
    'Website Profissional': '💻 Olá! Preciso de um website profissional responsivo para meu negócio.',
    'Marketing Digital Completo': '📈 Olá! Interessado em pacote completo de marketing digital.',
    'Produção Audiovisual': '🎬 Olá! Gostaria de orçamento para cobertura audiovisual do meu evento.',
    'IMPORTAÇÃO ASSISTIDA TCHOVADIGITAL': '📦 Olá! Gostaria de saber mais sobre o serviço de importação assistida TchovaDigital.',
    'Ferramentas GSM Profissionais': '📱 Olá! Interessado em ferramentas GSM profissionais.',
    'Social Media Design': '📱 Olá! Gostaria de design completo para minhas redes sociais.',
    'Materiais Publicitários': '📢 Olá! Preciso de materiais publicitários para minha empresa.',
    'Pacote Design Completo': '🎨 Olá! Interessado no pacote completo de design com todos os materiais impressos.'
  },
  plan: {
    'START RÁPIDO IA': '🤖 Olá! Gostaria de saber mais sobre o plano Start Rápido IA.',
    'STARTUP DESIGN': '🎨 Olá! Interessado no plano Startup Design.',
    'CRESCIMENTO DIGITAL': '📈 Olá! Gostaria de informações sobre o plano Crescimento Digital.',
    'EMPRESA DIGITAL': '🏢 Olá! Quero conhecer o plano Empresa Digital.',
    'DOMÍNIO TOTAL': '👑 Olá! Interessado no plano Domínio Total.'
  }
};

// Helper functions
export const getServiceById = (id: number): Service | undefined => {
  return INDIVIDUAL_SERVICES.find(service => service.id === id);
};

export const getPlanByName = (name: string): Plan | undefined => {
  return SERVICE_PLANS.find(plan => plan.name === name);
};

export const getServicesByCategory = (category: string): Service[] => {
  if (category === 'Todos') return INDIVIDUAL_SERVICES;
  return INDIVIDUAL_SERVICES.filter(service => service.category === category);
};

export const getWhatsAppMessage = (type: 'service' | 'plan', title: string): string => {
  const messages = WHATSAPP_MESSAGES[type];
  return messages[title as keyof typeof messages] || `Olá! Gostaria de saber mais sobre ${title}.`;
};