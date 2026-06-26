import { useEffect, useState, useCallback, useRef, lazy, Suspense } from 'react';
import { env } from '@/config/env';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { InteractiveContactModal } from '@/components/InteractiveContactModal';

const LoginModal = lazy(() => import('@/components/LoginModal'));

const About = lazy(() => import('@/components/About'));
const Services = lazy(() => import('@/components/Services'));
const HowItWorks = lazy(() => import('@/components/HowItWorks'));
const AudienceFilter = lazy(() => import('@/components/AudienceFilter'));
const Pricing = lazy(() => import('@/components/Pricing'));

const Testimonials = lazy(() => import('@/components/Testimonials'));
const FAQ = lazy(() => import('@/components/FAQ'));
const Contact = lazy(() => import('@/components/Contact'));
const Footer = lazy(() => import('@/components/Footer'));

// Extend window for service routing
declare global {
  interface Window {
    handleServiceAccess?: (serviceType: string, serviceData?: { title: string; type: string; requiresLogin: boolean } | null) => void;
  }
}

const Index = () => {
  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginModalConfig, setLoginModalConfig] = useState<{ title?: string; description?: string }>({});
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalService, setContactModalService] = useState('');

  const handleServiceAccess = useCallback((serviceType: string, serviceData: { title: string; type: string; requiresLogin?: boolean } | null = null) => {
    // GSM-specific services redirect to GSM dashboard route
    if (serviceType === 'gsm-rental' || serviceType === 'gsm-support') {
      window.location.href = '/gsm';
      return;
    }

    // Direct WhatsApp without modal friction
    const serviceName = serviceData?.title || 'Ecossistema Tchova';
    const message = encodeURIComponent(`Olá! Gostaria de saber mais sobre ${serviceName}.`);
    window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
  }, []);

  // Listen for login and contact modal events from other components
  useEffect(() => {
    const handleShowLoginModal = (event: CustomEvent) => {
      setLoginModalConfig({
        title: event.detail?.title || 'Acesso ao Sistema',
        description: event.detail?.description || 'Faça login para acessar recursos exclusivos'
      });
      setShowLoginModal(true);
    };

    const handleOpenContactModal = (event: CustomEvent) => {
      const { serviceType, serviceData } = event.detail;
      handleServiceAccess(serviceType, serviceData);
    };

    window.addEventListener('show-login-modal', handleShowLoginModal as EventListener);
    window.addEventListener('open-contact-modal', handleOpenContactModal as EventListener);
    
    return () => {
      window.removeEventListener('show-login-modal', handleShowLoginModal as EventListener);
      window.removeEventListener('open-contact-modal', handleOpenContactModal as EventListener);
    };
  }, [handleServiceAccess]);

  // Scroll animations with Intersection Observer
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    // Random animation types for horizontal slide variety
    const revealTypes = ['reveal-slide-left', 'reveal-slide-right', 'reveal-slide-up', 'reveal-fade-scale'];
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const timeout = setTimeout(() => {
            entry.target.classList.add('visible');
          }, 50);
          timeouts.push(timeout);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Observe existing animate-on-scroll elements
    document.querySelectorAll('.animate-on-scroll:not(.visible)').forEach((el) => observer.observe(el));
    
    // Observe new data-reveal elements with random animation assignment
    document.querySelectorAll('[data-reveal]:not(.visible)').forEach((el, index) => {
      const htmlEl = el as HTMLElement;
      const revealType = htmlEl.dataset.reveal || revealTypes[index % revealTypes.length];
      htmlEl.classList.add(revealType);
      observer.observe(htmlEl);
    });

    // Smooth scroll for anchor links
    const anchorClickHandlers: Array<{ element: HTMLAnchorElement; handler: (e: Event) => void }> = [];
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach(anchor => {
      const handler = (e: Event) => {
        e.preventDefault();
        const href = anchor.getAttribute('href') || '';
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
      anchor.addEventListener('click', handler);
      anchorClickHandlers.push({ element: anchor, handler });
    });

    return () => {
      observer.disconnect();
      timeouts.forEach(timeout => clearTimeout(timeout));
      anchorClickHandlers.forEach(({ element, handler }) => {
        element.removeEventListener('click', handler);
      });
    };
  }, []);

  return (
    <>
      <Header />



      <main id="main-content" role="main" tabIndex={-1} className="relative z-[1]">
        <Hero />
        <Suspense fallback={<div className="h-32 w-full animate-pulse bg-[#0A0A0A]" />}>
          <About />
          <Services />
          <HowItWorks />
          <AudienceFilter />
          <Pricing />
          <Testimonials />
          <FAQ />
          <Contact />
        </Suspense>
      </main>

      <Suspense fallback={<div className="h-32 w-full" />}>
        <Footer />
      </Suspense>
      <FloatingWhatsApp />

      {/* Login Modal — lazy loaded (pulls Firebase only when needed) */}
      {showLoginModal && (
        <Suspense fallback={null}>
          <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            title={loginModalConfig.title}
            description={loginModalConfig.description}
          />
        </Suspense>
      )}

      {/* Contact Modal — WhatsApp-first conversion trigger */}
      <InteractiveContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        serviceName={contactModalService}
      />
    </>
  );
};

export default Index;
