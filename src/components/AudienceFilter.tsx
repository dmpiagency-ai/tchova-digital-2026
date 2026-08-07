import React, { useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsapConfig";
import { isLowEnd, use75Quality, shouldLoadVideo } from '@/hooks/useLowEnd';

const AUDIENCE_VIDEO_100 = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/f_auto,q_100/v1785153343/vd_about_vawl46.mp4';
const AUDIENCE_VIDEO_75  = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/f_auto,q_75/v1785153343/vd_about_vawl46.mp4';
const AUDIENCE_POSTER    = 'https://res.cloudinary.com/dwlfwnbt0/video/upload/so_0,f_auto,q_100/v1785153343/vd_about_vawl46.jpg';

const AudienceFilter = () => {
  const containerRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoActive, setVideoActive] = useState(false);

  // True lazy-load: only assign src when card enters viewport
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoadVideo) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // First time visible — assign src and start loading
          if (!video.src) {
            video.src = use75Quality ? AUDIENCE_VIDEO_75 : AUDIENCE_VIDEO_100;
            video.load();
          }
          video.play().catch(() => {});
          setVideoActive(true);
        } else {
          video.pause();
          setVideoActive(false);
        }
      });
    }, { threshold: 0.1, rootMargin: '200px 0px' }); // 200px preload margin

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    if (isLowEnd) return;
    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      if (gridRef.current) {
        gsap.from(gridRef.current.children, {
          y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 75%' }
        });
      }
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      id="audience"
      className="py-12 md:py-16 lg:py-20 relative bg-background border-t border-white/[0.04] scroll-mt-6 overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-12 relative z-10">

        {/* 3-Card Bento Grid Container - Video Card Left (6 cols), Cards 2 & 3 Right (3 cols each) */}
        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 max-w-7xl mx-auto items-stretch">
          
          {/* Bento Card 1: Video & Headline Card (Wide Landscape Bento - Left Side) */}
          <div className="lg:col-span-6 relative rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl flex flex-col justify-between p-6 md:p-8 lg:p-10 bg-zinc-950 min-h-[360px] lg:min-h-[420px]">
            {/* Video Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-black to-zinc-900 pointer-events-none overflow-hidden">
              <video
                ref={videoRef}
                poster={AUDIENCE_POSTER}
                loop
                muted
                playsInline
                preload="none"
                className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                style={{ opacity: videoActive ? 0.8 : 0.6 }}
              />
              {/* Soft Gradient Overlay focused under text on the left */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none" />
            </div>

            <div className="relative z-20 flex flex-col items-start h-full">
              <div className="pt-6 md:pt-8 lg:pt-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8 md:mb-12 lg:mb-14 backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-bold text-primary uppercase tracking-widest font-nunito">Cliente Ideal</span>
                </div>
                <h2 className="text-[21px] sm:text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter leading-tight font-nunito mb-3 max-w-[500px]">
                  PARA QUEM <br />
                  <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green font-nunito">
                    TRABALHAMOS.
                  </span>
                </h2>
                <p className="text-xs md:text-sm lg:text-base text-zinc-300 font-normal leading-relaxed font-nunito mt-3 max-w-[440px]">
                  <span className="md:hidden">
                    Entregamos os melhores<br />
                    resultados quando o teu<br />
                    negócio está alinhado<br />
                    com o nosso método.
                  </span>
                  <span className="hidden md:inline">
                    Entregamos os melhores resultados<br />
                    quando o teu negócio<br />
                    está alinhado com o nosso método.
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bento Card 2: O Perfil Ideal (3 Cols) */}
          <div className="lg:col-span-3 bg-card/60 backdrop-blur-xl border border-primary/20 rounded-[2rem] p-5 md:p-6 lg:p-6 shadow-[0_0_40px_-15px_rgba(34,197,94,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[360px] lg:min-h-[420px]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            <div className="pt-2 md:pt-3 lg:pt-4">
              <h3 className="text-sm md:text-base font-bold text-white mb-5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span>Trabalhamos bem contigo se...</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs mb-0.5">Já faturas, mas a imagem não acompanha</h4>
                    <p className="text-[11px] text-zinc-400 leading-snug font-normal">O negócio vende bem, mas o visual não reflete o teu valor real.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs mb-0.5">Dependes só do boca-a-boca</h4>
                    <p className="text-[11px] text-zinc-400 leading-snug font-normal">Precisas de um caminho previsível para atrair novos clientes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs mb-0.5">Fazes tudo à mão e queres escala</h4>
                    <p className="text-[11px] text-zinc-400 leading-snug font-normal">Queres automações e sistemas para poupar tempo e energia.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 3: O Perfil Errado (3 Cols) */}
          <div className="lg:col-span-3 bg-white/[0.03] border border-white/10 rounded-[2rem] p-5 md:p-6 lg:p-6 relative overflow-hidden flex flex-col justify-between min-h-[360px] lg:min-h-[420px]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500/60" />
            <div className="pt-2 md:pt-3 lg:pt-4">
              <h3 className="text-sm md:text-base font-bold text-white mb-5 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                  <X className="w-3.5 h-3.5 text-red-500" />
                </div>
                <span>Pode não ser a altura se...</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-white/90 font-bold text-xs mb-0.5">Ainda estás na fase da ideia</h4>
                    <p className="text-[11px] text-zinc-400 leading-snug font-normal">Se ainda não começaste a vender, é cedo para a nossa operação.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-white/90 font-bold text-xs mb-0.5">Procuras a opção mais barata</h4>
                    <p className="text-[11px] text-zinc-400 leading-snug font-normal">Não competimos por preço baixo, mas sim por entregas com ROI.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/15 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-white/90 font-bold text-xs mb-0.5">Sem visão de investimento</h4>
                    <p className="text-[11px] text-zinc-400 leading-snug font-normal">Não estás pronto para investir na tua imagem e infraestrutura.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AudienceFilter;
