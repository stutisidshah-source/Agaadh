import { useState } from 'react';
import { GlassPanel } from '../components/ui/GlassPanel';

export const Explorer = () => {
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen pt-4 pb-32 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-7xl text-foam-white font-yatra tracking-widest mb-2 drop-shadow-lg">Explorer</h1>
        <p className="text-xl text-cyan-bright font-sans font-light tracking-wide">Ocean Data Map</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* World Map Panel */}
        <div className="lg:col-span-8">
          <GlassPanel className="h-[700px] flex flex-col relative">
            <h2 className="text-2xl text-foam-white font-display mb-4">Global Network</h2>
            
            {/* Mock Map Area */}
            <div className="flex-1 bg-deep-navy/40 border border-mid-teal/30 rounded-lg relative overflow-hidden flex items-center justify-center">
              <p className="text-foam-white/40 font-mono text-sm">[ Map Visualization Placeholder ]</p>
              
              {/* Mock Marker */}
              <button 
                onClick={() => setSelectedSite('MZ-09')}
                className="absolute top-1/2 left-1/3 w-6 h-6 -ml-3 -mt-3 bg-cyan-bright/50 border border-cyan-bright rounded-full animate-pulse flex items-center justify-center cursor-pointer hover:bg-cyan-bright transition-colors"
                title="Mariana Trench MZ-09"
              >
                <span className="w-2 h-2 bg-foam-white rounded-full"></span>
              </button>
            </div>
          </GlassPanel>
        </div>

        {/* Site Detail Panel */}
        <div className="lg:col-span-4">
          <GlassPanel className="h-[700px] flex flex-col">
            <h2 className="text-2xl text-foam-white font-display mb-6">Site Details</h2>
            
            {selectedSite ? (
              <div className="space-y-6 flex-1 flex flex-col">
                <div className="pb-4 border-b border-mid-teal/30">
                  <h3 className="text-gold font-display text-xl mb-1">{selectedSite}</h3>
                  <p className="text-sm text-cyan-bright font-mono uppercase tracking-widest">Mariana Trench</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-foam-white/60 mb-1 uppercase tracking-wider">Latitude</label>
                    <div className="bg-deep-navy/50 border border-mid-teal/50 rounded p-2 font-mono text-sm text-foam-white">11.3493</div>
                  </div>
                  <div>
                    <label className="block text-xs text-foam-white/60 mb-1 uppercase tracking-wider">Longitude</label>
                    <div className="bg-deep-navy/50 border border-mid-teal/50 rounded p-2 font-mono text-sm text-foam-white">142.1996</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-foam-white/60 mb-1 uppercase tracking-wider">Depth (m)</label>
                    <div className="bg-deep-navy/50 border border-mid-teal/50 rounded p-2 font-mono text-sm text-foam-white">4200</div>
                  </div>
                  <div>
                    <label className="block text-xs text-foam-white/60 mb-1 uppercase tracking-wider">Temp (°C)</label>
                    <div className="bg-deep-navy/50 border border-mid-teal/50 rounded p-2 font-mono text-sm text-foam-white">1.4</div>
                  </div>
                </div>
                
                <div className="mt-auto pt-6">
                  <button 
                    onClick={() => setShowModal(true)}
                    className="w-full py-3 bg-cyan-bright/20 border border-cyan-bright text-cyan-bright rounded-lg font-bold hover:bg-cyan-bright hover:text-deep-navy transition-colors"
                  >
                    View Visually
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center">
                <p className="text-sm text-foam-white/40 italic">Select a site marker<br/>on the map to view details.</p>
              </div>
            )}
          </GlassPanel>
        </div>
      </div>

      {/* 3D Modal Mock */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-deep-navy/80 backdrop-blur-sm animate-in fade-in">
          <GlassPanel className="w-full max-w-4xl h-[80vh] flex flex-col relative border-cyan-bright/50">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-foam-white/60 hover:text-foam-white"
            >
              ✕ Close
            </button>
            <h2 className="text-2xl text-foam-white font-display mb-4">Site Visualization: {selectedSite}</h2>
            <div className="flex-1 bg-black/50 border border-mid-teal/30 rounded-lg flex items-center justify-center">
              <p className="text-cyan-bright font-mono text-sm animate-pulse">[ 3D Visualizer Canvas ]</p>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
};
