import { Check, MessageCircle, CreditCard, Lock, Shield, ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleWhatsAppClick, getPricingMessage } from '@/lib/whatsapp';
import { env } from '@/config/env';
import { SERVICE_PLANS, getWhatsAppMessage } from '@/config/pricing';
import LoginModal from '@/components/LoginModal';

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slidesPerView = 3;
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);

  const handlePlanPurchase = (plan: { name: string; price: number; }) => {
    navigate(`/payment?service=${encodeURIComponent(plan.name)}&amount=${plan.price.toString()}`);
  };

  const handleCustomizePlan = (plan: { name: string; price: number; }) => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }
    navigate(`/customize-services?plan=${encodeURIComponent(plan.name)}&price=${plan.price.toString()}`);
  };

  const handlePlanWhatsApp = (plan: { name: string; }) => {
    const message = getWhatsAppMessage('plan', plan.name);
    const whatsappUrl = `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, Math.ceil(SERVICE_PLANS.length / slidesPerView) - 1));
    setIsAutoPlaying(false);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
    setIsAutoPlaying(false);
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  // Drag functionality
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setIsAutoPlaying(false);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
    setCurrentX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setCurrentX(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50;

    if (diff > threshold) {
      handleNextSlide();
    } else if (diff < -threshold) {
      handlePrevSlide();
    }

    setIsDragging(false);
  };

  const plans = SERVICE_PLANS;

  return (
    <section id="planos" className="bg-gray-50 dark:bg-background py-12 sm:py-16 lg:py-20 pricing-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Principal - Foco no Essencial */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20 animate-fade-up">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 pricing-title">
            <span className="gradient-text">As melhores soluções para o seu sucesso estão aqui</span>
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto font-light pricing-description">
            Soluções completas para levar seu negócio ao próximo nível com design profissional e tecnologia de ponta
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center space-x-4 mb-12">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevSlide}
            className="rounded-full p-2 hover:bg-primary/10 transition-all duration-300 hover:scale-105 active:scale-95"
            disabled={currentSlide === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex space-x-2">
            {Array.from({ length: Math.ceil(plans.length / slidesPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? 'bg-primary w-6'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextSlide}
            className="rounded-full p-2 hover:bg-primary/10 transition-all duration-300 hover:scale-105 active:scale-95"
            disabled={currentSlide === Math.ceil(plans.length / slidesPerView) - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Planos Carousel - Fixed Overflow Issue */}
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {Array.from({ length: Math.ceil(plans.length / slidesPerView) }).map((_, slideIndex) => (
              <div
                key={slideIndex}
                className="min-w-full flex justify-center"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-5xl">
                  {plans.slice(slideIndex * slidesPerView, slideIndex * slidesPerView + slidesPerView).map((plan, index) => (
                    <div
                      key={index}
                      className={`bg-white/95 dark:bg-card/95 backdrop-blur-sm shadow-xl rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border-t-4 ${plan.borderColor} flex flex-col justify-between relative animate-fade-up hover:shadow-2xl hover:scale-105 transition-all duration-500 group overflow-hidden`}
                      style={{ 
                        height: 'auto', // Remove fixed height for better content fit
                        minHeight: '450px', // Minimum height for consistency
                        animationDelay: `${index * 0.1}s` 
                      }}
                    >
                      {/* Badge */}
                      {plan.badge && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            plan.badge === 'Promoção' 
                              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                              : plan.badge === 'Mais Popular'
                              ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                              : plan.badge === 'Mais Barato'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                          }`}>
                            {plan.badge}
                          </span>
                        </div>
                      )}

                      <div className="relative z-10 flex flex-col flex-1">
                        {/* Ícone */}
                        <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-3 lg:mb-4 neo-inset rounded-lg sm:rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                          <plan.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-primary" />
                        </div>

                        {/* Título */}
                        <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-800 dark:text-foreground mb-1.5 sm:mb-2 leading-tight text-center">{plan.name}</h3>

                        {/* Preço */}
                        <div className="text-center mb-3 sm:mb-4 lg:mb-5">
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-lg sm:text-xl lg:text-2xl font-extrabold text-yellow-500 dark:text-yellow-400">
                              {plan.price.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-muted-foreground font-medium">
                              {plan.period}
                            </span>
                          </div>
                          {plan.originalPrice && (
                            <div className="text-xs text-gray-400 line-through mt-1">
                              De: {plan.originalPrice.toLocaleString()} MZN
                            </div>
                          )}
                          {plan.savings && (
                            <div className="text-xs text-green-600 dark:text-green-400 font-medium mt-1">
                              {plan.savings}
                            </div>
                          )}
                        </div>

                        {/* Descrição - Truncated for minimalism */}
                        <p className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 leading-relaxed line-clamp-2">
                          {plan.description}
                        </p>

                        {/* Recursos Essenciais - Minimalist */}
                        <ul className="text-left text-gray-700 dark:text-muted-foreground space-y-1 sm:space-y-1.5 mb-4 sm:mb-5 flex-1">
                          {plan.features.slice(0, 3).map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-muted-foreground leading-relaxed text-xs line-clamp-1">
                                {feature}
                              </span>
                            </li>
                          ))}
                          {plan.features.length > 3 && (
                            <li className="text-xs text-muted-foreground font-medium">
                              +{plan.features.length - 3} mais...
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Botões */}
                      <div className="relative z-10 space-y-2">
                        <Button
                          onClick={() => handlePlanPurchase(plan)}
                          className={`w-full ${plan.buttonColor} text-white py-1.5 sm:py-2 lg:py-2.5 px-2 sm:px-3 lg:px-4 rounded-lg font-bold text-xs sm:text-sm transition-all duration-300 hover-lift shadow-md hover:shadow-lg hover:scale-105 active:scale-95 group relative overflow-hidden`}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                          <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 relative z-10" />
                          <span className="hidden sm:inline relative z-10">
                            {plan.buttonText}
                          </span>
                          <span className="sm:hidden relative z-10">Aderir</span>
                        </Button>

                        <Button
                          onClick={() => handlePlanWhatsApp(plan)}
                          variant="outline"
                          className="w-full liquid-blur-border py-1 sm:py-1.5 lg:py-2 px-2 sm:px-3 lg:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-500 hover:shadow-lg hover:scale-105"
                        >
                          <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">💬 Tirar Dúvidas</span>
                          <span className="sm:hidden">💬</span>
                        </Button>

                        {/* Trust Elements - Compact */}
                        <div className="grid grid-cols-2 gap-1 sm:gap-2 text-center text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3">
                          <div className="flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                            <span>100% Seguro</span>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                            <span>Satisfação Garantida</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Gradient Overlays for Better UX */}
          {currentSlide > 0 && (
            <div className="absolute top-0 left-0 bottom-0 w-8 sm:w-12 lg:w-16 bg-gradient-to-r from-gray-50 dark:from-background to-transparent pointer-events-none z-10"></div>
          )}
          {currentSlide < Math.ceil(plans.length / slidesPerView) - 1 && (
            <div className="absolute top-0 right-0 bottom-0 w-8 sm:w-12 lg:w-16 bg-gradient-to-l from-gray-50 dark:from-background to-transparent pointer-events-none z-10"></div>
          )}
        </div>

        {/* Auto-play Indicator */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
            {isAutoPlaying ? 'Auto-play ativo' : 'Auto-play pausado'}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-xs h-6 px-2"
            >
              {isAutoPlaying ? 'Pausar' : 'Play'}
            </Button>
          </p>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Personalizar Plano"
        description="Faça login para personalizar seu plano e acessar recursos exclusivos"
      />
    </section>
  );
};

export default Pricing;