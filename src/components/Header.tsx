'use client';
import React, { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DarkModeToggle from '@/components/DarkModeToggle';
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
        className="hidden md:block fixed top-0 left-0 right-0 z-[1100] w-full transition-all duration-300"
        style={{
          paddingTop: (isPaymentPage || isServiceDetailsPage || scrolled) ? '1rem' : '2rem',
          paddingBottom: (isPaymentPage || isServiceDetailsPage || scrolled) ? '1rem' : '2rem',
        }}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <nav 
            className="flex items-center justify-between px-4 md:px-6 lg:px-8 rounded-full border transition-all duration-300"
            style={{
              height: (isPaymentPage || isServiceDetailsPage || scrolled) ? '4rem' : '5rem',
              backgroundColor: (isPaymentPage || isServiceDetailsPage || scrolled) ? 'rgba(3, 3, 3, 0.8)' : 'rgba(0, 0, 0, 0)',
              borderColor: (isPaymentPage || isServiceDetailsPage || scrolled) ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0)',
              backdropFilter: (isPaymentPage || isServiceDetailsPage || scrolled) ? 'blur(40px) saturate(150%)' : 'blur(0px) saturate(100%)',
              boxShadow: (isPaymentPage || isServiceDetailsPage || scrolled) ? '0 30px 60px rgba(0, 0, 0, 0.6)' : '0 0px 0px rgba(0, 0, 0, 0)',
            }}
          >
            {/* Logo Section */}
            <div className="flex items-center gap-4 lg:gap-6 shrink-0">
              {(isPaymentPage || isServiceDetailsPage) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                >
                  <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                </Button>
              )}
              <div className="relative flex items-center cursor-pointer transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95" onClick={() => navigate('/')}>
                  <div
                    className="flex items-center transition-all duration-300"
                    style={{ height: scrolled ? '36px' : '48px' }}
                  >
                    <AnimatedLogo className="h-full" showText={true} />
                  </div>
              </div>
            </div>

            {/* Desktop Navigation Links - Flexible centering up to xl */}
            <div className="hidden md:flex flex-1 justify-center items-center gap-3 lg:gap-6 xl:gap-12 px-2 xl:absolute xl:left-[57%] xl:-translate-x-1/2 xl:flex-none">
              {menuItems.slice(1, -1).map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="group relative py-2 text-[8px] lg:text-[10px] xl:text-[11px] font-black uppercase tracking-[0.1em] lg:tracking-[0.2em] xl:tracking-[0.3em] text-white/60 hover:text-white transition-colors duration-500 whitespace-nowrap"
                >
                  {item.label}
                  <span 
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500 ease-out" 
                  />
                </button>
              ))}
            </div>

            {/* Action Group Container */}
            <div className="relative flex flex-col items-end shrink-0">
              <button
                onClick={handleWhatsAppClick}
                style={{
                  backgroundColor: scrolled ? '#22C55E' : 'rgba(255, 255, 255, 0.05)',
                  color: scrolled ? '#000000' : '#FFFFFF',
                  boxShadow: scrolled ? '0 0 20px rgba(34, 197, 94, 0.3)' : '0 0 0px rgba(0, 0, 0, 0)',
                }}
                className="flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-black text-[9px] lg:text-[10px] uppercase tracking-widest border border-white/10 transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-3 h-3 lg:w-4 lg:h-4" />
                <span>Directo</span>
              </button>

              {/* Elite Status Badge — hides on scroll */}
              {!scrolled && (
                <div
                  className="hidden md:flex absolute top-[calc(100%+8px)] lg:top-[calc(100%+12px)] right-0 z-50 items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2 lg:py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md pointer-events-none transition-all duration-500 opacity-100 translate-y-0"
                >
                  <EliteRadar className="w-3 h-3 lg:w-4 lg:h-4 text-primary animate-pulse" />
                  <span className="text-[9px] lg:text-[10px] font-black text-white/80 uppercase tracking-widest whitespace-nowrap">Status: Online</span>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
