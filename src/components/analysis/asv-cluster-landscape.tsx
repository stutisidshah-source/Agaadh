import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type ASVNode, type ASVStatus, getClusterStats, MOCK_ASVS } from '@/lib/mockDataService';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ZoomIn, ZoomOut, Maximize, RotateCcw } from 'lucide-react';

const STATUS_COLORS: Record<ASVStatus, string> = {
  known: '#22d3ee', // Cyan
  novel: '#fb7185', // Coral/Pink
  uncertain: '#fbbf24', // Amber
  artifact: '#c084fc', // Purple
  environmental: '#4ade80', // Green
};

const STATUS_LABELS: Record<ASVStatus, string> = {
  known: 'Known Taxa',
  novel: 'Novel Lineage',
  uncertain: 'Uncertain',
  artifact: 'Artifact',
  environmental: 'Environmental Assoc'
};

export const ASVClusterLandscape: React.FC = () => {
  const [hoveredNode, setHoveredNode] = useState<ASVNode | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ASVStatus | null>(null);
  const [scale, setScale] = useState(1);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const stats = getClusterStats();

  const handleZoom = (factor: number) => {
    setScale(prev => Math.min(Math.max(prev * factor, 0.5), 4));
  };

  const handleReset = () => {
    setScale(1);
    setSelectedStatus(null);
  };

  return (
    <GlassPanel className="p-0 overflow-hidden rounded-2xl flex flex-col h-[700px] border border-cyan-400/20 relative">
      <div className="absolute top-5 left-5 z-20 flex items-center gap-3">
        <div className="flex flex-col">
          <h2 className="text-xl text-white font-display font-bold uppercase tracking-wide flex items-center gap-2">
            ASV Cluster Landscape
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 normal-case">
              Neo4j + Clustering
            </span>
          </h2>
          <p className="text-xs text-white/60 font-mono mt-1">Each point represents an ASV. Closer points indicate higher similarity.</p>
        </div>
      </div>

      <div className="absolute top-5 right-5 z-20 flex gap-2">
        <button onClick={() => handleZoom(1.2)} className="p-2 rounded bg-slate-900/80 text-white/70 hover:text-cyan-300 hover:bg-slate-800 transition-colors border border-white/10"><ZoomIn size={16} /></button>
        <button onClick={() => handleZoom(0.8)} className="p-2 rounded bg-slate-900/80 text-white/70 hover:text-cyan-300 hover:bg-slate-800 transition-colors border border-white/10"><ZoomOut size={16} /></button>
        <button onClick={handleReset} className="p-2 rounded bg-slate-900/80 text-white/70 hover:text-cyan-300 hover:bg-slate-800 transition-colors border border-white/10"><RotateCcw size={16} /></button>
        <button className="p-2 rounded bg-slate-900/80 text-white/70 hover:text-cyan-300 hover:bg-slate-800 transition-colors border border-white/10"><Maximize size={16} /></button>
      </div>

      {/* Main visualization area */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-[#011422] to-[#021827]" ref={constraintsRef}>
        <motion.div 
          className="w-full h-full cursor-grab active:cursor-grabbing"
          drag
          dragConstraints={constraintsRef}
          animate={{ scale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <svg viewBox="0 0 1000 700" className="w-full h-full absolute inset-0">
            {/* Grid overlay for scientific feel */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Nodes */}
            <g>
              {MOCK_ASVS.map((node) => {
                const isFaded = selectedStatus && selectedStatus !== node.status;
                return (
                  <circle
                    key={node.id}
                    cx={node.x + 100} // Shift to fit nicely in 1000x700
                    cy={node.y + 100}
                    r={hoveredNode?.id === node.id ? 8 : 4}
                    fill={STATUS_COLORS[node.status]}
                    opacity={isFaded ? 0.1 : 0.8}
                    style={{ transition: 'r 0.2s ease, opacity 0.3s ease, stroke 0.2s ease' }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    onClick={() => setSelectedStatus(selectedStatus === node.status ? null : node.status)}
                    className="cursor-pointer hover:stroke-white hover:stroke-2"
                  />
                )
              })}
            </g>
          </svg>
        </motion.div>

        {/* Legend */}
        <div className="absolute bottom-5 left-5 z-20 bg-slate-950/80 p-3 rounded-lg border border-white/10 backdrop-blur-md">
          <h3 className="text-[10px] uppercase text-white/60 mb-2 font-mono">Legend</h3>
          <div className="flex gap-4">
            {Object.entries(STATUS_LABELS).map(([status, label]) => (
              <button 
                key={status} 
                onClick={() => setSelectedStatus(selectedStatus === status ? null : status as ASVStatus)}
                className={`flex items-center gap-1.5 text-xs transition-opacity ${selectedStatus && selectedStatus !== status ? 'opacity-40' : 'opacity-100 hover:opacity-80'}`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS[status as ASVStatus] }} />
                <span className="text-white font-sans">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hover Tooltip */}
        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-30 pointer-events-none bg-slate-900 border border-cyan-400/30 rounded-lg p-4 shadow-2xl shadow-cyan-900/20 w-64"
              style={{
                left: Math.min(Math.max(20, (hoveredNode.x + 100) * (constraintsRef.current?.clientWidth || 1000)/1000 * scale), (constraintsRef.current?.clientWidth || 1000) - 270),
                top: Math.min(Math.max(20, (hoveredNode.y + 100) * (constraintsRef.current?.clientHeight || 700)/700 * scale + 20), (constraintsRef.current?.clientHeight || 700) - 150),
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-cyan-300 font-mono font-bold text-sm">{hoveredNode.id}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded text-slate-950 font-bold" style={{ backgroundColor: STATUS_COLORS[hoveredNode.status] }}>
                  {STATUS_LABELS[hoveredNode.status]}
                </span>
              </div>
              <p className="text-white text-xs mb-3 font-medium italic">{hoveredNode.classification}</p>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-white/70">
                <div className="bg-white/5 p-1.5 rounded">
                  <span className="block text-white/40 mb-0.5">CONFIDENCE</span>
                  <span className="text-white font-bold">{hoveredNode.confidence}%</span>
                </div>
                <div className="bg-white/5 p-1.5 rounded">
                  <span className="block text-white/40 mb-0.5">DEPTH</span>
                  <span className="text-white font-bold">{hoveredNode.depth}m</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Panel - Insights & Selected Cluster */}
        <div className="absolute right-5 top-20 bottom-5 w-64 flex flex-col gap-4 z-20 pointer-events-none">
          
          {selectedStatus && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-slate-950/90 border border-white/10 rounded-xl p-4 backdrop-blur-md pointer-events-auto"
            >
              <h3 className="text-xs uppercase text-white/50 font-mono mb-3 tracking-widest">Cluster Focus</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: STATUS_COLORS[selectedStatus] }} />
                <span className="text-white font-bold text-lg">{STATUS_LABELS[selectedStatus]}</span>
              </div>
              <div className="space-y-2 mt-4 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-white/60">Nodes:</span>
                  <span className="text-white">{stats[selectedStatus].count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Avg Confidence:</span>
                  <span className="text-white">{(stats[selectedStatus].totalConf / stats[selectedStatus].count).toFixed(1)}%</span>
                </div>
              </div>
              <button className="w-full mt-5 py-2 bg-white/10 hover:bg-white/20 text-white text-[10px] uppercase font-bold tracking-widest rounded transition-colors border border-white/20">
                Explore in Neo4j
              </button>
            </motion.div>
          )}

          <div className="bg-slate-950/80 border border-white/10 rounded-xl p-4 backdrop-blur-md mt-auto pointer-events-auto">
            <h3 className="text-xs uppercase text-cyan-400 font-mono mb-3 tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
              Key Insights
            </h3>
            <ul className="text-xs text-white/70 space-y-3 font-sans leading-relaxed">
              <li>
                <span className="text-cyan-300 font-medium">Known taxa</span> form the largest high-confidence cluster ({stats.known.count} nodes).
              </li>
              <li>
                <span className="text-rose-400 font-medium">Novel lineage</span> observations form a distinct cluster with lower classification confidence (avg {(stats.novel.totalConf/stats.novel.count).toFixed(1)}%).
              </li>
              <li>
                <span className="text-purple-400 font-medium">Artifacts</span> form a tightly grouped separate region and can be flagged as probable non-targets.
              </li>
            </ul>
          </div>
        </div>

      </div>
    </GlassPanel>
  );
};
