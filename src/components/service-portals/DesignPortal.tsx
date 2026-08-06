// ============================================
// DESIGN PORTAL — Wizard diagnóstico 3 passos
// Identidade Visual & Branding
// ============================================

import DiagnosticWizard from './DiagnosticWizard';

const DesignPortal = () => (
  <DiagnosticWizard
    portalName="Design & Branding"
    whatsappIntro="Olá! Preciso de ajuda com identidade visual / design para o meu negócio."
    steps={[
      {
        type: 'options',
        question: 'Qual é a tua situação?',
        subtitle: 'Escolhe a que mais se aproxima.',
        options: [
          { label: 'Ainda não tenho logo nem identidade', value: 'Sem identidade visual' },
          { label: 'Tenho logo mas está desactualizado', value: 'Logo desactualizado' },
          { label: 'Tenho marca mas falta-me templates para redes', value: 'Faltam templates' },
          { label: 'Preciso de rebrand completo', value: 'Rebrand completo' },
        ],
      },
      {
        type: 'options',
        question: 'O que precisas mais?',
        options: [
          { label: 'Logo + cartão de visita', value: 'Logo + cartão' },
          { label: 'Identidade visual completa', value: 'Identidade completa' },
          { label: 'Templates para Instagram / Facebook', value: 'Templates redes sociais' },
          { label: 'Manual de marca', value: 'Manual de marca' },
        ],
      },
      {
        type: 'contact',
        question: 'Fala connosco!',
        subtitle: 'Envia-nos uma mensagem e respondemos em menos de 2 horas.',
      },
    ]}
  />
);

export default DesignPortal;
