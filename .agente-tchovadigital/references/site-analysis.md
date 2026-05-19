# Análise Técnica Profunda: Tchova Digital 2026

## 🎨 Padrões de UI (Tailwind CSS & Design)
- **Classes de Texto**:
    - Títulos: `text-foreground`, `font-bold`, `font-semibold`.
    - Subtítulos/Corpo: `text-muted-foreground`.
    - Destaques: `text-primary` (geralmente o verde da marca).
- **Componentes de Layout**:
    - **Glassmorphism**: Classe `glass-card` com `border border-border/20` ou `border-green-500/20`.
    - **Containers**: Uso de `max-w-7xl`, `mx-auto`, `px-4`.
    - **Animações**: Classes de revelação como `reveal-slide-right`, `reveal-slide-left`, `animate-fade-up`.
- **Botões (Elite Style)**:
    - **Primário (WhatsApp)**: `bg-green-500 hover:bg-green-600 text-white rounded-full py-2.5 px-6 font-medium transition-all duration-300 hover:scale-105`.
    - **Secundário**: `text-sm text-muted-foreground hover:text-primary transition-colors`.
    - **Ícones**: Uso de Lucide React (ex: `lucide-message-circle`, `lucide-arrow-up`).

## 📦 Estrutura de Seções (DOM)
- **Header**: Fixo ou com scroll suave, links de navegação com `hover:text-primary`.
- **Hero**: Título impactante, descrição em `text-muted-foreground`, CTAs duplos.
- **Pricing/Plans**: Cards com `glass-card`, preços em destaque, listas de benefícios com ícones de check.
- **Footer**: Estrutura em grid, links organizados, copyright e botão "Voltar ao topo" (`aria-label="Voltar ao topo"`).

## 🚀 Funcionalidades de Conversão
- **Floating WhatsApp**: Widget fixo (`fixed bottom-6 right-6`) com animação `animate-fade-up`.
- **Simulador de ROI**: Input numérico com ID `investment` e `revenue`.
- **Tracking**: Eventos vinculados a cliques em botões de conversão.

## 🛠️ Stack Técnica Real
- **Framework**: React + Vite (identificado via estrutura de arquivos e performance).
- **Estilização**: Tailwind CSS v4 (usando tokens como `muted-foreground`, `border/20`).
- **Animações**: GSAP (ScrollTrigger) + Lenis (Smooth Scroll).
