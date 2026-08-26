import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { WorldMap } from '@/components/ui/world-map';
import { GlassPanel } from '../components/ui/GlassPanel';
import { UncopyableTitle } from '../components/ui/UncopyableTitle';

interface OceanStation {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  depth: number;
  temp: number;
  salinity: number;
  o2: number;
  novelASVs: number;
  totalReads: string;
  topTaxa: string[];
  status: 'active' | 'synced' | 'sampling';
  x: number; // percentage on map
  y: number; // percentage on map
}

const HARDCODED_STATIONS: OceanStation[] = [
  {
    id: 'MZ-09',
    name: 'Mariana Trench (Challenger Deep Ridge)',
    region: 'Western Pacific Ocean',
    lat: 11.3493,
    lon: 142.1996,
    depth: 10928,
    temp: 1.2,
    salinity: 34.7,
    o2: 3.1,
    novelASVs: 312,
    totalReads: '1.42M',
    topTaxa: ['Pseudoliparis swirei', 'Bathymodiolus sp.', 'Hadal Amphipoda', 'Thaumarchaeota'],
    status: 'active',
    x: 76,
    y: 48,
  },
  {
    id: 'TG-04',
    name: 'Tonga Trench (Horizon Deep Basin)',
    region: 'South Pacific Ocean',
    lat: -23.2500,
    lon: -174.7500,
    depth: 10882,
    temp: 1.1,
    salinity: 34.8,
    o2: 3.4,
    novelASVs: 284,
    totalReads: '1.18M',
    topTaxa: ['Alvinocarididae sp.', 'Hirondellea gigas', 'Sulfur-oxidizing Epsilonproteobacteria'],
    status: 'synced',
    x: 88,
    y: 72,
  },
  {
    id: 'PR-02',
    name: 'Puerto Rico Trench (Milwaukee Deep)',
    region: 'North Atlantic Ocean',
    lat: 19.8430,
    lon: -66.5000,
    depth: 8376,
    temp: 2.1,
    salinity: 35.2,
    o2: 4.2,
    novelASVs: 198,
    totalReads: '980K',
    topTaxa: ['Ophidiidae (Cusk-eel)', 'Macrostylid Isopoda', 'Deep Marine Microradialaria'],
    status: 'active',
    x: 32,
    y: 44,
  },
  {
    id: 'JR-07',
    name: 'Java / Sunda Trench Basin',
    region: 'Eastern Indian Ocean',
    lat: -10.3167,
    lon: 109.9667,
    depth: 7450,
    temp: 1.8,
    salinity: 34.6,
    o2: 2.9,
    novelASVs: 245,
    totalReads: '890K',
    topTaxa: ['Hadolychnus sp.', 'Polychaeta Siboglinidae', 'Chemosynthetic Archaeoglobus'],
    status: 'synced',
    x: 68,
    y: 62,
  },
  {
    id: 'AT-11',
    name: 'Mid-Atlantic Ridge (TAG Hydrothermal Field)',
    region: 'Central Atlantic Ocean',
    lat: 26.1360,
    lon: -44.8290,
    depth: 3650,
    temp: 2.4,
    salinity: 35.0,
    o2: 4.8,
    novelASVs: 420,
    totalReads: '2.35M',
    topTaxa: ['Rimicaris exoculata', 'Bathymodiolus azoricus', 'Epsilonbacteraeota Hydrothermalis'],
    status: 'sampling',
    x: 40,
    y: 38,
  },
  {
    id: 'AN-05',
    name: 'Southern Ocean Weddell Abyss',
    region: 'Antarctic Circumpolar Sea',
    lat: -61.2000,
    lon: -50.5000,
    depth: 5200,
    temp: -0.4,
    salinity: 34.4,
    o2: 5.6,
    novelASVs: 162,
    totalReads: '740K',
    topTaxa: ['Cryophilic Gammaproteobacteria', 'Trematomus bernacchii', 'Bipolar Copepoda'],
    status: 'active',
    x: 36,
    y: 86,
  }
];

