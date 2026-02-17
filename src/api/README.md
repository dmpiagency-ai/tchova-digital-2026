# TchovaDigital API Documentation

## Overview

A API da TchovaDigital foi projetada com uma arquitetura **plug-and-play**, permitindo fácil conexão e desconexão de serviços. Todos os módulos são independentes e podem funcionar em modo demo quando não configurados.

## Estrutura

```
src/api/
├── index.ts          # Ponto de entrada centralizado
├── config.ts         # Configuração consolidada
├── types.ts          # Tipos TypeScript compartilhados
├── client.ts         # Cliente HTTP base
├── firebase.ts       # Integração Firebase
├── payments.ts       # Sistema de pagamentos
├── ai-agent.ts       # Agente de IA inteligente
├── gsm.ts            # Serviços GSM
└── analytics.ts      # Tracking e analytics
```

## Instalação Rápida

1. Copie `.env.example` para `.env`
2. Configure as credenciais necessárias
3. Importe e use:

```typescript
import { paymentService, aiAgent, gsmService } from '@/api';

// Verificar status
const status = getAPIStatus();
console.log(status);
```

---

## Módulos

### 1. Firebase (`firebase.ts`)

Integração com Firebase para autenticação, banco de dados e analytics.

#### Configuração

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ
```

#### Uso

```typescript
import { auth, db, getDocument, setDocument } from '@/api';

// Autenticação
import { signInWithEmailAndPassword } from 'firebase/auth';
await signInWithEmailAndPassword(auth, email, password);

// Firestore
const user = await getDocument<User>('users', 'user-id');
await setDocument('users', 'user-id', { name: 'João' });
```

#### Status

```typescript
import { getFirebaseStatus } from '@/api';

const status = getFirebaseStatus();
// {
//   configured: true,
//   app: 'connected',
//   auth: 'ready',
//   db: 'ready',
//   analytics: 'active',
//   environment: 'production'
// }
```

---

### 2. Pagamentos (`payments.ts`)

Sistema de pagamentos unificado para Moçambique.

#### Métodos Suportados

| Método | Tipo | Status |
|--------|------|--------|
| M-Pesa | Mobile Money | ✅ Demo |
| E-mola | Mobile Money | ✅ Demo |
| PayPal | Internacional | ✅ Demo |
| Cartão | Stripe | ✅ Demo |
| Bitcoin | Crypto | ✅ Demo |

#### Configuração

```env
# M-Pesa
VITE_MPESA_API_KEY=your-mpesa-api-key

# E-mola
VITE_EMOLA_API_KEY=your-emola-api-key

# PayPal
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id

# Stripe
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key

# Crypto
VITE_NOWPAYMENTS_API_KEY=your-nowpayments-key
```

#### Uso

```typescript
import { paymentService } from '@/api';

// Listar métodos disponíveis
const methods = paymentService.getAvailablePaymentMethods();
// [{ id: 'mpesa', name: 'M-Pesa', ... }, ...]

// Processar pagamento
const result = await paymentService.processPayment({
  amount: 1000,
  currency: 'MZN',
  method: 'mpesa',
  userId: 'user-123',
  description: 'Serviço de design',
  phoneNumber: '841234567'
});

// Verificar status
const status = await paymentService.verifyPayment(result.transactionId);

// Calcular taxas
const fees = paymentService.calculateFees(1000, 'mpesa');
// { netAmount: 1000, fee: 0, percentage: 0 }
```

---

### 3. Agente de IA (`ai-agent.ts`)

O "cérebro inteligente" do site. Suporta múltiplos provedores de IA.

#### Provedores Suportados

| Provedor | Modelos | Status |
|----------|---------|--------|
| OpenAI | GPT-4, GPT-3.5 | ✅ |
| Anthropic | Claude 3 | ✅ |
| Google | Gemini | ✅ |
| Local | Ollama | ✅ |

#### Configuração

```env
# OpenAI (recomendado)
VITE_OPENAI_API_KEY=sk-your-openai-key

# Anthropic (alternativa)
VITE_ANTHROPIC_API_KEY=your-anthropic-key

# Google AI (alternativa)
VITE_GOOGLE_AI_KEY=your-google-ai-key
```

#### Uso

```typescript
import { aiAgent } from '@/api';

// Chat simples
const response = await aiAgent.generate('Quero criar um logo para meu negócio');
console.log(response.data?.content);

// Com opções
const response = await aiAgent.generate('Crie um post para Instagram', {
  model: 'gpt-4',
  maxTokens: 500,
  temperature: 0.8
});

// Gerar conteúdo específico
const logo = await aiAgent.generateContent('logo', {
  name: 'Minha Empresa',
  style: 'moderno',
  colors: 'azul e verde'
});

