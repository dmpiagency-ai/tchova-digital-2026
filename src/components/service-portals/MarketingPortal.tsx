// ============================================
// MARKETING PORTAL — Wizard diagnóstico 3 passos
// Campanhas & Redes Sociais
// ============================================

import DiagnosticWizard from './DiagnosticWizard';

const MarketingPortal = () => (
  <DiagnosticWizard
    portalName="Marketing Digital"
    whatsappIntro="Olá! Quero melhorar o marketing digital do meu negócio."
    steps={[
      {
        type: 'options',
        question: 'Como estão as tuas vendas online?',
        subtitle: 'Sê honesto — é para te ajudar melhor.',
        options: [
          { label: 'Não tenho presença digital', value: 'Sem presença digital' },
          { label: 'Tenho redes mas sem resultados', value: 'Redes sem resultados' },
          { label: 'Já faço anúncios mas não funciona', value: 'Anúncios sem retorno' },
          { label: 'Quero escalar o que já funciona', value: 'Quer escalar' },
        ],
      },
      {
        type: 'options',
        question: 'O que te bloqueia?',
        options: [
          { label: 'Não sei por onde começar', value: 'Não sabe por onde começar' },
          { label: 'Não tenho tempo para gerir', value: 'Sem tempo' },
          { label: 'Já fui enganado por uma agência', value: 'Experiência negativa com agência' },
          { label: 'Preciso de resultados rápidos', value: 'Quer resultados rápidos' },
        ],
      },
      {
        type: 'contact',
        question: 'Fala connosco!',
        subtitle: 'Diagnóstico gratuito. Respondemos em menos de 2 horas.',
      },
    ]}
  />
);

export default MarketingPortal;
