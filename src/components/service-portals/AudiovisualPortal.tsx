// ============================================
// AUDIOVISUAL PORTAL — Wizard diagnóstico 3 passos
// Vídeo, Fotografia & Conteúdo
// ============================================

import DiagnosticWizard from './DiagnosticWizard';

const AudiovisualPortal = () => (
  <DiagnosticWizard
    portalName="Audiovisual"
    whatsappIntro="Olá! Preciso de conteúdo audiovisual (vídeo / foto) para o meu negócio."
    steps={[
      {
        type: 'options',
        question: 'Que conteúdo precisas?',
        subtitle: 'Escolhe o que faz mais sentido agora.',
        options: [
          { label: 'Vídeos para redes sociais', value: 'Vídeos redes sociais' },
          { label: 'Sessão fotográfica profissional', value: 'Fotografia profissional' },
          { label: 'Vídeo institucional / apresentação', value: 'Vídeo institucional' },
          { label: 'Conteúdo recorrente mensal', value: 'Conteúdo mensal' },
        ],
      },
      {
        type: 'options',
        question: 'Para que serve?',
        options: [
          { label: 'Atrair novos clientes', value: 'Atrair clientes' },
          { label: 'Mostrar o meu produto / serviço', value: 'Mostrar produto' },
          { label: 'Reforçar a marca nas redes', value: 'Branding redes sociais' },
          { label: 'Evento ou lançamento específico', value: 'Evento / lançamento' },
        ],
      },
      {
        type: 'contact',
        question: 'Fala connosco!',
        subtitle: 'Envia-nos uma mensagem e preparamos uma proposta à tua medida.',
      },
    ]}
  />
);

export default AudiovisualPortal;
