import { Button } from '@/components/ui/button';
import { env } from '@/config/env';
import {
  CheckCircle,
  Clock,
  CreditCard,
  MessageCircle,
  Package,
  Rocket,
  Eye,
  Handshake,
  Timer,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface ProjectStatusProps {
  serviceTitle: string;
  paymentStatus: 'entry-50' | 'full' | 'final';
  paymentAmount?: string;
  projectId?: string;
  onContact: () => void;
  onPayment: () => void;
}

const ProjectStatus = ({
  serviceTitle,
  paymentStatus,
  paymentAmount,
  projectId,
  onContact,
  onPayment
}: ProjectStatusProps) => {
  // Determine current project stage based on payment status
  const getProjectStage = () => {
    if (paymentStatus === 'entry-50') return 2; // Pagamento Recebido (entrada)
    if (paymentStatus === 'full') return 2; // Pagamento Recebido (completo)
    if (paymentStatus === 'final') return 5; // Entrega Final
    return 1; // Acordo Confirmado
  };

  const currentStage = getProjectStage();

  // Project stages for timeline
  const projectStages = [
    { id: 1, title: 'Acordo Confirmado', description: 'Proposta aceite', icon: <Handshake className="w-4 h-4" /> },
    { id: 2, title: 'Pagamento Recebido', description: 'Pagamento confirmado', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 3, title: 'Em Desenvolvimento', description: 'Equipa trabalhando', icon: <Rocket className="w-4 h-4" /> },
    { id: 4, title: 'Em Revisão', description: 'Aguardando aprovação', icon: <Eye className="w-4 h-4" /> },
    { id: 5, title: 'Entrega Final', description: 'Projeto concluído', icon: <Package className="w-4 h-4" /> }
  ];

  return (
    <div className="mb-8 sm:mb-12 lg:mb-16">
      {/* Status do Projeto - Dynamic Status Display */}
      <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 sm:p-6 lg:p-8 mb-6 backdrop-blur-xl dark:bg-black/5 bg-slate-50/80 border dark:border-primary/20 border-slate-200 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg ${
              paymentStatus === 'entry-50' ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
              paymentStatus === 'full' ? 'bg-gradient-to-br from-blue-400 to-blue-600' :
              'bg-gradient-to-br from-green-400 to-green-600'
            }`}>
              {paymentStatus === 'entry-50' ? <Timer className="w-6 h-6 sm:w-7 sm:h-7 text-white" /> :
               paymentStatus === 'full' ? <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" /> :
               <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Estado do Projeto</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {paymentStatus === 'entry-50' && 'Projeto Iniciado - Entrada de 50%'}
                {paymentStatus === 'full' && 'Projeto Confirmado - Pagamento Completo'}
                {paymentStatus === 'final' && 'Projeto Concluído - Pronto para Entrega'}
              </p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
            paymentStatus === 'entry-50' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30' :
            paymentStatus === 'full' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30' :
            'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30'
          }`}>
            {paymentStatus === 'entry-50' && '🟡 Em Andamento'}
            {paymentStatus === 'full' && '🔵 Confirmado'}
            {paymentStatus === 'final' && '🟢 Concluído'}
          </div>
        </div>

        {/* Status Description */}
        <div className="bg-gradient-to-r from-primary/10 via-brand-green/5 to-transparent rounded-[16px] sm:rounded-[20px] p-4 sm:p-5 border border-primary/20">
          {paymentStatus === 'entry-50' && (
            <p className="text-sm sm:text-base text-muted-foreground">
              O seu projeto foi iniciado com o pagamento de entrada. A equipa está a trabalhar e entraremos em contacto quando estiver pronto para a próxima fase. O pagamento final será solicitado antes da entrega.
            </p>
          )}
          {paymentStatus === 'full' && (
            <p className="text-sm sm:text-base text-muted-foreground">
              O seu projeto está confirmado com pagamento completo. A equipa está a trabalhar e será notificado quando estiver pronto para revisão.
            </p>
          )}
          {paymentStatus === 'final' && (
            <p className="text-sm sm:text-base text-muted-foreground">
              O seu projeto foi concluído! Os arquivos finais estão prontos para entrega. Entre em contacto para receber tudo.
            </p>
          )}
        </div>
      </div>

      {/* Detalhes do Pagamento */}
      <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 sm:p-6 lg:p-8 mb-6 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-yellow/20 shadow-2xl">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-brand-yellow" />
          <span className="bg-gradient-to-r from-brand-yellow to-accent-light bg-clip-text text-transparent">Detalhes do Pagamento</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="dark:bg-black/10 bg-slate-100 rounded-2xl p-4 border dark:border-white/10 border-slate-200">
            <p className="text-xs text-muted-foreground mb-1">Serviço</p>
            <p className="text-sm sm:text-base font-bold text-foreground truncate">{serviceTitle}</p>
          </div>
          <div className="dark:bg-black/10 bg-slate-100 rounded-2xl p-4 border dark:border-white/10 border-slate-200">
            <p className="text-xs text-muted-foreground mb-1">Tipo de Pagamento</p>
            <p className="text-sm sm:text-base font-bold text-foreground">
              {paymentStatus === 'entry-50' && 'Entrada (50%)'}
              {paymentStatus === 'full' && 'Pagamento Completo'}
              {paymentStatus === 'final' && 'Pagamento Final'}
            </p>
          </div>
          <div className="dark:bg-black/10 bg-slate-100 rounded-2xl p-4 border dark:border-white/10 border-slate-200">
            <p className="text-xs text-muted-foreground mb-1">Valor Pago</p>
            <p className="text-sm sm:text-base font-bold text-primary">
              {paymentAmount ? `${parseInt(paymentAmount).toLocaleString('pt-MZ')} MZN` : 'Confirmado'}
            </p>
          </div>
          <div className="dark:bg-black/10 bg-slate-100 rounded-2xl p-4 border dark:border-white/10 border-slate-200">
            <p className="text-xs text-muted-foreground mb-1">ID do Projeto</p>
            <p className="text-sm sm:text-base font-bold text-foreground font-mono">{projectId || `#PRJ-${Date.now().toString().slice(-6)}`}</p>
          </div>
        </div>
      </div>

      {/* Etapa Atual - Progress Timeline */}
      <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 sm:p-6 lg:p-8 mb-6 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-green/20 shadow-2xl">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-brand-green" />
          <span className="bg-gradient-to-r from-brand-green to-primary bg-clip-text text-transparent">Etapa Atual</span>
        </h3>

        {/* Mobile Timeline - Vertical */}
        <div className="sm:hidden space-y-3">
          {projectStages.map((stage) => (
            <div key={stage.id} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                stage.id < currentStage ? 'bg-primary text-white' :
                stage.id === currentStage ? 'bg-brand-yellow text-white animate-pulse' :
                'dark:bg-white/10 dark:text-white/40 bg-slate-100 text-slate-400 border border-slate-200 dark:border-transparent'
              }`}>
                {stage.id < currentStage ? <CheckCircle className="w-5 h-5" /> : stage.icon}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${
                  stage.id === currentStage ? 'text-brand-yellow' : 
                  stage.id < currentStage ? 'text-primary' : 'text-muted-foreground'
                }`}>{stage.title}</p>
                <p className="text-xs text-muted-foreground">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden sm:block">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-white/10 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-primary to-brand-green rounded-full transition-all duration-500"
                style={{ width: `${((currentStage - 1) / (projectStages.length - 1)) * 100}%` }}
              />
            </div>

            {projectStages.map((stage) => (
              <div key={stage.id} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center ${
                  stage.id < currentStage ? 'bg-primary text-white' :
                  stage.id === currentStage ? 'bg-brand-yellow text-white animate-pulse shadow-lg shadow-brand-yellow/30' :
                  'dark:bg-white/10 dark:text-white/40 bg-slate-100 text-slate-400 border border-slate-200 dark:border-transparent'
                }`}>
                  {stage.id < currentStage ? <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6" /> : stage.icon}
                </div>
                <p className={`text-xs lg:text-sm font-bold mt-2 text-center ${
                  stage.id === currentStage ? 'text-brand-yellow' : 
                  stage.id < currentStage ? 'text-primary' : 'text-muted-foreground'
                }`}>{stage.title}</p>
                <p className="text-[10px] lg:text-xs text-muted-foreground text-center hidden lg:block">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client Actions - Contextual Buttons */}
      <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 sm:p-6 lg:p-8 mb-6 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl">
        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">Ações Disponíveis</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {paymentStatus === 'entry-50' && (
            <>
              <Button
                onClick={onContact}
                className="h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-bold bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar sobre o Projeto
              </Button>
              <Button
                onClick={onPayment}
                variant="outline"
                className="h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-bold border-2 border-brand-yellow text-brand-yellow hover:bg-brand-yellow hover:text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Efetuar Pagamento Final
              </Button>
            </>
          )}
          {paymentStatus === 'full' && (
            <>
              <Button
                onClick={onContact}
                className="h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-bold bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar sobre o Projeto
              </Button>
              <div className="flex items-center justify-center p-4 bg-blue-500/10 rounded-[20px] sm:rounded-[24px] border border-blue-500/20">
                <div className="text-center">
                  <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-blue-600 dark:text-blue-400">Projeto em Desenvolvimento</p>
                  <p className="text-xs text-muted-foreground">Entraremos em contacto em breve</p>
                </div>
              </div>
            </>
          )}
          {paymentStatus === 'final' && (
            <>
              <Button
                onClick={onContact}
                className="h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-bold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              >
                <Package className="w-5 h-5 mr-2" />
                Receber Arquivos Finais
              </Button>
              <Button
                onClick={onContact}
                variant="outline"
                className="h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Falar com a Equipa
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Trust Block */}
      <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 sm:p-6 lg:p-8 backdrop-blur-xl bg-gradient-to-br from-primary/10 via-brand-green/5 to-brand-yellow/10 border border-primary/20 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-brand-green rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          </div>
          <div>
            <p className="text-sm sm:text-base lg:text-lg font-bold text-foreground">
              Seu projeto está sendo acompanhado pela equipa Tchova Digital
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Suporte humano disponível para tirar dúvidas e acompanhar o progresso
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
