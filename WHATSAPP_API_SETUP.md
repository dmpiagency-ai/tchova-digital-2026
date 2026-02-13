# 🔌 WhatsApp Business API Setup Guide
## Configuração da API Real do WhatsApp para TchovaDigital

### 📋 Pré-requisitos

1. **Conta Facebook Business**
   - Acesse: https://business.facebook.com/
   - Crie uma conta Business ou use uma existente

2. **WhatsApp Business Account**
   - Acesse: https://developers.facebook.com/
   - Crie um app do tipo "Business"
   - Adicione o produto "WhatsApp" ao seu app

### 🚀 Passo a Passo da Configuração

#### 1. Configurar WhatsApp Business API

```bash
# 1. No Meta for Developers Console:
# - Vá para seu app
# - Adicione o produto "WhatsApp"
# - Configure um número de telefone
```

#### 2. Obter Credenciais Necessárias

Você precisará das seguintes credenciais:

```env
# Adicione ao seu arquivo .env.local
VITE_USE_WHATSAPP_API=true
VITE_WHATSAPP_API_URL=https://graph.facebook.com/v18.0
VITE_WHATSAPP_PHONE_NUMBER_ID=SEU_PHONE_NUMBER_ID
VITE_WHATSAPP_ACCESS_TOKEN=SEU_ACCESS_TOKEN
VITE_WHATSAPP_BUSINESS_ACCOUNT_ID=SEU_BUSINESS_ACCOUNT_ID
```

#### 3. Como Obter as Credenciais

**Phone Number ID:**
- No Meta Developers Console
- WhatsApp > API Setup
- Copie o "Phone Number ID"

**Access Token:**
- No Meta Developers Console
- App Settings > Basic
- Gere um "Temporary Access Token" (ou configure permanent token)

**Business Account ID:**
- No Meta Business Manager
- Business Settings > Business Info
- Copie o "Business ID"

### 📱 Templates de Mensagem

Para usar templates aprovados, você precisa:

1. **Criar Templates no WhatsApp Manager**
   - Acesse: https://business.facebook.com/wa/manage/message-templates/
   - Crie templates para:
     - `service_inquiry` - Consultas de serviço
     - `payment_success` - Confirmação de pagamento
     - `gsm_welcome` - Boas-vindas GSM

2. **Templates Configurados:**

```javascript
// Templates disponíveis no código
const whatsappTemplates = {
  service_inquiry: {
    name: 'service_inquiry',
    language: 'pt_BR'
  },
  payment_confirmation: {
    name: 'payment_success',
    language: 'pt_BR'
  },
  gsm_access: {
    name: 'gsm_welcome',
    language: 'pt_BR'
  }
};
```

### 🔧 Configuração Técnica

#### 1. Webhook (Opcional - Para Receber Mensagens)

```javascript
// Exemplo de configuração de webhook
const webhookConfig = {
  url: 'https://sua-api.com/webhook/whatsapp',
  verify_token: 'SEU_VERIFY_TOKEN'
};
```

#### 2. Teste da API

```bash
# Teste básico da API
curl -X GET "https://graph.facebook.com/v18.0/{phone-number-id}" \
  -H "Authorization: Bearer {access-token}"
```

### 📊 Monitoramento e Analytics

#### 1. Dashboard WhatsApp
- Acesse: https://business.facebook.com/wa/manage/
- Monitore mensagens enviadas/recebidas
- Acompanhe taxa de entrega

#### 2. Analytics no Código

```javascript
// O código já inclui tracking automático
console.log('WhatsApp interaction:', { context, subContext });

// Analytics do Google (se configurado)
gtag('event', 'whatsapp_click', {
  event_category: 'engagement',
  event_label: context
});
```

### 🔄 Fallback Automático

O sistema inclui fallback automático:

```javascript
// Se a API falhar, automaticamente usa wa.me
if (!whatsappService.isConfigured()) {
  // Fallback para https://wa.me/numero
  window.open(fallbackUrl, '_blank');
}
```

### ⚠️ Limitações e Considerações

#### Rate Limits da WhatsApp API:
- **Individual:** 250 mensagens/dia
- **Business:** 1,000 mensagens/dia (inicial)
- **Authentication:** 250 mensagens/dia

#### Custos:
- **API Calls:** $0.005 por mensagem
- **Templates:** Gratuito (até limite)
- **Phone Number:** $0.50/mês (aprox.)

### 🛠️ Troubleshooting

#### Problema: "Access Token Expired"
```bash
# Solução: Gerar novo token no Meta Developers Console
# App Settings > Basic > Generate Token
```

#### Problema: "Template Not Approved"
```bash
# Solução: Submeter template para aprovação
# WhatsApp Manager > Message Templates > Submit for Review
```

#### Problema: "Rate Limit Exceeded"
```bash
# Solução: Implementar queue de mensagens
# Ou usar fallback automático (já implementado)
```

### 📞 Suporte

- **Meta for Developers:** https://developers.facebook.com/docs/whatsapp/
- **WhatsApp Business API Docs:** https://developers.facebook.com/docs/whatsapp/cloud-api/
- **Suporte TchovaDigital:** dmpiagency@gmail.com

---

## ✅ Checklist de Configuração

- [ ] Conta Facebook Business criada
- [ ] App Meta for Developers configurado
- [ ] Produto WhatsApp adicionado
- [ ] Número de telefone verificado
- [ ] Access Token gerado
- [ ] Templates criados e aprovados
- [ ] Variáveis de ambiente configuradas
- [ ] Teste da API realizado
- [ ] Fallback testado

**Status:** ⚠️ Configuração pendente - API desabilitada por padrão