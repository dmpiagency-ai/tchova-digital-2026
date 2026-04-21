"use client";
import React, { useRef, useCallback, createContext, useContext, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

// Delay in milliseconds before closing the dropdown
const CLOSE_DELAY = 150;

// Context to share the close timeout ref between Menu and MenuItem
const MenuContext = createContext<{
  closeTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  setActive: (item: string | null) => void;
  active: string | null;
} | null>(null);

export const MenuItem = ({
  active,
  item,
  children,
  className,
}: {
  active: string | null;
  item: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  const context = useContext(MenuContext);
  const itemRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { contextSafe } = useGSAP({ scope: itemRef });

  const handleMouseEnter = useCallback(() => {
    if (context) {
      if (context.closeTimeoutRef.current) {
        clearTimeout(context.closeTimeoutRef.current);
        context.closeTimeoutRef.current = null;
      }
      context.setActive(item);
    }
  }, [context, item]);

  useGSAP(() => {
    if (active === item && children && dropdownRef.current) {
      gsap.fromTo(dropdownRef.current,
        { opacity: 0, scale: 0.95, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(2)" }
      );
    }
  }, { scope: itemRef, dependencies: [active, item] });

  return (
    <div 
      ref={itemRef} 
      onMouseEnter={handleMouseEnter} 
      className="relative"
    >
      <p
        className={cn(
          "cursor-pointer hover:opacity-[0.8] dark:text-white text-sm font-bold uppercase tracking-widest transition-opacity px-4 py-2",
          active === item ? "opacity-100" : "opacity-60",
          className
        )}
      >
        {item}
      </p>
      
      {active === item && children && (
        <div 
          ref={dropdownRef}
          className="absolute top-[calc(100%_+_0.5rem)] left-1/2 transform -translate-x-1/2 pt-2 z-50 pointer-events-auto"
        >
          <div className="bg-white/80 dark:bg-zinc-900/90 backdrop-blur-2xl rounded-2xl overflow-hidden border border-black/[0.05] dark:border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-max">
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const Menu = ({
  setActive,
  children,
  className,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  const [active, setInternalActive] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActive(null);
      setInternalActive(null);
    }, CLOSE_DELAY);
  }, [setActive]);

  const setActiveItem = useCallback((item: string | null) => {
    setActive(item);
    setInternalActive(item);
  }, [setActive]);

  return (
    <MenuContext.Provider value={{ closeTimeoutRef, setActive: setActiveItem, active }}>
      <nav
        ref={navRef}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative rounded-full flex justify-center items-center py-2 px-6",
          className
        )}
      >
        {children}
      </nav>
    </MenuContext.Provider>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
  onClick,
}: {
  title: string;
  description: string;
  href?: string;
  src?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="flex space-x-4 text-left hover:bg-black/[0.03] dark:hover:bg-white/[0.05] p-3 rounded-2xl transition-all duration-300 group"
    >
      {src && (
        <div className="relative overflow-hidden rounded-xl w-24 h-16 shadow-lg group-hover:scale-105 transition-transform duration-500">
          <img
            src={src}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="flex flex-col justify-center max-w-[12rem]">
        <h4 className="text-sm font-black mb-1 text-black dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="text-neutral-500 text-[11px] font-medium leading-relaxed dark:text-neutral-400">
          {description}
        </p>
      </div>
    </button>
  );
};

export const HoveredLink = ({ 
  children, 
  href,
  onClick,
  className 
}: { 
  children: React.ReactNode; 
  href?: string;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-neutral-600 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-all duration-200 text-left w-full py-1.5 text-xs font-bold uppercase tracking-widest",
        className
      )}
    >
      {children}
    </button>
  );
};
