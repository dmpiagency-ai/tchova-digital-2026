// ============================================
// WEBSITES PORTAL — Wizard diagnóstico 3 passos
// Criação de Sites & E-commerce
// ============================================

import DiagnosticWizard from './DiagnosticWizard';

const WebsitesPortal = () => (
  <DiagnosticWizard
    portalName="Websites"
    whatsappIntro="Olá! Preciso de ajuda com o meu site / loja online."
    steps={[
      {
        type: 'options',
        question: 'E o teu site?',
        subtitle: 'Conta-nos onde estás agora.',
        options: [
          { label: 'Não tenho site nenhum', value: 'Sem site' },
          { label: 'Tenho mas está desactualizado', value: 'Site desactualizado' },
          { label: 'Tenho mas não traz clientes', value: 'Site sem conversão' },
          { label: 'Quero uma loja online', value: 'E-commerce' },
        ],
      },
      {
        type: 'options',
        question: 'O que é mais importante?',
        options: [
          { label: 'Aparecer no Google', value: 'SEO / visibilidade' },
          { label: 'Ter um site profissional e moderno', value: 'Site profissional' },
          { label: 'Vender online (e-commerce)', value: 'Loja online' },
          { label: 'Landing pages para campanhas', value: 'Landing pages' },
        ],
      },
      {
        type: 'contact',
        question: 'Fala connosco!',
        subtitle: 'Recebe um orçamento personalizado em menos de 24 horas.',
      },
    ]}
  />
);

export default WebsitesPortal;
