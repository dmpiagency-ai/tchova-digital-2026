'use client';
import React from 'react';
import { cn } from '@/lib/utils';

type MenuToggleProps = React.ComponentProps<'div'> & {
  open: boolean;
  duration?: number;
  color?: string;
};

export function MenuToggleIcon({
  open,
  className,
  duration = 300,
  color,
  ...props
}: MenuToggleProps) {
  // Determine line color based on className prop
  const isWhite = className?.includes('text-white');
  const lineColor = color || (isWhite ? '#ffffff' : 'hsl(var(--primary))');

  return (
    <div
      className={cn(
        'relative w-6 h-6 flex flex-col justify-center items-center',
        className
      )}
      {...props}
    >
      {/* Top line */}
      <span
        className={cn(
          'absolute w-5 h-0.5 rounded-full transition-all',
          open ? 'rotate-45 translate-y-0' : '-translate-y-1.5'
        )}
        style={{ 
          transitionDuration: `${duration}ms`,
          backgroundColor: lineColor
        }}
      />
      {/* Middle line */}
      <span
        className={cn(
          'absolute w-5 h-0.5 rounded-full transition-all',
          open ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        )}
        style={{ 
          transitionDuration: `${duration}ms`,
          backgroundColor: lineColor
        }}
      />
      {/* Bottom line */}
      <span
        className={cn(
          'absolute w-5 h-0.5 rounded-full transition-all',
          open ? '-rotate-45 translate-y-0' : 'translate-y-1.5'
        )}
        style={{ 
          transitionDuration: `${duration}ms`,
          backgroundColor: lineColor
        }}
      />
    </div>
  );
}
