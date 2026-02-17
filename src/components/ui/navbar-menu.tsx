"use client";
import React, { useRef, useCallback, createContext, useContext } from "react";
import { motion, Transition } from "framer-motion";
import { cn } from "@/lib/utils";

const transition: Transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// Delay in milliseconds before closing the dropdown
const CLOSE_DELAY = 200;

// Context to share the close timeout ref between Menu and MenuItem
const MenuContext = createContext<{
  closeTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  setActive: (item: string) => void;
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
  
  const handleMouseEnter = useCallback(() => {
    if (context) {
      // Clear any pending close timeout when mouse enters
      if (context.closeTimeoutRef.current) {
        clearTimeout(context.closeTimeoutRef.current);
        context.closeTimeoutRef.current = null;
      }
      context.setActive(item);
    }
  }, [context, item]);

  return (
    <div onMouseEnter={handleMouseEnter} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className={cn(
          "cursor-pointer hover:opacity-[0.9] dark:text-white text-sm font-medium",
          className
        )}
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && children && (
            <div className="absolute top-[calc(100%_+_1rem)] left-1/2 transform -translate-x-1/2 pt-2">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-zinc-900 backdrop-blur-xl rounded-2xl overflow-hidden border border-black/[0.1] dark:border-white/[0.1] shadow-2xl"
              >
                <motion.div
                  layout
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
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
  // Ref to store the timeout for delayed close
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Delayed close handler - waits before closing the dropdown
  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setActive(null);
    }, CLOSE_DELAY);
  }, [setActive]);

  // Create wrapper function that matches context type
  const setActiveItem = useCallback((item: string) => {
    setActive(item);
  }, [setActive]);

  return (
    <MenuContext.Provider value={{ closeTimeoutRef, setActive: setActiveItem }}>
      <nav
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative rounded-full flex justify-center items-center space-x-1",
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
      className="flex space-x-3 text-left hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-xl transition-colors"
    >
      {src && (
        <img
          src={src}
          width={100}
          height={60}
          alt={title}
          className="flex-shrink-0 rounded-lg shadow-lg object-cover"
        />
      )}
      <div className="flex flex-col justify-center">
        <h4 className="text-base font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-600 text-xs max-w-[10rem] dark:text-neutral-400">
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
        "text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors text-left w-full",
        className
      )}
    >
      {children}
    </button>
  );
};
