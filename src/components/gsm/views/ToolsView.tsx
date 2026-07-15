import { useRef } from 'react';
import { Search } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsapConfig';
import { BoxTool } from '../types/gsm.types';
import { ToolCard } from '../components/ToolCard';

interface ToolsViewProps {
  tools: BoxTool[];
  onRent: (tool: BoxTool) => void;
  darkMode: boolean;
}

export const ToolsView = ({ tools, onRent, darkMode }: ToolsViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const cards = containerRef.current?.querySelectorAll('.gs-tool-card');
    if (cards && cards.length > 0) {
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power4.out'
      });
    }
  }, { scope: containerRef, dependencies: [tools] });

  return (
    <div ref={containerRef} className="p-4 sm:p-8 lg:p-12 pb-32 sm:pb-32 lg:pb-12 space-y-6 sm:space-y-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tighter">CATÁLOGO <span className="text-primary tracking-normal">TOOLS</span></h2>
          <p className="text-[10px] sm:text-sm font-black uppercase tracking-widest text-zinc-400 mt-1 sm:mt-2">Tecnologias de desbloqueio em tempo real</p>
        </div>
        <div className="flex gap-4 w-full lg:w-auto">
          <div className="relative group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input type="text" placeholder="BUSCAR..." className="w-full lg:w-64 pl-12 pr-6 py-4 rounded-[1.2rem] sm:rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-none text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {tools.map((tool: BoxTool) => (
          <ToolCard key={tool.id} tool={tool} onRent={onRent} darkMode={darkMode} />
        ))}
      </div>
    </div>
  );
};
export default ToolsView;
