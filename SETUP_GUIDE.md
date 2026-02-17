# 🚀 GUIA COMPLETO DE CONFIGURAÇÃO - TCHOVADIGITAL

## Índice
1. [Configuração do Firebase](#1-configuração-do-firebase)
2. [API de Pagamentos (M-Pesa)](#2-api-de-pagamentos-m-pesa)
3. [Hosting e Domínio](#3-hosting-e-domínio)
4. [Painel Admin com AI](#4-painel-admin-com-ai)

---

## 1. Configuração do Firebase

### Passo 1: Criar Conta no Firebase

1. Acesse: https://console.firebase.google.com
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `tchovadigital`
4. Desative Google Analytics (opcional para desenvolvimento)
5. Clique em **"Criar projeto"**

### Passo 2: Configurar Autenticação

1. No console, vá em **Authentication** > **Get Started**
2. Habilite os métodos:
   - ✅ **Email/Password**
   - ✅ **Google** (opcional)
3. Em **Settings** > **Authorized domains**, adicione:
   - `localhost` (desenvolvimento)
   - `tchovadigital.com` (produção)

### Passo 3: Configurar Firestore Database

1. Vá em **Firestore Database** > **Create database**
2. Selecione **Start in test mode** (depois configure regras)
3. Região: `europe-west1` (mais perto de Moçambique)

### Passo 4: Obter Credenciais

1. Vá em **Project Settings** (ícone de engrenagem)
2. Role para baixo até **Your apps**
3. Clique em **Web** (`</>`)
4. Nome do app: `tchovadigital-web`
5. Copie as credenciais:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "tchovadigital.firebaseapp.com",
  projectId: "tchovadigital",
  storageBucket: "tchovadigital.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456",
  measurementId: "G-ABCDEFGHIJ"
};
```

### Passo 5: Configurar no Projeto

Crie o arquivo `.env` na raiz do projeto:

```env
# Firebase
VITE_FIREBASE_API_KEY=AIzaSyB...
VITE_FIREBASE_AUTH_DOMAIN=tchovadigital.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tchovadigital
VITE_FIREBASE_STORAGE_BUCKET=tchovadigital.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ
```

### Passo 6: Regras de Segurança do Firestore

No console Firebase, vá em **Firestore** > **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Leads - apenas admin pode ler
    match /leads/{leadId} {
      allow create: if true;
      allow read: if request.auth != null;
    }
    
    // Transações - apenas do próprio usuário
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Serviços - leitura pública
    match /services/{serviceId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 2. API de Pagamentos (M-Pesa)

### Passo 1: Registrar como Comerciante M-Pesa

1. Acesse a loja Vodacom mais próxima
2. Solicite registro de **Conta Empresarial M-Pesa**
3. Documentos necessários:
   - NUIT (Número de Identificação Tributária)
   - Certificado de Registo Comercial
   - BI/Passaporte do representante
   - Comprovativo de residência

### Passo 2: Obter Credenciais de API

1. Após aprovação, acesse: https://mpesa.vodacom.co.mz/business
2. Vá em **Developer Portal**
3. Crie uma nova aplicação:
   - Nome: `TchovaDigital API`
   - Tipo: `Payment Collection`
4. Anote as credenciais:
   - **Shortcode** (ex: 12345)
   - **Consumer Key**
   - **Consumer Secret**
   - **Passkey**

### Passo 3: Configurar Callback URL

No portal M-Pesa Business:

1. Vá em **Settings** > **Callback URLs**
2. Adicione: `https://api.tchovadigital.com/payments/mpesa/callback`
3. Este URL receberá notificações de pagamento

### Passo 4: Configurar no Projeto

Adicione ao `.env`:

```env
# M-Pesa
VITE_MPESA_SHORTCODE=12345
VITE_MPESA_PASSKEY=sua-passkey-aqui
VITE_MPESA_CONSUMER_KEY=sua-consumer-key
VITE_MPESA_CONSUMER_SECRET=seu-consumer-secret
VITE_MPESA_API_KEY=sua-api-key
```

### Passo 5: Fluxo de Pagamento M-Pesa

```typescript
// Exemplo de implementação
import { paymentService } from '@/api';

async function processarPagamentoMPesa() {
  // 1. Solicitar pagamento
  const result = await paymentService.processPayment({
    amount: 1000,
    currency: 'MZN',
    method: 'mpesa',
    userId: 'user-123',
    description: 'Serviço de Design',
    phoneNumber: '841234567' // Número M-Pesa do cliente
  });

  // 2. Cliente recebe prompt no telemóvel
  // 3. Cliente insere PIN
  // 4. Callback recebido no backend
  // 5. Verificar status
  const status = await paymentService.verifyPayment(result.transactionId);
  
  if (status?.status === 'completed') {
    console.log('Pagamento confirmado!');
  }
}
```

### Alternativa: E-mola (Movitel)

Processo similar via portal Movitel:
1. Acesse: https://emola.movitel.co.mz/business
2. Solicite conta empresarial
3. Obtenha credenciais de API

```env
# E-mola
VITE_EMOLA_MERCHANT_ID=seu-merchant-id
VITE_EMOLA_API_KEY=sua-api-key
```

---

## 3. Hosting e Domínio

### Opção A: Firebase Hosting (Recomendado)

#### Passo 1: Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

#### Passo 2: Login no Firebase

```bash
firebase login
```

#### Passo 3: Inicializar Hosting

```bash
firebase init hosting
```

Selecione:
- Project: `tchovadigital`
- Public directory: `dist`
- Single-page app: `Yes`
- Overwrite index.html: `No`

#### Passo 4: Build e Deploy

```bash
# Build do projeto
npm run build

# Deploy para Firebase
firebase deploy --only hosting
```

#### Passo 5: Configurar Domínio Personalizado

1. No console Firebase, vá em **Hosting**
2. Clique em **Add custom domain**
3. Digite: `tchovadigital.com`
4. Adicione os registros DNS no seu provedor de domínio:

| Tipo | Nome | Valor |
|------|------|-------|
| A | @ | 199.36.158.100 |
| CNAME | www | tchovadigital.web.app |

5. Aguarde propagação DNS (até 48h)
6. SSL automático será configurado

### Opção B: Vercel (Alternativa)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Opção C: Netlify (Alternativa)

1. Conecte seu repositório GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Domínio: Settings > Domain management

---

## 4. Painel Admin com AI (ClowdBot)

### Arquitetura do ClowdBot

```
┌─────────────────────────────────────────┐
│           PAINEL ADMIN                  │
├─────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐   │
│  │  Dashboard  │  │   ClowdBot AI   │   │
│  │  - Leads    │  │  - Chat         │   │
│  │  - Vendas   │  │  - Sugestões    │   │
│  │  - Clientes │  │  - Automação    │   │
│  └─────────────┘  └─────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │        INTEGRAÇÕES              │    │
│  │  - Firebase (Auth + DB)         │    │
│  │  - M-Pesa API                   │    │
│  │  - OpenAI/Anthropic             │    │
│  │  - WhatsApp Business            │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### Configuração do AI Agent

```env
# OpenAI (Recomendado)
VITE_OPENAI_API_KEY=sk-your-openai-key

# OU Anthropic Claude
VITE_ANTHROPIC_API_KEY=your-anthropic-key

# OU Google Gemini
VITE_GOOGLE_AI_KEY=your-google-ai-key
```

### Funcionalidades do ClowdBot

1. **Assistente de Atendimento**
   - Responde perguntas sobre serviços
   - Coleta dados de leads
   - Agenda compromissos

2. **Análise de Dados**
   - Relatórios de vendas
   - Métricas de conversão
   - Previsões de receita

3. **Automação**
   - Follow-up com clientes
   - Lembretes de pagamento
   - Notificações de novos leads

---

## 📋 Checklist de Deploy

- [ ] Firebase configurado
- [ ] Autenticação funcionando
- [ ] Firestore regras aplicadas
- [ ] M-Pesa API integrada
- [ ] Domínio configurado
- [ ] SSL ativo
- [ ] AI Agent funcionando
- [ ] Testes de pagamento realizados
- [ ] Backup configurado

---

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build produção
npm run build

# Preview build
npm run preview

# Deploy Firebase
firebase deploy

# Ver logs Firebase
firebase hosting:channel:list

# Emuladores locais
firebase emulators:start
```

---

## 📞 Suporte

- **WhatsApp**: +258 87 909 7249
- **Email**: suporte@tchovadigital.com
- **Firebase Support**: https://firebase.google.com/support