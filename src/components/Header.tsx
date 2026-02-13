import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, MessageCircle, ArrowLeft, LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DarkModeToggle from '@/components/DarkModeToggle';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.svg';
import { env } from '@/config/env';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const isPaymentPage = location.pathname === '/payment';

  const menuItems = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'Serviços', href: '#services' },
    { name: 'Sobre', href: '#about' },
    { name: 'Planos', href: '#planos' },
    { name: 'Contacto', href: '#contact' },
  ];

  const handleNavigation = (item: typeof menuItems[0]) => {
    if (item.isRoute) {
      navigate(item.href);
    } else {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:shadow-lg"
      >
        Pular para o conteúdo principal
      </a>

      <DarkModeToggle />
      <header role="banner" className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/20">
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[72px] xl:h-20 relative">
            {/* Back Button for Payment Page */}
            {isPaymentPage && (
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="lg:hidden p-2 rounded-lg glass hover:bg-primary/10 transition-colors mr-2"
                aria-label="Voltar"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Button>
            )}

            {/* Logo - Mobile-first optimized */}
            <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2 lg:gap-3">
              {isPaymentPage && (
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  className="hidden lg:flex p-1.5 sm:p-2 rounded-lg glass hover:bg-primary/10 transition-colors mr-1.5 sm:mr-2"
                  aria-label="Voltar"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-1.5 sm:mr-2" />
                  <span className="text-sm sm:text-base">Voltar</span>
                </Button>
              )}
              <img src={logo} alt="TchovaDigital Logo" className="h-6 sm:h-8 lg:h-10 xl:h-12 w-auto" />
              <h1 className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl font-bold font-nunito text-[#283533] dark:text-primary navbar-logo-text">
                TchovaDigital
              </h1>
            </div>

            {/* Desktop Navigation - Simplified */}
            <nav role="navigation" aria-label="Menu principal" className="hidden lg:flex items-center space-x-4 xl:space-x-6 2xl:space-x-8">
               {menuItems.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item)}
                    className="text-foreground hover:text-primary transition-colors font-medium px-2 xl:px-3 py-1.5 xl:py-2 rounded-lg hover:bg-primary/10 text-sm xl:text-base"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>

            {/* User Authentication & WhatsApp - Desktop */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
              {/* WhatsApp Button */}
              <Button
                variant="outline"
                size="sm"
                aria-label="Abrir conversa no WhatsApp"
                className="border-primary/20 hover:bg-primary/10 text-primary hover:text-primary font-medium px-3 xl:px-4 focus-visible text-sm xl:text-base"
                onClick={() => window.open(`https://wa.me/${env.WHATSAPP_NUMBER}`, '_blank')}
              >
                <MessageCircle className="w-3 h-3 xl:w-4 xl:h-4 mr-1.5 xl:mr-2" aria-hidden="true" focusable="false" />
                <span className="hidden xl:inline">WhatsApp</span>
                <span className="xl:hidden">WA</span>
              </Button>

              {/* Login/Logout Button */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 bg-primary/10 rounded-lg px-3 py-1.5">
                    <User className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary hidden xl:inline">
                      {user?.name || 'Usuário'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      try {
                        logout();
                      } catch (error) {
                        // Error during logout (removed console.error for production)
                        // Error details: ${error}
                        // Fallback: forçar reload da página
                        window.location.reload();
                      }
                    }}
                    className="border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="w-3 h-3 xl:w-4 xl:h-4 mr-1.5 xl:mr-2" />
                    <span className="hidden xl:inline">Sair</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-white font-medium px-4 xl:px-6 focus-visible text-sm xl:text-base"
                >
                  <LogIn className="w-3 h-3 xl:w-4 xl:h-4 mr-1.5 xl:mr-2" />
                  <span className="hidden xl:inline">Entrar</span>
                  <span className="xl:hidden">Login</span>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            {!isPaymentPage && (
              <button
                type="button"
                className="lg:hidden p-1.5 sm:p-2 rounded-lg glass hover:bg-primary/10 transition-colors"
                aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-controls="mobile-menu"
                data-state={isMenuOpen ? 'open' : 'closed'}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                 {isMenuOpen ? (
                   <X className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" focusable="false" />
                 ) : (
                   <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-primary" aria-hidden="true" focusable="false" />
                 )}
               </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && !isPaymentPage && (
          <div id="mobile-menu" className="lg:hidden glass-card border-t border-primary/20 mx-3 sm:mx-4 mt-2 mb-3 sm:mb-4 animate-fade-in">
            <nav className="py-3 sm:py-4 space-y-1.5 sm:space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item)}
                  className="block w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-foreground hover:text-primary hover:bg-primary/5 transition-colors font-medium rounded-lg text-sm sm:text-base"
                >
                  {item.name}
                </button>
              ))}
              <div className="px-3 sm:px-4 pt-2">
                <Button
                  variant="default"
                  size="sm"
                  aria-label="Abrir conversa no WhatsApp"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium focus-visible text-sm sm:text-base"
                  onClick={() => {
                    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}`, '_blank');
                    setIsMenuOpen(false);
                  }}
                >
                  <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" aria-hidden="true" focusable="false" />
                  WhatsApp
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Acesso TchovaDigital"
        description="Entre na sua conta para acessar todos os recursos exclusivos"
      />

      {/* Spacer for fixed header */}
      <div className="h-14 sm:h-16 lg:h-[72px] xl:h-20" />
    </>
  );
};

export default Header;