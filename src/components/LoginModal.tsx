import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Mail, User, Shield, MessageCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  redirectTo?: string;
}

// Pre-filled demo data for new users
const DEMO_PRESETS = {
  name: 'Seu Nome',
  email: 'seuemail@exemplo.com',
  whatsapp: '+258 8X XXX XXXX',
  password: ''
};

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  title = "Acesso ao Sistema",
  description = "Faça login para acessar recursos exclusivos",
  redirectTo
}) => {
  const { login, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLoginMode) {
        // Login mode - only email and password required
        if (!formData.email || !formData.password) {
          setError('Email e senha são obrigatórios');
          return;
        }

        const result = await login(formData.email, formData.password);
        if (result.success) {
          onClose();
          if (redirectTo) {
            window.location.href = redirectTo;
          }
        } else {
          setError(result.error || 'Email ou senha incorretos');
        }
      } else {
        // Register mode - all fields required
        if (!formData.name || !formData.email || !formData.whatsapp || !formData.password) {
          setError('Todos os campos são obrigatórios');
          return;
        }

        if (formData.password.length < 6) {
          setError('A senha deve ter pelo menos 6 caracteres');
          return;
        }

        // Register new user locally
        const { registerLocalUser, setCurrentUser } = await import('@/services/localAuthService');
        const registerResult = registerLocalUser({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.whatsapp,
        });
        
        if (registerResult.success && registerResult.user) {
          // Send WhatsApp welcome message
          const welcomeMessage = encodeURIComponent(
            `🎉 *Bem-vindo à TchovaDigital!*\n\n` +
            `Olá ${formData.name}! 🙌\n\n` +
            `Sua conta foi criada com sucesso! Agora você pode:\n` +
            `✅ Explorar nossos serviços\n` +
            `✅ Solicitar orçamentos\n` +
            `✅ Acompanhar seus projetos\n\n` +
            `🚀 *Comece agora:* https://tchova-digital-2026.vercel.app\n\n` +
            `💡 Use o código *BEMVINDO10* para 10% de desconto no seu primeiro projeto!`
          );
          
          // Open WhatsApp with welcome message
          const whatsappNumber = formData.whatsapp.replace(/\D/g, '');
          window.open(`https://wa.me/${whatsappNumber}?text=${welcomeMessage}`, '_blank');
          
          // Auto login after registration
          const loginResult = await login(formData.email, formData.password);
          if (loginResult.success) {
            setRegistrationComplete(true);
            
            // Dispatch event to show WelcomeModal (only for NEW registrations)
            window.dispatchEvent(new CustomEvent('new-user-registered', {
              detail: { user: registerResult.user }
            }));
            
            onClose();
            if (redirectTo) {
              window.location.href = redirectTo;
            }
          } else {
            setError('Conta criada! Faça login para continuar.');
            setIsLoginMode(true);
          }
        } else {
          setError(registerResult.error || 'Erro ao criar conta. Tente novamente.');
        }
      }
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="tech-modal sm:max-w-md rounded-[48px] backdrop-blur-[20px] bg-white/90 dark:bg-black/90">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setIsLoginMode(true)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isLoginMode
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setIsLoginMode(false)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                !isLoginMode
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Criar Conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={DEMO_PRESETS.name}
                  required={!isLoginMode}
                  className="rounded-[16px] border-gray-200 focus:ring-[#22C55E]"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder={DEMO_PRESETS.email}
                required
                className="rounded-[16px] border-gray-200 focus:ring-[#22C55E]"
              />
            </div>

            {!isLoginMode && (
              <div className="space-y-2">
                <Label htmlFor="whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-green-500" />
                  WhatsApp
                  <span className="text-xs text-muted-foreground">(receberá mensagem de boas-vindas)</span>
                </Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                  placeholder="+258 87 123 4567"
                  required={!isLoginMode}
                  className="rounded-[16px] border-gray-200 focus:ring-[#22C55E]"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="rounded-[16px] border-gray-200 focus:ring-[#22C55E]"
              />
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="tech-button w-full rounded-[24px] py-2 px-6 font-bold transition-all duration-400"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isLoginMode ? 'Entrar' : 'Criar Conta'}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            {isLoginMode ? (
              <p>
                Não tem conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginMode(false)}
                  className="text-primary hover:underline"
                >
                  Criar conta
                </button>
              </p>
            ) : (
              <p>
                Já tem conta?{' '}
                <button
                  type="button"
                  onClick={() => setIsLoginMode(true)}
                  className="text-primary hover:underline"
                >
                  Fazer login
                </button>
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;