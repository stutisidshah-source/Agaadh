import React, { useState } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatusChip } from '@/components/ui/StatusChip';
import { MOCK_ASVS, getNeo4jStats, type ASVNode } from '@/lib/mockDataService';
import { RelationshipView } from './relationship-view';
import { Database, Search } from 'lucide-react';

export const Neo4jExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNode, setSelectedNode] = useState<ASVNode | null>(null);
  
  const stats = getNeo4jStats();
  
  const filteredASVs = MOCK_ASVS.filter(asv => 
    asv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asv.classification.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 15); // Show first 15 to avoid massive DOM for mock

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="text-xl text-white font-display font-bold uppercase tracking-wide flex items-center gap-2">
          Graph Database Content
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/40 normal-case flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Database: Neo4j AuraDB
          </span>
        </h2>
        <p className="text-xs text-white/60 font-mono mt-1">Neo4j knowledge graph data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* DB Stats Panel */}
        <div className="lg:col-span-3">
          <GlassPanel className="p-5 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-white/10 pb-3">
              <Database className="text-cyan-400" size={20} />
              <h3 className="text-sm text-white font-display font-semibold uppercase tracking-wider">
                Database Overview
              </h3>
            </div>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center p-2 rounded bg-white/5">
                <span className="text-white/60">Total Nodes</span>
                <span className="text-white font-bold text-sm">{stats.nodes.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-white/5">
                <span className="text-white/60">Relationships</span>
                <span className="text-cyan-300 font-bold text-sm">{stats.relationships.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-white/5">
                <span className="text-white/60">Labels</span>
                <span className="text-white font-bold text-sm">{stats.labels}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-white/5">
                <span className="text-white/60">Properties</span>
                <span className="text-white font-bold text-sm">{stats.properties.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-white/5">
                <span className="text-white/60">Clusters</span>
                <span className="text-amber-300 font-bold text-sm">{stats.clusters}</span>
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Nodes Table */}
        <div className="lg:col-span-9">
          <GlassPanel className="p-0 rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/50">
              <div className="flex gap-2 text-xs font-mono">
                <button className="px-3 py-1.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">Nodes</button>
                <button className="px-3 py-1.5 rounded text-white/50 hover:bg-white/5 hover:text-white transition-colors">Relationships</button>
                <button className="px-3 py-1.5 rounded text-white/50 hover:bg-white/5 hover:text-white transition-colors">Labels</button>
                <button className="px-3 py-1.5 rounded text-white/50 hover:bg-white/5 hover:text-white transition-colors">Properties</button>
              </div>

              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input 
                  type="text"
                  placeholder="Search Nodes (ASV...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-white/30 font-mono focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-slate-950/90 backdrop-blur border-b border-white/10 z-10">
                  <tr className="text-[10px] uppercase tracking-widest text-white/70 font-mono">
                    <th className="py-3 px-4">Node ID</th>
                    <th className="py-3 px-4">Label (Status)</th>
                    <th className="py-3 px-4">Key Properties</th>
                    <th className="py-3 px-4 text-center">Connections</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-xs">
                  {filteredASVs.map((row) => (
                    <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-4 font-mono text-cyan-300 font-bold">{row.id}</td>
                      <td className="py-3 px-4">
                        <StatusChip status={row.status} />
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="text-white/90">name: <span className="text-amber-200">{row.classification}</span></div>
                        <div className="text-white/60">conf: {row.confidence}% | depth: {row.depth}m</div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-white">
                        {row.connections}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          onClick={() => setSelectedNode(row)}
                          className="px-3 py-1.5 rounded border border-cyan-400/30 text-cyan-300 font-mono text-[10px] uppercase hover:bg-cyan-400/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          Explore Graph
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredASVs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-white/50 font-mono text-xs">No nodes match your search.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
      </div>

      {/* Drill-down Graph Modal */}
      {selectedNode && (
        <RelationshipView asv={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  );
};
