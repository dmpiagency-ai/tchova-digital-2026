# Processo Operacional Padrão (SOP) - Tchova Digital 2026

Este documento detalha o fluxo de trabalho obrigatório para a criação de Landing Pages e Aplicações Web no ecossistema Tchova Digital.

## FASE 1 — PLANEJAMENTO
1.  **Contexto**: Ler `product-marketing-context.md`.
2.  **Validação de Copy**: Verificar se o Copy está pronto.
    *   Se **NÃO**: Solicitar ao Squad Copy e aguardar.
    *   Se **SIM**: Prosseguir.
3.  **Referências de Design**: Verificar se existe design/referência.
    *   Se **SIM**: Coletar do Figma/screenshot/wireframe.
    *   Se **NÃO**: Coletar briefing do usuário (Tipo de página, Stack, Integrações, Domínio).
4.  **Arquitetura**: Acionar `site-architecture` para definir estrutura, URLs e navegação.
5.  **Escolha da Stack**:
    *   **SEO/Multi-página**: Next.js 15 + App Router + Tailwind v4.
    *   **SPA/Landing Única**: React + Vite + Tailwind v4.
6.  **Setup**: Criar projeto no diretório correto e copiar `.env.example` para `.env.local`.

## FASE 2 — IMPLEMENTAÇÃO
1.  **Seções da Página**:
    *   Hero + CTA *above the fold*.
    *   Social proof + Features + Como funciona.
    *   Pricing + FAQ + CTA final.
2.  **SEO Técnico**:
    *   HTML semântico (h1 único, hierarquia h1-h3).
    *   Meta tags (title, description, OG, Twitter Cards).
    *   Canonical URL + `lang=pt-MZ` (Moçambique).
    *   JSON-LD (Organization + WebSite).
    *   `sitemap.xml`, `robots.txt`, `llms.txt`.
    *   Favicons adaptativos (dark/light mode).
3.  **Analytics e Tracking**:
    *   GA4 script no head.
    *   Meta Pixel + Advanced Matching + eventID.
    *   Hook `useMetaPixel` (trackEvent, trackCustom).
    *   UTM capture (sessionStorage) + append links.
    *   Eventos: PageView, Lead, ViewContent.
4.  **Performance**:
    *   Imagens WebP/AVIF + lazy loading + srcset.
    *   Fonts: preload + font-display swap.
    *   CSS crítico inline + JS defer/async.
    *   Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1.
5.  **Acessibilidade + Animações**:
    *   Contraste WCAG AA (4.5:1 texto).
    *   Alt text + ARIA labels + focus states.
    *   Respeitar `prefers-reduced-motion`.
    *   Animações com `animejs v4` ou `GSAP`.
    *   Glassmorphism + glow orbs + scroll reveals.

## FASE 3 — VALIDAÇÃO
1.  **Responsividade**: Testar em 320px, 768px, 1024px, 1440px. (Corrigir se necessário).
2.  **Lighthouse**: Garantir score > 90 em todas as categorias. (Otimizar se necessário).
3.  **Funcionalidade**: Validar Forms, CTAs e Links. (Corrigir se necessário).
4.  **Cross-browser**: Testar em Chrome, Safari, Firefox.
5.  **Schema JSON-LD**: Validar structured data. (Corrigir se necessário).

## FASE 4 — DEPLOY
### Opção A: Vercel
1.  Confirmar nome do projeto.
2.  `npx vercel --yes` (Preview Deploy).
3.  Testar preview URL (mobile + desktop).
4.  Se OK: `npx vercel --prod`.
5.  *Fallback*: Se o build falhar, usar `--prebuilt` (build local).

### Opção B: Hostinger
1.  Upload de arquivos para a VPS.
2.  Geração do SSL.
3.  Serviço Nginx / run.
4.  Vinculação do Domínio.

## FASE 4b — DOMÍNIO (Cloudflare)
1.  Se domínio customizado: `npx vercel domains add` + DNS Cloudflare.
2.  Configurar A record / CNAME (`cname.vercel-dns.com`).
3.  `proxied: false` (DNS Only).

## FASE 5 — PÓS-DEPLOY
1.  Verificar SSL ativo (HTTPS).
2.  Subir env vars na Vercel.
3.  Verificar analytics recebendo dados.
4.  Testar OG preview (WhatsApp/Twitter).
5.  Testar forms + CTAs em produção.
6.  Registrar no log `squad-dev/YYYY-MM-DD.md`.
