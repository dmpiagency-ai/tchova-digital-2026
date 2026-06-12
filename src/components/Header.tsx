'use client';
import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { StaggeredMenu } from '@/components/ui/StaggeredMenu';
import { useScroll } from '@/components/ui/use-scroll';
import { env } from '@/config/env';
import { EliteRadar } from '@/components/ui/EliteIcons';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import logo from '@/assets/logo.svg';

export default function Header() {
  const scrolled = useScroll(20);
  useAuth(); 
  const location = useLocation();
  const navigate = useNavigate();

  const isPaymentPage = location.pathname === '/payment';
  const isServiceDetailsPage = location.pathname === '/service-details';

  const handleNavigation = useCallback((href: string) => {
    if (location.pathname !== '/') {
      navigate('/' + href);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.pathname, navigate]);

  const handleWhatsAppClick = useCallback(() => {
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}`, '_blank');
  }, []);

  const menuItems = useMemo(() => [
    { label: 'Início', link: '#home', onClick: () => handleNavigation('#home') },
    { label: 'Serviços', link: '#services', onClick: () => handleNavigation('#services') },
    { label: 'Planos', link: '#planos', onClick: () => handleNavigation('#planos') },
    { label: 'Como Funciona', link: '#how-it-works', onClick: () => handleNavigation('#how-it-works') },
    { label: 'Manifesto', link: '#about', onClick: () => handleNavigation('#about') },
    { label: 'Contacto', link: '#contact', onClick: () => handleNavigation('#contact') },
  ], [handleNavigation]);

  const socialItems = useMemo(() => [
    { label: 'WhatsApp', link: `https://wa.me/${env.WHATSAPP_NUMBER}` },
    { label: 'Instagram', link: 'https://instagram.com/tchovadigital' },
  ], []);

  return (
    <>

      {/* Mobile Header for Sub-pages (Service Details / Payment) */}
      {(isPaymentPage || isServiceDetailsPage) && (
        <div className="md:hidden fixed top-0 left-0 right-0 z-[1100] p-4 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </Button>
          
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <AnimatedLogo className="h-7" showText={true} />
          </div>

          <div className="w-10" /> {/* Spacer for symmetry */}
        </div>
      )}

      {/* Mobile Menu Trigger & System - Visible only on landing page mobile */}
      {!isPaymentPage && !isServiceDetailsPage && (
        <div className="md:hidden">
          <StaggeredMenu
            position="right"
            colors={['#000000', '#0a0a0a', '#111111']}
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            logoUrl={logo}
            accentColor="#22C55E"
            isFixed={true}
            closeOnClickAway={true}
          />
        </div>
      )}

      {/* Desktop/Tablet Header - Floating Glass Monolith */}
      <header
        className="hidden md:block fixed top-0 left-0 right-0 z-[1100] w-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          paddingTop: (isPaymentPage || isServiceDetailsPage || scrolled) ? '1rem' : '1.5rem',
          paddingBottom: (isPaymentPage || isServiceDetailsPage || scrolled) ? '1rem' : '1.5rem',
        }}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <nav 
            className="flex items-center justify-between px-4 md:px-6 lg:px-8 rounded-full border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              height: (isPaymentPage || isServiceDetailsPage || scrolled) ? '4.5rem' : '5.5rem',
              backgroundColor: (isPaymentPage || isServiceDetailsPage || scrolled) ? 'rgba(10, 10, 10, 0.75)' : 'rgba(0, 0, 0, 0)',
              borderColor: (isPaymentPage || isServiceDetailsPage || scrolled) ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0)',
              backdropFilter: (isPaymentPage || isServiceDetailsPage || scrolled) ? 'blur(24px) saturate(150%)' : 'blur(0px) saturate(100%)',
              boxShadow: (isPaymentPage || isServiceDetailsPage || scrolled) ? '0 30px 60px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)' : '0 0px 0px rgba(0, 0, 0, 0)',
            }}
          >
            {/* Logo Section */}
            <div className="flex items-center gap-4 lg:gap-6 shrink-0">
              {(isPaymentPage || isServiceDetailsPage) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-transform hover:scale-105"
                >
                  <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </Button>
              )}
              <div className="relative flex items-center cursor-pointer transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95" onClick={() => navigate('/')}>
                  <div
                    className="flex items-center transition-all duration-500"
                    style={{ height: scrolled ? '36px' : '48px' }}
                  >
                    <AnimatedLogo className="h-full" showText={true} />
                  </div>
              </div>
            </div>

            {/* Desktop Navigation Links - Modern Organic Pills */}
            <div className="hidden md:flex flex-1 justify-center items-center gap-1 lg:gap-2 xl:gap-4 px-2 xl:absolute xl:left-[52%] xl:-translate-x-1/2 xl:flex-none">
              {menuItems.slice(1, -1).map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="group relative px-4 py-2 lg:px-5 lg:py-2.5 rounded-full text-[9px] lg:text-[10px] xl:text-[11px] font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] text-white/60 hover:text-white transition-all duration-300 hover:bg-white/5 active:scale-95"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Action Group Container */}
            <div className="relative flex items-center shrink-0">
              <button
                onClick={handleWhatsAppClick}
                className={cn(
                  "group relative flex items-center gap-2 lg:gap-3 px-5 lg:px-7 py-2.5 lg:py-3 rounded-full font-black text-[9px] lg:text-[10px] uppercase tracking-widest transition-all duration-500 overflow-hidden",
                  scrolled 
                    ? "bg-[#22C55E] text-black shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-105 active:scale-95" 
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_0_30px_rgba(255,255,255,0.05)] hover:scale-105 active:scale-95"
                )}
              >
                {/* Inner Glow effect for un-scrolled state */}
                {!scrolled && <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(255,255,255,0.03)] pointer-events-none" />}
                
                {/* Integrated Status indicator inside button when not scrolled */}
                {!scrolled && (
                  <div className="relative flex items-center justify-center w-2 h-2 mr-1">
                    <div className="absolute w-full h-full bg-primary rounded-full animate-ping opacity-75" />
                    <div className="relative w-1.5 h-1.5 bg-primary rounded-full" />
                  </div>
                )}
                
                <MessageCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4 transition-transform duration-500 group-hover:scale-110" />
                <span>{scrolled ? 'Falar com Equipa' : 'Iniciar Projeto'}</span>
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
