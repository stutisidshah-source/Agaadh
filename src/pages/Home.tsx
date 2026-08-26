import { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import { toast } from '@/components/ui/Toast';
import { UncopyableTitle } from '@/components/ui/UncopyableTitle';
import { validateSampleContext } from '@/utils/validation';

type ChatMessage = { sender: 'user' | 'agaadh'; text: string; isResult?: boolean };

export const Home = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [done, setDone] = useState(false);
  const [formErrors, setFormErrors] = useState<{lat?: string; lon?: string; depth?: string; temp?: string}>({});
  
  const startAnalysis = () => {
    setAnalyzing(true);
    setChat([{ sender: 'user', text: 'Initiating sequencing telemetry for sample site MZ-09.' }]);
    
    // Simulate pipeline narration
    setTimeout(() => {
      setChat(prev => [...prev, { sender: 'agaadh', text: 'Quality Control passed (Q30 > 94.2%). Routing reads through the cascade filter...' }]);
    }, 1200);
    setTimeout(() => {
      setChat(prev => [...prev, { sender: 'agaadh', text: 'Mapped 4,210 ASVs against Silva/PR2 databases. Diverting 312 novel ASVs to deep neural classifier.' }]);
    }, 2800);
    setTimeout(() => {
      setChat(prev => [...prev, { sender: 'agaadh', text: 'Analysis complete. Identified endemic hadal fauna & unclassified eukaryota lineages.', isResult: true }]);
      setDone(true);
      setAnalyzing(false);
    }, Number(import.meta.env.VITE_MOCK_ANALYSIS_DUR) || 4500);
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
    <div className="w-full">
      {/* Single-line Vectorized Uncopyable Title */}
      <UncopyableTitle 
        variant="home"
        hindiText="अगाध"
        englishText="AGAADH"
        subText="DEEP-SEA eDNA INTELLIGENCE"
      />
      
      {!done ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Block (7 cols): Sequence Ingestion & Sample Parameters in a unified compact glass card */}
          <div className="lg:col-span-7 space-y-4 flex flex-col">
            {/* Dropzone Card */}
            <div className="glass-panel rounded-2xl p-4 transition-all duration-300">
              <FileUpload 
                title="Sequence Data Ingestion"
                description="Drag FASTQ, FASTA, .gz, CSV directly here"
                borderBeamTheme="dark"
                onFilesAccepted={() => {
                  startAnalysis();
                }}
              />
            </div>

            {/* Compact Context Parameters Card */}
            <div className="glass-panel rounded-2xl p-5 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <h2 className="text-base text-white font-display font-semibold tracking-wide">
                  Sample Metadata & Geolocation
                </h2>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-400/30">
                  Station MZ-09
                </span>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-white/80 mb-1 uppercase font-medium tracking-wider">Latitude (°N)</label>
                    <input name="lat" type="text" defaultValue="11.3493" className={`w-full glass-input rounded-lg p-2 font-mono text-xs focus:border-cyan-300 outline-none transition-all ${formErrors.lat ? 'border-red-400' : ''}`} />
                    {formErrors.lat && <p className="text-red-300 text-[10px] mt-0.5 font-mono">{formErrors.lat}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/80 mb-1 uppercase font-medium tracking-wider">Longitude (°E)</label>
                    <input name="lon" type="text" defaultValue="142.1996" className={`w-full glass-input rounded-lg p-2 font-mono text-xs focus:border-cyan-300 outline-none transition-all ${formErrors.lon ? 'border-red-400' : ''}`} />
                    {formErrors.lon && <p className="text-red-300 text-[10px] mt-0.5 font-mono">{formErrors.lon}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-white/80 mb-1 uppercase font-medium tracking-wider">Depth (m)</label>
                    <input name="depth" type="number" defaultValue="4200" className={`w-full glass-input rounded-lg p-2 font-mono text-xs focus:border-cyan-300 outline-none transition-all ${formErrors.depth ? 'border-red-400' : ''}`} />
                    {formErrors.depth && <p className="text-red-300 text-[10px] mt-0.5 font-mono">{formErrors.depth}</p>}
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/80 mb-1 uppercase font-medium tracking-wider">Bottom Temp (°C)</label>
                    <input name="temp" type="number" step="0.1" defaultValue="1.4" className={`w-full glass-input rounded-lg p-2 font-mono text-xs focus:border-cyan-300 outline-none transition-all ${formErrors.temp ? 'border-red-400' : ''}`} />
                    {formErrors.temp && <p className="text-red-300 text-[10px] mt-0.5 font-mono">{formErrors.temp}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <label className="block text-[10px] text-white/80 mb-1 uppercase font-medium tracking-wider">Target Marker</label>
                    <select className="w-full glass-input rounded-lg p-2 font-mono text-xs focus:border-cyan-300 outline-none text-white bg-slate-900">
                      <option value="12S">12S (Deep Teleosts)</option>
                      <option value="18S">18S (Hadal Eukaryotes)</option>
                      <option value="COI">COI (Benthic Metazoa)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-white/80 mb-1 uppercase font-medium tracking-wider">Replicate</label>
                    <input type="text" defaultValue="R1-Mariana" className="w-full glass-input rounded-lg p-2 font-mono text-xs focus:border-cyan-300 outline-none" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={analyzing}
                  className={`w-full mt-2 py-2.5 rounded-xl font-display font-bold text-sm tracking-wide transition-all duration-300 shadow-xl ${
                    analyzing 
                      ? 'bg-white/20 text-white/50 cursor-not-allowed border border-white/20' 
                      : 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 hover:from-amber-300 hover:to-amber-200 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] transform hover:-translate-y-0.5 active:translate-y-0'
                  }`}
                >
                  {analyzing ? 'Analyzing Sequences...' : 'Initiate Deep Analysis'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Block (5 cols): Live Pipeline Stream & Diagnostics - fully in view with zero scrolling */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-5 flex flex-col h-full min-h-[480px]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/15">
              <div className="flex items-center gap-2">
                <span className="text-amber-300 text-sm">⚡</span>
                <h3 className="text-amber-300 font-display font-semibold tracking-wide text-sm">Live Pipeline Telemetry</h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-400/40">
                {analyzing ? "● Processing" : "● Ready"}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs" aria-live="polite">
              {chat.length === 0 && !analyzing && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-950/60 border border-cyan-400/30 flex items-center justify-center mb-3 text-cyan-300">
                    🧬
                  </div>
                  <p className="text-white/70 italic text-xs leading-relaxed max-w-[220px]">
                    Drop eDNA sequences or click Initiate to start AI cascade analysis.
                  </p>
                </div>
              )}
              {chat.map((msg, i) => (
                <div 
                  key={i} 
                  className={`p-2.5 rounded-xl text-xs transition-all duration-300 shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-cyan-500/25 text-white self-end border border-cyan-400/50' 
                      : 'bg-slate-900/80 text-white border border-cyan-300/30'
                  }`}
                >
                  <div className="text-[9px] font-mono text-cyan-300/80 uppercase mb-0.5">
                    {msg.sender === 'user' ? 'Operator' : 'Agaadh Core'}
                  </div>
                  <p className="font-normal text-white drop-shadow-sm leading-relaxed">{msg.text}</p>
                </div>
              ))}
              {analyzing && (
                <div className="flex items-center gap-2 text-cyan-300 text-xs font-mono animate-pulse pt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
                  Aligning 12S/18S markers to NCBI & PR2 databases...
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in zoom-in duration-500">
          {/* AI Query Layer */}
          <div className="lg:col-span-5 glass-panel-glow rounded-3xl p-6 h-[800px] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b border-white/20 pb-4">
              <h3 className="text-xl text-amber-300 font-display font-semibold">Agaadh AI Query Layer</h3>
              <span className="text-xs font-mono bg-cyan-400/20 text-cyan-200 border border-cyan-300/40 px-3 py-1 rounded-full">
                MZ-09 Active
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" aria-live="polite">
              {chat.map((msg, i) => (
                <div 
                  key={i} 
                  className={`p-3.5 rounded-2xl text-sm transition-all shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-cyan-500/25 text-white self-end border border-cyan-300/40 ml-8' 
                      : 'bg-white/15 text-white border border-white/30 mr-8'
                  }`}
                >
                  <p className="font-normal text-white">{msg.text}</p>
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
              className="mt-auto pt-4 border-t border-white/20"
            >
              <input 
                name="query"
                type="text" 
                aria-label="Ask a question about these results"
                placeholder="Ask about results, e.g. 'Why is novelty so high?'" 
                className="w-full glass-input rounded-xl px-4 py-3 outline-none text-sm transition-all" 
              />
            </form>
          </div>

          {/* Analytics Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-panel p-6 rounded-3xl border-t-4 border-t-amber-300 text-center shadow-xl">
                <p className="text-xs uppercase tracking-widest text-white/80 mb-2 font-medium">Total ASVs</p>
                <p className="text-4xl font-mono text-white font-bold drop-shadow">4,210</p>
              </div>
              <div className="glass-panel p-6 rounded-3xl border-t-4 border-t-cyan-300 text-center shadow-xl">
                <p className="text-xs uppercase tracking-widest text-white/80 mb-2 font-medium">Novel Lineages</p>
                <p className="text-4xl font-mono text-cyan-300 font-bold drop-shadow">312</p>
              </div>
              <div className="glass-panel p-6 rounded-3xl border-t-4 border-t-teal-300 text-center shadow-xl">
                <p className="text-xs uppercase tracking-widest text-white/80 mb-2 font-medium">Diversity (Faith's PD)</p>
                <p className="text-4xl font-mono text-white font-bold drop-shadow">142.5</p>
              </div>
            </div>

            <div className="glass-panel-glow rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl text-white font-display font-semibold">Taxonomic Distribution</h3>
                <button 
                  onClick={handleDownload} 
                  className="text-xs bg-cyan-400/25 hover:bg-cyan-400/40 text-cyan-200 border border-cyan-300/50 font-bold px-4 py-2 rounded-xl transition-all shadow-lg hover:shadow-[0_0_15px_rgba(77,238,233,0.4)]"
                >
                  Export Data Report
                </button>
              </div>
              
              {/* CSS Bar Chart */}
              <div className="space-y-6 py-4">
                {[
                  { label: "Arthropoda (Crustaceans)", value: 45, color: "bg-cyan-300" },
                  { label: "Chordata (Fishes)", value: 25, color: "bg-amber-300" },
                  { label: "Annelida (Polychaetes)", value: 15, color: "bg-teal-300" },
                  { label: "Mollusca", value: 10, color: "bg-white" },
                  { label: "Unclassified (Novel)", value: 5, color: "bg-rose-400" }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-2 font-medium">
                      <span className="text-white drop-shadow-sm">{stat.label}</span>
                      <span className="font-mono text-cyan-200">{stat.value}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3.5 border border-white/20 p-0.5 backdrop-blur-md">
                      <div 
                        className={`h-full rounded-full ${stat.color} shadow-[0_0_12px_currentColor]`}
                        style={{ width: `${stat.value}%`, transition: 'width 1.5s ease-out' }}
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
