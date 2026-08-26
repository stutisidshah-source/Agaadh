import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { toast } from '@/components/ui/Toast';

import { validateSampleContext } from '@/utils/validation';

type ChatMessage = { sender: 'user' | 'agaadh'; text: string; isResult?: boolean };

export const Home = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [done, setDone] = useState(false);
  const [formErrors, setFormErrors] = useState<{lat?: string; lon?: string; depth?: string; temp?: string}>({});
  
  const startAnalysis = () => {
    setAnalyzing(true);
    setChat([{ sender: 'user', text: 'Initiating analysis for sample site MZ-09.' }]);
    
    // Simulate pipeline narration
    setTimeout(() => {
      setChat(prev => [...prev, { sender: 'agaadh', text: 'QC passed. Routing sequences through the cascade filter...' }]);
    }, 1500);
    setTimeout(() => {
      setChat(prev => [...prev, { sender: 'agaadh', text: 'Matched 4,210 ASVs to known databases. 312 ASVs diverted to the Deep AI lane for novelty gating.' }]);
    }, 3500);
    setTimeout(() => {
      setChat(prev => [...prev, { sender: 'agaadh', text: 'Analysis complete. Found high probability of localized endemic diversity.', isResult: true }]);
      setDone(true);
      setAnalyzing(false);
    }, Number(import.meta.env.VITE_MOCK_ANALYSIS_DUR) || 6000);
  };

  const handleDownload = () => {
    const reportData = "Agaadh Analysis Report\nSample: MZ-09\nDate: " + new Date().toISOString() + "\n\nResults:\n- 4,210 ASVs mapped\n- 312 Novel ASVs identified\n- High diversity score (Faith's PD: 142.5)";
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agaadh_report_MZ-09.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast('Report downloaded successfully!', 'success');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const lat = Number(formData.get('lat'));
    const lon = Number(formData.get('lon'));
    const depth = Number(formData.get('depth'));
    const temp = Number(formData.get('temp'));

    const errors = validateSampleContext(lat, lon, depth, temp);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast('Form validation failed.', 'error');
      return;
    }
    setFormErrors({});
    startAnalysis();
  };

  return (
    <div className="min-h-screen pt-4 pb-32">
      <div className="mb-12">
        <h1 className="text-7xl text-foam-white font-yatra tracking-widest mb-2 drop-shadow-lg">अगाध (Agaadh)</h1>
        <p className="text-xl text-cyan-bright font-sans font-light tracking-wide">Deep-Sea eDNA Intelligence Platform</p>
      </div>
      
      {!done ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Dropzone */}
            <div className="glass-panel rounded-2xl p-6">
              <FileUpload 
                title="Upload Sequence Data"
                description="FASTQ, FASTA, or .gz archives"
                borderBeamTheme="dark"
                onFilesAccepted={() => {
                  startAnalysis();
                }}
              />
            </div>
            
            {/* Narrating Chat Pipeline */}
            <div className="glass-panel rounded-2xl p-6 h-96 flex flex-col">
              <h3 className="text-gold font-display mb-4">Pipeline Status</h3>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" aria-live="polite">
                {chat.length === 0 && !analyzing && (
                  <p className="text-sm text-foam-white/40 italic text-center mt-10">Awaiting sample initialization...</p>
                )}
                {chat.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-mid-teal/20 self-end border border-mid-teal/30' : 'bg-deep-navy/50 border border-cyan-bright/30'}`}>
                    <p className={msg.sender === 'agaadh' ? 'font-light text-foam-white' : 'text-foam-white/80'}>{msg.text}</p>
                  </div>
                ))}
                {analyzing && (
                  <div className="text-cyan-bright text-sm animate-pulse">Processing...</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Context Form */}
          <div className="glass-panel rounded-2xl p-8">
            <h2 className="text-2xl text-foam-white font-display mb-6">Sample Context</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-foam-white/60 mb-1 uppercase tracking-wider">Latitude</label>
                  <input name="lat" type="text" defaultValue="11.3493" className={`w-full bg-deep-navy/50 border ${formErrors.lat ? 'border-red-400' : 'border-mid-teal/50'} rounded p-2 font-mono text-sm focus:border-cyan-bright outline-none`} />
                  {formErrors.lat && <p className="text-red-400 text-xs mt-1 font-mono">{formErrors.lat}</p>}
                </div>
                <div>
                  <label className="block text-xs text-foam-white/60 mb-1 uppercase tracking-wider">Longitude</label>
                  <input name="lon" type="text" defaultValue="142.1996" className={`w-full bg-deep-navy/50 border ${formErrors.lon ? 'border-red-400' : 'border-mid-teal/50'} rounded p-2 font-mono text-sm focus:border-cyan-bright outline-none`} />
                  {formErrors.lon && <p className="text-red-400 text-xs mt-1 font-mono">{formErrors.lon}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-foam-white/60 mb-1 uppercase tracking-wider">Depth (m)</label>
                  <input name="depth" type="number" defaultValue="4200" className={`w-full bg-deep-navy/50 border ${formErrors.depth ? 'border-red-400' : 'border-mid-teal/50'} rounded p-2 font-mono text-sm focus:border-cyan-bright outline-none`} />
                  {formErrors.depth && <p className="text-red-400 text-xs mt-1 font-mono">{formErrors.depth}</p>}
                </div>
                <div>
                  <label className="block text-xs text-foam-white/60 mb-1 uppercase tracking-wider">Bottom Temp (°C)</label>
                  <input name="temp" type="number" step="0.1" defaultValue="1.4" className={`w-full bg-deep-navy/50 border ${formErrors.temp ? 'border-red-400' : 'border-mid-teal/50'} rounded p-2 font-mono text-sm focus:border-cyan-bright outline-none`} />
                  {formErrors.temp && <p className="text-red-400 text-xs mt-1 font-mono">{formErrors.temp}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs text-foam-white/60 mb-1 uppercase tracking-wider">Marker Set</label>
                <select className="w-full bg-deep-navy/50 border border-mid-teal/50 rounded p-2 font-mono text-sm focus:border-cyan-bright outline-none text-foam-white">
                  <option>12S (Vertebrate)</option>
                  <option>18S (Eukaryote)</option>
                  <option>COI (Metazoan)</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-foam-white/60 mb-1 uppercase tracking-wider">Replicate ID</label>
                  <input type="text" defaultValue="R1" className="w-full bg-deep-navy/50 border border-mid-teal/50 rounded p-2 font-mono text-sm focus:border-cyan-bright outline-none" />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center space-x-2 text-sm text-foam-white/80 cursor-pointer">
                    <input type="checkbox" className="form-checkbox text-cyan-bright rounded border-mid-teal bg-deep-navy focus:ring-0 focus:ring-offset-0" />
                    <span>Blank Control</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={analyzing}
                className={`w-full mt-6 py-3 rounded-lg font-bold transition-colors ${
                  analyzing 
                    ? 'bg-mid-teal text-foam-white/50 cursor-not-allowed' 
                    : 'bg-gold text-deep-navy hover:bg-gold-light'
                }`}
              >
                {analyzing ? 'Analysis in progress...' : 'Start Analysis'}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in zoom-in duration-500">
          {/* AI Query Layer */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 h-[800px] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-mid-teal/30 pb-4">
              <h3 className="text-xl text-gold font-display">Agaadh AI Query Layer</h3>
              <span className="text-xs font-mono bg-cyan-bright/20 text-cyan-bright px-2 py-1 rounded">MZ-09 Active</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" aria-live="polite">
              {chat.map((msg, i) => (
                <div key={i} className={`p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-mid-teal/20 self-end border border-mid-teal/30 ml-8' : 'bg-deep-navy/50 border border-cyan-bright/30 mr-8'}`}>
                  <p className={msg.sender === 'agaadh' ? 'font-light text-foam-white' : 'text-foam-white/80'}>{msg.text}</p>
                </div>
              ))}
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const target = e.target as typeof e.target & { query: { value: string } };
                if (target.query.value) {
                  setChat(prev => [...prev, { sender: 'user', text: target.query.value }]);
                  setTimeout(() => {
                    setChat(prev => [...prev, { sender: 'agaadh', text: 'Analyzing cross-reference data... It appears this sample exhibits traits matching deep-sea hydro-thermal vent endemic species, specifically aligning with recent Mariana Trench discoveries.' }]);
                  }, 1200);
                  target.query.value = '';
                }
              }}
              className="mt-auto pt-4 border-t border-mid-teal/30"
            >
              <input 
                name="query"
                type="text" 
                aria-label="Ask a question about these results"
                placeholder="Ask about these results, e.g. 'Why is novelty so high?'" 
                className="w-full bg-deep-navy/80 border border-mid-teal rounded-lg px-4 py-3 outline-none focus:border-cyan-bright text-sm transition-colors" 
              />
            </form>
          </div>

          {/* Analytics Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-gold text-center">
                <p className="text-xs uppercase tracking-widest text-foam-white/60 mb-2">Total ASVs</p>
                <p className="text-4xl font-mono text-foam-white">4,210</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-cyan-bright text-center">
                <p className="text-xs uppercase tracking-widest text-foam-white/60 mb-2">Novel Lineages</p>
                <p className="text-4xl font-mono text-cyan-bright">312</p>
              </div>
              <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-mid-teal-light text-center">
                <p className="text-xs uppercase tracking-widest text-foam-white/60 mb-2">Diversity (Faith's PD)</p>
                <p className="text-4xl font-mono text-foam-white">142.5</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl text-foam-white font-display">Taxonomic Distribution</h3>
                <button onClick={handleDownload} className="text-xs bg-cyan-bright/20 hover:bg-cyan-bright/40 text-cyan-bright border border-cyan-bright/50 font-bold px-3 py-1.5 rounded transition-colors">
                  Export JSON
                </button>
              </div>
              
              {/* CSS Bar Chart */}
              <div className="space-y-6 py-4">
                {[
                  { label: "Arthropoda (Crustaceans)", value: 45, color: "bg-cyan-bright" },
                  { label: "Chordata (Fishes)", value: 25, color: "bg-gold" },
                  { label: "Annelida (Polychaetes)", value: 15, color: "bg-mid-teal-light" },
                  { label: "Mollusca", value: 10, color: "bg-foam-white" },
                  { label: "Unclassified (Novel)", value: 5, color: "bg-red-400" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-foam-white/80">{stat.label}</span>
                      <span className="font-mono text-foam-white/60">{stat.value}%</span>
                    </div>
                    <div className="w-full bg-deep-navy/80 rounded-full h-3 border border-mid-teal/30">
                      <div 
                        className={`h-full rounded-full ${stat.color} shadow-[0_0_10px_currentColor]`}
                        style={{ width: `${stat.value}%`, transition: 'width 1.5s ease-out', animation: 'grow-width 1.5s ease-out' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
