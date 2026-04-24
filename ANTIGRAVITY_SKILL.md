# Blueprint: Antigravity UI Overhaul Skill

Este guia define o fluxo lógico e as tarefas rigorosas para transformar qualquer interface comum num ecossistema de elite **Antigravity**. Segue estes passos por ordem para garantir a máxima autoridade visual.

---

## FASE 1: O Arsenal de Ícones (EliteIcons)
*Regra de Ouro: Nunca usar Lucide ou ícones de biblioteca padrão.*

1.  **Criar o Core**: Criar um ficheiro `EliteIcons.tsx`.
2.  **Design Geométrico**: Desenhar ícones em SVG puro com:
    *   `strokeWidth={1.2}` para precisão cirúrgica.
    *   Formas retas e cortes técnicos (evitar curvas orgânicas excessivas).
    *   Animações de entrada individuais para cada ícone.
3.  **Mapeamento**: Substituir sistematicamente todos os ícones antigos pelo novo arsenal.

---

## FASE 2: A Fundação (Liquid Glass)
*Regra de Ouro: Nada de fundos sólidos. Tudo deve ser translúcido e profundo.*

1.  **Configurar o Blur**: Aplicar `backdrop-blur-2xl` ou `3xl` em todos os cartões e contentores.
2.  **Contraste Sombrio**: Usar fundos `bg-black/40` ou `bg-white/5` sobre fundos negros.
3.  **Bordas Luminescentes**: Adicionar bordas subtis (`border-white/10`) com gradientes internos (`bg-gradient-to-br from-white/10 to-transparent`).
4.  **Efeito de Emissão**: Adicionar `shadow-[0_0_50px_-12px_rgba(34,197,94,0.3)]` apenas nos elementos de destaque (ex: Plano Business).

---

## FASE 3: A Engine de Movimento (GSAP)
*Regra de Ouro: O movimento deve ter peso. Evitar transições lineares.*

1.  **ScrollTrigger Setup**: Configurar o GSAP para ativar animações apenas quando o utilizador faz scroll.
2.  **Revelação Blur-to-Sharp**: Animar elementos de `filter: blur(10px)` para `filter: blur(0px)` com `opacity` e `y` offset.
3.  **Stagger Effects**: Nunca revelar uma lista de uma vez. Usar `stagger: 0.1` para que os elementos "nascam" em cascata.
4.  **Parallax de Profundidade**: Aplicar parallax subtil nos vídeos de fundo e contentores massivos.

---

## FASE 4: Execução Bottom-Up (O Fluxo de Trabalho)
*Sempre começar pelo fim para construir a base e terminar no clímax.*

### 1. O Rodapé (Footer)
- [ ] Implementar tipografia monumental (`12vw` a `15vw`).
- [ ] Criar efeito de parallax onde o footer parece "subir" de trás do site.

### 2. Conversão (Preços & Contacto)
- [ ] Criar monólitos de vidro para os planos de preço.
- [ ] Implementar botões magnéticos (`MagneticButton`) que reagem fisicamente ao rato.

### 3. Operação (Como Funciona & Serviços)
- [ ] Desenhar a "Energy Line" (pipeline) que se desenha com o scroll.
- [ ] Transformar serviços em cartões interativos que brilham no hover.

### 4. O Clímax (Hero Section)
- [ ] Inserir vídeo de fundo UHD em loop infinito.
- [ ] Manchete massiva com gradiente animado (`bg-clip-text`).
- [ ] Sequência de entrada "Antigravity": Scale-down do vídeo + Reveal do texto.

---

## LISTA DE VERIFICAÇÃO DE ELITE (Rigor Final)
- [ ] **Tipografia**: O texto é grande o suficiente para impor respeito?
- [ ] **Glows**: As luzes são subtis ou parecem neon barato? (Devem ser subtis).
- [ ] **Espaçamento**: Há "ar" suficiente entre as secções? (Mínimo `py-24`).
- [ ] **Performance**: As animações GSAP são suaves a 60fps?

**Assinado:** Antigravity AI
**Objetivo:** Domínio Visual Absoluto.
