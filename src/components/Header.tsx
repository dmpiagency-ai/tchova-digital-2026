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
import logo from '@/assets/logo.svg';
import { EliteRadar } from '@/components/ui/EliteIcons';
import { motion, AnimatePresence } from 'framer-motion';

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
      <DarkModeToggle />

      {/* Mobile Menu Trigger & System - Visible only on mobile/tablet */}
      {!isPaymentPage && !isServiceDetailsPage && (
        <div className="lg:hidden">
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

      {/* Desktop Header - Floating Glass Monolith (Hidden on Mobile) */}
      <motion.header
        initial={false}
        animate={{
          paddingTop: (isPaymentPage || isServiceDetailsPage || scrolled) ? '1rem' : '2rem',
          paddingBottom: (isPaymentPage || isServiceDetailsPage || scrolled) ? '1rem' : '2rem',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        className="hidden lg:block fixed top-0 left-0 right-0 z-[1100] w-full"
      >
        <div className="container mx-auto px-6 lg:px-12">
          <motion.nav 
            animate={{
              height: (isPaymentPage || isServiceDetailsPage || scrolled) ? '4rem' : '5rem',
              backgroundColor: (isPaymentPage || isServiceDetailsPage || scrolled) ? 'rgba(3, 3, 3, 0.8)' : 'rgba(0, 0, 0, 0)',
              borderColor: (isPaymentPage || isServiceDetailsPage || scrolled) ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0)',
              backdropFilter: (isPaymentPage || isServiceDetailsPage || scrolled) ? 'blur(40px) saturate(150%)' : 'blur(0px) saturate(100%)',
              boxShadow: (isPaymentPage || isServiceDetailsPage || scrolled) ? '0 30px 60px rgba(0, 0, 0, 0.6)' : '0 0px 0px rgba(0, 0, 0, 0)',
            }}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            className="flex items-center justify-between px-8 rounded-full border"
          >
            {/* Logo Section */}
            <div className="flex items-center gap-6">
              {(isPaymentPage || isServiceDetailsPage) && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/')}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </Button>
              )}
              <div 
                className="flex items-center gap-3 cursor-pointer transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-105 active:scale-95"
                onClick={() => navigate('/')}
              >
                <motion.img 
                  src={logo} 
                  alt="TchovaDigital" 
                  animate={{
                    height: scrolled ? '1.5rem' : '2rem',
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                  className="w-auto" 
                />
                <motion.span 
                  animate={{
                    fontSize: scrolled ? '1.125rem' : '1.5rem',
                  }}
                  transition={{ type: 'spring', stiffness: 200, damping: 30 }}
                  className="font-black tracking-[-0.02em] text-white"
                >
                  Tchova<span className="text-primary">Digital</span>
                </motion.span>
              </div>
            </div>

            {/* Desktop Navigation Links - Elite Hover Effects */}
            <div className="hidden lg:flex items-center gap-12">
              {menuItems.slice(1, -1).map((item) => (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  className="group relative py-2 text-[11px] font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors duration-500"
                >
                  {item.label}
                  <motion.span 
                    initial={false}
                    className="absolute bottom-0 left-0 w-0 h-[2px] bg-primary group-hover:w-full transition-all duration-500 ease-out" 
                  />
                </button>
              ))}
            </div>

            {/* Action Group */}
            <div className="flex items-center gap-6">
              <motion.button
                onClick={handleWhatsAppClick}
                animate={{
                  backgroundColor: scrolled ? '#22C55E' : 'rgba(255, 255, 255, 0.05)',
                  color: scrolled ? '#000000' : '#FFFFFF',
                  boxShadow: scrolled ? '0 0 20px rgba(34, 197, 94, 0.3)' : '0 0 0px rgba(0, 0, 0, 0)',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: scrolled ? '0 0 30px rgba(34, 197, 94, 0.6)' : '0 0 15px rgba(255, 255, 255, 0.1)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="flex items-center gap-3 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest border border-white/10"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Directo</span>
              </motion.button>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                <EliteRadar className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">Status: Online</span>
              </div>
            </div>
          </motion.nav>
        </div>
      </motion.header>
    </>
  );
}
