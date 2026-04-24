import React from 'react';
import { cn } from '@/lib/utils';

export interface EliteIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  glow?: boolean;
}

const baseClasses = "fill-none stroke-current";
const strokeProps = { strokeWidth: 1.2, strokeLinecap: "square" as const, strokeLinejoin: "miter" as const };

export const EliteMatrix = ({ className, glow = true, ...props }: EliteIconProps) => (
  <svg viewBox="0 0 24 24" className={cn(baseClasses, glow && "drop-shadow-[0_0_8px_currentColor]", className)} {...strokeProps} {...props}>
    <path d="M3 3h8v8H3z" />
    <path d="M13 13h8v8h-8z" />
    <path d="M13 3h8v3h-8z" className="opacity-40" />
    <path d="M3 18h8v3H3z" className="opacity-40" />
    <path d="M11 11l2 2" strokeWidth="0.8" className="opacity-50" />
  </svg>
);

export const EliteVector = ({ className, glow = true, ...props }: EliteIconProps) => (
  <svg viewBox="0 0 24 24" className={cn(baseClasses, glow && "drop-shadow-[0_0_8px_currentColor]", className)} {...strokeProps} {...props}>
    <path d="M4 20L20 4" />
    <path d="M10 4h10v10" />
    <path d="M14 4l-4-4" className="opacity-40" />
    <path d="M24 14l-4-4" className="opacity-40" />
    <path d="M4 20h4" className="opacity-40" />
    <path d="M4 20v-4" className="opacity-40" />
  </svg>
);

export const ElitePulse = ({ className, glow = true, ...props }: EliteIconProps) => (
  <svg viewBox="0 0 24 24" className={cn(baseClasses, glow && "drop-shadow-[0_0_8px_currentColor]", className)} {...strokeProps} {...props}>
    <path d="M2 12h5l3-7 4 14 3-7h5" />
    <path d="M7 12H2" className="opacity-40" />
    <path d="M22 12h-5" className="opacity-40" />
    <circle cx="12" cy="12" r="10" strokeWidth="0.5" className="opacity-20" />
  </svg>
);

export const EliteRadar = ({ className, glow = true, ...props }: EliteIconProps) => (
  <svg viewBox="0 0 24 24" className={cn(baseClasses, glow && "drop-shadow-[0_0_8px_currentColor]", className)} {...strokeProps} {...props}>
    <path d="M12 22V12" />
    <path d="M12 12l8.5-8.5" />
    <path d="M12 12L3.5 3.5" />
    <circle cx="12" cy="12" r="9" strokeWidth="0.5" className="opacity-40" strokeDasharray="2 4" />
    <circle cx="12" cy="12" r="5" strokeWidth="1" className="opacity-60" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

export const EliteGrid = ({ className, glow = true, ...props }: EliteIconProps) => (
  <svg viewBox="0 0 24 24" className={cn(baseClasses, glow && "drop-shadow-[0_0_8px_currentColor]", className)} {...strokeProps} {...props}>
    <rect x="2" y="2" width="20" height="20" />
    <path d="M2 8h20" />
    <path d="M8 2v20" className="opacity-40" />
    <path d="M16 8v14" className="opacity-40" />
  </svg>
);

export const EliteLens = ({ className, glow = true, ...props }: EliteIconProps) => (
  <svg viewBox="0 0 24 24" className={cn(baseClasses, glow && "drop-shadow-[0_0_8px_currentColor]", className)} {...strokeProps} {...props}>
    <rect x="2" y="4" width="20" height="16" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 8v8" className="opacity-30" />
    <path d="M8 12h8" className="opacity-30" />
    <path d="M18 6h2" className="opacity-60" />
  </svg>
);

export const EliteCore = ({ className, glow = true, ...props }: EliteIconProps) => (
  <svg viewBox="0 0 24 24" className={cn(baseClasses, glow && "drop-shadow-[0_0_8px_currentColor]", className)} {...strokeProps} {...props}>
    <path d="M12 2L3 6v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V6l-9-4z" />
    <path d="M12 6v15" className="opacity-30" />
    <path d="M3 12h18" className="opacity-30" />
    <rect x="9" y="9" width="6" height="6" className="opacity-60" />
  </svg>
);

export const EliteNode = ({ className, glow = true, ...props }: EliteIconProps) => (
  <svg viewBox="0 0 24 24" className={cn(baseClasses, glow && "drop-shadow-[0_0_8px_currentColor]", className)} {...strokeProps} {...props}>
    <path d="M12 2v20" />
    <path d="M2 12h20" />
    <path d="M4.9 4.9l14.2 14.2" className="opacity-40" />
    <path d="M19.1 4.9L4.9 19.1" className="opacity-40" />
    <rect x="10" y="10" width="4" height="4" fill="currentColor" />
  </svg>
);

export const EliteSphere = ({ className, glow = true, ...props }: EliteIconProps) => (
  <svg viewBox="0 0 24 24" className={cn(baseClasses, glow && "drop-shadow-[0_0_8px_currentColor]", className)} {...strokeProps} {...props}>
    <circle cx="12" cy="12" r="10" />
    <ellipse cx="12" cy="12" rx="10" ry="4" className="opacity-40" />
    <ellipse cx="12" cy="12" rx="4" ry="10" className="opacity-40" />
    <path d="M12 2v20" className="opacity-60" />
    <path d="M2 12h20" className="opacity-60" />
  </svg>
);

export const EliteAscent = ({ className, glow = true, ...props }: EliteIconProps) => (
  <svg viewBox="0 0 24 24" className={cn(baseClasses, glow && "drop-shadow-[0_0_8px_currentColor]", className)} {...strokeProps} {...props}>
    <path d="M12 22V2" />
    <path d="M5 9l7-7 7 7" />
    <path d="M5 16l7-7 7 7" className="opacity-40" />
    <path d="M9 22H15" className="opacity-20" />
  </svg>
);
