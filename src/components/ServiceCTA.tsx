import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowLeft } from 'lucide-react';

interface ServiceCTAProps {
  onContact: () => void;
  onBack: () => void;
  contactText?: string;
  backText?: string;
}

const ServiceCTA = ({ 
  onContact, 
  onBack,
  contactText = 'FALAR COM A TCHOVA',
  backText = 'Voltar'
}: ServiceCTAProps) => {
  return (
    <div className="liquid-card rounded-[48px] p-8 lg:p-12 backdrop-blur-xl dark:bg-black/5 bg-slate-50/80 border dark:border-white/10 border-slate-200 shadow-2xl">
      <h2 className="text-2xl lg:text-4xl font-black text-center mb-8 lg:mb-12">
        Pronto para Começar?
      </h2>
      
      <div className="space-y-6 lg:space-y-8">
        <Button
          onClick={onContact}
          className="w-full h-14 lg:h-16 text-lg lg:text-xl font-semibold bg-gradient-to-r from-[#22C55E] via-emerald-500 to-green-500 hover:from-[#16A34A] hover:to-emerald-600 text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
          <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8 mr-3 lg:mr-4 relative z-10" />
          <span className="relative z-10">FALAR COM A TCHOVA</span>
        </Button>
        
        <div className="text-center space-y-4">
          <p className="text-muted-foreground text-base lg:text-lg">
            Entre em contacto connosco para obter mais informações sobre os nossos serviços.
          </p>
          
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full h-12 lg:h-14"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {backText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCTA;
