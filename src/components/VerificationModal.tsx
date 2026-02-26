import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Shield,
  RefreshCw,
  MessageCircle,
  Smartphone,
  Check,
  AlertCircle,
  Clock,
  X
} from 'lucide-react';
import {
  createVerificationCode,
  verifyCode,
  sendCodeViaWhatsApp,
  getVerificationData,
  getTimeRemaining,
  VerificationResult
} from '@/utils/verificationCode';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId: string;
  phoneNumber: string;
  actionDescription: string;
}

const VerificationModal = ({
  isOpen,
  onClose,
  onSuccess,
  projectId,
  phoneNumber,
  actionDescription
}: VerificationModalProps) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'verifying' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<{ minutes: number; seconds: number }>({ minutes: 5, seconds: 0 });
  const [sentCode, setSentCode] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  // Update time remaining
  useEffect(() => {
    if (status !== 'sent') return;

    const interval = setInterval(() => {
      const data = getVerificationData();
      if (data) {
        const remaining = getTimeRemaining(data.expiresAt);
        setTimeRemaining({ minutes: remaining.minutes, seconds: remaining.seconds });
        
        if (remaining.total <= 0) {
          setError('Código expirado. Solicite um novo código.');
          setStatus('error');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [status]);

  // Send code when modal opens
  useEffect(() => {
    if (isOpen && status === 'idle') {
      handleSendCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Only run when modal opens

  const handleSendCode = async () => {
    setStatus('sending');
    setError(null);
    setCode(['', '', '', '', '', '']);

    try {
      const { code: newCode } = createVerificationCode(projectId, phoneNumber);
      setSentCode(newCode); // For demo purposes - in production, don't show this

      // Send via WhatsApp
      const result = await sendCodeViaWhatsApp(phoneNumber, newCode);

      if (result.success) {
        setStatus('sent');
      } else {
        setError(result.error || 'Erro ao enviar código');
        setStatus('error');
      }
    } catch (err) {
      setError('Erro ao enviar código. Tente novamente.');
      setStatus('error');
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newCode = [...code];
    newCode[index] = value.slice(-1); // Only keep last digit
    setCode(newCode);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (index === 5 && value) {
      const fullCode = newCode.join('');
      if (fullCode.length === 6) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    
    if (pastedData.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < pastedData.length; i++) {
        newCode[i] = pastedData[i];
      }
      setCode(newCode);

      if (pastedData.length === 6) {
        handleVerify(pastedData);
      }
    }
  };

  const handleVerify = async (fullCode: string) => {
    setStatus('verifying');
    setError(null);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const result: VerificationResult = verifyCode(fullCode, projectId);

    if (result.success) {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } else {
      setStatus('sent');
      setError(result.error || 'Código inválido');
      setRemainingAttempts(result.remainingAttempts ?? null);
      
      // Clear code on error
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendCode = async () => {
    await handleSendCode();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-background rounded-[32px] shadow-2xl border border-primary/20 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-brand-green/10 p-6 border-b border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-brand-green rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Verificação de Segurança</h2>
                <p className="text-xs text-muted-foreground">{actionDescription}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Sending state */}
          {status === 'sending' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Enviando código...</p>
            </div>
          )}

          {/* Sent state - Enter code */}
          {(status === 'sent' || status === 'verifying') && (
            <div className="space-y-6">
              {/* Info */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Enviamos um código para seu WhatsApp
                </p>
                <p className="text-xs text-muted-foreground">
                  {phoneNumber.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4')}
                </p>
              </div>

              {/* Code input */}
              <div className="flex justify-center gap-2 sm:gap-3">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleCodeChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    disabled={status === 'verifying'}
                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-white/5 dark:bg-black/10 border-2 border-primary/30 rounded-2xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all disabled:opacity-50"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>
                  Expira em {timeRemaining.minutes}:{timeRemaining.seconds.toString().padStart(2, '0')}
                </span>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Remaining attempts */}
              {remainingAttempts !== null && remainingAttempts > 0 && (
                <p className="text-center text-xs text-amber-600 dark:text-amber-400">
                  {remainingAttempts} tentativa{remainingAttempts !== 1 ? 's' : ''} restante{remainingAttempts !== 1 ? 's' : ''}
                </p>
              )}

              {/* Demo hint - Remove in production */}
              {sentCode && (
                <div className="text-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    [DEMO] Código: <span className="font-bold">{sentCode}</span>
                  </p>
                </div>
              )}

              {/* Verify button */}
              <Button
                onClick={() => handleVerify(code.join(''))}
                disabled={code.join('').length !== 6 || status === 'verifying'}
                className="w-full h-14 rounded-[24px] font-bold bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:transform-none"
              >
                {status === 'verifying' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </div>
                ) : (
                  'Confirmar Código'
                )}
              </Button>

              {/* Resend link */}
              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  className="text-sm text-primary hover:text-primary-darker transition-colors inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reenviar código
                </button>
              </div>
            </div>
          )}

          {/* Success state */}
          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check className="w-8 h-8 text-white" />
              </div>
              <p className="text-lg font-bold text-foreground">Verificado!</p>
              <p className="text-sm text-muted-foreground">Ação autorizada</p>
            </div>
          )}

          {/* Error state */}
          {status === 'error' && (
            <div className="space-y-6">
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-bold text-foreground">Erro</p>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>

              <Button
                onClick={handleResendCode}
                className="w-full h-14 rounded-[24px] font-bold bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Solicitar Novo Código
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </div>
            <div className="flex items-center gap-1">
              <Smartphone className="w-4 h-4" />
              <span>SMS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
