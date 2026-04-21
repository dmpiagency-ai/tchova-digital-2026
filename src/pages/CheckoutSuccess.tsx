import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  MessageCircle, 
  Shield, 
  ArrowRight,
  Mail,
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import Header from '@/components/Header';
import { env } from '@/config/env';

// Payment type labels
const paymentTypeLabels: Record<string, string> = {
  'entry-50': 'Entrada 50%',
  'full': 'Pagamento Total',
  'final-50': 'Parcela Final 50%',
  'installment': 'Parcela'
};

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(8);
  const [showCountdown, setShowCountdown] = useState(true);

  // Extract query parameters
  const serviceName = searchParams.get('serviceName') || 'Serviço';
  const serviceId = searchParams.get('serviceId') || '';
  const paymentType = searchParams.get('paymentType') || 'entry-50';
  const amount = searchParams.get('amount') || '0';
  const projectId = searchParams.get('projectId') || `TCH-${Date.now().toString(36).toUpperCase()}`;
  const clientEmail = searchParams.get('email') || '';

  // Auto-redirect countdown
  useEffect(() => {
    if (!showCountdown) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showCountdown]);

  // Navigate when countdown reaches 0
  useEffect(() => {
    if (showCountdown && countdown === 0) {
      navigate(`/service?id=${serviceId}`);
    }
  }, [countdown, showCountdown, navigate, serviceId]);

  // Handle WhatsApp contact
  const handleWhatsApp = useCallback(() => {
    setShowCountdown(false);
    const message = `Olá! Acabei de confirmar o pagamento do projeto ${serviceName} (${projectId}). Gostaria de saber os próximos passos.`;
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  }, [serviceName, projectId]);

  // Handle back to service
  const handleBackToService = useCallback(() => {
    navigate(`/service?id=${serviceId}`);
  }, [navigate, serviceId]);

  // Get current year
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 via-brand-green/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-tr from-brand-yellow/10 via-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary/5 to-brand-green/5 rounded-full blur-3xl" />
      </div>

      <Header />

      <main className="container relative z-10 mx-auto px-4 py-6 sm:py-8 max-w-xl">
        {/* Main Confirmation Card */}
        <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-6 sm:p-8 lg:p-10 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl">
          
          {/* Success Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-primary to-brand-green rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-primary/30 animate-pulse"></div>
            </div>
          </div>

          {/* Main Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-3">
              Pagamento Confirmado com Sucesso
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
              O seu pagamento foi recebido e o projeto já está em andamento.
            </p>
          </div>

          {/* Project Details */}
          <div className="bg-gradient-to-r from-primary/10 via-brand-green/5 to-primary/10 rounded-[20px] sm:rounded-[24px] p-4 sm:p-6 mb-6 sm:mb-8 border border-primary/20">
            <div className="space-y-4">
              {/* Service Name */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Serviço</span>
                <span className="font-bold text-foreground text-sm sm:text-base text-right max-w-[60%] truncate">
                  {serviceName}
                </span>
              </div>

              {/* Payment Type */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tipo de pagamento</span>
                <span className="font-semibold text-primary text-sm sm:text-base">
                  {paymentTypeLabels[paymentType] || paymentType}
                </span>
              </div>

              {/* Amount Paid */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-sm text-muted-foreground">Valor pago</span>
                <span className="font-bold text-lg sm:text-xl text-foreground">
                  {parseInt(amount).toLocaleString('pt-MZ')} MZN
                </span>
              </div>

              {/* Project ID */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-sm text-muted-foreground">ID do projeto</span>
                <span className="font-mono font-bold text-brand-yellow text-sm">
                  {projectId}
                </span>
              </div>
            </div>
          </div>

          {/* Próximos Passos Section */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center">
              <Sparkles className="w-5 h-5 text-brand-yellow mr-2" />
              O que acontece agora?
            </h2>
            
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <p className="text-sm text-muted-foreground pt-1">
                  Nossa equipa confirma internamente o pagamento
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <p className="text-sm text-muted-foreground pt-1">
                  A nossa equipa entrará em contacto directo consigo
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <p className="text-sm text-muted-foreground pt-1">
                  O desenvolvimento do projeto será iniciado
                </p>
              </div>
            </div>

            {/* Trust message */}
            <p className="text-xs sm:text-sm text-center text-muted-foreground mt-4 italic">
              A Tchova Digital acompanha cada etapa com profissionalismo.
            </p>
          </div>

          {/* Email Confirmation */}
          {clientEmail && (
            <div className="bg-white/5 rounded-[16px] sm:rounded-[20px] p-4 mb-6 sm:mb-8 border border-white/10 flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-yellow/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-brand-yellow" />
              </div>
              <p className="text-sm text-muted-foreground">
                Um comprovativo foi enviado para <span className="font-medium text-foreground">{clientEmail}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Primary Button */}
            <Button
              onClick={handleBackToService}
              className="w-full h-14 sm:h-16 rounded-[20px] sm:rounded-[24px] font-bold text-base sm:text-lg bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-400 relative overflow-hidden group"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Voltar ao Serviço
            </Button>

            {/* Secondary Button */}
            <Button
              onClick={handleWhatsApp}
              variant="outline"
              className="w-full h-12 sm:h-14 rounded-[20px] sm:rounded-[24px] font-semibold text-sm sm:text-base border-2 border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Falar com o Gestor de Projecto
            </Button>
          </div>

          {/* Countdown */}
          {showCountdown && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 text-xs sm:text-sm text-muted-foreground bg-white/5 rounded-full px-4 py-2">
                <Clock className="w-4 h-4" />
                <span>
                  Redirecionamento automático em <span className="font-bold text-primary">{countdown}</span> segundos...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">
              Pagamento processado com segurança.
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Tchova Digital © {currentYear}
          </p>
        </div>
      </main>
    </div>
  );
};

export default CheckoutSuccess;
