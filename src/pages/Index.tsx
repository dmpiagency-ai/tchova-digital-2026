import { useEffect, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import HowItWorks from '@/components/HowItWorks';
import About from '@/components/About';
import Pricing from '@/components/Pricing';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import GSMToolsPanel from '@/components/GSMToolsPanelNew';
import LoginModal from '@/components/LoginModal';
import WelcomeModal from '@/components/WelcomeModal';
import PromoPopup, { usePromoPopup } from '@/components/PromoPopup';
import { useAuth } from '@/contexts/AuthContext';
import { env } from '@/config/env';
import { logger } from '@/lib/logger';

// View types
type ViewType = 'home' | 'gsm-login' | 'login' | 'gsm-dashboard' | 'dashboard' | 'tool-rental';

// Interfaces
interface User {
  id: string;
  name: string;
  email: string;
  serviceAccess?: string;
  accessType?: string;
  partnerReferral?: string;
}

interface ServiceData {
  title: string;
  type: string;
  requiresLogin: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
  whatsapp?: string;
}

// Extend window for service routing
declare global {
  interface Window {
    handleServiceAccess?: (serviceType: string, serviceData?: ServiceData | null) => void;
  }
}

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedService, setSelectedService] = useState<{ type: string; data?: ServiceData } | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // Auth context for Firebase integration
  // Note: We don't use isAuthenticated here to avoid showing modals on page load
  // Instead, we listen for custom events from LoginModal
  
  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loginModalConfig, setLoginModalConfig] = useState<{ title?: string; description?: string }>({});
  
  // Promo popup for new visitors
  const { showPromo, closePromo } = usePromoPopup();

  // Service routing logic - memoized to prevent unnecessary re-renders
  const handleServiceAccess = useCallback((serviceType: string, serviceData: ServiceData | null = null) => {
    logger.info('Service Access:', { serviceType, serviceData });

    switch(serviceType) {
      case 'gsm-rental':
      case 'gsm-support':
        // GSM services - redirect to GSM dashboard after login
        if (user) {
          setCurrentView('gsm-dashboard');
        } else {
          setSelectedService({ type: serviceType, data: serviceData ?? undefined });
          setCurrentView('gsm-login');
        }
        break;

      case 'design-services':
        // Design services - can be direct or require consultation
        if (serviceData?.requiresLogin) {
          setSelectedService({ type: 'design', data: serviceData });
          setCurrentView('login');
        } else {
          // Direct WhatsApp contact for design services
          const message = encodeURIComponent(`Olá! Estou interessado em serviços de design. Vi o projeto "${serviceData?.title || 'trabalhos anteriores'}" e gostaria de saber mais.`);
          window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
        }
        break;

      case 'web-development':
        // Web development - project consultation
        if (serviceData?.requiresLogin) {
          setSelectedService({ type: 'web', data: serviceData });
          setCurrentView('login');
        } else {
          const message = encodeURIComponent(`Olá! Gostaria de desenvolver um projeto web similar a "${serviceData?.title || 'projetos anteriores'}". Podemos conversar sobre os detalhes?`);
          window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
        }
        break;

      case 'marketing-services': {
        // Marketing services - campaign consultation
        const marketingMessage = encodeURIComponent(`Olá! Estou interessado em serviços de marketing digital. Vi "${serviceData?.title || 'campanhas anteriores'}" e gostaria de saber como podemos trabalhar juntos.`);
        window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${marketingMessage}`, '_blank');
        break;
      }

      case 'social-media': {
        // Social media management
        const socialMessage = encodeURIComponent(`Olá! Preciso de ajuda com gestão de redes sociais. Vi "${serviceData?.title || 'trabalhos anteriores'}" e gostaria de saber mais sobre os serviços.`);
        window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${socialMessage}`, '_blank');
        break;
      }

      default: {
        // Generic service inquiry
        const genericMessage = encodeURIComponent(`Olá! Estou interessado em saber mais sobre os serviços disponíveis. Podemos conversar?`);
        window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${genericMessage}`, '_blank');
        break;
      }
    }
  }, [user]);

  // Authentication logic
  const handleLogin = useCallback((credentials: LoginCredentials) => {
    logger.info('Login attempt:', { email: credentials.email });

    // Simulate authentication
    const mockUser: User = {
      id: 'user_' + Date.now(),
      name: credentials.email.split('@')[0],
      email: credentials.email,
      serviceAccess: selectedService?.type || 'general'
    };

    setUser(mockUser);

    // Route to appropriate dashboard based on service
    if (selectedService?.type === 'gsm-rental' || selectedService?.type === 'gsm-support') {
      setCurrentView('tool-rental');
    } else {
      setCurrentView('dashboard');
    }
  }, [selectedService?.type]);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCurrentView('home');
    setSelectedService(null);
  }, []);

  // GSM-specific login handler
  const handleGSMLogin = useCallback((credentials: LoginCredentials) => {
    logger.info('GSM Login attempt:', { email: credentials.email });

    // Create user session for GSM access
    const gsmUser: User = {
      id: 'gsm_user_' + Date.now(),
      name: credentials.email.split('@')[0],
      email: credentials.email,
      accessType: 'gsm-partner',
      partnerReferral: 'tchova-digital'
    };

    setUser(gsmUser);

    // Go to GSM dashboard after login
    setCurrentView('gsm-dashboard');
  }, []);

  useEffect(() => {
    // Listen for login modal events from other components
    const handleShowLoginModal = (event: CustomEvent) => {
      setLoginModalConfig({
        title: event.detail?.title || 'Acesso ao Sistema',
        description: event.detail?.description || 'Faça login para acessar recursos exclusivos'
      });
      setShowLoginModal(true);
    };

    window.addEventListener('show-login-modal', handleShowLoginModal as EventListener);

    return () => {
      window.removeEventListener('show-login-modal', handleShowLoginModal as EventListener);
    };
  }, []);

  // Show welcome modal ONLY after a NEW registration (not on page load with existing session)
  useEffect(() => {
    // Listen for the custom event dispatched by LoginModal after successful registration
    const handleNewRegistration = () => {
      setShowWelcomeModal(true);
      sessionStorage.setItem('tchova_welcome_shown', 'true');
    };

    window.addEventListener('new-user-registered', handleNewRegistration as EventListener);

    return () => {
      window.removeEventListener('new-user-registered', handleNewRegistration as EventListener);
    };
  }, []);

  // Make service routing function available globally
  useEffect(() => {
    window.handleServiceAccess = handleServiceAccess;

    return () => {
      delete window.handleServiceAccess;
    };
  }, [handleServiceAccess]);
  useEffect(() => {
    // Intersection Observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all sections for animation
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);


  // Render different views based on current state
  const renderCurrentView = () => {
    switch(currentView) {
      case 'gsm-login':
        return (
          <div className="min-h-screen bg-background">
            <Header />
            <main id="main-content" role="main" tabIndex={-1} className="container mx-auto px-4 py-8 lg:py-12">
              <div className="max-w-5xl mx-auto">
                {/* Header Section - Ultra Compact */}
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl">📱</span>
                  </div>
                  <h1 className="text-xl lg:text-2xl font-bold mb-2 gradient-text">
                    GSM Premium
                  </h1>
                  <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                    Ferramentas GSM profissionais
                  </p>
                </div>

                {/* Mobile Layout - Ultra Compact Single Column */}
                <div className="block lg:hidden space-y-4">
                  {/* User Status - Compact */}
                  {user && (
                    <div className="neo hover-lift p-4 rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-bold text-white">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-green-800 dark:text-green-200">{user.name}</p>
                          <p className="text-xs text-green-600 dark:text-green-400">GSM ativo • 0 MZN</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Login Form - Ultra Compact */}
                  {!user && (
                    <div className="neo p-4 rounded-xl border">
                      <h3 className="text-base font-bold mb-3 flex items-center">
                        <span className="mr-2">🔐</span>
                        Criar Conta
                      </h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target as HTMLFormElement);
                        handleGSMLogin({
                          email: formData.get('email') as string,
                          password: formData.get('password') as string,
                          whatsapp: formData.get('whatsapp') as string
                        });
                      }} className="space-y-3">
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                          placeholder="E-mail"
                        />
                        <input
                          type="tel"
                          name="whatsapp"
                          required
                          className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                          placeholder="WhatsApp"
                        />
                        <input
                          type="password"
                          name="password"
                          required
                          className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                          placeholder="Palavra-passe"
                        />
                        <button
                          type="submit"
                          className="tech-button w-full rounded-[24px] py-2 px-6 font-bold transition-all duration-400 neo hover-lift px-3 py-3 font-semibold text-sm"
                        >
                          Criar conta
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Balance & Actions - Combined */}
                  <div className="neo p-4 rounded-xl border">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        onClick={() => {
                          const message = encodeURIComponent(`Olá! Gostaria de adicionar 500 MZN de saldo ao meu GSM.`);
                          window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                        }}
                        className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 neo hover-lift px-3 py-3 font-semibold text-xs"
                      >
                        500 MZN
                      </button>
                      <button
                        onClick={() => {
                          const message = encodeURIComponent(`Olá! Gostaria de adicionar 1000 MZN de saldo ao meu GSM.`);
                          window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                        }}
                        className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 neo hover-lift px-3 py-3 font-semibold text-xs"
                      >
                        1000 MZN
                      </button>
                      <button
                        onClick={() => {
                          const message = encodeURIComponent(`Olá! Gostaria de adicionar 2000 MZN de saldo ao meu GSM.`);
                          window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                        }}
                        className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 neo hover-lift px-3 py-3 font-semibold text-xs"
                      >
                        2000 MZN
                      </button>
                      <button
                        onClick={() => {
                          const message = encodeURIComponent(`Olá! Gostaria de adicionar saldo ao meu GSM.`);
                          window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                        }}
                        className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-3 py-3 font-semibold text-xs flex items-center justify-center"
                      >
                        <span>💳</span>
                        Outros
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setCurrentView('gsm-dashboard')}
                        className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 neo hover-lift px-3 py-3 font-semibold text-xs flex items-center justify-center"
                      >
                        <span className="mr-1">🔧</span>
                        GSM
                      </button>
                      <button
                        onClick={() => {
                          const message = encodeURIComponent(`Olá! Preciso de suporte GSM.`);
                          window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                        }}
                        className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-green-500 hover:bg-green-600 text-white px-3 py-3 font-semibold text-xs flex items-center justify-center"
                      >
                        <span className="mr-1">💬</span>
                        Suporte
                      </button>
                    </div>
                  </div>

                  {/* Back Button */}
                  <button
                    onClick={() => setCurrentView('home')}
                    className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 w-full neo hover-lift px-4 py-3 font-semibold text-sm flex items-center justify-center"
                  >
                    ← Voltar
                  </button>
                </div>

                {/* Desktop Layout - Ultra Compact 3 Column */}
                <div className="hidden lg:grid lg:grid-cols-3 gap-6">
                  {/* Left Column - User Status */}
                  <div className="space-y-4">
                    {user && (
                      <div className="neo hover-lift p-4 rounded-xl border bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-green-800 dark:text-green-200">{user.name}</p>
                            <p className="text-xs text-green-600 dark:text-green-400">GSM ativo • 0 MZN</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="neo p-4 rounded-xl border">
                      <div className="space-y-2">
                        <button
                          onClick={() => setCurrentView('gsm-dashboard')}
                          className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 w-full neo hover-lift px-3 py-2 font-semibold text-xs flex items-center justify-center"
                        >
                          <span className="mr-1">🔧</span>
                          GSM
                        </button>
                        <button
                          onClick={() => {
                            const message = encodeURIComponent(`Olá! Preciso de suporte GSM.`);
                            window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                          }}
                          className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 w-full bg-green-500 hover:bg-green-600 text-white px-3 py-2 font-semibold text-xs flex items-center justify-center"
                        >
                          <span className="mr-1">💬</span>
                          Suporte
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Center Column - Login Form */}
                  <div className="space-y-4">
                    {!user && (
                      <div className="neo p-4 rounded-xl border">
                        <h3 className="text-sm font-bold mb-3 flex items-center">
                          <span className="mr-2">🔐</span>
                          Criar Conta
                        </h3>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          const formData = new FormData(e.target as HTMLFormElement);
                          handleGSMLogin({
                            email: formData.get('email') as string,
                            password: formData.get('password') as string,
                            whatsapp: formData.get('whatsapp') as string
                          });
                        }} className="space-y-3">
                          <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                            placeholder="E-mail"
                          />
                          <input
                            type="tel"
                            name="whatsapp"
                            required
                            className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                            placeholder="WhatsApp"
                          />
                          <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-3 py-2 text-sm border border-primary/20 rounded-lg bg-background focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                            placeholder="Palavra-passe"
                          />
                          <button
                            type="submit"
                            className="tech-button w-full rounded-[24px] py-2 px-6 font-bold transition-all duration-400 neo hover-lift px-3 py-2 font-semibold text-sm"
                          >
                            Criar conta
                          </button>
                        </form>
                      </div>
                    )}

                    {/* Back Button */}
                    <button
                      onClick={() => setCurrentView('home')}
                      className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 w-full neo hover-lift px-3 py-2 font-semibold text-sm flex items-center justify-center"
                    >
                      ← Voltar
                    </button>
                  </div>

                  {/* Right Column - Balance Management */}
                  <div>
                    <div className="neo p-4 rounded-xl border">
                      <h3 className="text-sm font-bold mb-3 flex items-center">
                        <span className="mr-2">💰</span>
                        Adicionar Saldo
                      </h3>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <button
                          onClick={() => {
                            const message = encodeURIComponent(`Olá! Gostaria de adicionar 500 MZN de saldo ao meu GSM.`);
                            window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                          }}
                          className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 neo hover-lift px-2 py-2 text-xs font-semibold"
                        >
                          500
                        </button>
                        <button
                          onClick={() => {
                            const message = encodeURIComponent(`Olá! Gostaria de adicionar 1000 MZN de saldo ao meu GSM.`);
                            window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                          }}
                          className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 neo hover-lift px-2 py-2 text-xs font-semibold"
                        >
                          1000
                        </button>
                        <button
                          onClick={() => {
                            const message = encodeURIComponent(`Olá! Gostaria de adicionar 2000 MZN de saldo ao meu GSM.`);
                            window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                          }}
                          className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 neo hover-lift px-2 py-2 text-xs font-semibold"
                        >
                          2000
                        </button>
                        <button
                          onClick={() => {
                            const message = encodeURIComponent(`Olá! Gostaria de adicionar saldo ao meu GSM.`);
                            window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                          }}
                          className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-2 py-2 text-xs font-semibold flex items-center justify-center"
                        >
                          <span>💳</span>
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        M-Pesa • Cartão • Crypto
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        );

      case 'login':
        return (
          <div className="min-h-screen bg-background">
            <Header />
            <main id="main-content" role="main" tabIndex={-1} className="container mx-auto px-4 py-20">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Acesso ao Serviço</h2>
                <div className="glass-card p-6 rounded-2xl">
                  <h3 className="text-lg font-semibold mb-4">Acesso direto ao serviço</h3>
                  <p className="text-muted-foreground mb-6">
                    Para acessar o serviço selecionado, entre em contato diretamente conosco.
                  </p>

                  {/* Direct WhatsApp Contact */}
                  <button
                    onClick={() => {
                      const serviceName = selectedService?.data?.title || 'serviço solicitado';
                      const message = encodeURIComponent(`Olá! Gostaria de acessar o serviço "${serviceName}". Podemos conversar sobre os detalhes e próximos passos?`);
                      window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
                    }}
                    className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 transition-colors flex items-center justify-center gap-2 mb-4"
                  >
                    <span>💬 Conversar no WhatsApp</span>
                  </button>

                  <div className="text-center text-sm text-muted-foreground mb-4">
                    Ou faça login se já tem uma conta
                  </div>

                  {/* Optional Login Form - Collapsible */}
                  <details className="group">
                    <summary className="cursor-pointer text-primary hover:text-primary/80 font-medium text-sm mb-4">
                      Já tenho conta →
                    </summary>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.target as HTMLFormElement);
                      handleLogin({
                        email: formData.get('email') as string,
                        password: formData.get('password') as string
                      });
                    }} className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">E-mail</label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full px-3 py-2 border border-primary/20 rounded-lg bg-background"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Palavra-passe</label>
                        <input
                          type="password"
                          name="password"
                          required
                          className="w-full px-3 py-2 border border-primary/20 rounded-lg bg-background"
                          placeholder="••••••••"
                        />
                      </div>
                      <button
                        type="submit"
                        className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 transition-colors"
                      >
                        Entrar
                      </button>
                    </form>
                  </details>

                  <button
                    onClick={() => setCurrentView('home')}
                    className="tech-button rounded-[24px] py-2 px-6 font-bold transition-all duration-400 w-full mt-4 text-primary hover:text-primary/80 font-medium"
                  >
                    ← Voltar ao site
                  </button>
                </div>
              </div>
            </main>
          </div>
        );

      case 'gsm-dashboard':
        return (
          <div className="min-h-screen bg-background p-4">
            <Header />
            <main id="main-content" role="main" tabIndex={-1} className="container mx-auto px-4 py-8 lg:py-12">
              <GSMToolsPanel />
            </main>
          </div>
        );

      case 'dashboard':
        return (
          <div className="min-h-screen bg-background p-4">
            <Header />
            <main id="main-content" role="main" tabIndex={-1} className="container mx-auto px-4 py-8 lg:py-12">
              <GSMToolsPanel />
            </main>
          </div>
        );


      default:
        return (
          <>
            {/* Header is outside app-main to ensure fixed positioning works */}
            <Header />

            {/* Main app content */}
            <main id="main-content" role="main" tabIndex={-1}>
              <Hero />
              <Services />
              <HowItWorks />
              <About />
              <Pricing />
              <Contact />
            </main>
            <Footer />
            <FloatingWhatsApp />
            
            {/* Login Modal - accessible from anywhere */}
            <LoginModal
              isOpen={showLoginModal}
              onClose={() => setShowLoginModal(false)}
              title={loginModalConfig.title}
              description={loginModalConfig.description}
            />
            
            {/* Welcome Modal - shown after first login */}
            <WelcomeModal
              isOpen={showWelcomeModal}
              onClose={() => setShowWelcomeModal(false)}
            />
            
            {/* Promo Popup - shown to new visitors after 5s or scroll */}
            <PromoPopup
              isOpen={showPromo}
              onClose={closePromo}
              onAction={() => {
                closePromo();
                setLoginModalConfig({
                  title: 'Aproveite 10% de Desconto!',
                  description: 'Crie sua conta e use o código BEMVINDO10'
                });
                setShowLoginModal(true);
              }}
            />
          </>
        );
    }
  };

  return renderCurrentView();
};

export default Index;