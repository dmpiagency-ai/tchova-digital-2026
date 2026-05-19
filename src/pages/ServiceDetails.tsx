import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { GSMServicePage } from '@/components/gsm';
import { DesignPortal, MarketingPortal, WebsitesPortal, AudiovisualPortal, ImportacaoPortal } from '@/components/service-portals';
import { INDIVIDUAL_SERVICES } from '@/config/pricing';

// ============================================
// SERVICE DETAILS - PORTAL ROUTER
// Cada serviço leva directo ao seu painel funcional
// Padrão: mesmo que GSM (painel, não landing page)
// ============================================

const ServiceDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const serviceId = searchParams.get('id');
  const service = INDIVIDUAL_SERVICES.find(s => s.id.toString() === serviceId) || null;

  const isGSM = service?.category === 'Assistência GSM';
  const isDesign = service?.category === 'Design Gráfico';
  const isWebsites = service?.category === 'Desenvolvimento Web';
  const isMarketing = service?.category === 'Marketing Digital';
  const isAudiovisual = service?.category === 'Produção Audiovisual';
  const isImportacao = service?.category === 'Importação';

  // Service not found
  if (!service) {
    return (
      <div className="min-h-screen bg-background relative">
        <Header />
        <div className="container relative z-10 mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-[48px] p-8 shadow-xl">
            <h1 className="text-2xl font-bold mb-4 gradient-text">Serviço não encontrado</h1>
            <Button onClick={() => navigate('/')} className="w-full h-12 rounded-[24px] font-semibold">Voltar ao Início</Button>
          </div>
        </div>
      </div>
    );
  }

  // Route directly to the service-specific portal
  if (isGSM) return <GSMServicePage />;
  if (isDesign) return <DesignPortal />;
  if (isMarketing) return <MarketingPortal />;
  if (isWebsites) return <WebsitesPortal />;
  if (isAudiovisual) return <AudiovisualPortal />;
  if (isImportacao) return <ImportacaoPortal />;

  // Fallback for any unmapped service
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <div className="container relative z-10 mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/5 border border-white/20 rounded-[48px] p-8 shadow-xl">
          <h1 className="text-2xl font-bold mb-4">{service.title}</h1>
          <p className="text-muted-foreground mb-6">{service.description}</p>
          <Button onClick={() => navigate('/')} className="w-full h-12 rounded-[24px] font-semibold">Voltar ao Início</Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
