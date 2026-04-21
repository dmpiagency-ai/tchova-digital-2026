import { useCallback, useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

function RippleButton({
  children,
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [ripple, setRipple] = useState<{
    x: number;
    y: number;
    size: number;
    key: number;
    isLeaving?: boolean;
  } | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const rippleRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({ scope: buttonRef });

  const createRipple = contextSafe((event: React.MouseEvent<HTMLButtonElement>) => {
    if (isHovered || !buttonRef.current) return;
    setIsHovered(true);

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setRipple({ x, y, size, key: Date.now() });
  });

  const removeRipple = contextSafe((event: React.MouseEvent<HTMLButtonElement>) => {
    if (event.target !== event.currentTarget) return;
    setIsHovered(false);

    if (!ripple) return;

    gsap.to(rippleRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setRipple(null);
      }
    });
  });

  const handleMouseMove = contextSafe((event: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !isHovered || !ripple) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Follow mouse with GSAP for smoothness
    gsap.to(rippleRef.current, {
      left: x,
      top: y,
      duration: 0.4,
      ease: "power2.out"
    });
  });

  useGSAP(() => {
    if (ripple && !ripple.isLeaving && rippleRef.current) {
      gsap.fromTo(rippleRef.current,
        { scale: 0, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, { scope: buttonRef, dependencies: [ripple] });

  const baseClasses = "relative flex items-center justify-center overflow-hidden rounded-xl font-semibold transition-all duration-300 hover-lift focus-visible focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform-gpu";

  const variantClasses = {
    primary: "bg-gradient-to-r from-primary to-primary-light text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
    secondary: "bg-gradient-to-r from-accent to-primary-light text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button
      ref={buttonRef}
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      onMouseEnter={(e) => {
        if (e.target === e.currentTarget) {
          createRipple(e);
        }
      }}
      onMouseLeave={(e) => {
        if (e.target === e.currentTarget) {
          removeRipple(e);
        }
      }}
      onMouseMove={handleMouseMove}
      {...props}
    >
      <span className="relative z-[2] flex items-center gap-2 pointer-events-none">{children}</span>

      {ripple && (
        <span
          ref={rippleRef}
          className="absolute rounded-full bg-white/30 pointer-events-none z-[1]"
          style={{
            width: ripple.size,
            height: ripple.size,
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </button>
  );
}

}

export { RippleButton };


// Demo Component
export function Component() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col gap-6 items-center">
        <RippleButton onClick={() => alert('Button clicked!')} variant="primary" size="lg">
          Click Me
        </RippleButton>
        <RippleButton onClick={() => alert('Secondary clicked!')} variant="secondary" size="md">
          Secondary
        </RippleButton>
        <RippleButton onClick={() => alert('Outline clicked!')} variant="outline" size="sm">
          Outline
        </RippleButton>
      </div>
    </div>
  );
}

export { RippleButton };