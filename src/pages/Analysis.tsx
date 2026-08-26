import React, { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { KPICard } from '../components/ui/KPICard';
import { UncopyableTitle } from '../components/ui/UncopyableTitle';
import { ASVClusterLandscape } from '@/components/analysis/asv-cluster-landscape';
import { ClassificationFlow } from '@/components/analysis/classification-flow';
import { EnvironmentalAssociation } from '@/components/analysis/environmental-association';
import { Neo4jExplorer } from '@/components/analysis/neo4j-explorer';

export const Analysis: React.FC = () => {
  const [hasData, setHasData] = useState(true);

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Uncopyable Vector Title */}
      <UncopyableTitle 
        variant="page"
        englishText="ANALYSIS"
        subText="DEEP DIAGNOSTIC METRICS & TAXONOMIC NOVELTY MATRIX"
      />

      {!hasData ? (
        <GlassPanel className="min-h-[460px] flex flex-col items-center justify-center text-center rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-cyan-950/60 border border-cyan-400/30 flex items-center justify-center mb-4 shadow-xl">
            <span className="text-2xl">🧬</span>
          </div>
          <h2 className="text-xl text-white font-display font-semibold mb-2">No Active Analysis Loaded</h2>
          <p className="text-white/70 mb-6 max-w-sm text-xs leading-relaxed">
            Upload a sequence archive on the Home page or inspect the standard hadal reference benchmark dataset.
          </p>
          <button 
            onClick={() => setHasData(true)}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-bold font-display text-xs uppercase tracking-wider rounded-xl hover:from-amber-300 hover:to-amber-200 transition-all shadow-xl hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]"
          >
            Load Benchmark Dataset
          </button>
        </GlassPanel>
      ) : (
        <div className="space-y-12 animate-in fade-in zoom-in duration-300">
          
          {/* Top KPI Header Area */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard label="Total ASVs Mapped" value="12,450" colorClass="text-white" />
            <KPICard label="Known Taxa Alignments" value="4,210" colorClass="text-cyan-300" />
            <KPICard label="Faith's PD Diversity" value="142.5" colorClass="text-amber-300" />
            <KPICard label="Novel Lineage Clusters" value="312" colorClass="text-rose-400" />
          </div>

          {/* 1. Primary Visualization: UMAP / ASV Cluster Landscape */}
          <ASVClusterLandscape />

          {/* 2. Classification Flow: Sankey Diagram */}
          <ClassificationFlow />

          {/* 3. Environmental Association: Scatter Plot */}
          <EnvironmentalAssociation />

          {/* 4. Graph Database Content: Neo4j Explorer & Drill-Down */}
          <Neo4jExplorer />

        </div>
      )}
    </div>
  );
};