// Histórico
const history = aiAgent.getHistory();
aiAgent.clearHistory();
```

#### Modo Demo

Quando nenhum provedor está configurado, o agente funciona em modo demo com respostas pré-definidas para perguntas comuns sobre:
- Preços
- Serviços
- Contato

---

### 4. Serviços GSM (`gsm.ts`)

Sistema de créditos e serviços técnicos GSM.

#### Serviços Disponíveis

- Desbloqueio de telemóveis
- Remoção de FRP/iCloud
- Reparação de hardware
- Verificação de IMEI

#### Uso

```typescript
import { gsmService } from '@/api';

// Ver saldo
const balance = await gsmService.getUserBalance('user-id');
// { balance: 5000 }

// Adicionar créditos
const result = await gsmService.addCredits('user-id', 1000, 'Depósito');
// { newBalance: 6000, transactionId: 'TXN-...' }

// Comprar serviço
const purchase = await gsmService.purchaseService('user-id', 'unlock-smartphone');

// Listar serviços
const services = gsmService.getServices();
const tools = gsmService.getTools();
```

---

### 5. Analytics (`analytics.ts`)

Sistema de tracking e analytics.

#### Configuração

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_FB_PIXEL_ID=123456789
```

#### Uso

```typescript
import { 
  trackEvent, 
  trackPageView, 
  trackConversion,
  trackWhatsAppClick,
  trackServiceView 
} from '@/api';

// Evento customizado
await trackEvent({
  name: 'button_click',
  category: 'engagement',
  label: 'cta_principal'
});

// Page view
await trackPageView('/servicos');

// Conversão
await trackConversion('purchase', 5000);

// WhatsApp click
trackWhatsAppClick('header', 'design');

// Service view
trackServiceView('Desenvolvimento Web');
```

---

## Configuração Centralizada

```typescript
import { 
  config, 
  validateConfig, 
  getConfigStatus,
  logConfigStatus 
} from '@/api';

// Validar configuração
const validation = validateConfig();
if (!validation.valid) {
  console.error('Configuration issues:', validation.issues);
}

// Ver status
const status = getConfigStatus();

// Debug (apenas em desenvolvimento)
logConfigStatus();
```

---

## Feature Flags

Controle quais recursos estão ativos:

```env
VITE_ENABLE_LOGIN=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=true
VITE_ENABLE_ADMIN=false
VITE_ENABLE_GSM_FEATURES=true
VITE_ENABLE_AI=true
```

```typescript
import { features } from '@/api/config';

if (features.enablePayments) {
  // Mostrar opções de pagamento
}
```

---

## Modo Demo

Todos os módulos funcionam em modo demo quando não configurados:

- **Firebase**: Dados em memória/localStorage
- **Pagamentos**: Simulação de transações
- **IA**: Respostas pré-definidas
- **Analytics**: Logs no console

Isso permite desenvolvimento e testes sem configurar serviços externos.

---

## Exemplo Completo

```typescript
// main.tsx
import { initializeAPIs } from '@/api';

// Inicializar APIs
initializeAPIs().then(() => {
  console.log('APIs initialized');
});

// App.tsx
import { 
  paymentService, 
  aiAgent, 
  trackEvent,
  getAPIStatus 
} from '@/api';

function App() {
  const handlePayment = async () => {
    const result = await paymentService.processPayment({
      amount: 5000,
      currency: 'MZN',
      method: 'mpesa',
      userId: 'user-123',
      description: 'Serviço de design'
    });
    
    if (result.status === 'completed') {
      trackEvent({ name: 'payment_success', category: 'conversion' });
    }
  };

  const handleAIChat = async (message: string) => {
    const response = await aiAgent.generate(message);
    return response.data?.content;
  };

  return (
    // ...
  );
}
```

---

## Segurança

### Nunca fazer:

- ❌ Commitar `.env` para o repositório
- ❌ Expor chaves secretas no frontend
- ❌ Armazenar senhas em variáveis de ambiente do frontend

### Sempre fazer:

- ✅ Usar variáveis de ambiente com prefixo `VITE_`
- ✅ Validar configuração em produção
- ✅ Usar HTTPS em produção
- ✅ Implementar rate limiting no backend

---

## Troubleshooting

### Firebase não conecta

1. Verifique se as variáveis estão corretas
2. Confirme que o projeto Firebase está ativo
3. Verifique as regras do Firestore

### Pagamentos falham

1. Verifique as credenciais do provedor
2. Confirme que o modo sandbox está ativo em desenvolvimento
3. Verifique os logs do console

### IA não responde

1. Verifique se há um provedor configurado
2. Confirme que a chave API é válida
3. Verifique os limites de uso da API

---

## Suporte

Para dúvidas ou problemas:
- WhatsApp: +258 87 909 7249
- Email: suporte@tchovadigital.com