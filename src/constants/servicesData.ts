import React from 'react';
import { 
  FileImage, Megaphone, Play, Building, Layout, Smartphone, 
  MessageCircle, Search, Zap, Video, Camera, Film, Mountain, 
  Sparkle, Instagram, PenTool, Target, BarChart3, Users, 
  ShieldCheck, Eye, Globe, Headphones,
  Star, Palette, CreditCard
} from 'lucide-react';
import { 
  AudiovisualPackage, 
  AudiovisualExtra, 
  ServiceData 
} from '../types/services';

// --- SHARED DATA ---

export const commonProcess: ServiceData['process'] = [
  { step: 1, title: 'Diagnóstico Letal', description: 'Sincronização imediata de objetivos e neutralização de dores.' },
  { step: 2, title: 'Arquitetura de Elite', description: 'Engenharia da solução focada em conversão e poder de marca.' },
  { step: 3, title: 'Execução Hiper-Sónica', description: 'Produção 20x mais rápida via inteligência aumentada.' },
  { step: 4, title: 'Domínio de Mercado', description: 'Entrega do ecossistema e suporte para escala contínua.' }
];

// --- AUDIOVISUAL DATA ---

export const audiovisualPackages: AudiovisualPackage[] = [
  {
    name: 'Experiência Essencial',
    price: 35000,
    icon: React.createElement(Video, { className: "w-7 h-7" }),
    features: ['Até 4 horas de Cobertura VIP', '1 Videógrafo Senior', 'Edição High-End (3-5 min)', 'Entrega Prioritária (15 dias)']
  },
  {
    name: 'Experiência Premium',
    price: 65000,
    icon: React.createElement(Camera, { className: "w-7 h-7" }),
    features: ['Até 8 horas de Cobertura Total', 'Multicam Digital (2 Videógrafos)', 'Mini-Documentário (10-15 min)', 'Ensaio Fotográfico Integrado', 'Entrega em 20 dias'],
    popular: true
  },
  {
    name: 'Experiência Elite',
    price: 120000,
    icon: React.createElement(Film, { className: "w-7 h-7" }),
    features: ['Evento Completo (Sem limites)', 'Equipe de Cinema Completa', 'Cinematografia Aérea (Drone)', 'Álbum Artístico Premium', 'Suporte Concierge 24h']
  },
  {
    name: 'Projeto Exclusivo',
    price: 0,
    icon: React.createElement(Star, { className: "w-7 h-7" }),
    features: ['Consultoria de Produção Única', 'Orçamento Estratégico Sob Medida', 'Equipamentos de Hollywood']
  }
];

export const audiovisualExtras: AudiovisualExtra[] = [
  {
    name: 'Drone (Imagens Aéreas)',
    price: 15000,
    icon: React.createElement(Mountain, { className: "w-6 h-6" })
  },
  {
    name: 'Fogo de Artifício',
    price: 25000,
    icon: React.createElement(Zap, { className: "w-6 h-6" })
  },
  {
    name: 'Bolas de Fumaça',
    price: 8500,
    icon: React.createElement(Sparkle, { className: "w-6 h-6" })
  }
];

// --- SERVICES DATA MAP ---

