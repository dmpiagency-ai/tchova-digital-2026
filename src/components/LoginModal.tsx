import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Shield, AlertCircle, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "Acesso ao Aluguel de Ferramentas GSM", 
  description = "Faça login para alugar ferramentas GSM profissionais" 
}) => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.success) {
        onClose();
      } else {
        setError(result.error || 'Email ou senha incorretos.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao tentar fazer login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md backdrop-blur-2xl bg-[#1a1d1b]/95 border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 no-min-size"
          aria-label="Fechar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center space-y-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-tight">{title}</h2>
          <p className="text-xs sm:text-sm text-[#eff3c5]/70 font-medium">{description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="modal-email" className="text-xs font-semibold text-white/80">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                id="modal-email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 backdrop-blur-md bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-[16px] focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modal-password" className="text-xs font-semibold text-white/80">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                id="modal-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 backdrop-blur-md bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-[16px] focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors no-min-size"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 rounded-[16px]">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-xs text-red-200">{error}</AlertDescription>
            </Alert>
          )}

          {/* Demo Credentials Hint */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
            <strong>Demo:</strong> admin@tchova.digital / admin123
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full h-12 text-sm font-bold bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-[20px] uppercase tracking-wider"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Verificando...' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
