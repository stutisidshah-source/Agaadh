import { create } from 'zustand';

interface DepthState {
  depth01: number;
  setDepth: (val: number) => void;
  // Optional: tracking the active section for the guide creature to explain
  activeSectionId: string | null;
  setActiveSection: (id: string | null) => void;
}

export const useDepthStore = create<DepthState>((set) => ({
  depth01: 0,
  setDepth: (val) => set({ depth01: Math.max(0, Math.min(1, val)) }),
  activeSectionId: null,
  setActiveSection: (id) => set({ activeSectionId: id }),
}));
