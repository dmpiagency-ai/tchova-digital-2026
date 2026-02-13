# 🚀 Guia Completo: Configuração Firebase Console - TchovaDigital

## Visão Geral

Este guia mostra como configurar os 3 projetos Firebase necessários para o sistema TchovaDigital:
- **tchova-digital-dev** (Desenvolvimento)
- **tchova-digital-staging** (Testes)
- **tchova-digital-prod** (Produção)

---

## 📋 Pré-requisitos

1. **Conta Google** com acesso ao Firebase Console
2. **Projeto Firebase** criado
3. **Firebase CLI** instalado (`npm install -g firebase-tools`)
4. **Login feito**: `firebase login`

---

## 🔥 1. CRIAR PROJETO DE DESENVOLVIMENTO

### Passo 1: Acessar Firebase Console
```
https://console.firebase.google.com/
```

### Passo 2: Criar Novo Projeto
1. Clique **"Criar um projeto"** ou **"Create a project"**
2. **Nome do projeto**: `tchova-digital-dev`
3. **ID do projeto**: `tchova-digital-dev` (será sugerido automaticamente)
4. Marque **"Aceito os termos..."**
5. Clique **"Continuar"**

### Passo 3: Configurar Google Analytics
1. **Ativar Google Analytics**: Sim
2. **Conta do Google Analytics**: Selecione ou crie uma conta
3. **Propriedade do Analytics**: `TchovaDigital Dev`
4. Clique **"Criar projeto"**

### Passo 4: Configurar Autenticação
1. No menu lateral: **Authentication**
2. Aba **"Sign-in method"**
3. **Email/Password**: Clique **"Enable"**
4. **Google**: Clique **"Enable"**
   - **Nome do projeto**: `TchovaDigital Dev`
   - **Email de suporte**: seu-email@exemplo.com

### Passo 5: Configurar Firestore
1. No menu lateral: **Firestore Database**
2. Clique **"Criar banco de dados"**
3. **Modo de produção**: Selecionar
4. **Local**: `nam5 (us-central)` ou `eur3 (europe-west)`
5. Clique **"Concluído"**

### Passo 6: Configurar Hosting
1. No menu lateral: **Hosting**
2. Clique **"Começar"**
3. **Pasta public**: `dist` (já configurado)
4. **Configurar como app de página única**: Sim
5. Clique **"Concluído"**

### Passo 7: Obter Configurações
1. Clique no ícone **"⚙️"** (Configurações do projeto)
2. **Configurações gerais** → **Seus apps**
3. Clique **"</>"** (Web app)
4. **Nome do app**: `TchovaDigital Dev Web`
5. **Hosting**: Marcar
6. Copie as configurações que aparecerão

---

## 🔥 2. CRIAR PROJETO DE STAGING

### Repetir Passos 1-7 com essas diferenças:

- **Nome do projeto**: `tchova-digital-staging`
- **ID do projeto**: `tchova-digital-staging`
- **Propriedade Analytics**: `TchovaDigital Staging`
- **Nome do app**: `TchovaDigital Staging Web`

---

## 🔥 3. CRIAR PROJETO DE PRODUÇÃO

### ⚠️ IMPORTANTE: Projeto de Produção

Para produção, use um plano pago do Firebase (Blaze Plan) para ter mais recursos.

### Configuração Diferencial:

- **Nome do projeto**: `tchova-digital-prod`
- **ID do projeto**: `tchova-digital-prod`
- **Propriedade Analytics**: `TchovaDigital Production`
- **Nome do app**: `TchovaDigital Production Web`

### Configurações Adicionais para Produção:

1. **Atualizar Plano**: Ir para **"Usage and billing"** → **"Modify plan"** → **Blaze Plan**
2. **Security Rules**: Configurar regras de segurança mais restritivas
3. **Custom Domain**: Configurar domínio personalizado se necessário

---

## 🔧 4. CONFIGURAR VARIÁVEIS DE AMBIENTE

### Criar arquivo `.env.local`

```bash
cp .env.example .env.local
```

### Preencher com dados de cada projeto:

