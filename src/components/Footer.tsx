import React, { useRef } from 'react';
import { ArrowUp, Instagram, Facebook, Linkedin, Mail } from 'lucide-react';
import { env } from '@/config/env';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Olá! Vi o site e gostaria de saber mais.');
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const links = [
    { name: 'Serviços', href: '#services' },
    { name: 'Como Funciona', href: '#how-it-works' },
    { name: 'Sobre Nós', href: '#about' },
    { name: 'Planos', href: '#planos' },
  ];

  useGSAP(() => {
    // Massive Typography Parallax Reveal
    gsap.from(textRef.current, {
      y: 150,
      opacity: 0,
      scale: 0.8,
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom bottom',
        scrub: 1,
      }
    });

    // Floating animation for social icons
    gsap.to('.social-icon', {
      y: -10,
      duration: 2,
      stagger: 0.2,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} className="relative bg-background overflow-hidden border-t border-white/5 pt-24 pb-12">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute -top-[20%] left-[20%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] bg-brand-green/10 blur-[100px] rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12 flex flex-col items-center">
        
        {/* Call to Action Section */}
        <div className="text-center mb-24 max-w-3xl">
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">Pronto para Dominar?</p>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Pare de jogar à defesa.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">Escale o seu Império.</span>
          </h2>
          <button 
            onClick={handleWhatsAppClick}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black bg-white rounded-full overflow-hidden transition-transform hover:scale-105"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-brand-green opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors duration-300">
              Iniciar Projeto <ArrowUp className="w-5 h-5 rotate-45 group-hover:rotate-90 transition-transform" />
            </span>
          </button>
        </div>

        {/* Links Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-16 mb-24">
          
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-6 text-lg">Ecossistema</h4>
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className="text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-6 text-lg">Legal & Suporte</h4>
            <div className="flex flex-col gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Termos de Serviço</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</a>
              <button onClick={handleWhatsAppClick} className="text-muted-foreground hover:text-primary transition-colors text-left">Suporte Técnico</button>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-semibold mb-6 text-lg">Social</h4>
            <div className="flex gap-4">
              <a href="https://instagram.com/tchovadigital" target="_blank" rel="noreferrer" className="social-icon w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/tchovadigital" target="_blank" rel="noreferrer" className="social-icon w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="mailto:info@tchovadigital.co.mz" className="social-icon w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:border-primary transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        {/* Massive Typography */}
        <div className="w-full flex justify-center items-center overflow-hidden py-10">
          <h1 
            ref={textRef}
            className="flex flex-col items-center text-[13vw] font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-white/0 leading-[0.85] select-none tracking-tighter"
          >
            <span>TCHOVA</span>
            <span>DIGITAL</span>
          </h1>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground/50 pt-8 border-t border-white/5">
          <p>© {new Date().getFullYear()} TchovaDigital. Maputo, MZ.</p>
          <p>Engineered for Growth.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
