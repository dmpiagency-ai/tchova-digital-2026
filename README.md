# 🌟 TchovaDigital - Ecossistema Digital 360

[![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)](https://firebase.google.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **Ecossistema completo de serviços digitais para Moçambique** - Design, Desenvolvimento Web, Marketing Digital, Assistência GSM e muito mais.

## 🚀 Demonstração

[🔗 **Ver Site Ao Vivo**](https://tchovadigital.com) *(em breve)*

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação
- Login obrigatório para controle de acesso
- Autenticação com Email/Senha + Google OAuth
- Dashboard administrativo completo
- Controle de permissões por usuário

### 📊 Analytics Avançado
- Google Analytics 4 integrado
- Tracking de conversões em tempo real
- Funil de vendas otimizado
- Relatórios de performance

### 🎣 Captura Inteligente de Leads
- Formulários contextuais por serviço
- Progressive profiling automático
- Qualificação automática de leads
- Integração direta com WhatsApp

### 💰 Sistema de Pagamentos
- M-Pesa e eMola integrados
- Processamento seguro de pagamentos
- Recibos automáticos
- Controle financeiro completo

### 📱 Experiência Mobile-First
- Design responsivo otimizado
- Performance excepcional em redes móveis
- PWA (Progressive Web App) pronto
- Interface intuitiva e imersiva

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Firebase (Auth, Firestore, Analytics, Hosting)
- **Styling**: Tailwind CSS + shadcn/ui
- **Deploy**: Firebase Hosting com CI/CD
- **Analytics**: Google Analytics 4
- **Pagamentos**: M-Pesa API + eMola

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ e npm
- Firebase CLI (`npm install -g firebase-tools`)
- Conta Google com acesso ao Firebase Console

### 1. Clone o Repositório
```bash
git clone https://github.com/dmpiagency-ai/tchova-digital.git
cd tchova-digital
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure o Firebase
```bash
# Configuração automatizada
npm run setup:firebase

# Ou manualmente
npm run init:firebase
```

### 4. Configure Variáveis de Ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas chaves do Firebase
```

### 5. Configure Projetos Firebase
Siga o guia completo em [`FIREBASE_CONSOLE_SETUP.md`](./FIREBASE_CONSOLE_SETUP.md)

### 6. Execute em Desenvolvimento
```bash
npm run dev
```

## 🚀 Deploy

### Desenvolvimento
```bash
npm run deploy:dev
```

### Produção
```bash
npm run deploy:prod
```

### Verificação
```bash
npm run config:check
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
├── config/             # Configurações modulares 🔌
│   ├── firebase.ts     # Firebase App & Services
│   ├── features.ts     # Feature flags
│   └── environment.ts  # Environment variables
├── hooks/              # Custom hooks especializados
├── integrations/       # Integrações Firebase
├── pages/              # Páginas da aplicação
└── services/           # Serviços externos

scripts/                # Scripts de automação
├── init-firebase.js          # Inicialização completa
└── setup-firebase-projects.js # Configuração de projetos

📚 Documentação
├── FIREBASE_SETUP.md          # Setup Firebase técnico
├── FIREBASE_CONSOLE_SETUP.md  # Guia Console Firebase
├── FIREBASE_CHECKLIST.md      # Checklist completo
└── PLUG_IN_SYSTEM_README.md   # Sistema plug-in
```

## 🔌 Sistema Plug-in

Este projeto usa uma arquitetura **modular plug-in** que permite:
- ✅ Ligar/desligar funcionalidades sem quebrar código
- ✅ Configurações centralizadas e seguras
- ✅ Desenvolvimento em múltiplos ambientes
- ✅ Sincronização automática Git ↔ Firebase

### Como Usar
```typescript
// Em qualquer componente
import { useFirebaseIntegrations } from '@/integrations/firebase';

function MyComponent() {
  const { auth, analytics, trackWhatsAppClick } = useFirebaseIntegrations();
  // Tudo conectado automaticamente!
}
```

## 📊 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build para produção
npm run preview         # Preview do build

# Firebase
npm run emulators       # Emuladores locais
npm run deploy:dev      # Deploy desenvolvimento
npm run deploy:prod     # Deploy produção
npm run config:check    # Verificar configuração

# Utilitários
npm run init:firebase   # Inicialização Firebase
npm run setup:firebase  # Setup projetos Firebase
npm run lint            # Verificar código
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Contato

**TchovaDigital**
- 🌐 Website: [tchovadigital.com](https://tchovadigital.com)
- 📱 WhatsApp: +258 87 909 7249
- 📧 Email: hello@tchovadigital.com
- 🐙 GitHub: [dmpiagency-ai](https://github.com/dmpiagency-ai)

**Desenvolvido por TchovaDigital**
"# tchova-digital-2026"  
