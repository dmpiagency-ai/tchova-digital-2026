import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from '@/components/ui/carousel';
import { env } from '@/config/env';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/LoginModal';
import { Eye } from 'lucide-react';

const Services = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingService, setPendingService] = useState<{ id: number; title: string; category: string } | null>(null);

  const getServiceImage = (item: { id: number; }) => {
    const images: Record<number, string> = {
      1: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755337/Gemini_Generated_Image_qjaurwqjaurwqjau_k1fqgr.png',
      2: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755411/Gemini_Generated_Image_3a9xn93a9xn93a9x_dhydbm.png',
      3: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762747013/1762701812733_p93nsd.png',
      4: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755464/1762703721009_w7posw.png',
      5: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762756410/Gemini_Generated_Image_ni5h1ani5h1ani5h_p8vvov.png',
      6: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762755441/Gemini_Generated_Image_66r0q266r0q266r0_kbpqc8.png',
    };
    return images[item.id] || 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1762746750/1762703395544_lhphsq.png';
  };

  // Services with carousel
  const services = [
    {
      id: 1,
      title: 'Identidade Visual',
      category: 'Design',
    },
    {
      id: 2,
      title: 'Sites Profissionais',
      category: 'Web',
    },
    {
      id: 3,
      title: 'Marketing Digital',
      category: 'Marketing',
    },
    {
      id: 4,
      title: 'Produção Audiovisual',
      category: 'Vídeo',
    },
    {
      id: 5,
      title: 'Importação',
      category: 'Comércio',
    },
    {
      id: 6,
      title: 'Assistência GSM',
      category: 'Técnico',
    }
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleServiceClick = (service: { id: number; title: string; category: string; }) => {
    if (!isAuthenticated) {
      setPendingService(service);
      setIsLoginModalOpen(true);
      return;
    }
    navigate(`/service-details?id=${service.id}&title=${encodeURIComponent(service.title)}&category=${encodeURIComponent(service.category)}`);
  };

  return (
    <section id="services" className="py-20 relative overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Impact Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-primary via-brand-green to-brand-yellow bg-clip-text text-transparent drop-shadow-lg">
              Nossos Serviços
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto font-medium">
            Soluções completas para seu negócio
          </p>
        </div>

        {/* Visual-First Service Cards with Carousel */}
        <div className="px-2">
          <Carousel
            slides={services.map((item) => (
              <div key={item.id} className="select-none">
                <div
                  className="relative h-[400px] rounded-3xl overflow-hidden cursor-pointer group touch-manipulation"
                  style={{ maxWidth: '300px', margin: '0 auto' }}
                  onClick={() => handleServiceClick(item)}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    handleServiceClick(item);
                  }}
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${getServiceImage(item)})` }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content - Minimal */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white/80 mb-2">
                      {item.category}
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {item.title}
                    </h3>
                  </div>

                  {/* Liquid Glass "Ver Detalhes" Button */}
                  <div className="absolute top-4 right-4 z-20 pointer-events-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleServiceClick(item);
                      }}
                      onTouchEnd={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleServiceClick(item);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                        bg-white/20 backdrop-blur-md border border-white/30 
                        text-white text-xs font-medium
                        hover:bg-white/30 hover:border-white/40
                        active:bg-white/40
                        transition-all duration-200
                        shadow-lg shadow-black/20
                        touch-manipulation"
                      style={{
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                      }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Ver detalhes</span>
                    </button>
                  </div>

                  {/* Hover Indicator */}
                  <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/10 transition-colors duration-300 flex items-center justify-center pointer-events-none">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            options={{
              loop: true,
              align: 'center',
              containScroll: 'trimSnaps',
              slidesToScroll: isMobile ? 1 : 2,
              breakpoints: {
                '(min-width: 768px)': { slidesToScroll: 2, align: 'center' },
                '(min-width: 1024px)': { slidesToScroll: 3, align: 'center' }
              }
            }}
          />
        </div>

        {/* Single CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os serviços.');
              window.open(`https://wa.me/${env.WHATSAPP_NUMBER}?text=${message}`, '_blank');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-green-500/20"
          >
            <span>Falar sobre serviços</span>
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setPendingService(null);
        }}
        title="Acesso aos Serviços"
        description="Faça login para ver detalhes completos"
        redirectTo={pendingService ? `/service-details?id=${pendingService.id}&title=${encodeURIComponent(pendingService.title)}&category=${encodeURIComponent(pendingService.category)}` : undefined}
      />
    </section>
  );
};

export default Services;
