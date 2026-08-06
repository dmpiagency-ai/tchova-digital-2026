// ============================================
// DIAGNOSTIC WIZARD — 3 passos ultra-rápidos
// Step 1: Situação  ·  Step 2: Necessidade  ·  Step 3: Contacto
// ============================================

import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatedLogo } from '@/components/AnimatedLogo';
import { ArrowLeft, X, MessageCircle, Send } from 'lucide-react';
import { env } from '@/config/env';

// ── Types ──────────────────────────────────────────────
export interface WizardOption {
  label: string;
  value: string;
}

export interface WizardStepOptions {
  type: 'options';
  question: string;
  subtitle?: string;
  options: WizardOption[];
}

export interface WizardStepContact {
  type: 'contact';
  question: string;
  subtitle?: string;
}

export type WizardStep = WizardStepOptions | WizardStepContact;

export interface DiagnosticWizardProps {
  /** Portal title shown in WhatsApp message context */
  portalName: string;
  /** 3 steps: options, options, contact */
  steps: [WizardStepOptions, WizardStepOptions, WizardStepContact];
  /** Custom WhatsApp intro message */
  whatsappIntro?: string;
}

// ── Component ──────────────────────────────────────────
const DiagnosticWizard = ({
  portalName,
  steps,
  whatsappIntro,
}: DiagnosticWizardProps) => {
  const navigate = useNavigate();

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [contactForm, setContactForm] = useState({ name: '', whatsapp: '' });
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const totalSteps = steps.length;
  const step = steps[currentStep];

  // Animate step transitions
  const animateTransition = useCallback(
    (nextStep: number, dir: 'forward' | 'back') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setDirection(dir);

      // Fade out
      if (contentRef.current) {
        contentRef.current.style.opacity = '0';
        contentRef.current.style.transform =
          dir === 'forward' ? 'translateX(-30px)' : 'translateX(30px)';
      }

      setTimeout(() => {
        setCurrentStep(nextStep);
        // Reset for fade in
        if (contentRef.current) {
          contentRef.current.style.transform =
            dir === 'forward' ? 'translateX(30px)' : 'translateX(-30px)';
        }
        // Fade in
        requestAnimationFrame(() => {
          if (contentRef.current) {
            contentRef.current.style.opacity = '1';
            contentRef.current.style.transform = 'translateX(0)';
          }
          setTimeout(() => setIsAnimating(false), 300);
        });
      }, 200);
    },
    [isAnimating],
  );

  // Handle option selection (auto-advance)
  const handleOptionSelect = useCallback(
    (stepIndex: number, value: string) => {
      setAnswers((prev) => ({ ...prev, [stepIndex]: value }));

      // Auto-advance after brief highlight
      setTimeout(() => {
        if (stepIndex < totalSteps - 1) {
          animateTransition(stepIndex + 1, 'forward');
        }
      }, 300);
    },
    [totalSteps, animateTransition],
  );

  // Handle back
  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      animateTransition(currentStep - 1, 'back');
    }
  }, [currentStep, animateTransition]);

  // Handle close
  const handleClose = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Handle WhatsApp submit
  const handleSubmit = useCallback(() => {
    const { name, whatsapp } = contactForm;
    if (!name.trim() || !whatsapp.trim()) return;

    // Build message with answers
    const answerLines = Object.entries(answers)
      .map(([stepIdx, value]) => {
        const s = steps[Number(stepIdx)];
        if (s.type === 'options') {
          return `• ${s.question} → ${value}`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');

    const intro = whatsappIntro || `Olá! Quero saber mais sobre ${portalName}.`;
    const fullMessage = `${intro}\n\nNome: ${name}\n\n${answerLines}`;

    const encodedMessage = encodeURIComponent(fullMessage);
    window.open(
      `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodedMessage}`,
      '_blank',
    );
  }, [contactForm, answers, steps, portalName, whatsappIntro]);

  // Progress percentage
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-[#030303] text-white flex flex-col select-none overflow-hidden">
      {/* ─── Header ─── */}
      <header className="flex-shrink-0 border-b border-white/5 bg-[#030303]/90 backdrop-blur-md">
        {/* Progress bar */}
        <div className="h-1 w-full bg-white/5 relative">
          <div
            className="h-full bg-gradient-to-r from-primary to-brand-green transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between px-4 sm:px-6 h-14">
          {/* Logo */}
          <div className="h-6">
            <AnimatedLogo className="h-6 w-auto" />
          </div>

          {/* Step indicator dots */}
          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'w-6 bg-primary'
                    : i < currentStep
                      ? 'w-2 bg-primary/60'
                      : 'w-2 bg-white/15'
                }`}
              />
            ))}
            <span className="ml-3 text-xs text-zinc-500 font-mono tabular-nums">
              {currentStep + 1}/{totalSteps}
            </span>
          </div>

          {/* Close */}
          <button
            onClick={handleClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors no-min-size"
            aria-label="Fechar"
          >
            <X className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </header>

      {/* ─── Content ─── */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 overflow-y-auto">
        <div
          ref={contentRef}
          className="w-full max-w-lg"
          style={{
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          {/* ── Options Step ── */}
          {step.type === 'options' && (
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-3">
                {step.question}
              </h1>
              {step.subtitle && (
                <p className="text-sm text-zinc-500 font-medium mb-8">
                  {step.subtitle}
                </p>
              )}
              {!step.subtitle && <div className="mb-8" />}

              <div className="space-y-3">
                {step.options.map((option, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
                  const isSelected = answers[currentStep] === option.value;

                  return (
                    <button
                      key={optIdx}
                      onClick={() =>
                        handleOptionSelect(currentStep, option.value)
                      }
                      disabled={isAnimating}
                      className={`
                        group w-full flex items-center gap-4 px-5 py-4 rounded-2xl
                        text-left transition-all duration-200
                        ${
                          isSelected
                            ? 'bg-primary/10 border-2 border-primary shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                            : 'bg-white/[0.03] border border-white/8 hover:border-primary/40 hover:bg-white/[0.06]'
                        }
                      `}
                    >
                      {/* Letter badge */}
                      <span
                        className={`
                        flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center
                        text-xs font-black transition-colors
                        ${
                          isSelected
                            ? 'bg-primary text-white'
                            : 'bg-white/[0.06] text-zinc-500 group-hover:text-primary group-hover:bg-primary/10'
                        }
                      `}
                      >
                        {letter}
                      </span>

                      {/* Label */}
                      <span
                        className={`text-sm sm:text-base font-semibold transition-colors ${
                          isSelected ? 'text-white' : 'text-zinc-300'
                        }`}
                      >
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Contact Step ── */}
          {step.type === 'contact' && (
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight mb-3">
                {step.question}
              </h1>
              {step.subtitle && (
                <p className="text-sm text-zinc-500 font-medium mb-8">
                  {step.subtitle}
                </p>
              )}
              {!step.subtitle && <div className="mb-8" />}

              <div className="space-y-4 text-left">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    O teu nome
                  </label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Ex: João Silva"
                    className="w-full px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-600 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={contactForm.whatsapp}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        whatsapp: e.target.value,
                      }))
                    }
                    placeholder="+258 84 123 4567"
                    className="w-full px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-zinc-600 text-sm font-medium focus:outline-none focus:border-primary/50 focus:bg-white/[0.06] transition-all"
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={
                    !contactForm.name.trim() || !contactForm.whatsapp.trim()
                  }
                  className={`
                    w-full flex items-center justify-center gap-3 px-6 py-5 mt-4 rounded-2xl
                    font-black uppercase tracking-widest text-xs
                    transition-all duration-300
                    ${
                      contactForm.name.trim() && contactForm.whatsapp.trim()
                        ? 'bg-gradient-to-r from-primary to-brand-green text-white shadow-[0_0_30px_rgba(34,197,94,0.25)] hover:shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:scale-[1.02] active:scale-95'
                        : 'bg-white/5 text-zinc-600 cursor-not-allowed'
                    }
                  `}
                >
                  <MessageCircle className="w-5 h-5" />
                  Enviar pelo WhatsApp
                  <Send className="w-4 h-4" />
                </button>

                {/* Trust line */}
                <p className="text-center text-[11px] text-zinc-600 mt-3">
                  Os teus dados ficam connosco. Nunca partilhamos com terceiros.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── Footer nav ─── */}
      <footer className="flex-shrink-0 border-t border-white/5 px-4 sm:px-6 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          {/* Back button */}
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              disabled={isAnimating}
              className="flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors font-semibold no-min-size"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </button>
          ) : (
            <div />
          )}

          {/* Portal name */}
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
            {portalName}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default DiagnosticWizard;
