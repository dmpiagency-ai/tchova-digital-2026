const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/components/gsm/GSMTechDashboard.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// 1. Replace img tags with backgroundImage divs (both locations: ToolCard and DashboardView)
// ToolCard img replacement (around line 584)
content = content.replace(
  /<div className="w-full lg:w-48 h-40 sm:h-48 rounded-\[1\.5rem\] sm:rounded-\[2rem\] overflow-hidden shadow-2xl">\s*<img src=\{tool\.image\} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" \/>\s*<\/div>/g,
  `<div className="w-full lg:w-48 h-40 sm:h-48 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000" style={{ backgroundImage: \`url(\${tool.image})\` }} />`
);

// DashboardView popular tools img replacement (around line 555)
content = content.replace(
  /<div className="h-48 overflow-hidden relative">\s*<img src=\{tool\.image\} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" \/>/g,
  `<div className="h-48 overflow-hidden relative">
                 <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700" style={{ backgroundImage: \`url(\${tool.image})\` }} />`
);

// 2. Remove opacity-0 transform translate-y-10 from ToolCard (line 581)
content = content.replace(
  /className={`gs-tool-card group rounded-\[2rem\] sm:rounded-\[3rem\] p-5 sm:p-8 \$[^}]*\$ border shadow-xl hover:shadow-3xl transition-all duration-500 opacity-0 transform translate-y-10`}/g,
  `className={\`gs-tool-card group rounded-[2rem] sm:rounded-[3rem] p-5 sm:p-8 $\{darkMode ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-100'\} border shadow-xl hover:shadow-3xl transition-all duration-500\`}`
);

// 3. Add dependencies: [tools] to ToolsView useGSAP (around line 648)
content = content.replace(
  /useGSAP\(\(\) => \{\s*const cards = containerRef\.current\?.querySelectorAll\('\\.gs-tool-card'\);[^}]*gsap\.to\(cards,\s*\{[^}]*\};[^}]*\},\s*\{ scope: containerRef \}\);/g,
  (match) => match.replace('{ scope: containerRef }', '{ scope: containerRef, dependencies: [tools] }')
);

fs.writeFileSync(filePath, content);
console.log('Fixed GSMTechDashboard.tsx');