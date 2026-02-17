'use client';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Palette, Globe, TrendingUp, Smartphone, Video, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DarkModeToggle from '@/components/DarkModeToggle';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Menu, MenuItem, HoveredLink } from '@/components/ui/navbar-menu';
import { StaggeredMenu } from '@/components/ui/StaggeredMenu';
import { useScroll } from '@/components/ui/use-scroll';
import { env } from '@/config/env';
import logo from '@/assets/logo.svg';

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);
  const [active, setActive] = React.useState<string | null>(null);
  const scrolled = useScroll(10);
  useAuth(); // Keep context initialized
  const location = useLocation();
  const navigate = useNavigate();

  const isPaymentPage = location.pathname === '/payment';
  const isServiceDetailsPage = location.pathname === '/service-details';

  // Services for dropdown - each links to specific service detail page
  const servicesItems = [
    { name: 'Design Gráfico & Branding', serviceId: 1, icon: Palette },
    { name: 'Criação de Sites & Apps', serviceId: 2, icon: Globe },
    { name: 'Marketing Digital', serviceId: 3, icon: TrendingUp },
    { name: 'Produção Audiovisual', serviceId: 4, icon: Video },
    { name: 'Importação Assistida', serviceId: 5, icon: Package },
    { name: 'Assistência GSM Mobile', serviceId: 6, icon: Smartphone },
  ];

  // Plans for dropdown
  const plansItems = [
    { name: 'Start - 5.000 MT', href: '#planos' },
    { name: 'Business - 15.000 MT', href: '#planos' },
    { name: 'Pro - 35.000 MT', href: '#planos' },
  ];

  // StaggeredMenu items
  const menuItems = [
    { label: 'Início', link: '#home', onClick: () => handleNavigation('#home') },
    { label: 'Serviços', link: '#services', onClick: () => handleNavigation('#services') },
    { label: 'Planos', link: '#planos', onClick: () => handleNavigation('#planos') },
    { label: 'Como Funciona', link: '#how-it-works', onClick: () => handleNavigation('#how-it-works') },
    { label: 'Sobre Nós', link: '#about', onClick: () => handleNavigation('#about') },
    { label: 'Contacto', link: '#contact', onClick: () => handleNavigation('#contact') },
  ];

  const socialItems = [
    { label: 'WhatsApp', link: `https://wa.me/${env.WHATSAPP_NUMBER}` },
    { label: 'Instagram', link: 'https://instagram.com/tchovadigital' },
  ];

  const handleNavigation = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActive(null);
  };

  const handleServiceNavigation = (serviceId: number) => {
    navigate(`/service-details?id=${serviceId}`);
    setActive(null);
  };

  return (
    <>
      {/* Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
      >
        Pular para conteúdo
      </a>

      <DarkModeToggle />

      {/* Mobile StaggeredMenu - Only on home page */}
      {!isPaymentPage && !isServiceDetailsPage && (
        <StaggeredMenu
          position="right"
          colors={['#0a0a0a', '#111111', '#1a1a1a']}
          items={menuItems}
          socialItems={socialItems}
          displaySocials={true}
          displayItemNumbering={true}
          logoUrl={logo}
          accentColor="#22C55E"
          isFixed={true}
          closeOnClickAway={true}
        />
      )}

      {/* Desktop Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-[1100] w-full transition-all duration-500 ease-out',
          isPaymentPage || isServiceDetailsPage 
            ? 'bg-background/95 backdrop-blur-lg shadow-lg border-b border-border' 
            : scrolled 
              ? 'bg-background/95 backdrop-blur-lg shadow-lg border-b border-border'
              : 'bg-transparent',
          isPaymentPage || isServiceDetailsPage ? 'block' : 'hidden md:block'
        )}
      >
        <nav 
          className={cn(
            'flex w-full items-center justify-between px-4 transition-all duration-500 ease-out',
            scrolled ? 'h-14' : 'h-16'
          )}
        >
          {/* Logo */}
          <div className={cn(
            'flex items-center gap-2 transition-all duration-500 ease-out',
            scrolled && 'scale-90'
          )}>
            {(isPaymentPage || isServiceDetailsPage) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-primary/10"
              >
                <ArrowLeft className="w-5 h-5 text-primary" />
              </Button>
            )}
            <img 
              src={logo} 
              alt="TchovaDigital" 
              className={cn(
                'w-auto transition-all duration-500 ease-out',
                scrolled ? 'h-6' : 'h-7 sm:h-8'
              )} 
            />
            <h1 
              className={cn(
                'font-bold tracking-tight text-foreground transition-all duration-500 ease-out',
                scrolled ? 'text-sm' : 'text-base sm:text-lg'
              )}
            >
              TchovaDigital
            </h1>
          </div>

          {/* Desktop Navigation with Hover Dropdowns */}
          <div className="hidden md:flex items-center gap-2">
            <Menu setActive={setActive} className="flex items-center gap-1">
              {/* Serviços Dropdown */}
              <MenuItem 
                active={active} 
                item="Serviços"
                className={cn(
                  "px-3 py-1.5 rounded-full transition-colors duration-300 text-sm font-medium hover:text-primary",
                  scrolled || isPaymentPage || isServiceDetailsPage
                    ? "text-foreground"
                    : "text-white"
                )}
              >
                <div className="flex flex-col space-y-1 text-sm">
                  {servicesItems.map((item) => (
                    <HoveredLink 
                      key={item.name}
                      onClick={() => handleServiceNavigation(item.serviceId)}
                      className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      <item.icon className="w-4 h-4 text-primary" />
                      {item.name}
                    </HoveredLink>
                  ))}
                </div>
              </MenuItem>

              {/* Planos Dropdown */}
              <MenuItem 
                active={active} 
                item="Planos"
                className={cn(
                  "px-3 py-1.5 rounded-full transition-colors duration-300 text-sm font-medium hover:text-primary",
                  scrolled || isPaymentPage || isServiceDetailsPage
                    ? "text-foreground"
                    : "text-white"
                )}
              >
                <div className="flex flex-col space-y-1 text-sm">
                  {plansItems.map((item) => (
                    <HoveredLink 
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className="py-1.5 px-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      {item.name}
                    </HoveredLink>
                  ))}
                </div>
              </MenuItem>

              {/* Contacto - Simple link */}
              <button
                onClick={() => handleNavigation('#how-it-works')}
                className={cn(
                  "px-3 py-1.5 rounded-full transition-colors duration-300 text-sm font-medium hover:text-primary hover:bg-accent",
                  scrolled || isPaymentPage || isServiceDetailsPage
                    ? "text-foreground"
                    : "text-white"
                )}
              >
                Como Funciona
              </button>
              <button
                onClick={() => handleNavigation('#about')}
                className={cn(
                  "px-3 py-1.5 rounded-full transition-colors duration-300 text-sm font-medium hover:text-primary hover:bg-accent",
                  scrolled || isPaymentPage || isServiceDetailsPage
                    ? "text-foreground"
                    : "text-white"
                )}
              >
                Sobre Nós
              </button>
              <button
                onClick={() => handleNavigation('#contact')}
                className={cn(
                  "px-3 py-1.5 rounded-full transition-colors duration-300 text-sm font-medium hover:text-primary hover:bg-accent",
                  scrolled || isPaymentPage || isServiceDetailsPage
                    ? "text-foreground"
                    : "text-white"
                )}
              >
                Contacto
              </button>
            </Menu>

            {/* CTA Button */}
            <Button
              size="sm"
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-1.5 text-sm rounded-full transition-all duration-300 hover:scale-105"
              onClick={() => window.open(`https://wa.me/${env.WHATSAPP_NUMBER}`, '_blank')}
            >
              WhatsApp
            </Button>
          </div>
        </nav>
      </header>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  );
}
