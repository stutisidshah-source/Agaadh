import { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';
import { KPICard } from '../components/ui/KPICard';
import { StatusChip } from '../components/ui/StatusChip';

export const Analysis = () => {
  const [hasData, setHasData] = useState(false);

  const detections = [
    { id: 'ASV_001', match: 'Bathymodiolus sp.', confidence: '98.5%', status: 'known' as const },
    { id: 'ASV_042', match: 'Alvinocarididae sp.', confidence: '85.2%', status: 'uncertain' as const },
    { id: 'ASV_312', match: 'Unclassified Eukaryota', confidence: '12.4%', status: 'novel' as const },
    { id: 'ASV_405', match: 'Contaminant (Human)', confidence: '99.9%', status: 'artifact' as const },
  ];

  return (
    <div className="min-h-screen pt-4 pb-32 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-7xl text-foam-white font-yatra tracking-widest mb-2 drop-shadow-lg">Analysis</h1>
        <p className="text-xl text-cyan-bright font-sans font-light tracking-wide">Deep Diagnostics</p>
      </div>

      {!hasData ? (
        <GlassPanel className="min-h-[500px] flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-deep-navy/50 border-2 border-mid-teal/30 flex items-center justify-center mb-6">
            <span className="text-2xl opacity-50">🧬</span>
          </div>
          <h2 className="text-2xl text-foam-white font-display mb-2">No Active Analysis</h2>
          <p className="text-foam-white/60 mb-8 max-w-md">
            Upload a sample sequence on the Home page and initiate the pipeline to view deep diagnostic metrics.
          </p>
          <button 
            onClick={() => setHasData(true)}
            className="px-6 py-2 bg-mid-teal/20 text-cyan-bright border border-cyan-bright/50 rounded hover:bg-mid-teal/40 transition-colors"
          >
            Load Demo Data
          </button>
        </GlassPanel>
      ) : (
        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
          {/* KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard label="Total Detections" value="12,450" colorClass="text-foam-white" />
            <KPICard label="Mapped ASVs" value="4,210" colorClass="text-mid-teal-light" />
            <KPICard label="Faith's PD" value="142.5" colorClass="text-gold" />
            <KPICard label="Novel Clusters" value="312" colorClass="text-cyan-bright" />
          </div>

          {/* Detections Table Panel */}
          <GlassPanel className="min-h-[500px]">
            <h2 className="text-2xl text-foam-white font-display mb-6">High-Confidence Detections</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-mid-teal/30">
                    <th className="py-4 px-4 text-xs uppercase tracking-widest text-foam-white/60 font-mono">ASV ID</th>
                    <th className="py-4 px-4 text-xs uppercase tracking-widest text-foam-white/60 font-mono">Best Match</th>
                    <th className="py-4 px-4 text-xs uppercase tracking-widest text-foam-white/60 font-mono">Confidence</th>
                    <th className="py-4 px-4 text-xs uppercase tracking-widest text-foam-white/60 font-mono">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {detections.map((row) => (
                    <tr key={row.id} className="border-b border-mid-teal/10 hover:bg-mid-teal/10 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm text-cyan-bright">{row.id}</td>
                      <td className="py-4 px-4 text-foam-white italic">{row.match}</td>
                      <td className="py-4 px-4 font-mono text-sm text-foam-white/80">{row.confidence}</td>
                      <td className="py-4 px-4"><StatusChip status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
