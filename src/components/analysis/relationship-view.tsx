import React from 'react';
import { motion } from 'framer-motion';
import type { ASVNode } from '@/lib/mockDataService';

export const RelationshipView: React.FC<{ asv: ASVNode | null, onClose: () => void }> = ({ asv, onClose }) => {
  if (!asv) return null;

  // Generate a mock neighborhood for the ASV (Star Layout)
  const neighborhood = [
    { type: 'Taxonomy', label: asv.classification, color: '#fbbf24', rel: 'CLASSIFIED_AS' },
    { type: 'Cluster', label: asv.status.toUpperCase(), color: '#38bdf8', rel: 'MEMBER_OF' },
    { type: 'Environment', label: `${asv.depth}m Depth`, color: '#4ade80', rel: 'OBSERVED_AT' },
    { type: 'Sequencing', label: asv.metadata, color: '#c084fc', rel: 'GENERATED_FROM' },
  ];

  // If it has connections, add a random related ASV
  if (asv.connections > 0) {
    neighborhood.push({ type: 'ASV', label: `ASV_RELATED_${Math.floor(Math.random() * 900) + 100}`, color: '#f43f5e', rel: 'CO_OCCURS_WITH' });
  }

  const radius = 160;
  const cx = 350;
  const cy = 250;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl h-[600px] bg-slate-900 border border-cyan-400/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 z-20 px-3 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all font-mono text-xs border border-white/10"
        >
          ✕ Close Explorer
        </button>
        
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <h3 className="text-xl text-white font-display font-bold">
              Neo4j Knowledge Graph: {asv.id}
            </h3>
          </div>
        </div>

        <div className="flex-1 relative bg-gradient-to-b from-transparent to-cyan-950/20">
          <svg viewBox="0 0 700 500" className="w-full h-full">
            {/* Draw links */}
            {neighborhood.map((node, i) => {
              const angle = (i / neighborhood.length) * 2 * Math.PI - Math.PI / 2;
              const nx = cx + radius * Math.cos(angle);
              const ny = cy + radius * Math.sin(angle);
              return (
                <g key={`link-${i}`}>
                  <motion.line
                    x1={cx} y1={cy} x2={nx} y2={ny}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                  <motion.text
                    x={(cx + nx) / 2} y={(cy + ny) / 2 - 10}
                    fill="rgba(255,255,255,0.5)"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    {node.rel}
                  </motion.text>
                </g>
              );
            })}

            {/* Central Node */}
            <motion.circle
              cx={cx} cy={cy} r="30"
              fill="#0ea5e9"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring" }}
              className="cursor-pointer hover:stroke-white hover:stroke-4 transition-all"
            />
            <text x={cx} y={cy + 5} fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" pointerEvents="none">{asv.id}</text>
            <text x={cx} y={cy + 45} fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="monospace" textAnchor="middle" pointerEvents="none">Focus Node</text>

            {/* Neighborhood Nodes */}
            {neighborhood.map((node, i) => {
              const angle = (i / neighborhood.length) * 2 * Math.PI - Math.PI / 2;
              const nx = cx + radius * Math.cos(angle);
              const ny = cy + radius * Math.sin(angle);
              return (
                <motion.g 
                  key={`node-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                  className="cursor-pointer"
                >
                  <circle cx={nx} cy={ny} r="25" fill={node.color} opacity="0.8" className="hover:opacity-100 hover:stroke-white hover:stroke-2 transition-all" />
                  <text x={nx} y={ny + 4} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="drop-shadow-md">
                    {node.type}
                  </text>
                  <text x={nx} y={ny + 40} fill="rgba(255,255,255,0.7)" fontSize="10" fontFamily="monospace" textAnchor="middle" pointerEvents="none">
                    {node.label.length > 25 ? node.label.substring(0, 25) + '...' : node.label}
                  </text>
                </motion.g>
              );
            })}
          </svg>

          {/* Neo4j Branding overlay */}
          <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-full border border-cyan-400/20">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white text-[10px] font-mono uppercase">Query Executed in 14ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
