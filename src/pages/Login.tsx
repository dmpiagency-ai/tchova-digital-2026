import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Phone,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import logo from '@/assets/logo.svg';
import { registerLocalUser, isUsingLocalAuth } from '@/services/localAuthService';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    isRegistering: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.isRegistering) {
      if (!formData.name) {
        newErrors.name = 'Nome é obrigatório';
      }
      if (!formData.phone) {
        newErrors.phone = 'Telefone é obrigatório';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      // Handle registration
      if (formData.isRegistering) {
        if (isUsingLocalAuth()) {
          // Local registration
          const result = registerLocalUser({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            phone: formData.phone
          });
          
          if (result.success) {
            setSuccessMessage('Conta criada com sucesso! Faça login para continuar.');
            setFormData(prev => ({ ...prev, isRegistering: false }));
            setIsSubmitting(false);
            return;
          } else {
            setErrors({ submit: result.error || 'Erro ao criar conta' });
            setIsSubmitting(false);
            return;
          }
        }
      }
      
      // Handle login
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Navigate to intended page or home
        navigate(from, { replace: true });
      } else {
        setErrors({ submit: result.error || 'Email ou senha incorretos' });
      }
    } catch (error: unknown) {
      setErrors({ submit: error instanceof Error ? error.message : 'Erro ao fazer login' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setFormData(prev => ({ ...prev, isRegistering: !prev.isRegistering }));
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Enhanced liquid glass background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-32 right-20 w-80 h-80 bg-gradient-to-br from-primary/10 via-accent/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 via-primary/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-pink-500/5 to-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="h-10 px-4 rounded-xl backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-primary/30 text-foreground hover:text-primary transition-all duration-300 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 shadow-2xl animate-fade-up rounded-[48px]">
          <CardHeader className="text-center space-y-4 pb-6">
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3">
              <img src={logo} alt="TchovaDigital Logo" className="h-10 w-auto" />
              <h1 className="text-2xl font-bold gradient-text">TchovaDigital</h1>
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-xl font-bold text-foreground">
                {formData.isRegistering ? 'Criar Conta' : 'Entrar na Conta'}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {formData.isRegistering 
                  ? 'Crie sua conta para acessar recursos exclusivos'
                  : 'Acesse sua conta para gerenciar seus serviços'
                }
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration Fields */}
              {formData.isRegistering && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                      Nome Completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`pl-10 backdrop-blur-md bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground rounded-[16px] ${errors.name ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-xs text-red-500 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
                      Telefone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+258 8X XXX XXXX"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`pl-10 backdrop-blur-md bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground rounded-[16px] ${errors.phone ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-xs text-red-500 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 backdrop-blur-md bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground rounded-[16px] ${errors.email ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`pl-10 pr-10 backdrop-blur-md bg-white/10 border-white/20 text-foreground placeholder:text-muted-foreground rounded-[16px] ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <Alert variant="destructive" className="border-red-200 bg-red-50/10">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">{errors.submit}</AlertDescription>
                </Alert>
              )}

              {/* Success Message */}
              {successMessage && (
                <Alert className="border-green-200 bg-green-50/10">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <AlertDescription className="text-sm text-green-600">{successMessage}</AlertDescription>
                </Alert>
              )}

              {/* Demo Credentials Info */}
              {!formData.isRegistering && isUsingLocalAuth() && (
                <Alert className="border-blue-200 bg-blue-50/10">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <AlertDescription className="text-xs text-blue-600">
                    <strong>Demo:</strong> admin@tchova.digital / admin123
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full h-11 text-sm font-bold bg-gradient-to-r from-[#22C55E] to-emerald-600 hover:from-[#16A34A] hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-400 rounded-[24px]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Shield className="w-4 h-4 mr-2" />
                )}
                {isSubmitting 
                  ? 'Processando...' 
                  : formData.isRegistering 
                    ? 'Criar Conta' 
                    : 'Entrar'
                }
              </Button>
            </form>

            <Separator className="bg-white/20" />

            {/* Toggle Mode */}
            <div className="text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                {formData.isRegistering 
                  ? 'Já tem uma conta?' 
                  : 'Não tem uma conta?'
                }
              </p>
              <Button
                variant="outline"
                onClick={toggleMode}
                className="w-full h-9 text-sm font-semibold backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#22C55E]/50 text-foreground hover:text-[#22C55E] transition-all duration-400 rounded-[24px]"
              >
                {formData.isRegistering ? 'Entrar na Conta' : 'Criar Nova Conta'}
              </Button>
            </div>

            {/* Benefits for Registration */}
            {formData.isRegistering && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-foreground text-center">Benefícios de ter uma conta:</p>
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Acesso ao painel GSM</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Histórico de serviços</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Suporte prioritário</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;