import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { getClassificationFlowData } from '@/lib/mockDataService';

const COLORS = [
  '#38bdf8', // Cyan
  '#818cf8', // Indigo
  '#f43f5e', // Rose
  '#2dd4bf', // Teal
  '#fbbf24', // Amber
  '#c084fc', // Purple
  '#4ade80', // Green
  '#60a5fa', // Blue
  '#0ea5e9'  // Sky
];

export const ClassificationFlow: React.FC = () => {
  const data = getClassificationFlowData();
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  
  // Basic static layout calculation for 3-column Sankey
  const nodeWidth = 24;
  const colWidth = 400;
  
  // Hardcoded node positions for aesthetic alignment
  const nodePositions = [
    { x: 50, y: 150, h: 200 }, // 0: Total ASVs
    { x: 450, y: 80, h: 160 }, // 1: High Quality
    { x: 450, y: 320, h: 40 }, // 2: Low Quality
    { x: 850, y: 50, h: 80 },  // 3: Known Taxa
    { x: 850, y: 150, h: 50 }, // 4: Novel Lineages
    { x: 850, y: 220, h: 40 }, // 5: Uncertain
    { x: 850, y: 280, h: 20 }, // 6: Artifacts
    { x: 1250, y: 80, h: 90 }, // 7: Verified Clades
    { x: 1250, y: 200, h: 60 } // 8: Database Storage
  ];
  
  const generatePath = (sourcePos: any, targetPos: any, linkVal: number, totalSourceLinks: number, linkIndex: number) => {
    // simplified curve
    const startX = sourcePos.x + nodeWidth;
    const startY = sourcePos.y + (sourcePos.h / totalSourceLinks) * linkIndex + 10;
    const endX = targetPos.x;
    const endY = targetPos.y + (targetPos.h / 2);
    
    const controlPointX1 = startX + (endX - startX) * 0.5;
    const controlPointX2 = endX - (endX - startX) * 0.5;
    
    return `M ${startX},${startY} C ${controlPointX1},${startY} ${controlPointX2},${endY} ${endX},${endY}`;
  };

  return (
    <GlassPanel className="p-6 rounded-2xl border border-cyan-400/20">
      <div className="mb-6">
        <h2 className="text-xl text-white font-display font-bold uppercase tracking-wide flex items-center gap-2">
          Classification Flow
        </h2>
        <p className="text-xs text-white/60 font-mono mt-1">Distribution of ASVs through taxonomic classification pipeline.</p>
      </div>

      <div className="w-full overflow-x-auto overflow-y-hidden">
        <div className="min-w-[900px] h-[400px] relative">
          <svg viewBox="0 0 1400 400" className="w-full h-full">
            {/* Links */}
            {data.links.map((link, i) => {
              const source = nodePositions[link.source];
              const target = nodePositions[link.target];
              const isHovered = hoveredNode === link.source || hoveredNode === link.target;
              
              return (
                <motion.path
                  key={`link-${i}`}
                  d={generatePath(source, target, link.value, 2, i % 2)}
                  fill="none"
                  stroke={COLORS[link.source % COLORS.length]}
                  strokeWidth={Math.max(4, link.value / 10)}
                  strokeOpacity={hoveredNode !== null && !isHovered ? 0.1 : 0.4}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.1, ease: 'easeOut' }}
                  className="transition-opacity duration-300"
                />
              )
            })}
            
            {/* Nodes */}
            {data.nodes.map((node, i) => {
              const pos = nodePositions[i];
              const isHovered = hoveredNode === i;
              const isFaded = hoveredNode !== null && !isHovered;
              
              return (
                <g 
                  key={`node-${i}`} 
                  onMouseEnter={() => setHoveredNode(i)}
                  onMouseLeave={() => setHoveredNode(null)}
                  className="cursor-pointer transition-opacity duration-300"
                  style={{ opacity: isFaded ? 0.3 : 1 }}
                >
                  <rect
                    x={pos.x}
                    y={pos.y}
                    width={nodeWidth}
                    height={pos.h}
                    fill={COLORS[i % COLORS.length]}
                    rx={4}
                  />
                  <text
                    x={i === 0 ? pos.x + nodeWidth + 15 : i === 7 || i === 8 ? pos.x - 15 : pos.x + nodeWidth + 15}
                    y={pos.y + pos.h / 2}
                    fill="white"
                    fontSize="14"
                    fontFamily="monospace"
                    alignmentBaseline="middle"
                    textAnchor={i === 7 || i === 8 ? 'end' : 'start'}
                    className="font-bold drop-shadow-md"
                  >
                    {node.id}
                  </text>
                  {isHovered && (
                    <text
                      x={i === 0 ? pos.x + nodeWidth + 15 : i === 7 || i === 8 ? pos.x - 15 : pos.x + nodeWidth + 15}
                      y={pos.y + pos.h / 2 + 18}
                      fill={COLORS[i % COLORS.length]}
                      fontSize="12"
                      fontFamily="monospace"
                      alignmentBaseline="middle"
                      textAnchor={i === 7 || i === 8 ? 'end' : 'start'}
                    >
                      {/* Rough mock count mapping */}
                      {i === 0 ? 400 : i === 1 ? 380 : i === 3 ? 190 : i === 4 ? 100 : i === 5 ? 70 : 20} ASVs
                    </text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </GlassPanel>
  );
};
