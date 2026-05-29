import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Package, ClipboardCheck } from 'lucide-react';
import { Service } from '@/config/pricing';
import { env } from '@/config/env';

interface ServiceHeroProps {
  service: Service;
  serviceCategory: string;
  onContact: () => void;
  onPayment: () => void;
  onScrollToPackages?: () => void;
}

const ServiceHero = ({ 
  service, 
  serviceCategory, 
  onContact, 
  onPayment,
  onScrollToPackages 
}: ServiceHeroProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const isAudiovisual = service.category === 'Produção Audiovisual';
  const isGSM = service.category === 'Assistência GSM';

  const getHeroTitle = () => {
    if (isGSM) {
      return 'Acesso Profissional a Ferramentas GSM do Mercado';
    }
    if (isAudiovisual) {
      return 'Produção Audiovisual Profissional';
    }
    if (service.category === 'Marketing Digital') {
      return 'Marketing que atrai clientes todos os dias';
    }
    return service.title;
  };

  const getHeroDescription = () => {
    if (isGSM) {
      return 'Box, servers e ferramentas premium usadas por técnicos GSM profissionais.';
    }
    if (isAudiovisual) {
      return 'Cobertura completa de eventos com filmagem, fotografia e edição premium.';
    }
    if (service.category === 'Marketing Digital') {
      return 'Estratégias que fazem seu negócio crescer de verdade';
    }
    return service.shortDescription;
  };

  const renderButtons = () => {
    if (isGSM) {
      return (
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <Button
            onClick={onPayment}
            className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-[#22C55E] to-emerald-600 hover:from-[#16A34A] hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-14 text-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <ClipboardCheck className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Solicitar Ativação GSM</span>
          </Button>
          <Button
            onClick={onContact}
            className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-14 text-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <MessageCircle className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Falar com Técnico</span>
          </Button>
        </div>
      );
    }

    if (isAudiovisual) {
      return (
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <Button
            onClick={onScrollToPackages}
            className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-[#22C55E] to-emerald-600 hover:from-[#16A34A] hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-14 text-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <Package className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Ver Pacotes</span>
          </Button>
          <Button
            onClick={onContact}
            className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-14 text-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <MessageCircle className="w-5 h-5 mr-2 relative z-10" />
            <span className="relative z-10">Falar no WhatsApp</span>
          </Button>
        </div>
      );
    }



    return (
      <Button
        onClick={onContact}
        className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 bg-gradient-to-r from-[#22C55E] to-emerald-600 hover:from-[#16A34A] hover:to-emerald-700 text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-14 text-lg relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
        <MessageCircle className="w-5 h-5 mr-2 relative z-10" />
        <span className="relative z-10">FALAR COM A TCHOVA</span>
      </Button>
    );
  };

  return (
    <div className="tech-card overflow-hidden mb-16 lg:mb-20 rounded-[48px] p-[40px] shadow-xl border border-white/10">
      <div className="relative h-64 lg:h-80 overflow-hidden rounded-[48px]">
        <img
          src={service.image}
          alt={service.title}
          className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'scale-105 opacity-100' : 'scale-110 opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

        <div className="absolute bottom-4 left-6 right-6">
          <div className="space-y-4">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
                {getHeroTitle()}
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
                {getHeroDescription()}
              </p>
            </div>
            {renderButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceHero;