export const Explorer: React.FC = () => {
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const mapConstraintsRef = useRef<HTMLDivElement>(null);

  const selectedSite = HARDCODED_STATIONS.find(s => s.id === selectedSiteId);

  const ALL_CONNECTORS = [
    { start: { lat: 11.3493, lng: 142.1996, id: 'MZ-09' }, end: { lat: -23.2500, lng: -174.7500, id: 'TG-04' } },
    { start: { lat: 19.8430, lng: -66.5000, id: 'PR-02' }, end: { lat: 26.1360, lng: -44.8290, id: 'AT-11' } },
    { start: { lat: -10.3167, lng: 109.9667, id: 'JR-07' }, end: { lat: -61.2000, lng: -50.5000, id: 'AN-05' } }
  ];
  const activeConnectors = selectedSiteId ? ALL_CONNECTORS.filter(c => c.start.id === selectedSiteId || c.end.id === selectedSiteId) : [];

  return (
    <div className="w-full animate-in fade-in duration-500">
      {/* Uncopyable Vector Title */}
      <UncopyableTitle 
        variant="page"
        englishText="EXPLORER"
        subText="GLOBAL OCEANIC SENSOR GRID & TRENCH BIOMES"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* World Ocean Map Panel */}
        <div className="lg:col-span-7 flex flex-col">
          <GlassPanel className="p-5 flex-1 flex flex-col rounded-2xl min-h-[520px]">
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <h2 className="text-sm text-white font-display font-semibold uppercase tracking-wider">
                  Global Bathymetric Grid
                </h2>
              </div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-cyan-300">
                <span>Active Stations: 6</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/40">
                  Telemetry Synced
                </span>
              </div>
            </div>
            
            {/* Interactive Vector Ocean Map Container */}
            <div 
              ref={mapConstraintsRef}
              className="relative flex-1 rounded-xl overflow-hidden border border-cyan-400/20 bg-gradient-to-b from-[#021827] via-[#032238] to-[#011422] select-none"
            >
              <motion.div 
                drag
                dragConstraints={mapConstraintsRef}
                dragElastic={0.1}
                className="absolute w-[180%] h-[180%] left-[-40%] top-[-40%] cursor-grab active:cursor-grabbing"
              >
                <WorldMap 
                  lineColor="#38BDF8"
                  dots={activeConnectors}
                />

              {/* Interactive Station Pulse Markers */}
              {HARDCODED_STATIONS.map((st) => {
                const isSelected = selectedSiteId === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedSiteId(st.id)}
                    style={{ left: `${st.x}%`, top: `${st.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-all duration-300 z-10`}
                    title={`${st.id}: ${st.name}`}
                  >
                    {/* Pulsing Sonar Ring */}
                    <span 
                      className={`absolute -inset-3 rounded-full opacity-75 animate-ping ${
                        isSelected ? 'bg-amber-400' : 'bg-cyan-400'
                      }`} 
                    />
                    
                    {/* Outer Glow */}
                    <div 
                      className={`relative flex items-center justify-center rounded-full transition-all duration-300 ${
                        isSelected 
                          ? 'w-7 h-7 bg-amber-400/80 border-2 border-white shadow-[0_0_20px_rgba(251,191,36,0.9)] scale-125' 
                          : 'w-6 h-6 bg-cyan-950/80 border-2 border-cyan-300 hover:border-white hover:scale-125 shadow-[0_0_15px_rgba(77,238,233,0.7)]'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-cyan-200'}`} />
                    </div>

                    {/* Site Label Tooltip Badge */}
                    <div className={`absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap pointer-events-none transition-all duration-200 ${
                      isSelected 
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-lg' 
                        : 'bg-slate-900/90 text-cyan-200 border border-cyan-400/30 group-hover:border-cyan-300'
                    }`}>
                      {st.id}
                    </div>
                  </button>
                );
              })}

              </motion.div>
              {/* Map Footer Compass Coordinates */}
              <div className="absolute bottom-2 left-3 text-[9px] font-mono text-cyan-400/70 tracking-widest pointer-events-none">
                GRID: WGS-84 / GLOBAL HADAL TRENCH SURVEY
              </div>
            </div>
          </GlassPanel>
        </div>

        {/* Right Site Details Deck */}
        <div className="lg:col-span-5 flex flex-col">
          <GlassPanel className="p-5 flex-1 flex flex-col rounded-2xl min-h-[520px] justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
                <h2 className="text-sm text-white font-display font-semibold uppercase tracking-wider">
                  Site Telemetry Profile
                </h2>
                {selectedSite && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                    Station {selectedSite.id} Locked
                  </span>
                )}
              </div>
              
              {selectedSite ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-xl text-white font-display font-bold">{selectedSite.name}</h3>
                    <p className="text-xs text-cyan-300 font-mono tracking-wide mt-0.5">{selectedSite.region}</p>
                  </div>

                  {/* 2x2 Metric Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                    <div className="glass-input rounded-lg p-2.5">
                      <span className="text-[10px] text-white/60 block uppercase">Coordinates</span>
                      <span className="text-white font-semibold text-xs">
                        {selectedSite.lat > 0 ? `${selectedSite.lat}°N` : `${Math.abs(selectedSite.lat)}°S`}, {selectedSite.lon > 0 ? `${selectedSite.lon}°E` : `${Math.abs(selectedSite.lon)}°W`}
                      </span>
                    </div>

                    <div className="glass-input rounded-lg p-2.5">
                      <span className="text-[10px] text-white/60 block uppercase">Benthic Depth</span>
                      <span className="text-cyan-300 font-bold text-xs">{selectedSite.depth.toLocaleString()} meters</span>
                    </div>

                    <div className="glass-input rounded-lg p-2.5">
                      <span className="text-[10px] text-white/60 block uppercase">Water Temp</span>
                      <span className="text-amber-300 font-semibold text-xs">{selectedSite.temp} °C</span>
                    </div>

                    <div className="glass-input rounded-lg p-2.5">
                      <span className="text-[10px] text-white/60 block uppercase">Salinity / O₂</span>
                      <span className="text-white font-semibold text-xs">{selectedSite.salinity} PSU · {selectedSite.o2} mg/L</span>
                    </div>
                  </div>

                  {/* Novel Taxonomy & Yield */}
                  <div className="glass-input rounded-lg p-3 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/80 font-medium">Deep AI Divergent ASVs:</span>
                      <span className="text-cyan-300 font-mono font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-400/40">
                        {selectedSite.novelASVs} novel taxa
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-white/80 font-medium">Metagenome Reads:</span>
                      <span className="text-white font-mono font-semibold">{selectedSite.totalReads} reads</span>
                    </div>
                  </div>

                  {/* Dominant Taxa Chips */}
                  <div>
                    <span className="text-[10px] text-white/70 block uppercase font-mono mb-1.5">Dominant Lineages Identified</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSite.topTaxa.map((taxa, i) => (
                        <span key={i} className="text-[11px] font-sans px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20 italic">
                          {taxa}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-cyan-950/70 border border-cyan-400/30 flex items-center justify-center mb-3 text-cyan-300 text-lg animate-pulse">
                    📡
                  </div>
                  <h4 className="text-sm text-white font-display font-medium mb-1">Awaiting Station Selection</h4>
                  <p className="text-xs text-white/60 leading-relaxed max-w-[240px]">
                    Click any glowing sensor node on the oceanic map to inspect benthic environmental telemetry and sequencing data.
                  </p>
                </div>
              )}
            </div>

            {selectedSite && (
              <div className="pt-4 border-t border-white/10 mt-4">
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-cyan-300 text-slate-950 rounded-xl font-display font-bold text-xs uppercase tracking-wider hover:from-cyan-300 hover:to-cyan-200 transition-all shadow-xl hover:shadow-[0_0_20px_rgba(77,238,233,0.5)]"
                >
                  Launch 3D Bathymetric Telemetry Scan
                </button>
              </div>
            )}
          </GlassPanel>
        </div>
      </div>

      {/* 3D Bathymetric Telemetry Modal */}
      {showModal && selectedSite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md animate-in fade-in">
          <GlassPanel className="w-full max-w-3xl flex flex-col relative border-cyan-400/40 rounded-3xl shadow-2xl p-6">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 px-3 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all font-mono text-xs"
            >
              ✕ Close Scan
            </button>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <h3 className="text-lg text-white font-display font-bold">
                Benthic Bathymetry: {selectedSite.name} ({selectedSite.id})
              </h3>
            </div>
            
            {/* Modal Telemetry Screen */}
            <div className="bg-slate-950/90 border border-cyan-400/30 rounded-2xl p-5 text-xs font-mono space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-400/20">
                  <span className="text-[10px] text-white/60 block">HYDROSTATIC PRESSURE</span>
                  <span className="text-cyan-300 font-bold text-base">{(selectedSite.depth * 0.1).toFixed(0)} atm</span>
                </div>
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-400/20">
                  <span className="text-[10px] text-white/60 block">PCR Q30 INTEGRITY</span>
                  <span className="text-amber-300 font-bold text-base">97.8%</span>
                </div>
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-400/20">
                  <span className="text-[10px] text-white/60 block">FAITH'S PD DIVERSITY</span>
                  <span className="text-white font-bold text-base">142.5</span>
                </div>
              </div>
              <div className="p-3 rounded-lg bg-black/50 border border-white/10 text-white/80 leading-relaxed text-xs">
                [LIVE TELEMETRY] High-throughput Oxford Nanopore & Illumina NovaSeq sequence pipelines mapped {selectedSite.totalReads} reads with zero contamination detected. Deep phylogenetic clade diversion active.
              </div>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
