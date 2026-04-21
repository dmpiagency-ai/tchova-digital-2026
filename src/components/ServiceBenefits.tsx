import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ServiceBenefitsProps {
  benefits: string[];
  benefitsPerView?: number;
}

const ServiceBenefits = ({ 
  benefits, 
  benefitsPerView = 2 
}: ServiceBenefitsProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const totalSlides = Math.ceil(benefits.slice(0, 6).length / benefitsPerView);
  
  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
  };

  const visibleBenefits = benefits.slice(0, 6);
  const startIndex = currentSlide * benefitsPerView;
  const endIndex = Math.min(startIndex + benefitsPerView, visibleBenefits.length);
  const currentBenefits = visibleBenefits.slice(startIndex, endIndex);

  return (
    <div className="liquid-card rounded-[48px] p-8 lg:p-12 mb-12 lg:mb-16 backdrop-blur-xl dark:bg-black/5 bg-slate-50/80 border dark:border-white/10 border-slate-200 shadow-2xl">
      <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-8 lg:mb-12 flex items-center">
        <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent font-black">
          Benefícios do Serviço
        </span>
      </h2>
      
      <div className="relative">
        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6">
          {currentBenefits.map((benefit, index) => (
            <div 
              key={`${startIndex + index}`}
              className="group bg-gradient-to-br from-amber-500/10 via-orange-400/5 to-transparent backdrop-blur-lg rounded-[24px] p-6 border border-amber-200/30 hover:border-amber-300/50 transition-all duration-500 hover:scale-[1.02]"
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                  {startIndex + index + 1}
                </div>
                <p className="text-base lg:text-lg text-foreground leading-relaxed">
                  {benefit}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="rounded-full h-12 w-12 flex items-center justify-center"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots */}
            <div className="flex space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-amber-500 scale-125'
                      : 'bg-amber-200 hover:bg-amber-300'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentSlide === totalSlides - 1}
              className="rounded-full h-12 w-12 flex items-center justify-center"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Additional Benefits Info */}
        {benefits.length > 6 && (
          <p className="text-center text-muted-foreground text-sm lg:text-base mt-6">
            Mostrando {startIndex + 1}-{Math.min(endIndex, benefits.length)} de {benefits.length} benefícios
          </p>
        )}
      </div>
    </div>
  );
};

export default ServiceBenefits;
