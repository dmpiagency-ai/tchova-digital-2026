# Plano: Atualização de Preços - GSM Tech Dashboard

## Objetivo
Atualizar os preços das ferramentas no painel GSM para refletir valores de mercado real (80-320 MT).

## Preços Atuais → Preços Novos

| Ferramenta | Preço Atual | Preço Novo | Categoria |
|------------|-------------|------------|-----------|
| UnlockTool | 50 MT | **100-130 MT** | Chimera |
| Chimera Tool | 100 MT | **220-320 MT** | Chimera |
| DFT Pro | 30 MT | **80 MT** | Server |
| TFM Tool Pro | 15 MT | **80 MT** | Server |
| EFT Pro | 45 MT | **80 MT** | Remote |

## Novos Itens: Créditos

### CRD Credits (Créditos Chimera)
- Preço sugerido: **75-80 MT** (custo 64 MT)
- Adicionar como card no catálago tools

### TSM Server Credits
- Preço: **80-100 MT** por tentativa
- Adicionar como card no catálago tools

## Decisões de Implementação

1. **Manter 5 ferramentas** + adicionar 2 novos cards de créditos (total 7 itens)
2. Categoria `credit` será adicionada ao tipo BoxTool
3. Interface mostra preço "por tentativa" para créditos vs "por hora" para tools

## Arquivos Afetados
- `src/components/gsm/GSMTechDashboard.tsx` - mockBoxTools array (linhas 104-180)

## Tarefas
1. Atualizar preços no array `mockBoxTools`
2. Adicionar novo tipo `credit` na interface BoxTool
3. Adicionar CRD Credits e TSM Credits como novas ferramentas
4. Atualizar rentals mockados com novos preços
5. Validar com `npm run lint` e `npm run typecheck`

## Risco
- Alteração de preços afeta simulação de aluguel - atualizar rentals mockados