export const servicesData: Record<string, ServiceData> = {
  design: {
    id: 'design',
    title: 'Design que Marca & Identidade Visual',
    heroDescription: 'Elimine o amadorismo. Criamos identidades visuais de elite que impõem respeito e param o scroll instantaneamente.',
    heroCards: [
      {
        title: 'DNA Visual',
        subtitle: 'Identidade Pro',
        icon: React.createElement(Palette, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-primary to-primary-darker',
        borderColor: 'border-primary/50',
        animationDelay: '0.1s',
        spans: 2
      },
      {
        title: 'Impacto Físico',
        subtitle: 'Banners & Print',
        icon: React.createElement(FileImage, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-brand-green to-brand-green',
        borderColor: 'border-brand-green/50',
        animationDelay: '0.2s'
      },
      {
        title: 'Retenção Alpha',
        subtitle: 'Social & Motion',
        icon: React.createElement(Instagram, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-brand-yellow to-accent-light',
        borderColor: 'border-brand-yellow/50',
        animationDelay: '0.3s'
      }
    ],
    includes: [
      {
        name: 'Ecossistema Visual de Autoridade',
        icon: React.createElement(Palette, { className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" }),
        gradient: 'from-primary to-primary-darker',
        color: 'from-primary/20 to-primary-darker/20 border-primary/30'
      },
      {
        name: 'Design de Escala para Redes',
        icon: React.createElement(Instagram, { className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" }),
        gradient: 'from-brand-green to-primary',
        color: 'from-brand-green/20 to-primary/20 border-brand-green/30'
      },
      {
        name: 'Anúncios de Alta Conversão',
        icon: React.createElement(Megaphone, { className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" }),
        gradient: 'from-primary to-primary-darker',
        color: 'from-primary/20 to-primary-darker/20 border-primary/30'
      }
    ],
    process: commonProcess,
    nextStep: {
      id: 'websites',
      title: 'Ecossistemas Web & Lojas',
      logic: 'Agora que a sua marca impõe respeito, é hora de construir o seu quartel-general digital para converter visitantes em lucro.'
    }
  },
  websites: {
    id: 'websites',
    title: 'Sites e Apps (Ecossistemas que Vendem)',
    heroDescription: 'Quartéis-generais de alta conversão. Desenvolvemos ecossistemas web de carregamento hiper-sónico que dominam o Google.',
    heroCards: [
      {
        title: 'Motor de Leads',
        subtitle: 'Landing Pages',
        icon: React.createElement(Layout, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-brand-green to-primary',
        borderColor: 'border-brand-green/50',
        animationDelay: '0.1s',
        spans: 2
      },
      {
        title: 'Quartel-General',
        subtitle: 'Sites Pro',
        icon: React.createElement(Building, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-primary to-primary-darker',
        borderColor: 'border-primary/50',
        animationDelay: '0.2s'
      },
      {
        title: 'Velocidade 20x',
        subtitle: 'Ranking #1',
        icon: React.createElement(Zap, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-accent to-brand-yellow',
        borderColor: 'border-accent/50',
        animationDelay: '0.3s'
      }
    ],
    includes: [
      {
        name: 'Plataformas de Autoridade e Conversão',
        icon: React.createElement(Layout, { className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" }),
        gradient: 'from-primary to-primary-darker',
        color: 'from-primary/20 to-primary-darker/20 border-primary/30'
      },
      {
        name: 'Otimização Extrema de Carregamento',
        icon: React.createElement(Zap, { className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" }),
        gradient: 'from-brand-bright to-brand-green',
        color: 'from-brand-bright/20 to-brand-green/20 border-brand-bright/30'
      },
      {
        name: 'Integrações Pro de Captação de Leads',
        icon: React.createElement(MessageCircle, { className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" }),
        gradient: 'from-primary to-brand-green',
        color: 'from-primary/20 to-brand-green/20 border-primary/30'
      }
    ],
    process: commonProcess,
    nextStep: {
      id: 'marketing',
      title: 'Marketing & Tráfego Pago',
      logic: 'O seu site está pronto e veloz. Vamos agora bombardeá-lo com clientes qualificados através de tráfego inteligente.'
    }
  },
  marketing: {
    id: 'marketing',
    title: 'Marketing Digital & Gestão de Tráfego',
    heroDescription: 'Metemos o pé no acelerador. Estratégias de tráfego agressivo e conteúdo que transforma visualizações em faturas pagas.',
    heroCards: [
      {
        title: 'Tráfego Pro',
        subtitle: 'Ads Meta/Google',
        icon: React.createElement(Megaphone, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-brand-green to-primary',
        borderColor: 'border-brand-green/50',
        animationDelay: '0.1s',
        spans: 2
      },
      {
        title: 'Domínio Social',
        subtitle: 'Gestão Alpha',
        icon: React.createElement(Instagram, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-brand-yellow to-accent-light',
        borderColor: 'border-brand-yellow/50',
        animationDelay: '0.2s'
      },
      {
        title: 'Escala Sónica',
        subtitle: 'Data & ROI',
        icon: React.createElement(BarChart3, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-brand-dark to-brand-dark',
        borderColor: 'border-brand-dark/50',
        animationDelay: '0.3s'
      }
    ],
    includes: [
      {
        name: 'Gestão de Autoridade em Canais Digitais',
        icon: React.createElement(Instagram, { className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" }),
        gradient: 'from-brand-yellow to-accent-light',
        color: 'from-brand-yellow/20 to-accent-light/20 border-brand-yellow/30'
      },
      {
        name: 'Produção de Conteúdo Orientada a Vendas',
        icon: React.createElement(PenTool, { className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" }),
        gradient: 'from-primary to-primary-darker',
        color: 'from-primary/20 to-primary-darker/20 border-primary/30'
      },
      {
        name: 'Campanhas de Tráfego Pago de Alta Performance',
        icon: React.createElement(Megaphone, { className: "w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7" }),
        gradient: 'from-brand-green to-primary',
        color: 'from-brand-green/20 to-primary/20 border-brand-green/30'
      }
    ],
    process: commonProcess,
    nextStep: {
      id: 'importacao',
      title: 'Importação & Logística',
      logic: 'Com as vendas a escalar, o seu stock precisa de acompanhar. Vamos importar tecnologia e produtos sem burocracia.'
    }
  },
  audiovisual: {
    id: 'audiovisual',
    title: 'Audiovisual (Foto, Vídeo e Drone)',
    heroDescription: 'Teu evento merece ser eterno. Transformamos momentos em autoridade visual com equipamentos de cinema e aquele toque que só nós temos.',
    heroCards: [
      {
        title: 'Filmagem',
        subtitle: 'Vídeo',
        icon: React.createElement(Video, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-primary to-primary-darker',
        borderColor: 'border-primary/50',
        animationDelay: '0.1s',
        spans: 2
      },
      {
        title: 'Foto',
        subtitle: 'Sessão',
        icon: React.createElement(Camera, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-brand-yellow to-accent-light',
        borderColor: 'border-brand-yellow/50',
        animationDelay: '0.15s'
      },
      {
        title: 'Edição',
        subtitle: 'Premium',
        icon: React.createElement(Film, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-brand-green to-primary',
        borderColor: 'border-brand-green/50',
        animationDelay: '0.2s'
      },
      {
        title: 'Drone',
        subtitle: 'Aéreo',
        icon: React.createElement(Mountain, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-brand-bright to-brand-green',
        borderColor: 'border-brand-bright/50',
        animationDelay: '0.25s'
      },
      {
        title: 'Fogo',
        subtitle: 'Artifício',
        icon: React.createElement(Zap, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-brand-yellow to-accent-light',
        borderColor: 'border-brand-yellow/50',
        animationDelay: '0.3s'
      },
      {
        title: 'Fumaça',
        subtitle: 'Bolas',
        icon: React.createElement(Sparkle, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-primary to-brand-green',
        borderColor: 'border-primary/50',
        animationDelay: '0.35s'
      }
    ],
    includes: [], // Handled by packages
    process: commonProcess
  },
  importacao: {
    id: 'importacao',
    title: 'Importação & Logística (Zero Stress)',
    heroDescription: 'Expansão global sem burocracia. Do fornecedor à sua porta com risco zero e total segurança.',
    heroCards: [
      {
        title: 'Escudo de Risco',
        subtitle: '100% Seguro',
        icon: React.createElement(ShieldCheck, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-primary to-primary-darker',
        borderColor: 'border-primary/50',
        animationDelay: '0.1s'
      },
      {
        title: 'Sourcing Global',
        subtitle: 'China & EUA',
        icon: React.createElement(Globe, { className: "w-7 h-7 lg:w-8 lg:h-8 text-white" }),
        gradient: 'from-brand-yellow to-accent-light',
        borderColor: 'border-brand-yellow/50',
        animationDelay: '0.2s'
      }
    ],
    includes: [],
    process: commonProcess,
    nextStep: {
      id: 'design',
      title: 'Design de Autoridade',
      logic: 'Nova escala exige novo visual. Vamos elevar o patamar da sua marca para dominar o setor a longo prazo.'
    }
  },
};
