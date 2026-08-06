// ============================================
// SERVICE METHOD PAGE — Reusable Fluxcore-inspired layout
// Scroll contínuo · 4 fases · Deliverables · Compromissos · CTA
// ============================================

import { useNavigate } from 'react-router-dom';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { ArrowLeft, MessageCircle, type LucideIcon } from 'lucide-react';
import { env } from '@/config/env';

// ── Types ──────────────────────────────────────────────
export interface MethodStep {
  number: string;         // "01", "02", etc.
  icon: LucideIcon;
  title: string;
  accentLine: string;     // short punchy line in accent colour
  description: string;
  deliverable: string;    // bold "Deliverable:" line
  deliverableNote: string;
}

export interface Commitment {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ServiceMethodPageProps {
  // Hero
  heroTitle: string;
  heroAccent: string;       // word/phrase highlighted in accent
  heroSubtitle: string;
  heroDescription: string;

  // Method steps (4)
  steps: MethodStep[];

  // Commitments (3)
  commitments: Commitment[];

  // CTA
  ctaTitle: string;
  ctaDescription: string;
  ctaButtonText: string;
  whatsappMessage: string;
}

// ── Component ──────────────────────────────────────────
const ServiceMethodPage = ({
  heroTitle,
  heroAccent,
  heroSubtitle,
  heroDescription,
  steps,
  commitments,
  ctaTitle,
  ctaDescription,
  ctaButtonText,
  whatsappMessage,
}: ServiceMethodPageProps) => {
  const navigate = useNavigate();

  const whatsappLink = `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#030303] text-white select-none font-sans overflow-x-hidden">
      {/* ─── Sticky Header ─── */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#030303]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-14 md:h-20 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group text-sm font-semibold no-min-size"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Voltar</span>
          </button>
          <div className="h-6 md:h-8">
            <AnimatedLogo className="h-6 md:h-8 w-auto" />
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-28 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[180px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-3xl text-center relative z-10">
          {/* Accent bar */}
          <div className="w-10 h-1 bg-primary mx-auto mb-6 rounded-full" />

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
            {heroTitle}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-brand-green">
              {heroAccent}
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-xl text-zinc-400 font-medium max-w-2xl mx-auto mb-4 leading-relaxed">
            {heroSubtitle}
          </p>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto">
            {heroDescription}
          </p>
        </div>

        {/* Timeline visual — subtle heartbeat line */}
        <div className="mt-16 md:mt-24 max-w-lg mx-auto px-8 relative">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="flex justify-between -mt-1.5">
            {steps.map((s, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full bg-primary/60 border-2 border-[#030303] shadow-[0_0_8px_rgba(34,197,94,0.4)]"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── METHOD STEPS ─── */}
      {steps.map((step, index) => {
        const isEven = index % 2 === 0;
        const StepIcon = step.icon;

        return (
          <section
            key={index}
            className={`relative py-16 md:py-28 ${isEven ? 'bg-[#030303]' : 'bg-[#060606]'}`}
          >
            {/* Subtle side glow */}
            <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'left-0' : 'right-0'} w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none`} />

            <div className="container mx-auto px-4 md:px-6 max-w-4xl relative z-10">
              {/* Number + Icon row */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-6xl md:text-8xl font-black text-white/[0.06] leading-none select-none">
                  {step.number}
                </span>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center -ml-4 md:-ml-6">
                  <StepIcon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-3">
                {step.title}
              </h2>

              {/* Accent line */}
              <p className="text-sm sm:text-base md:text-lg text-primary font-bold mb-5">
                {step.accentLine}
              </p>

              {/* Description */}
              <p className="text-sm md:text-base text-zinc-400 font-medium leading-relaxed max-w-2xl mb-8">
                {step.description}
              </p>

              {/* Deliverable */}
              <div className="inline-block">
                <p className="text-xs sm:text-sm font-black text-white mb-1">
                  Entrega: {step.deliverable}
                </p>
                <p className="text-xs text-zinc-500 font-medium">
                  {step.deliverableNote}
                </p>
              </div>
            </div>
          </section>
        );
      })}

      {/* ─── DELIVERABLES SUMMARY ─── */}
      <section className="py-16 md:py-28 bg-[#030303] relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary mb-3 block">
            O que recebes
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mb-12 md:mb-16">
            As tuas entregas em cada fase
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={i}
                  className="group p-5 md:p-7 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-black text-primary">{step.number}</span>
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <StepIcon className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-white mb-1">{step.deliverable}</h3>
                  <p className="text-xs text-zinc-500 font-medium">{step.deliverableNote}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── COMMITMENTS ─── */}
      <section className="py-16 md:py-28 bg-[#060606]">
        <div className="container mx-auto px-4 max-w-4xl">
          <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary mb-3 block">
            Os nossos compromissos
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight mb-12 md:mb-16">
            O que te prometemos
          </h2>

          <div className="space-y-4 md:space-y-5">
            {commitments.map((c, i) => {
              const CommitIcon = c.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 md:gap-5 p-5 md:p-7 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CommitIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm md:text-base font-black text-white mb-1">{c.title}</h3>
                    <p className="text-xs md:text-sm text-zinc-400 font-medium leading-relaxed">{c.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 md:py-32 bg-[#030303] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />

        <div className="container mx-auto px-4 max-w-lg text-center relative z-10">
          <div className="p-6 sm:p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-zinc-950/60 backdrop-blur-xl border border-white/5 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-50 pointer-events-none rounded-[2rem] md:rounded-[2.5rem]" />

            <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-3 relative z-10">
              {ctaTitle}
            </h2>
            <p className="text-sm text-zinc-400 font-medium mb-8 relative z-10">
              {ctaDescription}
            </p>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 inline-flex w-full items-center justify-center gap-3 px-8 py-5 rounded-full bg-gradient-to-r from-primary to-brand-green text-white font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(34,197,94,0.3)]"
            >
              <MessageCircle className="w-5 h-5" />
              {ctaButtonText}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceMethodPage;