#### Desenvolvimento (.env.local para dev):
```env
# Firebase - Desenvolvimento
VITE_FIREBASE_API_KEY=AIzaSyD... (do projeto dev)
VITE_FIREBASE_AUTH_DOMAIN=tchova-digital-dev.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tchova-digital-dev
VITE_FIREBASE_STORAGE_BUCKET=tchova-digital-dev.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MEASUREMENT_ID=G-ABCDEFGHIJ

# Outras configurações
VITE_WHATSAPP_NUMBER=+258879097249
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PAYMENTS=false
```

#### Produção (.env.production):
```env
# Firebase - Produção
VITE_FIREBASE_API_KEY=AIzaSyD... (do projeto prod)
VITE_FIREBASE_AUTH_DOMAIN=tchova-digital-prod.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tchova-digital-prod
# ... outros valores do projeto de produção

VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PAYMENTS=true
```

---

## 🖥️ 5. CONECTAR PROJETOS LOCALMENTE

### Inicializar Firebase CLI:
```bash
firebase login
npm run init:firebase
```

### Adicionar projetos:
```bash
# Adicionar projetos existentes
firebase use --add
# Selecionar: tchova-digital-dev
# Alias: development

firebase use --add
# Selecionar: tchova-digital-staging
# Alias: staging

firebase use --add
# Selecionar: tchova-digital-prod
# Alias: production
```

### Verificar configuração:
```bash
firebase projects:list
firebase use  # Ver qual está ativo
```

---

## 🧪 6. TESTAR CONFIGURAÇÃO

### Testar emuladores:
```bash
npm run emulators
```

### Testar deploy desenvolvimento:
```bash
npm run deploy:dev
```

### Verificar status:
```bash
npm run config:check
```

---

## 🔐 7. CONFIGURAÇÕES DE SEGURANÇA

### Firestore Security Rules (Produção):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Leads - only authenticated users can create
    match /leads/{leadId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && request.auth.token.admin == true;
    }

    // Analytics data - admin only
    match /analytics/{document} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

### Storage Security Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

---

## 📊 8. CONFIGURAÇÕES DE MONITORAMENTO

### Google Analytics:
1. Acesse **Analytics** no Firebase Console
2. Vá para **Admin** → **Data Streams**
3. Configure eventos personalizados:
   - `whatsapp_click`
   - `lead_capture`
   - `service_view`
   - `payment_complete`

### Alertas:
1. **Functions** → **Health** → Configurar alertas
2. **Hosting** → Configurar monitoramento de uptime
3. **Database** → Configurar alertas de uso

---

## 🚀 9. DEPLOY INICIAL

### Deploy desenvolvimento:
```bash
firebase use development
npm run deploy:dev
```

### Deploy produção:
```bash
firebase use production
npm run deploy:prod
```

---

## 🔍 10. VERIFICAÇÃO FINAL

### Checklist:
- ✅ Projetos criados no Firebase Console
- ✅ Autenticação configurada
- ✅ Firestore criado
- ✅ Hosting configurado
- ✅ Analytics ativo
- ✅ Variáveis de ambiente configuradas
- ✅ Firebase CLI conectado
- ✅ Deploy testado
- ✅ Regras de segurança aplicadas

### Testes funcionais:
1. **Login/Registro**: Testar autenticação
2. **Analytics**: Verificar eventos no GA4
3. **Database**: Testar leitura/escrita
4. **Hosting**: Verificar deploy

---

## 🆘 TROUBLESHOOTING

### Erro: "Project not found"
```bash
firebase projects:list
firebase use --add  # Adicionar projeto
```

### Erro: "Permission denied"
- Verificar se você é owner do projeto
- Adicionar colaboradores se necessário

### Erro: "Quota exceeded"
- Upgrade para Blaze Plan (produção)
- Verificar limites de uso

---

## 📞 SUPORTE

**Documentação Oficial:**
- [Firebase Console Guide](https://firebase.google.com/docs/console)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

**Suporte TchovaDigital:**
- WhatsApp: +258 84 123 4567
- Email: suporte@tchovadigital.com

---

**🎉 Após completar esta configuração, seu sistema estará totalmente operacional com Firebase!**