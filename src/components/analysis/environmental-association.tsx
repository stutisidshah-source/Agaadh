import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { MOCK_ASVS, type ASVStatus } from '@/lib/mockDataService';

const STATUS_COLORS: Record<ASVStatus, string> = {
  known: '#22d3ee', // Cyan
  novel: '#fb7185', // Coral/Pink
  uncertain: '#fbbf24', // Amber
  artifact: '#c084fc', // Purple
  environmental: '#4ade80', // Green
};

export const EnvironmentalAssociation: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);

  // Normalize data for scatter plot (Depth: 0-11000m, Temp: 0-5C)
  const maxDepth = 11000;
  const maxTemp = 5;

  return (
    <GlassPanel className="p-6 rounded-2xl border border-cyan-400/20">
      <div className="mb-6">
        <h2 className="text-xl text-white font-display font-bold uppercase tracking-wide flex items-center gap-2">
          Environmental Association
        </h2>
        <p className="text-xs text-white/60 font-mono mt-1">Observed distribution across environmental gradients (Depth vs Temperature).</p>
      </div>

      <div className="relative w-full h-[400px] border-l-2 border-b-2 border-white/20 pl-4 pb-4">
        {/* Y Axis - Depth */}
        <div className="absolute -left-12 top-0 bottom-4 flex flex-col justify-between text-[10px] text-white/50 font-mono text-right w-10">
          <span>0m</span>
          <span>5000m</span>
          <span>11000m</span>
        </div>
        <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-mono text-cyan-400/80 tracking-widest uppercase">
          Depth
        </div>

        {/* X Axis - Temperature */}
        <div className="absolute left-4 right-0 -bottom-8 flex justify-between text-[10px] text-white/50 font-mono">
          <span>0 °C</span>
          <span>2.5 °C</span>
          <span>5 °C</span>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 text-xs font-mono text-cyan-400/80 tracking-widest uppercase">
          Temperature
        </div>

        {/* Scatter Plot Area */}
        <div className="w-full h-full relative overflow-hidden bg-gradient-to-tr from-cyan-950/20 to-transparent">
          {MOCK_ASVS.map((asv) => {
            const xPercent = (asv.temperature / maxTemp) * 100;
            const yPercent = (asv.depth / maxDepth) * 100;
            const radius = Math.max(3, asv.confidence / 10);
            
            return (
              <motion.div
                key={asv.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.7, scale: 1 }}
                transition={{ delay: Math.random() * 0.5 }}
                onMouseEnter={() => setHoveredNode({ ...asv, x: xPercent, y: yPercent })}
                onMouseLeave={() => setHoveredNode(null)}
                className="absolute rounded-full cursor-pointer hover:opacity-100 hover:z-10 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                style={{
                  left: `${xPercent}%`,
                  top: `${yPercent}%`,
                  width: radius * 2,
                  height: radius * 2,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: STATUS_COLORS[asv.status],
                }}
              />
            )
          })}
        </div>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute z-20 bg-slate-900/95 border border-cyan-400/30 rounded p-3 shadow-xl backdrop-blur-md pointer-events-none w-48"
              style={{
                left: `${Math.min(90, Math.max(10, hoveredNode.x))}%`,
                top: `${Math.min(90, Math.max(10, hoveredNode.y - 10))}%`,
                transform: 'translate(-50%, -100%)'
              }}
            >
              <div className="text-cyan-300 font-mono font-bold text-xs mb-1">{hoveredNode.id}</div>
              <div className="text-white text-[10px] mb-2">{hoveredNode.classification}</div>
              <div className="flex justify-between text-[10px] font-mono text-white/70">
                <span>Temp: {hoveredNode.temperature}°C</span>
                <span>Depth: {hoveredNode.depth}m</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassPanel>
  );
};
